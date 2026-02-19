// ─── Peak Flow v13.0 — Centralized Mock Data ───

// ─── Route Data ───
export const MOCK_ROUTES = [
    {
        id: 1,
        name: 'The Black Forest Hairpins',
        region: 'Baden-Württemberg',
        author: 'Stefan K.',
        authorVerified: true,
        distance: 42,
        curves: 'High',
        curvinessIndex: 4,
        sss: 9.4,
        duration: 45,
        technical: true,
        scenic: true,
        distanceFromUser: 120,
        hearts: 342,
        image: 'https://welovetravel.in/wp-content/uploads/2024/09/david-talley-FWCjJ7VNm-k-unsplash-scaled.jpg',
        surface: { asphalt: 89, concrete: 6, gravel: 4, cobblestone: 1 },
        elevation: { gain: 860, max: 1140, minGradient: -8, maxGradient: 11 },
        hazards: { speedHumps: 1, potholes: 0, unpaved: 0 },
        atmosphere: ['Forest'],
        coordinates: { start: { lat: 48.41, lng: 8.07 }, end: { lat: 48.23, lng: 8.18 } },
        gallery: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400'
        ],
        waypoints: [
            { name: 'Obertal Viewpoint', type: 'scenic', distanceKm: 8 },
            { name: 'Shell V-Power Station', type: 'fuel', distanceKm: 22 },
            { name: 'Mummelsee Overlook', type: 'scenic', distanceKm: 35 }
        ]
    },
    {
        id: 2,
        name: 'Alpine Pass Sprint',
        region: 'Bavaria',
        author: 'Peak Flow Curated',
        authorVerified: false,
        distance: 18,
        curves: 'Medium',
        curvinessIndex: 3,
        sss: 8.8,
        duration: 25,
        technical: false,
        scenic: true,
        distanceFromUser: 280,
        hearts: 187,
        image: 'https://www.mototourseurope.com/img/website/blog_posts/thumbs/2c4c5e64-8590-472a-b080-0b01b8e4703c_000.jpg',
        surface: { asphalt: 82, concrete: 10, gravel: 5, cobblestone: 3 },
        elevation: { gain: 520, max: 1680, minGradient: -6, maxGradient: 9 },
        hazards: { speedHumps: 2, potholes: 0, unpaved: 0 },
        atmosphere: ['Alpine'],
        coordinates: { start: { lat: 47.44, lng: 11.10 }, end: { lat: 47.39, lng: 11.25 } },
        gallery: [
            'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
        ],
        waypoints: [
            { name: 'Summit Pass', type: 'scenic', distanceKm: 12 },
            { name: 'Alpine Hut Rest Stop', type: 'rest', distanceKm: 16 }
        ]
    },
    {
        id: 3,
        name: 'Coastal Cruise',
        region: 'North Sea',
        author: 'Jasper M.',
        authorVerified: true,
        distance: 120,
        curves: 'Low',
        curvinessIndex: 1,
        sss: 7.5,
        duration: 110,
        technical: false,
        scenic: true,
        distanceFromUser: 450,
        hearts: 89,
        image: 'https://blog.alltours.de/wp-content/uploads/2025/07/kuestenstrasse-kroatien-istock-525555543.jpg',
        surface: { asphalt: 72, concrete: 12, gravel: 10, cobblestone: 6 },
        elevation: { gain: 120, max: 45, minGradient: -2, maxGradient: 3 },
        hazards: { speedHumps: 3, potholes: 1, unpaved: 2 },
        atmosphere: ['Coastal'],
        coordinates: { start: { lat: 53.87, lng: 8.70 }, end: { lat: 54.32, lng: 8.55 } },
        gallery: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
            'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400',
            'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400',
            'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=400'
        ],
        waypoints: [
            { name: 'Lighthouse Point', type: 'scenic', distanceKm: 18 },
            { name: 'Harbour Café', type: 'rest', distanceKm: 55 },
            { name: 'Dune Overlook', type: 'scenic', distanceKm: 82 },
            { name: 'Aral High-Octane', type: 'fuel', distanceKm: 100 }
        ]
    },
    {
        id: 4,
        name: 'Urban Night Loop',
        region: 'Berlin',
        author: 'Max T.',
        authorVerified: false,
        distance: 25,
        curves: 'Medium',
        curvinessIndex: 2,
        sss: 6.5,
        duration: 40,
        technical: true,
        scenic: false,
        distanceFromUser: 15,
        hearts: 56,
        image: 'https://i.pinimg.com/236x/86/37/7a/86377a8a62ae6bb953f952d6669a8703.jpg',
        surface: { asphalt: 60, concrete: 15, gravel: 3, cobblestone: 22 },
        elevation: { gain: 30, max: 65, minGradient: -1, maxGradient: 2 },
        hazards: { speedHumps: 5, potholes: 2, unpaved: 0 },
        atmosphere: ['Industrial'],
        coordinates: { start: { lat: 52.52, lng: 13.40 }, end: { lat: 52.52, lng: 13.40 } },
        gallery: [
            'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400'
        ],
        waypoints: [
            { name: 'Brandenburg Gate', type: 'scenic', distanceKm: 5 },
            { name: 'Tempelhof Straight', type: 'scenic', distanceKm: 15 }
        ]
    },
    {
        id: 5,
        name: 'Taunus Climb',
        region: 'Hesse',
        author: 'Stefan K.',
        authorVerified: true,
        distance: 35,
        curves: 'High',
        curvinessIndex: 4,
        sss: 8.9,
        duration: 55,
        technical: true,
        scenic: true,
        distanceFromUser: 20,
        hearts: 221,
        image: 'https://www.rossfeldpanoramastrasse.de/wp-content/uploads/2024/05/rossfeld-panorama-strasse-home-header-1024x682.jpg',
        surface: { asphalt: 91, concrete: 5, gravel: 3, cobblestone: 1 },
        elevation: { gain: 640, max: 880, minGradient: -10, maxGradient: 12 },
        hazards: { speedHumps: 2, potholes: 0, unpaved: 0 },
        atmosphere: ['Forest'],
        coordinates: { start: { lat: 50.22, lng: 8.48 }, end: { lat: 50.18, lng: 8.50 } },
        gallery: [
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
            'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400',
            'https://images.unsplash.com/photo-1542202229-7d93c33f5d07?w=400'
        ],
        waypoints: [
            { name: 'Feldberg Summit', type: 'scenic', distanceKm: 18 },
            { name: 'Aral V-Power', type: 'fuel', distanceKm: 28 },
            { name: 'Saalburg Overlook', type: 'scenic', distanceKm: 33 }
        ]
    },
    {
        id: 6,
        name: 'Mosel Valley Run',
        region: 'Rhineland',
        author: 'Peak Flow Curated',
        authorVerified: false,
        distance: 60,
        curves: 'Medium',
        curvinessIndex: 3,
        sss: 9.1,
        duration: 90,
        technical: false,
        scenic: true,
        distanceFromUser: 210,
        hearts: 156,
        image: 'https://www.canyon.com/dw/image/v2/BCML_PRD/on/demandware.static/-/Library-Sites-canyon-shared/default/dw3ec105c0/images/blog/E-Bike/moselle-cycle-path-01.jpg?sw=1064',
        surface: { asphalt: 85, concrete: 8, gravel: 5, cobblestone: 2 },
        elevation: { gain: 380, max: 520, minGradient: -5, maxGradient: 7 },
        hazards: { speedHumps: 1, potholes: 0, unpaved: 0 },
        atmosphere: ['Forest', 'Coastal'],
        coordinates: { start: { lat: 50.36, lng: 7.59 }, end: { lat: 49.95, lng: 7.31 } },
        gallery: [
            'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=400',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400'
        ],
        waypoints: [
            { name: 'Vineyard Terrace', type: 'scenic', distanceKm: 15 },
            { name: 'Cochem Castle View', type: 'scenic', distanceKm: 38 },
            { name: 'River Bend Rest', type: 'rest', distanceKm: 52 }
        ]
    },
    {
        id: 7,
        name: 'Eifel Ring Road',
        region: 'Nürburg',
        author: 'Peak Flow Curated',
        authorVerified: false,
        distance: 15,
        curves: 'Extreme',
        curvinessIndex: 5,
        sss: 9.8,
        duration: 20,
        technical: true,
        scenic: false,
        distanceFromUser: 180,
        hearts: 892,
        image: 'https://funkygermany.com/wp-content/uploads/2020/06/roadtrip-deutschland-bayern.jpg',
        surface: { asphalt: 96, concrete: 4, gravel: 0, cobblestone: 0 },
        elevation: { gain: 190, max: 620, minGradient: -7, maxGradient: 8 },
        hazards: { speedHumps: 0, potholes: 0, unpaved: 0 },
        atmosphere: ['Forest'],
        coordinates: { start: { lat: 50.33, lng: 6.94 }, end: { lat: 50.33, lng: 6.94 } },
        gallery: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
            'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400'
        ],
        waypoints: [
            { name: 'Pit Lane Entry', type: 'scenic', distanceKm: 0 },
            { name: 'Karussell', type: 'scenic', distanceKm: 7 }
        ]
    },
    {
        id: 8,
        name: 'Grand Alpine Tour',
        region: 'The Alps',
        author: 'Stefan K.',
        authorVerified: true,
        distance: 350,
        curves: 'Medium',
        curvinessIndex: 3,
        sss: 9.5,
        duration: 360,
        technical: false,
        scenic: true,
        multiDay: true,
        distanceFromUser: 290,
        hearts: 1204,
        image: 'https://www.grossglockner.at/Bildmaterial%20%26%20PDF%20Websites/Gro%C3%9Fglockner%20Hochalpenstra%C3%9Fe/Naturlandschaft/169/image-thumb__169__lightbox/Glockner-Edelweissspitze-1.a03aa18a.jpg',
        surface: { asphalt: 78, concrete: 11, gravel: 8, cobblestone: 3 },
        elevation: { gain: 3200, max: 2504, minGradient: -12, maxGradient: 14 },
        hazards: { speedHumps: 2, potholes: 1, unpaved: 0 },
        atmosphere: ['Alpine'],
        coordinates: { start: { lat: 47.07, lng: 12.84 }, end: { lat: 47.07, lng: 12.84 } },
        gallery: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
            'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
        ],
        waypoints: [
            { name: 'Grossglockner Entry', type: 'scenic', distanceKm: 0 },
            { name: 'Kaiser-Franz-Josefs-Höhe', type: 'scenic', distanceKm: 48 },
            { name: 'Edelweiß-Spitze', type: 'scenic', distanceKm: 85 },
            { name: 'OMV High-Octane', type: 'fuel', distanceKm: 160 },
            { name: 'Zillertal Valley Café', type: 'rest', distanceKm: 220 },
            { name: 'Inntal Panorama', type: 'scenic', distanceKm: 310 }
        ]
    }
]

// ─── Trip History Data ───
export const MOCK_TRIPS = [
    {
        id: 't1',
        routeId: 1,
        routeName: 'The Black Forest Hairpins',
        date: '2026-02-08',
        distance: 42.3,
        duration: 48, // minutes actual
        image: 'https://welovetravel.in/wp-content/uploads/2024/09/david-talley-FWCjJ7VNm-k-unsplash-scaled.jpg',
        notes: 'Perfect conditions. Morning mist cleared by 10am. Took the southern variant through the valley.',
        photos: 3,
        performance: {
            avgSpeed: 72,
            maxSpeed: 164,
            avgGForce: 0.4,
            maxGForce: 1.1,
            fuelUsed: 18.2,
            gearChanges: 342,
            sectors: [
                { name: 'Sector 1 — Valley Entry', time: '4:32', speed: 88 },
                { name: 'Sector 2 — Hairpin Series', time: '12:08', speed: 54 },
                { name: 'Sector 3 — Ridge Run', time: '6:44', speed: 112 },
                { name: 'Sector 4 — Descent', time: '8:16', speed: 96 }
            ]
        }
    },
    {
        id: 't2',
        routeId: 5,
        routeName: 'Taunus Climb',
        date: '2026-02-01',
        distance: 35.1,
        duration: 58,
        image: 'https://www.rossfeldpanoramastrasse.de/wp-content/uploads/2024/05/rossfeld-panorama-strasse-home-header-1024x682.jpg',
        notes: 'Cold but dry. Some frost patches on the northern switchbacks. Incredible sunset at the top.',
        photos: 7,
        performance: {
            avgSpeed: 64,
            maxSpeed: 148,
            avgGForce: 0.5,
            maxGForce: 1.3,
            fuelUsed: 14.8,
            gearChanges: 298,
            sectors: [
                { name: 'Sector 1 — Base Approach', time: '3:18', speed: 92 },
                { name: 'Sector 2 — Main Climb', time: '14:22', speed: 48 },
                { name: 'Sector 3 — Summit Loop', time: '5:56', speed: 68 }
            ]
        }
    },
    {
        id: 't3',
        routeId: 7,
        routeName: 'Eifel Ring Road',
        date: '2026-01-25',
        distance: 15.2,
        duration: 22,
        image: 'https://funkygermany.com/wp-content/uploads/2020/06/roadtrip-deutschland-bayern.jpg',
        notes: 'Quick blast around the ring. Track was quiet, perfect grip.',
        photos: 2,
        performance: {
            avgSpeed: 108,
            maxSpeed: 212,
            avgGForce: 0.8,
            maxGForce: 1.8,
            fuelUsed: 8.4,
            gearChanges: 186,
            sectors: [
                { name: 'Sector 1 — Sprint Start', time: '2:48', speed: 142 },
                { name: 'Sector 2 — Technical Mid', time: '6:12', speed: 94 },
                { name: 'Sector 3 — Fast Finish', time: '3:44', speed: 128 }
            ]
        }
    },
    {
        id: 't4',
        routeId: 8,
        routeName: 'Grand Alpine Tour',
        date: '2026-01-12',
        distance: 348.7,
        duration: 312,
        image: 'https://www.grossglockner.at/Bildmaterial%20%26%20PDF%20Websites/Gro%C3%9Fglockner%20Hochalpenstra%C3%9Fe/Naturlandschaft/169/image-thumb__169__lightbox/Glockner-Edelweissspitze-1.a03aa18a.jpg',
        notes: 'Full day tour with the PEX team. Stopped at 3 overlooks. Highlight was the Grossglockner pass.',
        photos: 24,
        performance: {
            avgSpeed: 68,
            maxSpeed: 178,
            avgGForce: 0.3,
            maxGForce: 0.9,
            fuelUsed: 82.5,
            gearChanges: 1420,
            sectors: [
                { name: 'Sector 1 — Valley Start', time: '18:32', speed: 88 },
                { name: 'Sector 2 — Mountain Climb', time: '42:08', speed: 52 },
                { name: 'Sector 3 — High Pass', time: '28:44', speed: 64 },
                { name: 'Sector 4 — Descent Home', time: '22:16', speed: 82 }
            ]
        }
    }
]

// ─── Convoy Groups ───
// ─── Convoy Groups ───
export const MOCK_GROUPS = [
    {
        id: 1,
        title: 'PEX team roadtrip to Arlberg',
        countdown: 'Now happening',
        members: 8,
        distance: 530,
        startLocation: 'Munich',
        endLocation: 'Lech am Arlberg',
        image: 'https://www.grossglockner.at/Bildmaterial%20%26%20PDF%20Websites/Gro%C3%9Fglockner%20Hochalpenstra%C3%9Fe/Naturlandschaft/169/image-thumb__169__lightbox/Glockner-Edelweissspitze-1.a03aa18a.jpg',
        route: MOCK_ROUTES.find(r => r.id === 8) // Grand Alpine Tour
    },
    {
        id: 2,
        title: 'Black Forest Grand Tour',
        countdown: 'In 12 days',
        members: 5,
        distance: 420,
        startLocation: 'Stuttgart',
        endLocation: 'Freiburg',
        image: 'https://welovetravel.in/wp-content/uploads/2024/09/david-talley-FWCjJ7VNm-k-unsplash-scaled.jpg',
        route: MOCK_ROUTES.find(r => r.id === 1) // Black Forest Hairpins
    },
    {
        id: 3,
        title: 'Alpine Sunrise Convoy',
        countdown: 'In 18 days',
        members: 12,
        distance: 680,
        startLocation: 'Innsbruck',
        endLocation: 'Zell am See',
        image: 'https://www.mototourseurope.com/img/website/blog_posts/thumbs/2c4c5e64-8590-472a-b080-0b01b8e4703c_000.jpg',
        route: MOCK_ROUTES.find(r => r.id === 2) // Alpine Pass Sprint
    },
]

// ─── Users ───
export const MOCK_USERS = [
    { id: 'u1', name: 'Stefan K.', vehicle: 'McLaren 720S', verified: true, avatar: null },
    { id: 'u2', name: 'Jasper M.', vehicle: 'Porsche 911 GT3', verified: true, avatar: null },
    { id: 'u3', name: 'Max T.', vehicle: 'BMW M4', verified: false, avatar: null },
    { id: 'u4', name: 'Lisa R.', vehicle: 'Audi RS6', verified: true, avatar: null },
    { id: 'u5', name: 'Tom W.', vehicle: 'Mercedes AMG GT', verified: true, avatar: null },
]
