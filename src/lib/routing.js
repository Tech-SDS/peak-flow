/**
 * routing.js — Shared routing utility using OSRM (free, no API key required).
 *
 * Calculates real road routes between two points and returns
 * the geometry (as Leaflet [lat, lng] positions), distance, and duration.
 */

const OSRM_ENDPOINT = 'https://router.project-osrm.org/route/v1/driving'

// Cache to avoid redundant API calls
const navRouteCache = new Map()

function cacheKey(origin, destination) {
    return `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}|${destination.lat.toFixed(4)},${destination.lng.toFixed(4)}`
}

export async function calculateRoute(origin, destination, signal) {
    const key = cacheKey(origin, destination)
    if (navRouteCache.has(key)) return navRouteCache.get(key)

    // OSRM coordinates: lng,lat;lng,lat
    const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`
    const url = `${OSRM_ENDPOINT}/${coords}?alternatives=3&overview=full&geometries=geojson&steps=true`

    try {
        const res = await fetch(url, { signal })

        if (!res.ok) {
            throw new Error(`OSRM ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()

        if (data.code !== 'Ok' || !data.routes?.length) {
            throw new Error(`OSRM error: ${data.message || data.code}`)
        }

        // 1. Map raw OSRM routes
        let routes = data.routes.map((r, index) => ({
            id: `route-${index}-${Date.now()}`,
            geometry: r.geometry.coordinates.map(c => [c[1], c[0]]), // [lng,lat] → [lat,lng]
            distance: Math.round(r.distance / 100) / 10,              // metres → km (1 decimal)
            duration: Math.round(r.duration / 60),                    // seconds → minutes
        }))

        // Sort by duration (shortest first)
        routes.sort((a, b) => a.duration - b.duration)

        // 2. Ensure exactly 3 routes exist
        if (routes.length === 1) {
            // Create Balanced and Curvy from Fastest
            const fastest = routes[0]
            routes.push({
                ...fastest,
                id: `route-balanced-${Date.now()}`,
                duration: Math.round(fastest.duration * 1.08),
                distance: Math.round(fastest.distance * 1.05 * 10) / 10,
                isSimulated: true
            })
            routes.push({
                ...fastest,
                id: `route-curvy-${Date.now()}`,
                duration: Math.round(fastest.duration * 1.25),
                distance: Math.round(fastest.distance * 1.15 * 10) / 10,
                isSimulated: true
            })
        } else if (routes.length === 2) {
            // Create Curvy from the slower of the two
            const slower = routes[1]
            routes.push({
                ...slower,
                id: `route-curvy-${Date.now()}`,
                duration: Math.round(slower.duration * 1.15),
                distance: Math.round(slower.distance * 1.08 * 10) / 10,
                isSimulated: true
            })
        } else if (routes.length > 3) {
            routes = routes.slice(0, 3)
        }

        // 3. Assign standardized labels and curviness
        // Fastest
        routes[0].label = 'Fastest'
        routes[0].curvinessIndex = 2

        // Balanced
        routes[1].label = 'Balanced'
        routes[1].curvinessIndex = 3

        // Curvy (always the slowest/most curves)
        routes[2].label = 'Curvy'
        routes[2].curvinessIndex = 5

        navRouteCache.set(key, routes)
        return routes
    } catch (e) {
        console.error('[Routing] OSRM error', e)
        throw e
    }
}

/**
 * Calculate a route through multiple waypoints.
 *
 * @param {Array<{lat: number, lng: number}>} points - Array of points (start, stops, destination)
 * @returns {Promise<{ geometry: [number, number][], distance: number, duration: number } | null>}
 */
export async function calculateMultiStopRoute(points) {
    if (points.length < 2) throw new Error('Need at least 2 points')

    // OSRM: lng,lat;lng,lat;...
    const coords = points.map(p => `${p.lng},${p.lat}`).join(';')
    const url = `${OSRM_ENDPOINT}/${coords}?overview=full&geometries=geojson&steps=false`

    try {
        const res = await fetch(url)

        if (!res.ok) {
            console.error('OSRM Error', res.status, res.statusText)
            return null
        }

        const data = await res.json()
        if (data.code !== 'Ok' || !data.routes?.length) return null

        const r = data.routes[0]
        return {
            geometry: r.geometry.coordinates.map(c => [c[1], c[0]]), // Leaflet: [lat, lng]
            distance: Math.round(r.distance / 100) / 10,
            duration: Math.round(r.duration / 60),
        }
    } catch (err) {
        console.error('Route calculation failed', err)
        return null
    }
}
