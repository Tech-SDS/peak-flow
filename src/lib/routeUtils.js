import { reverseGeocode } from './searchService'

// One-line descriptions for all curated waypoints
const WAYPOINT_DESCRIPTIONS = {
    // München
    'Isar Overlook': 'Elevated viewpoint over the winding Isar river valley',
    'Grünwald Bridge': 'Historic bridge with views of the densely forested Isar gorge',
    'Schäftlarn Abbey': '12th-century Benedictine monastery in a tranquil riverside setting',
    'Herrsching Promenade': 'Charming lakeside promenade with views across Ammersee',
    'Dießen Café': 'Lakeside café stop in the historic artist\'s town of Dießen',
    'Andechs Kloster': 'Pilgrimage monastery famous for its brewery and hilltop views',
    'Sauerlach Curves': 'Series of sweeping bends through lush farmland south of Munich',
    'Holzkirchen Bypass': 'Fast open road with views toward the Alpine foothills',
    'Miesbach Valley': 'Pastoral valley framed by the first rows of the Bavarian Alps',
    'Dachau Palace': 'Renaissance palace and gardens on a hill overlooking the Amper valley',
    'Amper Bridge': 'Picturesque crossing of the Amper river through willow meadows',
    'Schleißheim Palace': 'Baroque palace complex with grand canal and manicured gardens',
    // Alpen
    'Kesselberg Pass': 'Legendary 18% gradient pass favoured by motorsport legends',
    'Walchensee View': "Bavaria's deepest lake surrounded by forested Alpine peaks",
    'Urfeld Café': 'Traditional Bavarian inn at the lakeside village of Urfeld',
    'Rossfeld Summit': "Germany's highest public toll road with views to the Berchtesgaden Alps",
    'Panorama Terrace': 'Open terrace overlooking Salzburg and the Salzach valley',
    'Sylvenstein Dam': 'Turquoise reservoir flanked by steep forested mountainsides',
    'Fall Village': 'Idyllic mountain village offering traditional Bavarian refreshments',
    'Lenggries Return': 'Sweeping valley road back through the Isar foothills',
    'Nebelhorn Base': 'Start of the Allgäu high-alpine world with panoramic cable car views',
    'Fellhorn View': 'Saddle ridge with sweeping views across the German-Austrian border',
    'Breitachklamm': "Europe's deepest gorge carved by the raging Breitach river",
    'Tegernsee Bräustüberl': 'Iconic lakeside beer hall and boat dock on Tegernsee',
    'Rottach Promenade': 'Elegant lakeside promenade with views to the southern Alps',
    'Kreuth Valley': 'Unspoiled valley road winding deep into the Bavarian Alpine foothills',
    'Plansee Shore': 'Crystal-clear Alpine lake straddling the German-Austrian border',
    'Heiterwanger See': 'Quieter sister lake to Plansee with mirror-calm reflections',
    'Ammergau Return': 'Sweeping descent through the Ammergau Alps back to the valley',
    'Wank Panorama': 'Summit view over Garmisch-Partenkirchen and the Zugspitze',
    'Esterbergalm': 'Alpine pasture hut with refreshments and mountain panoramas',
    'Partnachklamm View': 'Vantage point above the dramatic Partnach gorge ravine',
    'Alte Saline': 'Historic salt works museum tracing the ancient salt trade route',
    'Thumsee': 'Hidden Alpine lake ideal for a scenic stop in the spa town',
    'Nonn Viewpoint': 'Hilltop vantage with views over the Salzach valley into Austria',
    // Schwarzwald
    'Mummelsee': 'Mysterious glacial lake steeped in Black Forest folklore',
    'Ruhestein Pass': 'Remote wooded high pass with dense dark-fir forest atmosphere',
    'Hornisgrinde Summit': 'Highest peak in the northern Black Forest with sweeping views',
    'Schauinsland Summit': "Freiburg's local mountain with cable car and 360° panorama",
    'Bergstation Café': 'Summit café with views over the Rhine plain and Vosges mountains',
    'Triberg Falls': "Germany's highest waterfalls cascading 163 metres through the forest",
    'Cuckoo Clock Workshop': 'World-famous Black Forest cuckoo clock craftsmen\'s workshop',
    'Gutach Valley': 'Traditional open-air museum village in a deep forest valley',
    'Titisee Promenade': 'Popular Black Forest lake with boat rentals and resort atmosphere',
    'Feldberg Summit Road': 'Highest road in the Black Forest with views into Switzerland',
    'Seebuck View': 'Ridge viewpoint over Titisee, Baden and the Alps beyond',
    'Marktplatz': "One of Germany's largest town squares, surrounded by arcaded galleries",
    'Kniebis Pass': 'Forested highland pass at 1000m with classic Black Forest scenery',
    'Murgtal View': 'Valley overlook into the winding Murg river canyon below',
    'Schluchsee Dam': "Impressive dam wall holding back the Black Forest's largest lake",
    'St. Blasien': 'Stunning domed cathedral towering incongruously in a forest valley',
    'Aha Viewpoint': 'Remote ridge with panoramas south to the Swiss Alps on clear days',
    'Hermann Hesse Museum': 'Birthplace of the Nobel Prize-winning author in the old town',
    'Nagold Valley': 'Scenic winding river valley with medieval ruins on the hillsides',
    'Hirsau Monastery': '11th-century Benedictine abbey complex in atmospheric ruins',
    'Kinzig Bridge': 'Centuries-old river crossing marking the start of the valley run',
    'Wolfach Old Town': 'Well-preserved half-timbered town with a fine Ducal Palace',
    // Rest-DE
    'Nürburgring View': 'Overlook of the legendary Nordschleife racetrack pit complex',
    'Adenau Town': 'Gateway town to the Nürburgring with local café culture',
    'Hohe Acht': 'Highest peak in the Eifel with views deep into the volcanic landscape',
    'Cochem Castle': 'Fairytale neo-Gothic castle dramatically perched above the Mosel',
    'Vineyard Terrace': 'Terraced Mosel vineyards with classic river bend panorama',
    'Beilstein Village': 'Tiny, perfectly preserved medieval village clinging to the riverbank',
    'Wernigerode Castle': 'Colourful half-timbered castle crowning the Harz foothills',
    'Schierke Village': 'Charming Harz village and gateway to the Brocken summit',
    'Brocken Vista': 'Highest peak in northern Germany — site of Walpurgis Night legend',
    'Bastei Bridge': 'Iconic sandstone bridge spanning a dramatic rock formation above the Elbe',
    'Königstein Fortress': 'Virtually impregnable hilltop fortress with sweeping valley views',
    'Elbe Valley View': 'Wide panorama over the sandstone pillars and Elbe meanders',
    'Wasserkuppe': 'Highest peak in the Rhön with gliding activity and open moorland',
    'Kreuzberg Kloster': 'Franciscan monastery known for its brewery and forest setting',
    'Milseburg View': 'Basalt hill with Iron Age fort remains and sweeping Rhön panoramas',
    'Feldberg Summit': 'Taunus high point with views over the Frankfurt skyline',
    'Saalburg Roman Fort': "Reconstructed Roman Limes fort and museum on Hadrian's frontier",
    'Oberursel Return': 'Winding descent through Taunus vineyards back toward the Rhine-Main',
    'Felsenmeer': 'Sea of ancient granite boulders scattered across a mystical forest floor',
    'Lindenfels Castle': 'Romantic ruined hilltop castle with views over the Odenwald',
    'Auerbach Valley': 'Gentle valley road winding through orchards and vineyard slopes',
    'Tecklenburg Castle': 'Hilltop castle ruins with dramatic views over the Teutonic forest',
    'Dörenther Klippen': 'Striking sandstone crags rising above the Teutoburg forest canopy',
    'Bad Iburg': 'Spa town with Benedictine abbey and hill castle in one complex',
    'Kreidefelsen Königsstuhl': "Germany's most photographed chalk-white sea cliffs on Rügen",
    'Prora Beach': 'Vast 4.5 km-long Nazi-era resort complex now repurposed on the Baltic',
    'Binz Promenade': 'Elegant Wilhelminian beach resort with white spa architecture',
    'Großer Plöner See': "Largest of Holstein's lakes, ringed by gentle hills and reeds",
    'Malente Kurpark': 'Spa park set between five lakes in a classic German health resort',
    'Eutin Castle': 'Water castle of the Holstein-Gottorp dynasty in a rose-garden park',
    // England
    'Honister Pass': "England's steepest road pass, cutting through dramatic fell scenery",
    'Hardknott Pass': "One of England's most challenging passes with 30% gradients",
    'Windermere Lake': "England's largest natural lake with steamer cruises and lakeside inns",
    'Bourton-on-the-Water': 'Picture-perfect Cotswolds village with low stone bridges over the Windrush',
    'Broadway Tower': 'Folly tower on the Cotswolds escarpment with views to 13 counties',
    'Chipping Campden': 'Finest medieval wool town in the Cotswolds, with golden-stone market hall',
    'Snake Pass Summit': 'Wild moorland pass often closed by snow — dramatic open road driving',
    'Ladybower Reservoir': 'Site of the Dambusters trials, with drowned villages beneath the water',
    'Mam Tor Viewpoint': 'Shivering Mountain ridge with views over the Hope Valley',
    'Rievaulx Abbey': 'Atmospheric Cistercian abbey ruins set in a hidden wooded valley',
    'Goathland Village': "Moorland village famous as 'Heartbeat' and Harry Potter filming location",
    'Whitby Harbour': 'Gothic harbour town with ruined abbey — inspiration for Dracula',
    'Clovelly Village': 'Privately owned fishing village tumbling steeply to the sea on cobbled lanes',
    'Bude Sea Pool': '1930s tidal sea pool carved into the Atlantic rocks at Bude',
    'Tintagel Castle': "Legendary cliff-top ruin said to be King Arthur's birthplace",
    'Porthmeor Beach': "Surfers' beach right below St Ives' Tate gallery on the Atlantic coast",
    "Land's End": "Britain's most south-westerly point — dramatic cliff-top finale",
    'Penzance Harbour': 'Ferry port for the Isles of Scilly with historic promenade gardens',
    'Ditchling Beacon': 'Highest point of the East Sussex Downs with views to the sea',
    "Devil's Dyke": "Legendary V-shaped valley — the Devil's failed attempt to flood the Weald",
    'Beachy Head': "England's highest chalk sea cliff with dramatic lighthouse views",
    'Wroxham Broad': 'Capital of the Broads — gateway to hundreds of miles of inland waterways',
    'Horsey Windpump': 'Historic drainage windmill with grey seal colonies on the nearby beach',
    'Ranworth Church': '14th-century church with a tower offering views across the Broads',
    'Buttertubs Pass': 'Remote moorland pass named for limestone potholes along the roadside',
    'Tan Hill Inn': "England's highest pub at 528m — essential stop on the Pennine Way",
    'Ribblehead Viaduct': '24-arch Victorian railway viaduct striding across the open moorland',
    'Ludlow Castle': "Impressive Norman castle in one of England's finest medieval towns",
    'Long Mynd': 'Ancient plateau with Iron Age trackways and gliding above the heather',
    'Stiperstones': 'Quartzite ridge with Arthurian legends and views to Wales',
    'Beaulieu Motor Museum': 'Home of the National Motor Museum and Palace House estate',
    'Bolderwood Deer Sanctuary': 'Ancient oak woodland where red deer gather at a daily feeding point',
    'Lymington Quay': 'Georgian harbour town with Solent views and sailing culture',
    "Hubbard's Hills": 'Victorian pleasure grounds in a chalk valley below the Wolds',
    'Donington on Bain': 'Quiet village at the heart of the chalk and flint Wolds landscape',
    'Tetford Village': 'Peaceful inn village in the Wolds, a resting place since coaching days',
    'Long Mynd Burway': 'Single-track road climbing the Burway to open heather moorland',
    'Caer Caradoc': 'Iron Age hillfort with legend ties to the Romano-British king Caractacus',
    'Wenlock Edge': "Ancient limestone escarpment immortalised by A.E. Housman's poetry",
    'Dartmoor Prison Museum': 'Forbidding 1809 prison converted into a museum on the high moor',
    'Haytor Rocks': "Massive granite tor rising from the high moor — Dartmoor's most iconic feature",
    'Widecombe-in-the-Moor': 'Cathedral of the moor — the village square hosts the famous annual fair',
    'Henley Bridge': 'Elegant 18th-century bridge at the start of the Royal Regatta reach',
    'Turville Village': 'Charming Chilterns village with a windmill perched on the hill above',
    'Christmas Common': 'Beech woodland clearing high on the Chilterns escarpment',
    'Box Hill Viewpoint': "Surrey's most popular viewpoint above the Mole Gap — Tour de France stage finish",
    'Leith Hill Tower': 'Highest point in south-east England with views to the sea',
    'Shere Village': "Surrey's prettiest village with a ford, stream and ancient church",
    'Alnwick Castle': "Northumberland's great castle — location for the first Harry Potter films",
    'Bamburgh Castle': 'Towering royal fortress on a basalt crag above the North Sea beach',
    'Holy Island Causeway': 'Tidal causeway — timing is essential — leading to Lindisfarne',
    'Glastonbury Tor': "Mystical hill crowned with St Michael's Tower — Arthurian heart of England",
    'Wells Cathedral': "England's smallest city with a magnificent Gothic cathedral facade",
    'Cheddar Gorge': "Britain's largest gorge — dramatic limestone cliffs rising 138 metres",
    'Puzzlewood': 'Ancient iron-mine forest — inspiration for Middle-earth according to Tolkien',
    'Symonds Yat Rock': 'Eagle-nesting viewpoint looping the meander of the river Wye below',
    'Tintern Abbey': 'Atmospheric Cistercian ruins in the wooded Wye Valley — Turner painted it here',
    'The Needles': 'Three chalk stacks tipped by a red-and-white striped lighthouse',
    'Ventnor Esplanade': 'Victorian spa resort on the sheltered south coast with Mediterranean microclimate',
    'Sandown Bay': "Wide sandy bay framed by chalk cliffs — the island's sunniest spot",
}

export const normalizeRoute = async (route, userLocation) => {
    if (!route) return []

    let stops = []

    // 1. Manual/OSRM Route (Look for 'legs')
    if (route.legs && route.legs.length > 0) {
        // Start
        stops.push({
            type: 'start',
            name: 'Start Point',
            details: route.startAddress || 'Current Location',
            isCurrentLocation: !route.startAddress,
            coordinates: route.coordinates?.start
        })

        // Intermediate Stops & Destination
        route.legs.forEach((leg, i) => {
            const isLast = i === route.legs.length - 1
            const stopData = route.stops ? route.stops[i] : {}

            stops.push({
                type: isLast ? 'destination' : 'stop',
                name: isLast ? (route.destinationName || route.name) : `Waypoint ${i + 1}`,
                distanceFromPrev: leg.distance,
                durationFromPrev: leg.duration,
                ...stopData,
                index: i
            })
        })
    }
    // 2. Curated Route (Look for 'waypoints')
    else if (route.waypoints) {
        // Start
        stops.push({
            type: 'start',
            name: 'Start Point',
            details: route.region || 'Start',
            coordinates: route.waypoints[0]?.coordinates
        })

        let prevDist = 0
        route.waypoints.forEach((wp) => {
            const dist = wp.distanceKm ? (wp.distanceKm * 1000) : 0
            const legDist = dist - prevDist
            prevDist = dist

            stops.push({
                ...wp,                    // spread first (wp.type like "scenic"/"rest" included)
                type: 'stop',             // override wp.type — always a stop, never a destination
                name: wp.name,
                details: wp.description || WAYPOINT_DESCRIPTIONS[wp.name] || null,
                distanceFromPrev: legDist > 0 ? legDist : 0,
            })
        })

        // Add explicit destination after all stops
        const lastWpDist = route.waypoints.length > 0
            ? (route.waypoints[route.waypoints.length - 1].distanceKm || 0) * 1000
            : 0
        const totalDist = (route.distance || 0) * 1000
        const destDistFromPrev = totalDist > lastWpDist ? totalDist - lastWpDist : 0

        stops.push({
            type: 'destination',
            name: route.isLoop ? 'Return to Start' : (route.endName || route.name),
            details: route.isLoop ? 'Complete the loop back to the starting point' : (route.endRegion || route.region || null),
            distanceFromPrev: destDistFromPrev,
        })
    }
    // 3. Fallback (Simple Start/End, with optional intermediate stops)
    else {
        stops.push({ type: 'start', name: 'Start Point', details: 'Current Location', isCurrentLocation: true })

        if (route.stops?.length > 0) {
            route.stops.forEach(stop => {
                stops.push({
                    type: 'stop',
                    name: stop.name,
                    details: stop.details || null,
                })
            })
        }

        stops.push({
            type: 'destination',
            name: route.destinationName || route.name,
            details: route.destinationAddress || null,
            distanceFromPrev: (route.distance || 0) * 1000
        })
    }

    // Reverse geocode start if needed
    const startStop = stops[0]
    if (startStop.isCurrentLocation && userLocation && !route.startAddress) {
        const address = await reverseGeocode(userLocation.lat, userLocation.lng)
        if (address) {
            stops[0] = { ...stops[0], details: address, isCurrentLocation: false }
        }
    } else if (startStop.isCurrentLocation && route.coordinates?.start && !route.startAddress) {
        const address = await reverseGeocode(route.coordinates.start.lat, route.coordinates.start.lng)
        if (address) {
            stops[0] = { ...stops[0], details: address, isCurrentLocation: false }
        }
    }

    // Reverse geocode destination if we have coords but no address yet
    const destStop = stops[stops.length - 1]
    if (!destStop.details && route.destinationCoords) {
        const address = await reverseGeocode(route.destinationCoords.lat, route.destinationCoords.lng)
        if (address) {
            stops[stops.length - 1] = { ...destStop, details: address }
        }
    }

    return stops
}
