// ─── Peak Flow v13.0 — AI Architect Service ───
// Simulates a "Real" LLM by dynamically composing routes from a POI database
// based on natural language intent.

// ─── Knowledge Base: Points of Interest ───
const POI_DB = {
    starts: [
        { name: 'Munich (Center)', lat: 48.1351, lng: 11.5820 },
        { name: 'Munich (South)', lat: 48.0970, lng: 11.5450 }
    ],
    lakes: [
        { name: 'Walchensee', lat: 47.5940, lng: 11.4010, type: 'scenic', icon: '🏔️', tags: ['scenic', 'chill', 'swim'] },
        { name: 'Kochelsee', lat: 47.6035, lng: 11.3308, type: 'scenic', icon: '📸', tags: ['scenic', 'chill'] },
        { name: 'Sylvensteinsee', lat: 47.5870, lng: 11.5560, type: 'scenic', icon: '🌉', tags: ['scenic', 'bridge', 'chill'] },
        { name: 'Tegernsee', lat: 47.7280, lng: 11.7730, type: 'scenic', icon: '⛵', tags: ['scenic', 'posh', 'coffee'] },
        { name: 'Ammersee', lat: 47.9990, lng: 11.1310, type: 'scenic', icon: '🌅', tags: ['scenic', 'sunset', 'chill'] },
        { name: 'Starnberger See', lat: 47.9077, lng: 11.3618, type: 'scenic', icon: '🛥️', tags: ['scenic', 'posh'] },
        { name: 'Eibsee', lat: 47.4560, lng: 10.9920, type: 'scenic', icon: '💎', tags: ['scenic', 'far', 'mountains'] }
    ],
    passes: [
        { name: 'Kesselberg Pass', lat: 47.6250, lng: 11.3520, type: 'driving', icon: '🏁', tags: ['curves', 'fast', 'technical'] },
        { name: 'Sudelfeld Pass', lat: 47.6830, lng: 12.0100, type: 'driving', icon: '�️', tags: ['curves', 'technical', 'mountains'] },
        { name: 'Tatzelwurm', lat: 47.6710, lng: 12.0830, type: 'driving', icon: '🐍', tags: ['curves', 'waterfall', 'short'] },
        { name: 'Jachenau Toll Road', lat: 47.5800, lng: 11.4340, type: 'driving', icon: '🌲', tags: ['curves', 'forest', 'scenic'] }, // Adjusted coord
        { name: 'Rossfeld Panoramastraße', lat: 47.6160, lng: 13.0930, type: 'driving', icon: '⛰️', tags: ['curves', 'views', 'far'] }
    ],
    food: [
        { name: 'Dinbzer Kaffeerösterei', lat: 47.7550, lng: 11.7450, type: 'cafe', icon: '☕', tags: ['coffee', 'cake'] },
        { name: 'Aran Brothaus Tegernsee', lat: 47.7080, lng: 11.7560, type: 'cafe', icon: '🍞', tags: ['coffee', 'view'] },
        { name: 'Winklstüberl', lat: 47.7830, lng: 11.9540, type: 'cafe', icon: '🍰', tags: ['cake', 'traditional'] },
        { name: 'Gourmet Tempel', lat: 48.0000, lng: 11.3000, type: 'food', icon: '🍜', tags: ['food'] }
    ],
    cities: [
        { name: 'Bad Tölz', lat: 47.7600, lng: 11.5600, type: 'landmark', icon: '🏘️', tags: ['city', 'culture'] },
        { name: 'Mittenwald', lat: 47.4410, lng: 11.2640, type: 'landmark', icon: '🎻', tags: ['city', 'mountains'] },
        { name: 'Garmisch-Partenkirchen', lat: 47.4910, lng: 11.0950, type: 'landmark', icon: '⛷️', tags: ['city', 'mountains'] }
    ]
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
    // Rough logic: Calculate linear distance between points
    let dist = 0
    for (let i = 0; i < waypoints.length - 1; i++) {
        const lat1 = waypoints[i].lat
        const lon1 = waypoints[i].lng
        const lat2 = waypoints[i + 1].lat
        const lon2 = waypoints[i + 1].lng

        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        dist += R * c;
    }

    // Road factor: scenic routes are twisty, so actual distance is ~1.4x linear
    const realDist = Math.round(dist * 1.4)

    // Duration: Assume avg speed 60km/h (1km/min) + 15min per stop
    // This is much more realistic for scenic driving
    const drivingMinutes = Math.round(realDist * 1.0)
    const stopMinutes = (waypoints.length - 2) * 15 // Exclude start/end if loop
    const realDur = drivingMinutes + stopMinutes

    return { distance: realDist, duration: realDur }
}

// ─── Generator Engine ───
export const generateAIRouteIntent = async (userPrompt, userLocation) => {
    console.log('[AI Architect] Generating real route for:', userPrompt, 'from:', userLocation)
    await new Promise(resolve => setTimeout(resolve, 1500)) // Sim thinking

    const { duration, vibes } = parseIntent(userPrompt)
    const isLoop = true // Assume loops for now

    // Build Stop List
    let stops = []
    // Use user location if available, else Munich
    const start = userLocation ? { name: 'Current Location', lat: userLocation.lat, lng: userLocation.lng } : POI_DB.starts[0]

    // Filter candidate POIs based on vibes
    let candidates = []

    // Add relevant categories
    if (vibes.includes('curves') || vibes.includes('fast')) {
        candidates.push(...POI_DB.passes)
    }
    if (vibes.includes('scenic') || vibes.includes('chill')) {
        candidates.push(...POI_DB.lakes)
        candidates.push(...POI_DB.cities)
    }
    if (vibes.includes('coffee')) {
        candidates.push(...POI_DB.food)
    }

    // Default fill if empty or generic
    if (candidates.length === 0) {
        candidates = [...POI_DB.lakes, ...POI_DB.passes, ...POI_DB.cities]
    }

    // Deduplicate
    candidates = [...new Set(candidates)]

    // Selection Strategy: Pick 2-4 primary stops based on duration
    const numStops = Math.max(2, Math.min(5, Math.floor(duration / 45)))
    const selectedStops = getRandom(candidates, numStops)

    // Fix: If "Coffee" requested, FORCE a coffee stop if not present
    if (vibes.includes('coffee') && !selectedStops.some(s => s.type === 'cafe')) {
        const coffeeStop = getRandom(POI_DB.food, 1)[0]
        if (coffeeStop) selectedStops[1] = coffeeStop // Inject in middle
    }

    // Sort roughly by longitude to make a logical loop (simple heuristic)
    // Or just Keep random order for "adventure"? 
    // Let's sort South-West to East? 
    // Actually, simple sorting by LNG helps prevent zig-zags
    selectedStops.sort((a, b) => a.lng - b.lng)

    // Construct Waypoints
    const waypoints = [start, ...selectedStops, start]

    // Stats
    const stats = estimateStats(waypoints)

    // Naming
    const mainFeature = selectedStops.find(s => s.type === 'driving' || s.type === 'scenic') || selectedStops[0]
    const routeName = `AI: ${mainFeature.name} ${vibes.includes('fast') ? 'Sprint' : 'Explorer'}`

    const routeData = {
        id: `ai-gen-${Date.now()}`,
        name: routeName,
        region: userLocation ? 'Near You' : 'Bavaria',
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
        distanceFromUser: 0,
        image: mainFeature.type === 'scenic' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Walchensee_Panorama.jpg/1280px-Walchensee_Panorama.jpg' : 'https://www.rossfeldpanoramastrasse.de/wp-content/uploads/2024/05/rossfeld-panorama-strasse-home-header-1024x682.jpg', // Dynamic image based on POI? kept simple for now
        surface: { asphalt: 100 },
        hazards: { potholes: 0, speedHumps: 0, unpaved: 0 },
        elevation: { gain: Math.floor(stats.distance * 8), maxGradient: 4 },
        waypoints: waypoints.map(w => ({ lat: w.lat, lng: w.lng, name: w.name })),
        stops: selectedStops // keep metadata
    }

    return {
        status: 'success',
        ai_reasoning: `Selected ${selectedStops.length} stops matching "${vibes.join(', ')}" vibe.`,
        route_proposal: routeData
    }
}

// ─── Legacy Export (kept for compatibility) ───
export const generateFromParameters = async (params, userLocation) => {
    // Redirect to new logic using params
    const prompt = `${params.style > 0.5 ? 'fast technical curves' : 'scenic chill'} ${params.duration} minutes`
    return generateAIRouteIntent(prompt, userLocation)
}
