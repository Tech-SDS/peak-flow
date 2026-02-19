import { useState, useEffect, useRef } from 'react'
import { Polyline, CircleMarker, Marker } from 'react-leaflet'
import L from 'leaflet'

/**
 * SmartRoute — renders a route on the map.
 *
 * 1. Immediately draws a polyline through the given waypoints.
 * 2. After a 500 ms debounce, asks ORS for a road-snapped path.
 * 3. Caches the result in a module-level Map.
 */

const ORS_ENDPOINT = '/ors-proxy/v2/directions/driving-car/geojson'
const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY
const DEBOUNCE_MS = 500

// ── Module-level cache ──────────────────────────────────────────────────────
const routeCache = new Map()

// ── ORS fetch helper ────────────────────────────────────────────────────────
async function fetchORSRoute(waypoints, signal) {
    if (!ORS_API_KEY) throw new Error('Missing VITE_ORS_API_KEY in .env')

    const coordinates = waypoints.map(w => [w.lng, w.lat])

    const res = await fetch(ORS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ORS_API_KEY,
        },
        body: JSON.stringify({
            coordinates,
            radiuses: coordinates.map(() => 10000),
        }),
        signal,
    })

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(`ORS ${res.status}: ${errData.error?.message || res.statusText}`)
    }

    const data = await res.json()
    if (!data.features || !data.features.length) throw new Error('ORS returned no features')

    // GeoJSON [lng, lat] → Leaflet [lat, lng]
    return data.features[0].geometry.coordinates.map(c => [c[1], c[0]])
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function waypointsToKey(wps) {
    if (!wps || wps.length === 0) return ''
    return wps.map(w => `${w.lat},${w.lng}`).join('|')
}

function waypointsToPositions(wps) {
    return wps.map(w => [w.lat, w.lng])
}

// ─── Numbered Icon Helper ───
const createNumberedIcon = (number) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
            background-color: #ff5f1f;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
        ">${number}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    })
}

// ─── Component ───────────────────────────────────────────────────────────────
const SmartRoute = ({ waypoints, color = '#ff5f1f', onRouteClick, isSelected, image }) => {
    const [routePath, setRoutePath] = useState([])
    const [isSnapped, setIsSnapped] = useState(false)

    const prevKeyRef = useRef('')
    const debounceRef = useRef(null)
    const abortRef = useRef(null)

    const currentKey = waypointsToKey(waypoints)

    useEffect(() => {
        if (currentKey === prevKeyRef.current) return
        prevKeyRef.current = currentKey

        clearTimeout(debounceRef.current)
        if (abortRef.current) abortRef.current.abort()

        if (routeCache.has(currentKey)) {
            setRoutePath(routeCache.get(currentKey))
            setIsSnapped(true)
            return
        }

        const fallback = waypoints ? waypointsToPositions(waypoints) : []
        setRoutePath(fallback)
        setIsSnapped(false)

        if (!waypoints || waypoints.length < 2) return

        debounceRef.current = setTimeout(() => {
            const controller = new AbortController()
            abortRef.current = controller

            fetchORSRoute(waypoints, controller.signal)
                .then(path => {
                    if (!controller.signal.aborted) {
                        routeCache.set(currentKey, path)
                        setRoutePath(path)
                        setIsSnapped(true)
                    }
                })
                .catch(err => {
                    if (err.name === 'AbortError') return
                    console.warn('[SmartRoute] ORS fallback:', err.message)
                })
        }, DEBOUNCE_MS)

        return () => {
            clearTimeout(debounceRef.current)
            if (abortRef.current) abortRef.current.abort()
        }
    }, [currentKey])

    // ─── Render ──────────────────────────────────────────────────────────────
    if (!routePath || routePath.length < 2) return null

    // Visual State Logic
    const routeColor = isSelected ? color : '#cc4c19' // Dimmer orange if not selected
    const routeOpacity = isSelected ? 1 : 0.6
    const routeWeight = isSelected ? 6 : 4
    const zIndex = isSelected ? 100 : 10

    // Custom Marker Icon (Cover Image)
    const markerIcon = isSelected || image ? L.divIcon({
        className: 'route-marker-icon',
        html: `
            <div class="marker-pin ${isSelected ? 'selected' : ''}">
                <div class="marker-image" style="background-image: url('${image}');"></div>
            </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50]
    }) : null

    return (
        <>
            <Polyline
                positions={routePath}
                pathOptions={{
                    color: routeColor,
                    weight: isSnapped ? routeWeight : 3,
                    opacity: isSnapped ? routeOpacity : 0.4,
                    lineCap: 'round',
                    lineJoin: 'round',
                    dashArray: isSnapped ? undefined : '5 10',
                    zIndexOffset: zIndex,
                    className: isSelected ? 'route-glow' : '',
                }}
                eventHandlers={{
                    click: (e) => onRouteClick && onRouteClick(routePath, e),
                    mouseover: (e) => {
                        if (!isSelected) {
                            e.target.setStyle({ weight: 6, opacity: 0.9 })
                        }
                    },
                    mouseout: (e) => {
                        if (!isSelected) {
                            e.target.setStyle({ weight: 4, opacity: 0.6 })
                        }
                    }
                }}
            />

            {/* Start Marker with Image - ONLY if not showing numbered pins? or keep for "0" index? */}
            {/* The user wants "pins with numbers where the stops are located". */}
            {/* If I show both, it might be cluttered. But the image marker is nice for "Identity". */}
            {/* I'll keep the Image Marker at start (index 0) AND add numbered pins for indices 0..N? */}
            {/* If I add number at 0, it overlaps image. */}
            {/* I will add numbered pins for indices > 0 (Wait, Start is a stop). */}
            {/* Maybe I replace the Image Marker with "1" if we are in "Editor Mode" (isSelected)? */}
            {/* User said "Add pins with numbers". */}
            {/* I'll add them alongside. If overlap, so be it, or I offset them. */}
            {/* Actually, for the "Editor", clarity is key. I'll render numbered pins for ALL stops. */}
            {/* And I'll hide the Image Marker if isSelected (Editor Mode) so we just see numbers? */}
            {/* Or I'll just render Number 1 at start. */}

            {/* Let's render Numbered Markers for ALL waypoints if isSelected is true. */}
            {isSelected && waypoints && waypoints.map((wp, i) => (
                <Marker
                    key={`wp-${i}`}
                    position={[wp.lat, wp.lng]}
                    icon={createNumberedIcon(i + 1)}
                    zIndexOffset={zIndex + 1000 + i}
                />
            ))}

            {/* Image Marker - Keep it but maybe valid only if NOT isSelected? Or always? */}
            {/* User request: "pins with numbers". */}
            {/* If I hide the image marker, I lose the cover art. */}
            {/* I'll keep it. The number 1 will be on top of it or inside it? */}
            {/* `createNumberedIcon` is 24x24. Image marker is 40x50. */}
            {/* They will overlap. */}
            {/* I'll render the Image Marker ONLY if we are NOT in editor mode (i.e. viewing list). */}
            {/* But `isSelected` is true in Editor Mode. */}
            {/* I'll render the Image Marker always, but maybe the Number 1 is redundant if Image is there? */}
            {/* No, "numbers where the stops are located". Start is a stop. */}
            {/* I'll just render them. */}

            {markerIcon && !isSelected && (
                <Marker
                    position={routePath[0]}
                    icon={markerIcon}
                    zIndexOffset={zIndex + 10}
                    eventHandlers={{
                        click: (e) => onRouteClick && onRouteClick(routePath, e),
                    }}
                />
            )}
            {/* If isSelected, we show numbers instead of the big pin? Or both? */}
            {/* I made !isSelected condition above. So selected route gets numbers. Unselected gets Image Pin. */}
            {/* This seems cleaner for "Editing". */}

            {/* End dot (small) - Remove if using numbered pins */}
            {!isSelected && (
                <CircleMarker
                    center={routePath[routePath.length - 1]}
                    radius={4}
                    pathOptions={{
                        color: '#fff',
                        fillColor: routeColor,
                        fillOpacity: 1,
                        weight: 1,
                    }}
                />
            )}
        </>
    )
}

export default SmartRoute
