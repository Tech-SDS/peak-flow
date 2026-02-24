// ─── Peak Flow v13.0 — AI Architect Service ───
// Dynamically generates route proposals based on the user's current location
// and natural language intent. No hardcoded city locations.

// ─── Dynamic POI Generator ───
// Creates realistic-sounding POIs near any user location using random offsets
const POI_TEMPLATES = {
    scenic: [
        { suffix: 'Lake Viewpoint', type: 'scenic', icon: '🏔️', tags: ['scenic', 'chill', 'swim'] },
        { suffix: 'Reservoir Lookout', type: 'scenic', icon: '📸', tags: ['scenic', 'chill'] },
        { suffix: 'Bridge Crossing', type: 'scenic', icon: '🌉', tags: ['scenic', 'bridge', 'chill'] },
        { suffix: 'Panorama Point', type: 'scenic', icon: '🌅', tags: ['scenic', 'sunset', 'chill'] },
        { suffix: 'Valley Overlook', type: 'scenic', icon: '💎', tags: ['scenic', 'mountains'] },
        { suffix: 'Hilltop Vista', type: 'scenic', icon: '⛰️', tags: ['scenic', 'views'] },
    ],
    driving: [
        { suffix: 'Mountain Pass', type: 'driving', icon: '🏁', tags: ['curves', 'fast', 'technical'] },
        { suffix: 'Serpentine Road', type: 'driving', icon: '🐍', tags: ['curves', 'technical', 'mountains'] },
        { suffix: 'Canyon Drive', type: 'driving', icon: '🛣️', tags: ['curves', 'waterfall', 'short'] },
        { suffix: 'Forest Trail Road', type: 'driving', icon: '🌲', tags: ['curves', 'forest', 'scenic'] },
        { suffix: 'Ridge Highway', type: 'driving', icon: '⛰️', tags: ['curves', 'views', 'far'] },
    ],
    food: [
        { suffix: 'Artisan Roastery', type: 'cafe', icon: '☕', tags: ['coffee', 'cake'] },
        { suffix: 'Roadside Bakery', type: 'cafe', icon: '🍞', tags: ['coffee', 'view'] },
        { suffix: 'Mountain Bistro', type: 'cafe', icon: '🍰', tags: ['cake', 'traditional'] },
        { suffix: 'Local Kitchen', type: 'food', icon: '🍜', tags: ['food'] },
    ],
    landmark: [
        { suffix: 'Old Town', type: 'landmark', icon: '🏘️', tags: ['city', 'culture'] },
        { suffix: 'Historic Quarter', type: 'landmark', icon: '🎻', tags: ['city', 'mountains'] },
        { suffix: 'Market Square', type: 'landmark', icon: '⛷️', tags: ['city', 'mountains'] },
    ]
}

// Generate POIs dynamically near a given location
const generateNearbyPOIs = (center, radiusKm = 60) => {
    const result = { scenic: [], driving: [], food: [], landmark: [] }
    const degPerKm = 1 / 111 // rough conversion

    for (const [category, templates] of Object.entries(POI_TEMPLATES)) {
        templates.forEach((tpl, i) => {
            // Random angle and distance from center
            const angle = Math.random() * 2 * Math.PI
            const dist = (0.2 + Math.random() * 0.8) * radiusKm * degPerKm
            const lat = center.lat + dist * Math.cos(angle)
            const lng = center.lng + dist * Math.sin(angle) / Math.cos(center.lat * Math.PI / 180)

            result[category].push({
                name: tpl.suffix,
                lat, lng,
                type: tpl.type,
                icon: tpl.icon,
                tags: tpl.tags,
                description: `A ${tpl.type} stop ${Math.round(dist * 111)}km from your location`
            })
        })
    }
    return result
}

// ─── Intent Parser ───
const parseIntent = (prompt) => {
    const p = prompt.toLowerCase()

    // Duration
    let duration = 180 // default 3h
    const hourMatch = p.match(/(\d+)\s*h/) || p.match(/(\d+)\s*hour/)
    if (hourMatch) duration = parseInt(hourMatch[1]) * 60

    // Vibe
    const vibes = []
    if (p.includes('fast') || p.includes('speed') || p.includes('sport')) vibes.push('fast')
    if (p.includes('chill') || p.includes('relax') || p.includes('easy')) vibes.push('chill')
    if (p.includes('scenic') || p.includes('view') || p.includes('nice')) vibes.push('scenic')
    if (p.includes('curve') || p.includes('corner') || p.includes('fun')) vibes.push('curves')
    if (p.includes('coffee') || p.includes('cafe') || p.includes('cake')) vibes.push('coffee')
    if (p.includes('mountain') || p.includes('alp')) vibes.push('mountains')
    if (p.includes('lake') || p.includes('water')) vibes.push('scenic')

    return { duration, vibes }
}

const getRandom = (arr, count = 1) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
}

const estimateStats = (waypoints) => {
    let dist = 0
    for (let i = 0; i < waypoints.length - 1; i++) {
        const lat1 = waypoints[i].lat
        const lon1 = waypoints[i].lng
        const lat2 = waypoints[i + 1].lat
        const lon2 = waypoints[i + 1].lng

        const R = 6371
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        dist += R * c
    }

    const realDist = Math.round(dist * 1.4)
    const drivingMinutes = Math.round(realDist * 1.0)
    const stopMinutes = (waypoints.length - 2) * 15
    const realDur = drivingMinutes + stopMinutes

    return { distance: realDist, duration: realDur }
}

// ─── Generator Engine ───
export const generateAIRouteIntent = async (userPrompt, userLocation) => {
    console.log('[AI Architect] Generating route for:', userPrompt, 'from:', userLocation)
    await new Promise(resolve => setTimeout(resolve, 1500)) // Sim thinking

    const { duration, vibes } = parseIntent(userPrompt)

    // Build start from user's actual location
    const start = userLocation
        ? { name: 'Current Location', lat: userLocation.lat, lng: userLocation.lng }
        : { name: 'Start Point', lat: 48.1351, lng: 11.5820 } // Absolute last resort fallback

    // Generate POIs dynamically near the user, scaled by trip duration
    const radiusKm = Math.min(120, Math.max(20, duration / 3))
    const nearbyPOIs = generateNearbyPOIs(start, radiusKm)

    // Filter candidate POIs based on vibes
    let candidates = []
    if (vibes.includes('curves') || vibes.includes('fast')) {
        candidates.push(...nearbyPOIs.driving)
    }
    if (vibes.includes('scenic') || vibes.includes('chill')) {
        candidates.push(...nearbyPOIs.scenic)
        candidates.push(...nearbyPOIs.landmark)
    }
    if (vibes.includes('coffee')) {
        candidates.push(...nearbyPOIs.food)
    }

    // Default fill if empty or generic
    if (candidates.length === 0) {
        candidates = [...nearbyPOIs.scenic, ...nearbyPOIs.driving, ...nearbyPOIs.landmark]
    }

    // Selection Strategy
    const numStops = Math.max(2, Math.min(5, Math.floor(duration / 45)))
    const selectedStops = getRandom(candidates, numStops)

    // Force a coffee stop if requested
    if (vibes.includes('coffee') && !selectedStops.some(s => s.type === 'cafe')) {
        const coffeeStop = getRandom(nearbyPOIs.food, 1)[0]
        if (coffeeStop) selectedStops[1] = coffeeStop
    }

    // Sort by angle from start to create a logical loop path
    selectedStops.sort((a, b) => {
        const angleA = Math.atan2(a.lat - start.lat, a.lng - start.lng)
        const angleB = Math.atan2(b.lat - start.lat, b.lng - start.lng)
        return angleA - angleB
    })

    // Construct loop waypoints
    const waypoints = [start, ...selectedStops, start]
    const stats = estimateStats(waypoints)

    // Name the route
    const mainFeature = selectedStops.find(s => s.type === 'driving' || s.type === 'scenic') || selectedStops[0]
    const routeName = `AI: ${mainFeature.name} ${vibes.includes('fast') ? 'Sprint' : 'Explorer'}`

    const routeData = {
        id: `ai-gen-${Date.now()}`,
        name: routeName,
        region: 'Near You',
        author: 'AI Architect',
        authorVerified: true,
        distance: stats.distance,
        duration: stats.duration,
        curves: vibes.includes('curves') ? 'High' : 'Medium',
        curvinessIndex: vibes.includes('curves') ? 5 : 3,
        sss: vibes.includes('curves') ? 9.2 : 8.5,
        hearts: 0,
        technical: vibes.includes('fast') || vibes.includes('curves'),
        scenic: true,
        isLoop: true,
        isGenerated: true,
        distanceFromUser: 0,
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
        surface: { asphalt: 100 },
        hazards: { potholes: 0, speedHumps: 0, unpaved: 0 },
        elevation: { gain: Math.floor(stats.distance * 8), maxGradient: 4 },
        waypoints: waypoints.map(w => ({ lat: w.lat, lng: w.lng, name: w.name })),
        stops: selectedStops
    }

    return {
        status: 'success',
        ai_reasoning: `Generated ${selectedStops.length} stops matching "${vibes.join(', ')}" vibe, all near your current location.`,
        route_proposal: routeData
    }
}

// ─── Legacy Export (kept for compatibility) ───
export const generateFromParameters = async (params, userLocation) => {
    const prompt = `${params.style > 0.5 ? 'fast technical curves' : 'scenic chill'} ${params.duration} minutes`
    return generateAIRouteIntent(prompt, userLocation)
}
