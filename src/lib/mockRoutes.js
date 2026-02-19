//  Peak Flow v13  30 Route Database 
// 4 Sectors: München, Alpen, Schwarzwald, Rest-DE
// Each route has a unique startPoint for spider-leg clustering

export const ROUTE_DATABASE = [
  {
    "id": "muc-1",
    "name": "Isar-Classic Loop",
    "region": "München Ost",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 55,
    "duration": 75,
    "sss": 9.8,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 105,
    "image": "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800",
    "surface": {
      "asphalt": 98,
      "concrete": 2,
      "gravel": 0,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 120,
      "max": 590,
      "minGradient": -3,
      "maxGradient": 4
    },
    "hazards": {
      "speedHumps": 0,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Keine"
    ],
    "atmosphere": [
      "Riverside",
      "Urban Exit"
    ],
    "coordinates": {
      "start": {
        "lat": 48.13,
        "lng": 11.595
      },
      "end": {
        "lat": 48.13,
        "lng": 11.595
      }
    },
    "path": [
      {
        "lat": 48.13,
        "lng": 11.595
      },
      {
        "lat": 48.091,
        "lng": 11.55
      },
      {
        "lat": 48.041,
        "lng": 11.519
      },
      {
        "lat": 48.06,
        "lng": 11.48
      },
      {
        "lat": 48.091,
        "lng": 11.53
      },
      {
        "lat": 48.13,
        "lng": 11.595
      }
    ],
    "waypoints": [
      {
        "name": "Isar Overlook",
        "type": "scenic",
        "distanceKm": 8
      },
      {
        "name": "Grünwald Bridge",
        "type": "scenic",
        "distanceKm": 22
      },
      {
        "name": "Schäftlarn Abbey",
        "type": "scenic",
        "distanceKm": 38
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400"
    ]
  },
  {
    "id": "muc-2",
    "name": "Ammersee Westbank",
    "region": "München West",
    "author": "Stefan K.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 115,
    "duration": 150,
    "sss": 9.4,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 487,
    "image": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    "surface": {
      "asphalt": 96,
      "concrete": 4,
      "gravel": 0,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 280,
      "max": 710,
      "minGradient": -4,
      "maxGradient": 5
    },
    "hazards": {
      "speedHumps": 2,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Promenaden-Verkehr"
    ],
    "atmosphere": [
      "Lakeside",
      "Countryside"
    ],
    "coordinates": {
      "start": {
        "lat": 48.146,
        "lng": 11.459
      },
      "end": {
        "lat": 48.146,
        "lng": 11.459
      }
    },
    "path": [
      {
        "lat": 48.146,
        "lng": 11.459
      },
      {
        "lat": 48.08,
        "lng": 11.3
      },
      {
        "lat": 48.001,
        "lng": 11.112
      },
      {
        "lat": 47.95,
        "lng": 11.08
      },
      {
        "lat": 48.001,
        "lng": 11.2
      },
      {
        "lat": 48.08,
        "lng": 11.35
      },
      {
        "lat": 48.146,
        "lng": 11.459
      }
    ],
    "waypoints": [
      {
        "name": "Herrsching Promenade",
        "type": "scenic",
        "distanceKm": 20
      },
      {
        "name": "Dießen Café",
        "type": "rest",
        "distanceKm": 48
      },
      {
        "name": "Andechs Kloster",
        "type": "rest",
        "distanceKm": 78
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400"
    ]
  },
  {
    "id": "muc-3",
    "name": "Voralpen-Sprint",
    "region": "München Süd",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 140,
    "duration": 165,
    "sss": 8.5,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 267,
    "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "surface": {
      "asphalt": 93,
      "concrete": 4,
      "gravel": 3,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 860,
      "max": 920,
      "minGradient": -10,
      "maxGradient": 12
    },
    "hazards": {
      "speedHumps": 2,
      "potholes": 1,
      "unpaved": 0
    },
    "chassisThreats": [
      "Scharfe Kurven im Forst"
    ],
    "atmosphere": [
      "Alpine Foothills",
      "Forest"
    ],
    "coordinates": {
      "start": {
        "lat": 48.11,
        "lng": 11.54
      },
      "end": {
        "lat": 48.11,
        "lng": 11.54
      }
    },
    "path": [
      {
        "lat": 48.11,
        "lng": 11.54
      },
      {
        "lat": 48.04,
        "lng": 11.58
      },
      {
        "lat": 47.95,
        "lng": 11.65
      },
      {
        "lat": 47.854,
        "lng": 11.751
      },
      {
        "lat": 47.92,
        "lng": 11.68
      },
      {
        "lat": 48.01,
        "lng": 11.6
      },
      {
        "lat": 48.11,
        "lng": 11.54
      }
    ],
    "waypoints": [
      {
        "name": "Sauerlach Curves",
        "type": "scenic",
        "distanceKm": 18
      },
      {
        "name": "Holzkirchen Bypass",
        "type": "scenic",
        "distanceKm": 42
      },
      {
        "name": "Miesbach Valley",
        "type": "scenic",
        "distanceKm": 75
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    ]
  },
  {
    "id": "muc-4",
    "name": "Dachauer Hinterland",
    "region": "München Nord",
    "author": "Max T.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 75,
    "duration": 90,
    "sss": 9.2,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 175,
    "image": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
    "surface": {
      "asphalt": 97,
      "concrete": 3,
      "gravel": 0,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 90,
      "max": 520,
      "minGradient": -2,
      "maxGradient": 3
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Landstraßen-Profil"
    ],
    "atmosphere": [
      "Countryside",
      "Moorland"
    ],
    "coordinates": {
      "start": {
        "lat": 48.2,
        "lng": 11.58
      },
      "end": {
        "lat": 48.2,
        "lng": 11.58
      }
    },
    "path": [
      {
        "lat": 48.2,
        "lng": 11.58
      },
      {
        "lat": 48.26,
        "lng": 11.5
      },
      {
        "lat": 48.31,
        "lng": 11.48
      },
      {
        "lat": 48.29,
        "lng": 11.55
      },
      {
        "lat": 48.25,
        "lng": 11.57
      },
      {
        "lat": 48.2,
        "lng": 11.58
      }
    ],
    "waypoints": [
      {
        "name": "Dachau Palace",
        "type": "scenic",
        "distanceKm": 12
      },
      {
        "name": "Amper Bridge",
        "type": "scenic",
        "distanceKm": 35
      },
      {
        "name": "Schleißheim Palace",
        "type": "scenic",
        "distanceKm": 58
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400"
    ]
  },
  {
    "id": "alp-1",
    "name": "Kesselberg & Walchensee",
    "region": "Kochel am See",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 95,
    "duration": 120,
    "sss": 7.8,
    "curvinessIndex": 5,
    "curves": "Extreme",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 245,
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    "surface": {
      "asphalt": 90,
      "concrete": 5,
      "gravel": 5,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 1200,
      "max": 1100,
      "minGradient": -14,
      "maxGradient": 16
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 1,
      "unpaved": 1
    },
    "chassisThreats": [
      "Haarnadelkurven",
      "Hohes Verkehrsaufkommen"
    ],
    "atmosphere": [
      "Alpine",
      "Mountain Pass"
    ],
    "coordinates": {
      "start": {
        "lat": 47.683,
        "lng": 11.332
      },
      "end": {
        "lat": 47.683,
        "lng": 11.332
      }
    },
    "path": [
      {
        "lat": 47.683,
        "lng": 11.332
      },
      {
        "lat": 47.65,
        "lng": 11.34
      },
      {
        "lat": 47.61,
        "lng": 11.35
      },
      {
        "lat": 47.585,
        "lng": 11.345
      },
      {
        "lat": 47.6,
        "lng": 11.32
      },
      {
        "lat": 47.64,
        "lng": 11.31
      },
      {
        "lat": 47.683,
        "lng": 11.332
      }
    ],
    "waypoints": [
      {
        "name": "Kesselberg Pass",
        "type": "scenic",
        "distanceKm": 12
      },
      {
        "name": "Walchensee View",
        "type": "scenic",
        "distanceKm": 35
      },
      {
        "name": "Urfeld Café",
        "type": "rest",
        "distanceKm": 55
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400"
    ]
  },
  {
    "id": "alp-2",
    "name": "Rossfeldpanoramastraße",
    "region": "Berchtesgaden",
    "author": "Stefan K.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 40,
    "duration": 75,
    "sss": 8.2,
    "curvinessIndex": 5,
    "curves": "Extreme",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 128,
    "image": "https://www.rossfeldpanoramastrasse.de/wp-content/uploads/2024/05/rossfeld-panorama-strasse-home-header-1024x682.jpg",
    "surface": {
      "asphalt": 92,
      "concrete": 6,
      "gravel": 2,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 920,
      "max": 1560,
      "minGradient": -13,
      "maxGradient": 13
    },
    "hazards": {
      "speedHumps": 0,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Steile Gradienten (13%)"
    ],
    "atmosphere": [
      "Alpine",
      "Panorama"
    ],
    "coordinates": {
      "start": {
        "lat": 47.63,
        "lng": 13.001
      },
      "end": {
        "lat": 47.63,
        "lng": 13.001
      }
    },
    "path": [
      {
        "lat": 47.63,
        "lng": 13.001
      },
      {
        "lat": 47.64,
        "lng": 13.02
      },
      {
        "lat": 47.65,
        "lng": 13.05
      },
      {
        "lat": 47.645,
        "lng": 13.07
      },
      {
        "lat": 47.635,
        "lng": 13.04
      },
      {
        "lat": 47.63,
        "lng": 13.001
      }
    ],
    "waypoints": [
      {
        "name": "Rossfeld Summit",
        "type": "scenic",
        "distanceKm": 15
      },
      {
        "name": "Panorama Terrace",
        "type": "scenic",
        "distanceKm": 25
      }
    ],
    "gallery": [
      "https://www.rossfeldpanoramastrasse.de/wp-content/uploads/2024/05/rossfeld-panorama-strasse-home-header-1024x682.jpg"
    ]
  },
  {
    "id": "alp-3",
    "name": "Sylvenstein Odyssey",
    "region": "Bad Tölz",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 120,
    "duration": 180,
    "sss": 9,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 346,
    "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    "surface": {
      "asphalt": 95,
      "concrete": 3,
      "gravel": 2,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 680,
      "max": 880,
      "minGradient": -8,
      "maxGradient": 10
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Brücken-Dehnungsfugen"
    ],
    "atmosphere": [
      "Alpine",
      "Lakeside"
    ],
    "coordinates": {
      "start": {
        "lat": 47.749,
        "lng": 11.412
      },
      "end": {
        "lat": 47.749,
        "lng": 11.412
      }
    },
    "path": [
      {
        "lat": 47.749,
        "lng": 11.412
      },
      {
        "lat": 47.7,
        "lng": 11.45
      },
      {
        "lat": 47.62,
        "lng": 11.55
      },
      {
        "lat": 47.592,
        "lng": 11.538
      },
      {
        "lat": 47.64,
        "lng": 11.48
      },
      {
        "lat": 47.7,
        "lng": 11.43
      },
      {
        "lat": 47.749,
        "lng": 11.412
      }
    ],
    "waypoints": [
      {
        "name": "Sylvenstein Dam",
        "type": "scenic",
        "distanceKm": 30
      },
      {
        "name": "Fall Village",
        "type": "rest",
        "distanceKm": 55
      },
      {
        "name": "Lenggries Return",
        "type": "scenic",
        "distanceKm": 90
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400"
    ]
  },
  {
    "id": "alp-4",
    "name": "Oberstdorf Alpencross",
    "region": "Oberstdorf",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 110,
    "duration": 150,
    "sss": 8,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 242,
    "image": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800",
    "surface": {
      "asphalt": 91,
      "concrete": 5,
      "gravel": 4,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 1100,
      "max": 1200,
      "minGradient": -12,
      "maxGradient": 14
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 1,
      "unpaved": 1
    },
    "chassisThreats": [
      "Engstellen",
      "Viehgitter"
    ],
    "atmosphere": [
      "Alpine",
      "Valley"
    ],
    "coordinates": {
      "start": {
        "lat": 47.407,
        "lng": 10.279
      },
      "end": {
        "lat": 47.407,
        "lng": 10.279
      }
    },
    "path": [
      {
        "lat": 47.407,
        "lng": 10.279
      },
      {
        "lat": 47.38,
        "lng": 10.3
      },
      {
        "lat": 47.358,
        "lng": 10.316
      },
      {
        "lat": 47.34,
        "lng": 10.298
      },
      {
        "lat": 47.36,
        "lng": 10.27
      },
      {
        "lat": 47.39,
        "lng": 10.26
      },
      {
        "lat": 47.407,
        "lng": 10.279
      }
    ],
    "waypoints": [
      {
        "name": "Nebelhorn Base",
        "type": "scenic",
        "distanceKm": 8
      },
      {
        "name": "Fellhorn View",
        "type": "scenic",
        "distanceKm": 42
      },
      {
        "name": "Breitachklamm",
        "type": "scenic",
        "distanceKm": 75
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400"
    ]
  },
  {
    "id": "alp-5",
    "name": "Tegernsee Panorama",
    "region": "Gmund am Tegernsee",
    "author": "Stefan K.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 85,
    "duration": 105,
    "sss": 9.5,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 236,
    "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    "surface": {
      "asphalt": 97,
      "concrete": 3,
      "gravel": 0,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 480,
      "max": 870,
      "minGradient": -6,
      "maxGradient": 8
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "1 Temposchwelle Rottach-Egern"
    ],
    "atmosphere": [
      "Lakeside",
      "Alpine"
    ],
    "coordinates": {
      "start": {
        "lat": 47.746,
        "lng": 11.737
      },
      "end": {
        "lat": 47.746,
        "lng": 11.737
      }
    },
    "path": [
      {
        "lat": 47.746,
        "lng": 11.737
      },
      {
        "lat": 47.72,
        "lng": 11.75
      },
      {
        "lat": 47.69,
        "lng": 11.76
      },
      {
        "lat": 47.67,
        "lng": 11.74
      },
      {
        "lat": 47.7,
        "lng": 11.72
      },
      {
        "lat": 47.73,
        "lng": 11.73
      },
      {
        "lat": 47.746,
        "lng": 11.737
      }
    ],
    "waypoints": [
      {
        "name": "Tegernsee Bräustüberl",
        "type": "rest",
        "distanceKm": 12
      },
      {
        "name": "Rottach Promenade",
        "type": "scenic",
        "distanceKm": 30
      },
      {
        "name": "Kreuth Valley",
        "type": "scenic",
        "distanceKm": 55
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400"
    ]
  },
  {
    "id": "alp-6",
    "name": "Plansee Border Run",
    "region": "Reutte (AT)",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 70,
    "duration": 100,
    "sss": 9.1,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 447,
    "image": "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800",
    "surface": {
      "asphalt": 94,
      "concrete": 4,
      "gravel": 2,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 520,
      "max": 980,
      "minGradient": -7,
      "maxGradient": 9
    },
    "hazards": {
      "speedHumps": 0,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Grenzübergang"
    ],
    "atmosphere": [
      "Alpine",
      "Lakeside"
    ],
    "coordinates": {
      "start": {
        "lat": 47.486,
        "lng": 10.718
      },
      "end": {
        "lat": 47.486,
        "lng": 10.718
      }
    },
    "path": [
      {
        "lat": 47.486,
        "lng": 10.718
      },
      {
        "lat": 47.46,
        "lng": 10.75
      },
      {
        "lat": 47.44,
        "lng": 10.79
      },
      {
        "lat": 47.432,
        "lng": 10.785
      },
      {
        "lat": 47.45,
        "lng": 10.73
      },
      {
        "lat": 47.486,
        "lng": 10.718
      }
    ],
    "waypoints": [
      {
        "name": "Plansee Shore",
        "type": "scenic",
        "distanceKm": 10
      },
      {
        "name": "Heiterwanger See",
        "type": "scenic",
        "distanceKm": 32
      },
      {
        "name": "Ammergau Return",
        "type": "scenic",
        "distanceKm": 55
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=400"
    ]
  },
  {
    "id": "alp-7",
    "name": "Garmisch: Wank & Estergebirge",
    "region": "Garmisch-Partenkirchen",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 100,
    "duration": 135,
    "sss": 8.3,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 394,
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    "surface": {
      "asphalt": 92,
      "concrete": 5,
      "gravel": 3,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 980,
      "max": 1280,
      "minGradient": -11,
      "maxGradient": 13
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 1,
      "unpaved": 0
    },
    "chassisThreats": [
      "Steile Rampen",
      "Forstweg-Kreuzungen"
    ],
    "atmosphere": [
      "Alpine",
      "Mountain Pass"
    ],
    "coordinates": {
      "start": {
        "lat": 47.492,
        "lng": 11.096
      },
      "end": {
        "lat": 47.492,
        "lng": 11.096
      }
    },
    "path": [
      {
        "lat": 47.492,
        "lng": 11.096
      },
      {
        "lat": 47.47,
        "lng": 11.12
      },
      {
        "lat": 47.44,
        "lng": 11.08
      },
      {
        "lat": 47.435,
        "lng": 11.105
      },
      {
        "lat": 47.455,
        "lng": 11.13
      },
      {
        "lat": 47.48,
        "lng": 11.1
      },
      {
        "lat": 47.492,
        "lng": 11.096
      }
    ],
    "waypoints": [
      {
        "name": "Wank Panorama",
        "type": "scenic",
        "distanceKm": 15
      },
      {
        "name": "Esterbergalm",
        "type": "rest",
        "distanceKm": 45
      },
      {
        "name": "Partnachklamm View",
        "type": "scenic",
        "distanceKm": 72
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"
    ]
  },
  {
    "id": "alp-8",
    "name": "Bad Reichenhall Salzstraße",
    "region": "Bad Reichenhall",
    "author": "Lisa R.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 65,
    "duration": 90,
    "sss": 9.3,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 362,
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    "surface": {
      "asphalt": 96,
      "concrete": 4,
      "gravel": 0,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 380,
      "max": 750,
      "minGradient": -5,
      "maxGradient": 7
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Salzbergwerk-Verkehr"
    ],
    "atmosphere": [
      "Alpine",
      "Cultural"
    ],
    "coordinates": {
      "start": {
        "lat": 47.727,
        "lng": 12.878
      },
      "end": {
        "lat": 47.727,
        "lng": 12.878
      }
    },
    "path": [
      {
        "lat": 47.727,
        "lng": 12.878
      },
      {
        "lat": 47.71,
        "lng": 12.9
      },
      {
        "lat": 47.69,
        "lng": 12.92
      },
      {
        "lat": 47.7,
        "lng": 12.95
      },
      {
        "lat": 47.72,
        "lng": 12.91
      },
      {
        "lat": 47.727,
        "lng": 12.878
      }
    ],
    "waypoints": [
      {
        "name": "Alte Saline",
        "type": "scenic",
        "distanceKm": 5
      },
      {
        "name": "Thumsee",
        "type": "scenic",
        "distanceKm": 25
      },
      {
        "name": "Nonn Viewpoint",
        "type": "scenic",
        "distanceKm": 48
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
    ]
  },
  {
    "id": "sw-1",
    "name": "Schwarzwaldhochstraße (B500)",
    "region": "Baden-Baden",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 160,
    "duration": 210,
    "sss": 8.8,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 308,
    "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    "surface": {
      "asphalt": 93,
      "concrete": 4,
      "gravel": 3,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 1100,
      "max": 1164,
      "minGradient": -10,
      "maxGradient": 12
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Wildwechsel",
      "Touristenbusse"
    ],
    "atmosphere": [
      "Forest",
      "Mountain Pass"
    ],
    "coordinates": {
      "start": {
        "lat": 48.762,
        "lng": 8.242
      },
      "end": {
        "lat": 48.762,
        "lng": 8.242
      }
    },
    "path": [
      {
        "lat": 48.762,
        "lng": 8.242
      },
      {
        "lat": 48.7,
        "lng": 8.23
      },
      {
        "lat": 48.63,
        "lng": 8.22
      },
      {
        "lat": 48.52,
        "lng": 8.21
      },
      {
        "lat": 48.6,
        "lng": 8.25
      },
      {
        "lat": 48.7,
        "lng": 8.26
      },
      {
        "lat": 48.762,
        "lng": 8.242
      }
    ],
    "waypoints": [
      {
        "name": "Mummelsee",
        "type": "scenic",
        "distanceKm": 25
      },
      {
        "name": "Ruhestein Pass",
        "type": "scenic",
        "distanceKm": 60
      },
      {
        "name": "Hornisgrinde Summit",
        "type": "scenic",
        "distanceKm": 95
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400"
    ]
  },
  {
    "id": "sw-2",
    "name": "Schauinsland Hillclimb",
    "region": "Freiburg",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 50,
    "duration": 60,
    "sss": 7.5,
    "curvinessIndex": 5,
    "curves": "Extreme",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 170,
    "image": "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?w=800",
    "surface": {
      "asphalt": 90,
      "concrete": 5,
      "gravel": 5,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 1050,
      "max": 1284,
      "minGradient": -14,
      "maxGradient": 16
    },
    "hazards": {
      "speedHumps": 0,
      "potholes": 1,
      "unpaved": 0
    },
    "chassisThreats": [
      "Extreme Kurvenfolge",
      "Motorradfahrer"
    ],
    "atmosphere": [
      "Forest",
      "Mountain Pass"
    ],
    "coordinates": {
      "start": {
        "lat": 47.994,
        "lng": 7.852
      },
      "end": {
        "lat": 47.994,
        "lng": 7.852
      }
    },
    "path": [
      {
        "lat": 47.994,
        "lng": 7.852
      },
      {
        "lat": 47.97,
        "lng": 7.87
      },
      {
        "lat": 47.94,
        "lng": 7.89
      },
      {
        "lat": 47.91,
        "lng": 7.89
      },
      {
        "lat": 47.94,
        "lng": 7.86
      },
      {
        "lat": 47.97,
        "lng": 7.85
      },
      {
        "lat": 47.994,
        "lng": 7.852
      }
    ],
    "waypoints": [
      {
        "name": "Schauinsland Summit",
        "type": "scenic",
        "distanceKm": 18
      },
      {
        "name": "Bergstation Café",
        "type": "rest",
        "distanceKm": 25
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?w=400"
    ]
  },
  {
    "id": "sw-3",
    "name": "Triberg Waterfall Circuit",
    "region": "Triberg",
    "author": "Stefan K.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 80,
    "duration": 110,
    "sss": 8.9,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 154,
    "image": "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800",
    "surface": {
      "asphalt": 94,
      "concrete": 4,
      "gravel": 2,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 620,
      "max": 950,
      "minGradient": -8,
      "maxGradient": 10
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Touristenzone Triberg"
    ],
    "atmosphere": [
      "Forest",
      "Cultural"
    ],
    "coordinates": {
      "start": {
        "lat": 48.13,
        "lng": 8.234
      },
      "end": {
        "lat": 48.13,
        "lng": 8.234
      }
    },
    "path": [
      {
        "lat": 48.13,
        "lng": 8.234
      },
      {
        "lat": 48.1,
        "lng": 8.25
      },
      {
        "lat": 48.06,
        "lng": 8.28
      },
      {
        "lat": 48.08,
        "lng": 8.31
      },
      {
        "lat": 48.11,
        "lng": 8.27
      },
      {
        "lat": 48.13,
        "lng": 8.234
      }
    ],
    "waypoints": [
      {
        "name": "Triberg Falls",
        "type": "scenic",
        "distanceKm": 5
      },
      {
        "name": "Cuckoo Clock Workshop",
        "type": "scenic",
        "distanceKm": 28
      },
      {
        "name": "Gutach Valley",
        "type": "scenic",
        "distanceKm": 55
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=400"
    ]
  },
  {
    "id": "sw-4",
    "name": "Titisee-Feldberg Loop",
    "region": "Titisee-Neustadt",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 90,
    "duration": 120,
    "sss": 8.1,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 167,
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    "surface": {
      "asphalt": 92,
      "concrete": 5,
      "gravel": 3,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 880,
      "max": 1493,
      "minGradient": -12,
      "maxGradient": 14
    },
    "hazards": {
      "speedHumps": 0,
      "potholes": 1,
      "unpaved": 0
    },
    "chassisThreats": [
      "Feldberg-Gradienten",
      "Wanderer-Verkehr"
    ],
    "atmosphere": [
      "Alpine",
      "Lakeside"
    ],
    "coordinates": {
      "start": {
        "lat": 47.899,
        "lng": 8.157
      },
      "end": {
        "lat": 47.899,
        "lng": 8.157
      }
    },
    "path": [
      {
        "lat": 47.899,
        "lng": 8.157
      },
      {
        "lat": 47.87,
        "lng": 8.14
      },
      {
        "lat": 47.86,
        "lng": 8.1
      },
      {
        "lat": 47.88,
        "lng": 8.07
      },
      {
        "lat": 47.91,
        "lng": 8.1
      },
      {
        "lat": 47.899,
        "lng": 8.157
      }
    ],
    "waypoints": [
      {
        "name": "Titisee Promenade",
        "type": "scenic",
        "distanceKm": 5
      },
      {
        "name": "Feldberg Summit Road",
        "type": "scenic",
        "distanceKm": 35
      },
      {
        "name": "Seebuck View",
        "type": "scenic",
        "distanceKm": 60
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
    ]
  },
  {
    "id": "sw-5",
    "name": "Freudenstadt Forest Sprint",
    "region": "Freudenstadt",
    "author": "Max T.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 70,
    "duration": 95,
    "sss": 9,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 108,
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    "surface": {
      "asphalt": 95,
      "concrete": 3,
      "gravel": 2,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 480,
      "max": 740,
      "minGradient": -6,
      "maxGradient": 8
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Forst-Fahrzeuge"
    ],
    "atmosphere": [
      "Forest",
      "Countryside"
    ],
    "coordinates": {
      "start": {
        "lat": 48.461,
        "lng": 8.411
      },
      "end": {
        "lat": 48.461,
        "lng": 8.411
      }
    },
    "path": [
      {
        "lat": 48.461,
        "lng": 8.411
      },
      {
        "lat": 48.43,
        "lng": 8.44
      },
      {
        "lat": 48.4,
        "lng": 8.47
      },
      {
        "lat": 48.42,
        "lng": 8.5
      },
      {
        "lat": 48.45,
        "lng": 8.45
      },
      {
        "lat": 48.461,
        "lng": 8.411
      }
    ],
    "waypoints": [
      {
        "name": "Marktplatz",
        "type": "scenic",
        "distanceKm": 3
      },
      {
        "name": "Kniebis Pass",
        "type": "scenic",
        "distanceKm": 28
      },
      {
        "name": "Murgtal View",
        "type": "scenic",
        "distanceKm": 50
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
    ]
  },
  {
    "id": "sw-6",
    "name": "Schluchsee Deep Valley",
    "region": "Schluchsee",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 85,
    "duration": 115,
    "sss": 8.4,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 199,
    "image": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
    "surface": {
      "asphalt": 91,
      "concrete": 5,
      "gravel": 4,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 780,
      "max": 1020,
      "minGradient": -11,
      "maxGradient": 13
    },
    "hazards": {
      "speedHumps": 0,
      "potholes": 1,
      "unpaved": 1
    },
    "chassisThreats": [
      "Steile Abstiegs-Kurven",
      "Gravel-Abschnitt"
    ],
    "atmosphere": [
      "Forest",
      "Lakeside"
    ],
    "coordinates": {
      "start": {
        "lat": 47.816,
        "lng": 8.174
      },
      "end": {
        "lat": 47.816,
        "lng": 8.174
      }
    },
    "path": [
      {
        "lat": 47.816,
        "lng": 8.174
      },
      {
        "lat": 47.79,
        "lng": 8.19
      },
      {
        "lat": 47.76,
        "lng": 8.21
      },
      {
        "lat": 47.78,
        "lng": 8.24
      },
      {
        "lat": 47.81,
        "lng": 8.2
      },
      {
        "lat": 47.816,
        "lng": 8.174
      }
    ],
    "waypoints": [
      {
        "name": "Schluchsee Dam",
        "type": "scenic",
        "distanceKm": 8
      },
      {
        "name": "St. Blasien",
        "type": "scenic",
        "distanceKm": 35
      },
      {
        "name": "Aha Viewpoint",
        "type": "scenic",
        "distanceKm": 60
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400"
    ]
  },
  {
    "id": "sw-7",
    "name": "Calw Heritage Run",
    "region": "Calw",
    "author": "Lisa R.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 60,
    "duration": 80,
    "sss": 9.2,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 319,
    "image": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800",
    "surface": {
      "asphalt": 96,
      "concrete": 3,
      "gravel": 1,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 320,
      "max": 610,
      "minGradient": -5,
      "maxGradient": 6
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Altstadt-Pflaster"
    ],
    "atmosphere": [
      "Forest",
      "Cultural"
    ],
    "coordinates": {
      "start": {
        "lat": 48.714,
        "lng": 8.74
      },
      "end": {
        "lat": 48.714,
        "lng": 8.74
      }
    },
    "path": [
      {
        "lat": 48.714,
        "lng": 8.74
      },
      {
        "lat": 48.69,
        "lng": 8.76
      },
      {
        "lat": 48.67,
        "lng": 8.79
      },
      {
        "lat": 48.69,
        "lng": 8.81
      },
      {
        "lat": 48.71,
        "lng": 8.77
      },
      {
        "lat": 48.714,
        "lng": 8.74
      }
    ],
    "waypoints": [
      {
        "name": "Hermann Hesse Museum",
        "type": "scenic",
        "distanceKm": 3
      },
      {
        "name": "Nagold Valley",
        "type": "scenic",
        "distanceKm": 22
      },
      {
        "name": "Hirsau Monastery",
        "type": "scenic",
        "distanceKm": 42
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400"
    ]
  },
  {
    "id": "sw-8",
    "name": "Kinzigtal Curves",
    "region": "Haslach im Kinzigtal",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 100,
    "duration": 130,
    "sss": 8.6,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 132,
    "image": "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800",
    "surface": {
      "asphalt": 93,
      "concrete": 4,
      "gravel": 3,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 720,
      "max": 860,
      "minGradient": -9,
      "maxGradient": 11
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Holztransporter",
      "Enge Talstraße"
    ],
    "atmosphere": [
      "Forest",
      "Valley"
    ],
    "coordinates": {
      "start": {
        "lat": 48.277,
        "lng": 8.086
      },
      "end": {
        "lat": 48.277,
        "lng": 8.086
      }
    },
    "path": [
      {
        "lat": 48.277,
        "lng": 8.086
      },
      {
        "lat": 48.25,
        "lng": 8.11
      },
      {
        "lat": 48.22,
        "lng": 8.14
      },
      {
        "lat": 48.2,
        "lng": 8.12
      },
      {
        "lat": 48.24,
        "lng": 8.08
      },
      {
        "lat": 48.277,
        "lng": 8.086
      }
    ],
    "waypoints": [
      {
        "name": "Kinzig Bridge",
        "type": "scenic",
        "distanceKm": 10
      },
      {
        "name": "Wolfach Old Town",
        "type": "scenic",
        "distanceKm": 38
      },
      {
        "name": "Gutach Valley",
        "type": "scenic",
        "distanceKm": 70
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=400"
    ]
  },
  {
    "id": "ger-1",
    "name": "Eifel: Green Hell Periphery",
    "region": "Nürburg",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 85,
    "duration": 105,
    "sss": 8,
    "curvinessIndex": 5,
    "curves": "Extreme",
    "scenic": false,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 319,
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
    "surface": {
      "asphalt": 88,
      "concrete": 6,
      "gravel": 4,
      "cobblestone": 2
    },
    "elevation": {
      "gain": 560,
      "max": 620,
      "minGradient": -9,
      "maxGradient": 11
    },
    "hazards": {
      "speedHumps": 2,
      "potholes": 2,
      "unpaved": 0
    },
    "chassisThreats": [
      "Schlaglöcher auf Nebenstraßen"
    ],
    "atmosphere": [
      "Forest",
      "Motorsport"
    ],
    "coordinates": {
      "start": {
        "lat": 50.334,
        "lng": 6.942
      },
      "end": {
        "lat": 50.334,
        "lng": 6.942
      }
    },
    "path": [
      {
        "lat": 50.334,
        "lng": 6.942
      },
      {
        "lat": 50.36,
        "lng": 6.97
      },
      {
        "lat": 50.4,
        "lng": 7.05
      },
      {
        "lat": 50.38,
        "lng": 7.01
      },
      {
        "lat": 50.35,
        "lng": 6.96
      },
      {
        "lat": 50.334,
        "lng": 6.942
      }
    ],
    "waypoints": [
      {
        "name": "Nürburgring View",
        "type": "scenic",
        "distanceKm": 5
      },
      {
        "name": "Adenau Town",
        "type": "rest",
        "distanceKm": 25
      },
      {
        "name": "Hohe Acht",
        "type": "scenic",
        "distanceKm": 55
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400"
    ]
  },
  {
    "id": "ger-2",
    "name": "Mosel: Hairpin Heaven",
    "region": "Cochem",
    "author": "Stefan K.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 110,
    "duration": 135,
    "sss": 8.9,
    "curvinessIndex": 5,
    "curves": "Extreme",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 461,
    "image": "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800",
    "surface": {
      "asphalt": 91,
      "concrete": 5,
      "gravel": 3,
      "cobblestone": 1
    },
    "elevation": {
      "gain": 720,
      "max": 540,
      "minGradient": -10,
      "maxGradient": 12
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Enge Weinberg-Serpentinen"
    ],
    "atmosphere": [
      "Riverside",
      "Cultural"
    ],
    "coordinates": {
      "start": {
        "lat": 50.147,
        "lng": 7.167
      },
      "end": {
        "lat": 50.147,
        "lng": 7.167
      }
    },
    "path": [
      {
        "lat": 50.147,
        "lng": 7.167
      },
      {
        "lat": 50.12,
        "lng": 7.14
      },
      {
        "lat": 50.08,
        "lng": 7.11
      },
      {
        "lat": 50.05,
        "lng": 7.1
      },
      {
        "lat": 50.09,
        "lng": 7.14
      },
      {
        "lat": 50.13,
        "lng": 7.16
      },
      {
        "lat": 50.147,
        "lng": 7.167
      }
    ],
    "waypoints": [
      {
        "name": "Cochem Castle",
        "type": "scenic",
        "distanceKm": 3
      },
      {
        "name": "Vineyard Terrace",
        "type": "scenic",
        "distanceKm": 35
      },
      {
        "name": "Beilstein Village",
        "type": "rest",
        "distanceKm": 65
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=400"
    ]
  },
  {
    "id": "ger-3",
    "name": "Harz: The Brocken Loop",
    "region": "Wernigerode",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 130,
    "duration": 165,
    "sss": 8.3,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 416,
    "image": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
    "surface": {
      "asphalt": 89,
      "concrete": 6,
      "gravel": 4,
      "cobblestone": 1
    },
    "elevation": {
      "gain": 840,
      "max": 1141,
      "minGradient": -11,
      "maxGradient": 13
    },
    "hazards": {
      "speedHumps": 2,
      "potholes": 1,
      "unpaved": 0
    },
    "chassisThreats": [
      "Feuchtigkeit im Wald",
      "Temposchwellen"
    ],
    "atmosphere": [
      "Forest",
      "Mountain Pass"
    ],
    "coordinates": {
      "start": {
        "lat": 51.833,
        "lng": 10.784
      },
      "end": {
        "lat": 51.833,
        "lng": 10.784
      }
    },
    "path": [
      {
        "lat": 51.833,
        "lng": 10.784
      },
      {
        "lat": 51.81,
        "lng": 10.75
      },
      {
        "lat": 51.78,
        "lng": 10.68
      },
      {
        "lat": 51.75,
        "lng": 10.6
      },
      {
        "lat": 51.79,
        "lng": 10.7
      },
      {
        "lat": 51.82,
        "lng": 10.76
      },
      {
        "lat": 51.833,
        "lng": 10.784
      }
    ],
    "waypoints": [
      {
        "name": "Wernigerode Castle",
        "type": "scenic",
        "distanceKm": 5
      },
      {
        "name": "Schierke Village",
        "type": "rest",
        "distanceKm": 42
      },
      {
        "name": "Brocken Vista",
        "type": "scenic",
        "distanceKm": 80
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400"
    ]
  },
  {
    "id": "ger-4",
    "name": "Sächsische Schweiz Panorama",
    "region": "Pirna",
    "author": "Lisa R.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 90,
    "duration": 120,
    "sss": 9.1,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 369,
    "image": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
    "surface": {
      "asphalt": 93,
      "concrete": 4,
      "gravel": 2,
      "cobblestone": 1
    },
    "elevation": {
      "gain": 520,
      "max": 420,
      "minGradient": -7,
      "maxGradient": 9
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Pflasterstein-Segmente"
    ],
    "atmosphere": [
      "Forest",
      "Cultural"
    ],
    "coordinates": {
      "start": {
        "lat": 50.962,
        "lng": 14.124
      },
      "end": {
        "lat": 50.962,
        "lng": 14.124
      }
    },
    "path": [
      {
        "lat": 50.962,
        "lng": 14.124
      },
      {
        "lat": 50.94,
        "lng": 14.16
      },
      {
        "lat": 50.92,
        "lng": 14.2
      },
      {
        "lat": 50.92,
        "lng": 14.3
      },
      {
        "lat": 50.94,
        "lng": 14.25
      },
      {
        "lat": 50.96,
        "lng": 14.16
      },
      {
        "lat": 50.962,
        "lng": 14.124
      }
    ],
    "waypoints": [
      {
        "name": "Bastei Bridge",
        "type": "scenic",
        "distanceKm": 15
      },
      {
        "name": "Königstein Fortress",
        "type": "scenic",
        "distanceKm": 38
      },
      {
        "name": "Elbe Valley View",
        "type": "scenic",
        "distanceKm": 65
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400"
    ]
  },
  {
    "id": "ger-5",
    "name": "Rhön: Biosphäre Loop",
    "region": "Fulda",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 105,
    "duration": 135,
    "sss": 9,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 109,
    "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    "surface": {
      "asphalt": 94,
      "concrete": 4,
      "gravel": 2,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 680,
      "max": 950,
      "minGradient": -8,
      "maxGradient": 10
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Windkraftanlagen-Zufahrten"
    ],
    "atmosphere": [
      "Countryside",
      "Forest"
    ],
    "coordinates": {
      "start": {
        "lat": 50.554,
        "lng": 9.678
      },
      "end": {
        "lat": 50.554,
        "lng": 9.678
      }
    },
    "path": [
      {
        "lat": 50.554,
        "lng": 9.678
      },
      {
        "lat": 50.52,
        "lng": 9.72
      },
      {
        "lat": 50.48,
        "lng": 9.76
      },
      {
        "lat": 50.45,
        "lng": 9.73
      },
      {
        "lat": 50.49,
        "lng": 9.69
      },
      {
        "lat": 50.53,
        "lng": 9.67
      },
      {
        "lat": 50.554,
        "lng": 9.678
      }
    ],
    "waypoints": [
      {
        "name": "Wasserkuppe",
        "type": "scenic",
        "distanceKm": 22
      },
      {
        "name": "Kreuzberg Kloster",
        "type": "rest",
        "distanceKm": 52
      },
      {
        "name": "Milseburg View",
        "type": "scenic",
        "distanceKm": 78
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400"
    ]
  },
  {
    "id": "ger-6",
    "name": "Taunus Ridge Run",
    "region": "Bad Homburg",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 75,
    "duration": 100,
    "sss": 8.7,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 495,
    "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    "surface": {
      "asphalt": 92,
      "concrete": 5,
      "gravel": 3,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 640,
      "max": 880,
      "minGradient": -10,
      "maxGradient": 12
    },
    "hazards": {
      "speedHumps": 2,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Radfahrer am Feldberg"
    ],
    "atmosphere": [
      "Forest",
      "Mountain Pass"
    ],
    "coordinates": {
      "start": {
        "lat": 50.227,
        "lng": 8.615
      },
      "end": {
        "lat": 50.227,
        "lng": 8.615
      }
    },
    "path": [
      {
        "lat": 50.227,
        "lng": 8.615
      },
      {
        "lat": 50.24,
        "lng": 8.58
      },
      {
        "lat": 50.26,
        "lng": 8.54
      },
      {
        "lat": 50.25,
        "lng": 8.5
      },
      {
        "lat": 50.235,
        "lng": 8.56
      },
      {
        "lat": 50.227,
        "lng": 8.615
      }
    ],
    "waypoints": [
      {
        "name": "Feldberg Summit",
        "type": "scenic",
        "distanceKm": 18
      },
      {
        "name": "Saalburg Roman Fort",
        "type": "scenic",
        "distanceKm": 35
      },
      {
        "name": "Oberursel Return",
        "type": "scenic",
        "distanceKm": 58
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400"
    ]
  },
  {
    "id": "ger-7",
    "name": "Odenwald Nibelungen Sprint",
    "region": "Bensheim",
    "author": "Max T.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 95,
    "duration": 125,
    "sss": 8.5,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 223,
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    "surface": {
      "asphalt": 91,
      "concrete": 5,
      "gravel": 3,
      "cobblestone": 1
    },
    "elevation": {
      "gain": 720,
      "max": 580,
      "minGradient": -9,
      "maxGradient": 11
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 1,
      "unpaved": 0
    },
    "chassisThreats": [
      "Nibelungenstraße eng",
      "Forstwirtschaft"
    ],
    "atmosphere": [
      "Forest",
      "Cultural"
    ],
    "coordinates": {
      "start": {
        "lat": 49.68,
        "lng": 8.62
      },
      "end": {
        "lat": 49.68,
        "lng": 8.62
      }
    },
    "path": [
      {
        "lat": 49.68,
        "lng": 8.62
      },
      {
        "lat": 49.66,
        "lng": 8.66
      },
      {
        "lat": 49.63,
        "lng": 8.7
      },
      {
        "lat": 49.61,
        "lng": 8.68
      },
      {
        "lat": 49.64,
        "lng": 8.64
      },
      {
        "lat": 49.67,
        "lng": 8.62
      },
      {
        "lat": 49.68,
        "lng": 8.62
      }
    ],
    "waypoints": [
      {
        "name": "Felsenmeer",
        "type": "scenic",
        "distanceKm": 12
      },
      {
        "name": "Lindenfels Castle",
        "type": "scenic",
        "distanceKm": 38
      },
      {
        "name": "Auerbach Valley",
        "type": "scenic",
        "distanceKm": 65
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"
    ]
  },
  {
    "id": "ger-8",
    "name": "Tecklenburger Land",
    "region": "Tecklenburg",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 70,
    "duration": 95,
    "sss": 9.3,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 143,
    "image": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
    "surface": {
      "asphalt": 96,
      "concrete": 3,
      "gravel": 1,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 280,
      "max": 235,
      "minGradient": -4,
      "maxGradient": 5
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Landwirtschafts-Verkehr"
    ],
    "atmosphere": [
      "Countryside"
    ],
    "coordinates": {
      "start": {
        "lat": 52.219,
        "lng": 7.812
      },
      "end": {
        "lat": 52.219,
        "lng": 7.812
      }
    },
    "path": [
      {
        "lat": 52.219,
        "lng": 7.812
      },
      {
        "lat": 52.24,
        "lng": 7.84
      },
      {
        "lat": 52.26,
        "lng": 7.87
      },
      {
        "lat": 52.245,
        "lng": 7.9
      },
      {
        "lat": 52.225,
        "lng": 7.85
      },
      {
        "lat": 52.219,
        "lng": 7.812
      }
    ],
    "waypoints": [
      {
        "name": "Tecklenburg Castle",
        "type": "scenic",
        "distanceKm": 3
      },
      {
        "name": "Dörenther Klippen",
        "type": "scenic",
        "distanceKm": 28
      },
      {
        "name": "Bad Iburg",
        "type": "rest",
        "distanceKm": 52
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400"
    ]
  },
  {
    "id": "ger-9",
    "name": "Rügen Coastal Cruise",
    "region": "Bergen auf Rügen",
    "author": "Stefan K.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 95,
    "duration": 125,
    "sss": 9.4,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 208,
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    "surface": {
      "asphalt": 95,
      "concrete": 4,
      "gravel": 1,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 120,
      "max": 160,
      "minGradient": -3,
      "maxGradient": 4
    },
    "hazards": {
      "speedHumps": 1,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Saisonaler Touristenverkehr"
    ],
    "atmosphere": [
      "Coastal",
      "Cultural"
    ],
    "coordinates": {
      "start": {
        "lat": 54.418,
        "lng": 13.432
      },
      "end": {
        "lat": 54.418,
        "lng": 13.432
      }
    },
    "path": [
      {
        "lat": 54.418,
        "lng": 13.432
      },
      {
        "lat": 54.44,
        "lng": 13.48
      },
      {
        "lat": 54.47,
        "lng": 13.52
      },
      {
        "lat": 54.49,
        "lng": 13.5
      },
      {
        "lat": 54.46,
        "lng": 13.45
      },
      {
        "lat": 54.43,
        "lng": 13.43
      },
      {
        "lat": 54.418,
        "lng": 13.432
      }
    ],
    "waypoints": [
      {
        "name": "Kreidefelsen Königsstuhl",
        "type": "scenic",
        "distanceKm": 18
      },
      {
        "name": "Prora Beach",
        "type": "scenic",
        "distanceKm": 42
      },
      {
        "name": "Binz Promenade",
        "type": "rest",
        "distanceKm": 68
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
    ]
  },
  {
    "id": "ger-10",
    "name": "Holsteinische Schweiz",
    "region": "Eutin",
    "author": "Lisa R.",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 80,
    "duration": 105,
    "sss": 9.2,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 394,
    "image": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800",
    "surface": {
      "asphalt": 96,
      "concrete": 3,
      "gravel": 1,
      "cobblestone": 0
    },
    "elevation": {
      "gain": 180,
      "max": 168,
      "minGradient": -3,
      "maxGradient": 4
    },
    "hazards": {
      "speedHumps": 0,
      "potholes": 0,
      "unpaved": 0
    },
    "chassisThreats": [
      "Keine"
    ],
    "atmosphere": [
      "Lakeside",
      "Countryside"
    ],
    "coordinates": {
      "start": {
        "lat": 54.137,
        "lng": 10.619
      },
      "end": {
        "lat": 54.137,
        "lng": 10.619
      }
    },
    "path": [
      {
        "lat": 54.137,
        "lng": 10.619
      },
      {
        "lat": 54.16,
        "lng": 10.65
      },
      {
        "lat": 54.18,
        "lng": 10.69
      },
      {
        "lat": 54.17,
        "lng": 10.72
      },
      {
        "lat": 54.15,
        "lng": 10.67
      },
      {
        "lat": 54.137,
        "lng": 10.619
      }
    ],
    "waypoints": [
      {
        "name": "Großer Plöner See",
        "type": "scenic",
        "distanceKm": 12
      },
      {
        "name": "Malente Kurpark",
        "type": "rest",
        "distanceKm": 35
      },
      {
        "name": "Eutin Castle",
        "type": "scenic",
        "distanceKm": 62
      }
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400"
    ]
  },
  {
    "id": "eng-1",
    "name": "Lake District Passes",
    "region": "Keswick, Cumbria",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Challenging",
    "distance": 115,
    "duration": 165,
    "sss": 8.4,
    "curvinessIndex": 5,
    "curves": "Extreme",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 612,
    "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "surface": { "asphalt": 90, "concrete": 5, "gravel": 4, "cobblestone": 1 },
    "elevation": { "gain": 1420, "max": 454, "minGradient": -16, "maxGradient": 18 },
    "hazards": { "speedHumps": 0, "potholes": 2, "unpaved": 0 },
    "chassisThreats": ["Steep gradients on Hardknott Pass", "Single-track sections"],
    "atmosphere": ["Mountain Pass", "Lakeside"],
    "coordinates": { "start": { "lat": 54.601, "lng": -3.136 }, "end": { "lat": 54.601, "lng": -3.136 } },
    "path": [
      { "lat": 54.601, "lng": -3.136 }, { "lat": 54.55, "lng": -3.18 },
      { "lat": 54.48, "lng": -3.22 }, { "lat": 54.40, "lng": -3.15 },
      { "lat": 54.38, "lng": -3.07 }, { "lat": 54.42, "lng": -3.02 },
      { "lat": 54.50, "lng": -3.05 }, { "lat": 54.56, "lng": -3.10 },
      { "lat": 54.601, "lng": -3.136 }
    ],
    "waypoints": [
      { "name": "Honister Pass", "type": "scenic", "distanceKm": 18 },
      { "name": "Hardknott Pass", "type": "scenic", "distanceKm": 55 },
      { "name": "Windermere Lake", "type": "rest", "distanceKm": 90 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"]
  },
  {
    "id": "eng-2",
    "name": "Cotswolds Golden Tour",
    "region": "Stow-on-the-Wold, Gloucestershire",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 95,
    "duration": 130,
    "sss": 9.3,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 487,
    "image": "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=800",
    "surface": { "asphalt": 97, "concrete": 2, "gravel": 1, "cobblestone": 0 },
    "elevation": { "gain": 420, "max": 310, "minGradient": -5, "maxGradient": 6 },
    "hazards": { "speedHumps": 1, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Occasional farm traffic"],
    "atmosphere": ["Countryside", "Cultural"],
    "coordinates": { "start": { "lat": 51.929, "lng": -1.725 }, "end": { "lat": 51.929, "lng": -1.725 } },
    "path": [
      { "lat": 51.929, "lng": -1.725 }, { "lat": 51.96, "lng": -1.78 },
      { "lat": 52.00, "lng": -1.83 }, { "lat": 51.98, "lng": -1.90 },
      { "lat": 51.95, "lng": -1.85 }, { "lat": 51.93, "lng": -1.77 },
      { "lat": 51.929, "lng": -1.725 }
    ],
    "waypoints": [
      { "name": "Bourton-on-the-Water", "type": "scenic", "distanceKm": 8 },
      { "name": "Broadway Tower", "type": "scenic", "distanceKm": 38 },
      { "name": "Chipping Campden", "type": "rest", "distanceKm": 65 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1590073844006-33379778ae09?w=400"]
  },
  {
    "id": "eng-3",
    "name": "Peak District Snake Pass",
    "region": "Glossop, Derbyshire",
    "author": "James W.",
    "authorVerified": true,
    "theme": "Challenging",
    "distance": 105,
    "duration": 150,
    "sss": 8.6,
    "curvinessIndex": 5,
    "curves": "Extreme",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 534,
    "image": "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
    "surface": { "asphalt": 93, "concrete": 4, "gravel": 2, "cobblestone": 1 },
    "elevation": { "gain": 980, "max": 512, "minGradient": -12, "maxGradient": 14 },
    "hazards": { "speedHumps": 0, "potholes": 1, "unpaved": 0 },
    "chassisThreats": ["Exposed moorland crosswinds", "Tight switchbacks"],
    "atmosphere": ["Mountain Pass", "Countryside"],
    "coordinates": { "start": { "lat": 53.443, "lng": -1.950 }, "end": { "lat": 53.443, "lng": -1.950 } },
    "path": [
      { "lat": 53.443, "lng": -1.950 }, { "lat": 53.42, "lng": -1.88 },
      { "lat": 53.40, "lng": -1.82 }, { "lat": 53.38, "lng": -1.76 },
      { "lat": 53.41, "lng": -1.85 }, { "lat": 53.43, "lng": -1.92 },
      { "lat": 53.443, "lng": -1.950 }
    ],
    "waypoints": [
      { "name": "Snake Pass Summit", "type": "scenic", "distanceKm": 22 },
      { "name": "Ladybower Reservoir", "type": "scenic", "distanceKm": 48 },
      { "name": "Mam Tor Viewpoint", "type": "scenic", "distanceKm": 78 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400"]
  },
  {
    "id": "eng-4",
    "name": "North York Moors Loop",
    "region": "Helmsley, North Yorkshire",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 130,
    "duration": 180,
    "sss": 9.1,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 378,
    "image": "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
    "surface": { "asphalt": 95, "concrete": 3, "gravel": 2, "cobblestone": 0 },
    "elevation": { "gain": 780, "max": 454, "minGradient": -8, "maxGradient": 10 },
    "hazards": { "speedHumps": 0, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Sheep on road"],
    "atmosphere": ["Countryside", "Coastal"],
    "coordinates": { "start": { "lat": 54.246, "lng": -1.064 }, "end": { "lat": 54.246, "lng": -1.064 } },
    "path": [
      { "lat": 54.246, "lng": -1.064 }, { "lat": 54.30, "lng": -0.98 },
      { "lat": 54.36, "lng": -0.88 }, { "lat": 54.40, "lng": -0.78 },
      { "lat": 54.38, "lng": -0.92 }, { "lat": 54.30, "lng": -1.02 },
      { "lat": 54.246, "lng": -1.064 }
    ],
    "waypoints": [
      { "name": "Rievaulx Abbey", "type": "scenic", "distanceKm": 5 },
      { "name": "Goathland Village", "type": "rest", "distanceKm": 55 },
      { "name": "Whitby Harbour", "type": "scenic", "distanceKm": 95 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400"]
  },
  {
    "id": "eng-5",
    "name": "Devon Atlantic Highway",
    "region": "Barnstaple, Devon",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 140,
    "duration": 195,
    "sss": 9.0,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": false,
    "distanceFromUser": 0,
    "hearts": 451,
    "image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800",
    "surface": { "asphalt": 96, "concrete": 3, "gravel": 1, "cobblestone": 0 },
    "elevation": { "gain": 520, "max": 230, "minGradient": -7, "maxGradient": 9 },
    "hazards": { "speedHumps": 1, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Seasonal tourist traffic on A39"],
    "atmosphere": ["Coastal", "Countryside"],
    "coordinates": { "start": { "lat": 51.080, "lng": -4.060 }, "end": { "lat": 50.688, "lng": -5.042 } },
    "path": [
      { "lat": 51.080, "lng": -4.060 }, { "lat": 51.02, "lng": -4.20 },
      { "lat": 50.96, "lng": -4.40 }, { "lat": 50.85, "lng": -4.62 },
      { "lat": 50.78, "lng": -4.80 }, { "lat": 50.688, "lng": -5.042 }
    ],
    "waypoints": [
      { "name": "Clovelly Village", "type": "scenic", "distanceKm": 30 },
      { "name": "Bude Sea Pool", "type": "rest", "distanceKm": 65 },
      { "name": "Tintagel Castle", "type": "scenic", "distanceKm": 100 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400"]
  },
  {
    "id": "eng-6",
    "name": "Cornwall Coastal Blast",
    "region": "St Ives, Cornwall",
    "author": "Oliver T.",
    "authorVerified": true,
    "theme": "Challenging",
    "distance": 100,
    "duration": 150,
    "sss": 8.2,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 389,
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    "surface": { "asphalt": 91, "concrete": 5, "gravel": 3, "cobblestone": 1 },
    "elevation": { "gain": 680, "max": 250, "minGradient": -11, "maxGradient": 13 },
    "hazards": { "speedHumps": 1, "potholes": 1, "unpaved": 0 },
    "chassisThreats": ["Narrow single-track lanes", "Blind corners on B-roads"],
    "atmosphere": ["Coastal", "Countryside"],
    "coordinates": { "start": { "lat": 50.211, "lng": -5.479 }, "end": { "lat": 50.211, "lng": -5.479 } },
    "path": [
      { "lat": 50.211, "lng": -5.479 }, { "lat": 50.18, "lng": -5.42 },
      { "lat": 50.12, "lng": -5.35 }, { "lat": 50.07, "lng": -5.40 },
      { "lat": 50.10, "lng": -5.50 }, { "lat": 50.16, "lng": -5.52 },
      { "lat": 50.211, "lng": -5.479 }
    ],
    "waypoints": [
      { "name": "Porthmeor Beach", "type": "scenic", "distanceKm": 3 },
      { "name": "Land's End", "type": "scenic", "distanceKm": 35 },
      { "name": "Penzance Harbour", "type": "rest", "distanceKm": 70 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"]
  },
  {
    "id": "eng-7",
    "name": "South Downs Rollercoaster",
    "region": "Lewes, East Sussex",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 85,
    "duration": 115,
    "sss": 9.2,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 298,
    "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    "surface": { "asphalt": 96, "concrete": 3, "gravel": 1, "cobblestone": 0 },
    "elevation": { "gain": 580, "max": 248, "minGradient": -8, "maxGradient": 9 },
    "hazards": { "speedHumps": 0, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Cyclists on Ditchling Beacon road"],
    "atmosphere": ["Countryside", "Coastal"],
    "coordinates": { "start": { "lat": 50.873, "lng": 0.012 }, "end": { "lat": 50.873, "lng": 0.012 } },
    "path": [
      { "lat": 50.873, "lng": 0.012 }, { "lat": 50.90, "lng": -0.05 },
      { "lat": 50.92, "lng": -0.12 }, { "lat": 50.90, "lng": -0.20 },
      { "lat": 50.88, "lng": -0.12 }, { "lat": 50.873, "lng": 0.012 }
    ],
    "waypoints": [
      { "name": "Ditchling Beacon", "type": "scenic", "distanceKm": 12 },
      { "name": "Devil's Dyke", "type": "scenic", "distanceKm": 35 },
      { "name": "Beachy Head", "type": "scenic", "distanceKm": 68 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400"]
  },
  {
    "id": "eng-8",
    "name": "Norfolk Broads Glide",
    "region": "Norwich, Norfolk",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 90,
    "duration": 120,
    "sss": 9.5,
    "curvinessIndex": 1,
    "curves": "Minimal",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 245,
    "image": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
    "surface": { "asphalt": 98, "concrete": 2, "gravel": 0, "cobblestone": 0 },
    "elevation": { "gain": 45, "max": 28, "minGradient": -1, "maxGradient": 2 },
    "hazards": { "speedHumps": 0, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["None"],
    "atmosphere": ["Countryside", "Lakeside"],
    "coordinates": { "start": { "lat": 52.630, "lng": 1.297 }, "end": { "lat": 52.630, "lng": 1.297 } },
    "path": [
      { "lat": 52.630, "lng": 1.297 }, { "lat": 52.65, "lng": 1.40 },
      { "lat": 52.68, "lng": 1.52 }, { "lat": 52.72, "lng": 1.58 },
      { "lat": 52.70, "lng": 1.42 }, { "lat": 52.66, "lng": 1.32 },
      { "lat": 52.630, "lng": 1.297 }
    ],
    "waypoints": [
      { "name": "Wroxham Broad", "type": "scenic", "distanceKm": 12 },
      { "name": "Horsey Windpump", "type": "scenic", "distanceKm": 48 },
      { "name": "Ranworth Church", "type": "scenic", "distanceKm": 72 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400"]
  },
  {
    "id": "eng-9",
    "name": "Yorkshire Dales Buttertubs",
    "region": "Hawes, North Yorkshire",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Challenging",
    "distance": 110,
    "duration": 160,
    "sss": 8.5,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 502,
    "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    "surface": { "asphalt": 92, "concrete": 4, "gravel": 3, "cobblestone": 1 },
    "elevation": { "gain": 1180, "max": 528, "minGradient": -14, "maxGradient": 16 },
    "hazards": { "speedHumps": 0, "potholes": 1, "unpaved": 0 },
    "chassisThreats": ["25% gradient sections", "Exposed cattle grids"],
    "atmosphere": ["Mountain Pass", "Countryside"],
    "coordinates": { "start": { "lat": 54.322, "lng": -2.200 }, "end": { "lat": 54.322, "lng": -2.200 } },
    "path": [
      { "lat": 54.322, "lng": -2.200 }, { "lat": 54.35, "lng": -2.15 },
      { "lat": 54.38, "lng": -2.08 }, { "lat": 54.40, "lng": -2.15 },
      { "lat": 54.37, "lng": -2.22 }, { "lat": 54.34, "lng": -2.21 },
      { "lat": 54.322, "lng": -2.200 }
    ],
    "waypoints": [
      { "name": "Buttertubs Pass", "type": "scenic", "distanceKm": 15 },
      { "name": "Tan Hill Inn", "type": "rest", "distanceKm": 52 },
      { "name": "Ribblehead Viaduct", "type": "scenic", "distanceKm": 88 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400"]
  },
  {
    "id": "eng-10",
    "name": "Welsh Border Switchbacks",
    "region": "Ludlow, Shropshire",
    "author": "Emily R.",
    "authorVerified": true,
    "theme": "Challenging",
    "distance": 90,
    "duration": 130,
    "sss": 8.8,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 267,
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    "surface": { "asphalt": 93, "concrete": 4, "gravel": 2, "cobblestone": 1 },
    "elevation": { "gain": 820, "max": 540, "minGradient": -10, "maxGradient": 12 },
    "hazards": { "speedHumps": 0, "potholes": 1, "unpaved": 0 },
    "chassisThreats": ["Forestry vehicles on B-roads"],
    "atmosphere": ["Forest", "Countryside"],
    "coordinates": { "start": { "lat": 52.367, "lng": -2.718 }, "end": { "lat": 52.367, "lng": -2.718 } },
    "path": [
      { "lat": 52.367, "lng": -2.718 }, { "lat": 52.40, "lng": -2.78 },
      { "lat": 52.44, "lng": -2.85 }, { "lat": 52.42, "lng": -2.92 },
      { "lat": 52.39, "lng": -2.82 }, { "lat": 52.367, "lng": -2.718 }
    ],
    "waypoints": [
      { "name": "Ludlow Castle", "type": "scenic", "distanceKm": 2 },
      { "name": "Long Mynd", "type": "scenic", "distanceKm": 35 },
      { "name": "Stiperstones", "type": "scenic", "distanceKm": 62 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400"]
  },
  {
    "id": "eng-11",
    "name": "New Forest Cruise",
    "region": "Lyndhurst, Hampshire",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 70,
    "duration": 95,
    "sss": 9.4,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 412,
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    "surface": { "asphalt": 97, "concrete": 2, "gravel": 1, "cobblestone": 0 },
    "elevation": { "gain": 180, "max": 128, "minGradient": -3, "maxGradient": 4 },
    "hazards": { "speedHumps": 2, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Free-roaming ponies on road", "40 mph speed limits"],
    "atmosphere": ["Forest", "Countryside"],
    "coordinates": { "start": { "lat": 50.872, "lng": -1.575 }, "end": { "lat": 50.872, "lng": -1.575 } },
    "path": [
      { "lat": 50.872, "lng": -1.575 }, { "lat": 50.85, "lng": -1.62 },
      { "lat": 50.82, "lng": -1.68 }, { "lat": 50.80, "lng": -1.60 },
      { "lat": 50.84, "lng": -1.55 }, { "lat": 50.872, "lng": -1.575 }
    ],
    "waypoints": [
      { "name": "Beaulieu Motor Museum", "type": "scenic", "distanceKm": 10 },
      { "name": "Bolderwood Deer Sanctuary", "type": "scenic", "distanceKm": 32 },
      { "name": "Lymington Quay", "type": "rest", "distanceKm": 55 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"]
  },
  {
    "id": "eng-12",
    "name": "Lincolnshire Wolds Sprint",
    "region": "Louth, Lincolnshire",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 75,
    "duration": 100,
    "sss": 9.3,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 156,
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    "surface": { "asphalt": 97, "concrete": 2, "gravel": 1, "cobblestone": 0 },
    "elevation": { "gain": 320, "max": 168, "minGradient": -5, "maxGradient": 6 },
    "hazards": { "speedHumps": 0, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Agricultural vehicles in season"],
    "atmosphere": ["Countryside"],
    "coordinates": { "start": { "lat": 53.370, "lng": -0.006 }, "end": { "lat": 53.370, "lng": -0.006 } },
    "path": [
      { "lat": 53.370, "lng": -0.006 }, { "lat": 53.40, "lng": 0.04 },
      { "lat": 53.42, "lng": 0.10 }, { "lat": 53.40, "lng": 0.15 },
      { "lat": 53.38, "lng": 0.08 }, { "lat": 53.370, "lng": -0.006 }
    ],
    "waypoints": [
      { "name": "Hubbard's Hills", "type": "scenic", "distanceKm": 3 },
      { "name": "Donington on Bain", "type": "scenic", "distanceKm": 30 },
      { "name": "Tetford Village", "type": "rest", "distanceKm": 55 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400"]
  },
  {
    "id": "eng-13",
    "name": "Shropshire Hills Circuit",
    "region": "Church Stretton, Shropshire",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Challenging",
    "distance": 85,
    "duration": 125,
    "sss": 8.7,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 234,
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    "surface": { "asphalt": 92, "concrete": 5, "gravel": 2, "cobblestone": 1 },
    "elevation": { "gain": 760, "max": 516, "minGradient": -11, "maxGradient": 13 },
    "hazards": { "speedHumps": 0, "potholes": 1, "unpaved": 0 },
    "chassisThreats": ["Single-track sections with passing places"],
    "atmosphere": ["Mountain Pass", "Countryside"],
    "coordinates": { "start": { "lat": 52.538, "lng": -2.803 }, "end": { "lat": 52.538, "lng": -2.803 } },
    "path": [
      { "lat": 52.538, "lng": -2.803 }, { "lat": 52.56, "lng": -2.85 },
      { "lat": 52.58, "lng": -2.90 }, { "lat": 52.57, "lng": -2.95 },
      { "lat": 52.55, "lng": -2.87 }, { "lat": 52.538, "lng": -2.803 }
    ],
    "waypoints": [
      { "name": "Long Mynd Burway", "type": "scenic", "distanceKm": 5 },
      { "name": "Caer Caradoc", "type": "scenic", "distanceKm": 35 },
      { "name": "Wenlock Edge", "type": "scenic", "distanceKm": 62 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"]
  },
  {
    "id": "eng-14",
    "name": "Dartmoor Wilderness Run",
    "region": "Princetown, Devon",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Challenging",
    "distance": 95,
    "duration": 140,
    "sss": 8.3,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 345,
    "image": "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
    "surface": { "asphalt": 90, "concrete": 5, "gravel": 4, "cobblestone": 1 },
    "elevation": { "gain": 880, "max": 520, "minGradient": -13, "maxGradient": 15 },
    "hazards": { "speedHumps": 0, "potholes": 2, "unpaved": 0 },
    "chassisThreats": ["Livestock on open moorland roads", "Sudden fog banks"],
    "atmosphere": ["Countryside", "Mountain Pass"],
    "coordinates": { "start": { "lat": 50.543, "lng": -3.989 }, "end": { "lat": 50.543, "lng": -3.989 } },
    "path": [
      { "lat": 50.543, "lng": -3.989 }, { "lat": 50.58, "lng": -3.92 },
      { "lat": 50.62, "lng": -3.85 }, { "lat": 50.60, "lng": -3.78 },
      { "lat": 50.57, "lng": -3.88 }, { "lat": 50.543, "lng": -3.989 }
    ],
    "waypoints": [
      { "name": "Dartmoor Prison Museum", "type": "scenic", "distanceKm": 2 },
      { "name": "Haytor Rocks", "type": "scenic", "distanceKm": 38 },
      { "name": "Widecombe-in-the-Moor", "type": "rest", "distanceKm": 65 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400"]
  },
  {
    "id": "eng-15",
    "name": "Chilterns Beechwood Run",
    "region": "Henley-on-Thames, Oxfordshire",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 80,
    "duration": 110,
    "sss": 9.1,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 312,
    "image": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
    "surface": { "asphalt": 96, "concrete": 3, "gravel": 1, "cobblestone": 0 },
    "elevation": { "gain": 480, "max": 267, "minGradient": -7, "maxGradient": 9 },
    "hazards": { "speedHumps": 1, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Commuter traffic near M40"],
    "atmosphere": ["Forest", "Countryside"],
    "coordinates": { "start": { "lat": 51.535, "lng": -0.903 }, "end": { "lat": 51.535, "lng": -0.903 } },
    "path": [
      { "lat": 51.535, "lng": -0.903 }, { "lat": 51.57, "lng": -0.95 },
      { "lat": 51.60, "lng": -1.02 }, { "lat": 51.62, "lng": -0.95 },
      { "lat": 51.58, "lng": -0.88 }, { "lat": 51.535, "lng": -0.903 }
    ],
    "waypoints": [
      { "name": "Henley Bridge", "type": "scenic", "distanceKm": 2 },
      { "name": "Turville Village", "type": "scenic", "distanceKm": 30 },
      { "name": "Christmas Common", "type": "rest", "distanceKm": 55 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400"]
  },
  {
    "id": "eng-16",
    "name": "Surrey Hills Box Hill Sprint",
    "region": "Dorking, Surrey",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 65,
    "duration": 90,
    "sss": 8.9,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 567,
    "image": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    "surface": { "asphalt": 96, "concrete": 3, "gravel": 1, "cobblestone": 0 },
    "elevation": { "gain": 420, "max": 224, "minGradient": -8, "maxGradient": 10 },
    "hazards": { "speedHumps": 2, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Cyclists on Zig Zag Road", "Speed bumps in villages"],
    "atmosphere": ["Forest", "Countryside"],
    "coordinates": { "start": { "lat": 51.248, "lng": -0.334 }, "end": { "lat": 51.248, "lng": -0.334 } },
    "path": [
      { "lat": 51.248, "lng": -0.334 }, { "lat": 51.27, "lng": -0.38 },
      { "lat": 51.29, "lng": -0.42 }, { "lat": 51.28, "lng": -0.48 },
      { "lat": 51.26, "lng": -0.40 }, { "lat": 51.248, "lng": -0.334 }
    ],
    "waypoints": [
      { "name": "Box Hill Viewpoint", "type": "scenic", "distanceKm": 5 },
      { "name": "Leith Hill Tower", "type": "scenic", "distanceKm": 25 },
      { "name": "Shere Village", "type": "rest", "distanceKm": 45 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400"]
  },
  {
    "id": "eng-17",
    "name": "Northumberland Coast Road",
    "region": "Alnwick, Northumberland",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 120,
    "duration": 165,
    "sss": 9.5,
    "curvinessIndex": 2,
    "curves": "Low",
    "scenic": true,
    "technical": false,
    "isLoop": false,
    "distanceFromUser": 0,
    "hearts": 423,
    "image": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
    "surface": { "asphalt": 97, "concrete": 2, "gravel": 1, "cobblestone": 0 },
    "elevation": { "gain": 280, "max": 160, "minGradient": -4, "maxGradient": 5 },
    "hazards": { "speedHumps": 0, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["None"],
    "atmosphere": ["Coastal", "Cultural"],
    "coordinates": { "start": { "lat": 55.413, "lng": -1.706 }, "end": { "lat": 55.672, "lng": -1.924 } },
    "path": [
      { "lat": 55.413, "lng": -1.706 }, { "lat": 55.46, "lng": -1.72 },
      { "lat": 55.52, "lng": -1.75 }, { "lat": 55.58, "lng": -1.80 },
      { "lat": 55.63, "lng": -1.86 }, { "lat": 55.672, "lng": -1.924 }
    ],
    "waypoints": [
      { "name": "Alnwick Castle", "type": "scenic", "distanceKm": 3 },
      { "name": "Bamburgh Castle", "type": "scenic", "distanceKm": 50 },
      { "name": "Holy Island Causeway", "type": "scenic", "distanceKm": 85 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400"]
  },
  {
    "id": "eng-18",
    "name": "Somerset Levels Glide",
    "region": "Glastonbury, Somerset",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 75,
    "duration": 100,
    "sss": 9.4,
    "curvinessIndex": 1,
    "curves": "Minimal",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 198,
    "image": "https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?w=800",
    "surface": { "asphalt": 97, "concrete": 2, "gravel": 1, "cobblestone": 0 },
    "elevation": { "gain": 120, "max": 158, "minGradient": -2, "maxGradient": 3 },
    "hazards": { "speedHumps": 1, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Seasonal flooding risk on low-lying roads"],
    "atmosphere": ["Countryside", "Cultural"],
    "coordinates": { "start": { "lat": 51.148, "lng": -2.714 }, "end": { "lat": 51.148, "lng": -2.714 } },
    "path": [
      { "lat": 51.148, "lng": -2.714 }, { "lat": 51.12, "lng": -2.78 },
      { "lat": 51.08, "lng": -2.82 }, { "lat": 51.06, "lng": -2.75 },
      { "lat": 51.10, "lng": -2.70 }, { "lat": 51.148, "lng": -2.714 }
    ],
    "waypoints": [
      { "name": "Glastonbury Tor", "type": "scenic", "distanceKm": 3 },
      { "name": "Wells Cathedral", "type": "scenic", "distanceKm": 28 },
      { "name": "Cheddar Gorge", "type": "scenic", "distanceKm": 55 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?w=400"]
  },
  {
    "id": "eng-19",
    "name": "Forest of Dean Twister",
    "region": "Coleford, Gloucestershire",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Challenging",
    "distance": 80,
    "duration": 115,
    "sss": 8.6,
    "curvinessIndex": 4,
    "curves": "High",
    "scenic": true,
    "technical": true,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 289,
    "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    "surface": { "asphalt": 92, "concrete": 4, "gravel": 3, "cobblestone": 1 },
    "elevation": { "gain": 620, "max": 310, "minGradient": -9, "maxGradient": 11 },
    "hazards": { "speedHumps": 0, "potholes": 1, "unpaved": 0 },
    "chassisThreats": ["Forestry logging vehicles", "Loose gravel patches"],
    "atmosphere": ["Forest", "Countryside"],
    "coordinates": { "start": { "lat": 51.794, "lng": -2.614 }, "end": { "lat": 51.794, "lng": -2.614 } },
    "path": [
      { "lat": 51.794, "lng": -2.614 }, { "lat": 51.82, "lng": -2.58 },
      { "lat": 51.84, "lng": -2.52 }, { "lat": 51.82, "lng": -2.46 },
      { "lat": 51.80, "lng": -2.55 }, { "lat": 51.794, "lng": -2.614 }
    ],
    "waypoints": [
      { "name": "Puzzlewood", "type": "scenic", "distanceKm": 5 },
      { "name": "Symonds Yat Rock", "type": "scenic", "distanceKm": 32 },
      { "name": "Tintern Abbey", "type": "scenic", "distanceKm": 58 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=400"]
  },
  {
    "id": "eng-20",
    "name": "Isle of Wight Diamond",
    "region": "Newport, Isle of Wight",
    "author": "Peak Flow Curated",
    "authorVerified": true,
    "theme": "Relaxed",
    "distance": 95,
    "duration": 135,
    "sss": 9.0,
    "curvinessIndex": 3,
    "curves": "Medium",
    "scenic": true,
    "technical": false,
    "isLoop": true,
    "distanceFromUser": 0,
    "hearts": 376,
    "image": "https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800",
    "surface": { "asphalt": 95, "concrete": 3, "gravel": 2, "cobblestone": 0 },
    "elevation": { "gain": 480, "max": 240, "minGradient": -8, "maxGradient": 10 },
    "hazards": { "speedHumps": 1, "potholes": 0, "unpaved": 0 },
    "chassisThreats": ["Summer tourist traffic", "Military Road cliff erosion areas"],
    "atmosphere": ["Coastal", "Countryside"],
    "coordinates": { "start": { "lat": 50.693, "lng": -1.289 }, "end": { "lat": 50.693, "lng": -1.289 } },
    "path": [
      { "lat": 50.693, "lng": -1.289 }, { "lat": 50.67, "lng": -1.35 },
      { "lat": 50.64, "lng": -1.52 }, { "lat": 50.66, "lng": -1.30 },
      { "lat": 50.70, "lng": -1.15 }, { "lat": 50.72, "lng": -1.22 },
      { "lat": 50.693, "lng": -1.289 }
    ],
    "waypoints": [
      { "name": "The Needles", "type": "scenic", "distanceKm": 25 },
      { "name": "Ventnor Esplanade", "type": "rest", "distanceKm": 50 },
      { "name": "Sandown Bay", "type": "scenic", "distanceKm": 78 }
    ],
    "gallery": ["https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=400"]
  }
];
