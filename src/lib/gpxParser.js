/**
 * GPX Parser for Peak Flow
 * Parses standard GPX files and converts them to the Peak Flow route format.
 */

export const parseGPX = async (url) => {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch GPX: ${response.statusText}`)

        const text = await response.text()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, "text/xml")

        // Parse Tracks
        const trkpts = xmlDoc.getElementsByTagName("trkpt")
        const path = []

        if (trkpts.length === 0) {
            console.warn("No track points found in GPX")
            return null
        }

        // Extract coordinates
        for (let i = 0; i < trkpts.length; i++) {
            const lat = parseFloat(trkpts[i].getAttribute("lat"))
            const lng = parseFloat(trkpts[i].getAttribute("lon"))

            // Check for elevation (ele)
            const ele = trkpts[i].getElementsByTagName("ele")[0]?.textContent

            path.push({
                lat,
                lng,
                ele: ele ? parseFloat(ele) : 0
            })
        }

        // Parse Metadata
        const metadata = xmlDoc.getElementsByTagName("metadata")[0]
        const trk = xmlDoc.getElementsByTagName("trk")[0]
        const name = trk?.getElementsByTagName("name")[0]?.textContent || "Imported Route"
        const desc = trk?.getElementsByTagName("desc")[0]?.textContent || ""

        const start = path[0]
        const end = path[path.length - 1]

        // Basic stats calculation (distance in km)
        let distance = 0
        for (let i = 0; i < path.length - 1; i++) {
            distance += getDistanceFromLatLonInKm(path[i].lat, path[i].lng, path[i + 1].lat, path[i + 1].lng)
        }

        return {
            id: `gpx-${Date.now()}`,
            name: name,
            region: "Imported GPX",
            author: "GPX Import",
            authorVerified: false,
            theme: "Custom",
            distance: Math.round(distance), // in km
            duration: Math.round(distance * 1.5), // Rough estimate: 40km/h avg speed -> 1.5 mins per km
            sss: 8.5, // Default score
            curvinessIndex: 4,
            curves: "High",
            scenic: true,
            technical: true,
            isLoop: getDistanceFromLatLonInKm(start.lat, start.lng, end.lat, end.lng) < 0.5,
            distanceFromUser: 0,
            hearts: 0,
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", // Default alpine image
            surface: {
                asphalt: 90,
                concrete: 5,
                gravel: 5,
                cobblestone: 0
            },
            elevation: {
                gain: 0, // Placeholder
                max: 0,
                minGradient: 0,
                maxGradient: 0
            },
            hazards: {
                speedHumps: 0,
                potholes: 0,
                unpaved: 0
            },
            chassisThreats: [],
            atmosphere: ["Imported", "Mountain"],
            coordinates: {
                start: { lat: start.lat, lng: start.lng },
                end: { lat: end.lat, lng: end.lng }
            },
            path: path.map(p => ({ lat: p.lat, lng: p.lng })), // Clean for Leaflet
            waypoints: [], // To be populated if 'wpt' tags exist
            gallery: []
        }

    } catch (error) {
        console.error("Error parsing GPX:", error)
        return null
    }
}

// Distance helper (Haversine)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
