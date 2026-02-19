// ─── Search Service (Photon API) ───
// Documentation: https://github.com/komoot/photon

const SEARCH_API_URL = 'https://photon.komoot.io/api/'

/**
 * Search for places using Photon API
 * @param {string} query - The search query
 * @param {number} limit - Max results (default 5)
 * @returns {Promise<Array>} - List of standardized location objects
 */
export const searchPlaces = async (query, limit = 5, location = null) => {
    if (!query || query.length < 3) return []

    try {
        let url = `${SEARCH_API_URL}?q=${encodeURIComponent(query)}&limit=${limit}`
        if (location) {
            url += `&lat=${location.lat}&lon=${location.lng}`
        }
        const response = await fetch(url)
        const data = await response.json()

        if (!data.features) return []

        return data.features.map(f => {
            const props = f.properties
            const city = props.city || props.town || props.village || props.hamlet
            const context = [city, props.state, props.country].filter(Boolean).join(', ')

            return {
                id: `loc-${props.osm_id}`,
                name: props.name || city || 'Unknown Location',
                details: context,
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0],
                type: props.osm_value || props.osm_key
            }
        })
    } catch (error) {
        console.error('Search failed:', error)
        return []
    }
}

/**
 * Reverse geocode coordinates to an address
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<string>} - Formatted address or null
 */
export const reverseGeocode = async (lat, lng) => {
    try {
        // Photon reverse endpoint is just /reverse, not /api/reverse
        const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`
        const response = await fetch(url)
        const data = await response.json()

        if (data.features && data.features.length > 0) {
            const props = data.features[0].properties
            const street = props.street || ''
            const housenumber = props.housenumber || ''
            const city = props.city || props.town || props.village || ''

            // Construct address: "Musterstraße 42, Freiburg"
            const addressParts = []
            if (street) addressParts.push(housenumber ? `${street} ${housenumber}` : street)
            if (city) addressParts.push(city)

            return addressParts.join(', ') || props.name
        }
        return null
    } catch (error) {
        console.error('Reverse geocode failed:', error)
        return null
    }
}

// Simple debounce utility
export const debounce = (func, wait) => {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}
