import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Layers, X, Crosshair, Users, Globe, Map as MapIcon, Check, Info, List, Verified, Heart, Plus, Sparkles, Play, Pause, Square, Circle, StopCircle, ArrowLeft, Navigation, Clock, Mic } from 'lucide-react'
import { calculateRoute, calculateMultiStopRoute } from '../lib/routing'
import RoutePlanningPanel from '../components/RoutePlanningPanel'
import TurnByTurnPanel from '../components/TurnByTurnPanel'
import MapContainer from '../components/MapContainer'

// Force Refresh: v4


import RouteOverviewSheet from '../components/RouteOverviewSheet'
import RouteDetailSheet from '../components/RouteDetailSheet'
import RouteCard from '../components/RouteCard'
import AIArchitectModal from '../components/AIArchitectModal'
import RouteEditor from '../components/RouteEditor'
import AddStopSearch from '../components/AddStopSearch'
import ManualRoutePlanner from '../components/ManualRoutePlanner'
import OmniSearch from '../components/OmniSearch'
import SearchResultsSheet from '../components/SearchResultsSheet'
import POICard from '../components/POICard'
import { ROUTE_DATABASE } from '../lib/mockRoutes'
import { searchPlaces } from '../lib/searchService'

const NEARBY_RADIUS_START = 25 // km
const NEARBY_RADIUS_STEP = 300 // km

const MOCK_DRIVERS = [
    { id: 'd1', name: 'Jasper M.', vehicle: 'Porsche 911 GT3', latOffset: 0.015, lngOffset: -0.01 },
    { id: 'd2', name: 'Anna B.', vehicle: 'Porsche Cayman GT4', latOffset: -0.01, lngOffset: 0.02 },
]

const MOCK_CONVOY_MEMBERS = [
    { name: 'Max', distance: 30, vehicle: 'Porsche 911 GT3' },
    { name: 'Anna', distance: 20, vehicle: 'Porsche Cayman GT4' },
    { name: 'Tom', distance: 385, vehicle: 'BMW M3 Touring' }, // Rounds to 385
    { name: 'Lisa', distance: 5, vehicle: 'Audi RS6' },
]

const formatDictance = (meters) => {
    if (meters <= 20) return meters
    return Math.round(meters / 5) * 5
}



const Discover = ({ favorites, bucketList, onToggleFavorite, onToggleBucketList, onSaveMyRoute, onSaveTrip, createMode, onResetCreateMode, initialRoute, onClearInitialRoute, onRequestConvoy, drivingMode, onStartDrive, onEndDrive, onToggleNav, squadEnabled, setSquadEnabled, onLeaveConvoy }) => {
    const [viewMode, setViewMode] = useState('map') // 'map' | 'list' | 'editor'
    const [returnToViewMode, setReturnToViewMode] = useState(null)

    const [userLocation, setUserLocation] = useState(null)
    const [allRoutes, setAllRoutes] = useState([...ROUTE_DATABASE])

    const enrichedAllRoutes = useMemo(() => {
        if (!userLocation) return allRoutes

        return allRoutes.map(r => {
            const startCoords = r.coordinates?.start
            if (!startCoords) return r

            const R = 6371 // Earth radius in km
            const dLat = (startCoords.lat - userLocation.lat) * Math.PI / 180
            const dLon = (startCoords.lng - userLocation.lng) * Math.PI / 180
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(startCoords.lat * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            const d = R * c

            return { ...r, distanceFromUser: d.toFixed(1) } // Add formatted distance
        })
    }, [allRoutes, userLocation])

    const displayMembers = useMemo(() => {
        if (drivingMode?.members) {
            return drivingMode.members.map((m, i) => ({
                ...m,
                distance: m.distance || (i + 1) * 45 + Math.floor(Math.random() * 20)
            }))
        }
        return MOCK_CONVOY_MEMBERS
    }, [drivingMode])


    /*
        const loadRealRoute = async () => {
            console.log("Loading GPX route...")
            const route = await parseGPX('/routes/test_route.gpx')
            if (route) {
                console.log("GPX Loaded:", route)
                setAllRoutes([route]) // Replace mock data

                // Auto-zoom to route
                if (route.coordinates?.start) {
                    setFlyToTarget({
                        path: route.path,
                        paddingOptions: { padding: [50, 50] }
                    })
                }
            }
        }
        loadRealRoute()
    */

    // AI / Editor State
    const [generatedRoute, setGeneratedRoute] = useState(null)

    const [selectedRoute, setSelectedRoute] = useState(null) // For RouteOverviewSheet
    const [detailRoute, setDetailRoute] = useState(null)     // For full RouteDetailSheet
    const [flyToTarget, setFlyToTarget] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [showAI, setShowAI] = useState(false)
    const [showManualPlanner, setShowManualPlanner] = useState(false)
    const [showAddStopSearch, setShowAddStopSearch] = useState(false)

    // Map Enhancements State
    const [mapStyle, setMapStyle] = useState('default') // 'default' | 'satellite'
    const [activeFilters, setActiveFilters] = useState(new Set()) // Multi-select
    const [mapCenter, setMapCenter] = useState(null)
    const [showSquadModal, setShowSquadModal] = useState(false)
    const [showLeaveModal, setShowLeaveModal] = useState(false) // New state for leave confirmation


    // ─── Unified Convoy Panel State ───
    const [showConvoyPanel, setShowConvoyPanel] = useState(false)
    const [convoyTab, setConvoyTab] = useState('members') // 'members' | 'comms'
    const [convoyFeed, setConvoyFeed] = useState([
        { id: 'sys1', type: 'system', text: 'Convoy started', time: 'Now' }
    ])
    const [isRecording, setIsRecording] = useState(false)
    const [nearbyDrivers, setNearbyDrivers] = useState([])
    const [selectedDriver, setSelectedDriver] = useState(null)
    const [selectedPOI, setSelectedPOI] = useState(null)
    const [drivenCuratedRoute, setDrivenCuratedRoute] = useState(null) // curated route kept visible in orange during navigation

    // ─── Active Navigation Controls State ───
    const [showNavControls, setShowNavControls] = useState(false)
    const [isNavOverview, setIsNavOverview] = useState(false)
    const navControlsTimer = React.useRef(null)

    const handleMapInteraction = useCallback(() => {
        if (drivingMode) {
            setShowNavControls(true)
            if (navControlsTimer.current) clearTimeout(navControlsTimer.current)
            navControlsTimer.current = setTimeout(() => {
                setShowNavControls(false)
            }, 5000)
        }
    }, [drivingMode])

    useEffect(() => {
        return () => {
            if (navControlsTimer.current) clearTimeout(navControlsTimer.current)
        }
    }, [])
    // ─── Search State ───
    const [searchResults, setSearchResults] = useState([]) // Ensure initialized
    const [searchHistory, setSearchHistory] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('peak_flow_search_history') || '[]')
        } catch { return [] }
    })

    // History Helper
    const addToHistory = (location) => {
        if (!location || !location.name) return
        setSearchHistory(prev => {
            const newItem = {
                id: location.id || `loc-${Date.now()}`,
                name: location.name,
                details: location.details || location.region || '',
                lat: location.lat,
                lng: location.lng,
                type: location.type || 'place',
                timestamp: Date.now()
            }
            // Dedup by name
            const filtered = prev.filter(item => item.name !== newItem.name)
            const next = [newItem, ...filtered].slice(0, 5)
            localStorage.setItem('peak_flow_search_history', JSON.stringify(next))
            return next
        })
    }

    // ─── Navigation Route State ───
    const [availableRoutes, setAvailableRoutes] = useState([]) // Multi-route options
    const [activeNavRoute, setActiveNavRoute] = useState(null) // { geometry, distance, duration, destinationName }
    const [routeLoading, setRouteLoading] = useState(false)
    const [routeStops, setRouteStops] = useState([]) // Intermediate stops added by user

    const handleAddStop = useCallback(async (place) => {
        if (!userLocation || !activeNavRoute?.destinationCoords) return
        const newStops = [...routeStops, place]
        setRouteStops(newStops)
        setRouteLoading(true)
        try {
            const points = [userLocation, ...newStops, activeNavRoute.destinationCoords]
            const result = await calculateMultiStopRoute(points)
            if (result) {
                setActiveNavRoute(prev => ({
                    ...prev,
                    geometry: result.geometry,
                    distance: result.distance,
                    duration: result.duration,
                    stops: newStops,
                }))
                setAvailableRoutes([]) // Alternatives don't apply to multi-stop routes
                if (result.geometry) {
                    setFlyToTarget({
                        path: result.geometry.map(pt => ({ lat: pt[0], lng: pt[1] })),
                        paddingOptions: { paddingTopLeft: [50, 50], paddingBottomRight: [50, 400] }
                    })
                }
            }
        } catch (e) {
            console.error('Failed to add stop:', e)
            setRouteStops(routeStops) // revert
        } finally {
            setRouteLoading(false)
        }
    }, [userLocation, activeNavRoute, routeStops])

    // ─── Trip Recorder State ───
    const [recordingState, setRecordingState] = useState('idle') // 'idle', 'recording', 'paused'
    const [recordingDuration, setRecordingDuration] = useState(0)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [tripName, setTripName] = useState('')
    const [isPTTActive, setIsPTTActive] = useState(false)
    const [pttDuration, setPttDuration] = useState(0)

    useEffect(() => {
        let interval
        if (isPTTActive) {
            interval = setInterval(() => {
                setPttDuration(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isPTTActive])
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    // ─── Re-center Logic ───
    const [showRecenterBtn, setShowRecenterBtn] = useState(false)

    // Recorder Timer
    useEffect(() => {
        let interval
        if (recordingState === 'recording') {
            interval = setInterval(() => {
                setRecordingDuration(prev => prev + 1)
            }, 1000)
        } else if (recordingState === 'idle') {
            setRecordingDuration(0)
        }
        return () => clearInterval(interval)
    }, [recordingState])

    // Simulate Radar Finding Drivers
    useEffect(() => {
        let drivers = []

        // 1. If Squad/Radar is explicitly enabled, show random nearby drivers (Discovery Mode)
        if (squadEnabled && userLocation) {
            drivers = [...drivers, ...MOCK_DRIVERS.map(d => ({
                ...d,
                lat: userLocation.lat + d.latOffset,
                lng: userLocation.lng + d.lngOffset
            }))]
        }

        // 2. If Driving in a Convoy, show convoy members (Active Convoy Mode)
        // We filter out duplicates based on name if they exist in both lists
        if (drivingMode?.members && userLocation) {
            const memberDrivers = drivingMode.members.map((m, i) => {
                // Generate a consistent pseudo-random offset based on name char codes
                const seed = m.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
                const latOffset = ((seed % 100) / 10000) * (i % 2 === 0 ? 1 : -1)
                const lngOffset = ((seed % 50) / 5000) * (i % 2 === 0 ? -1 : 1)

                return {
                    id: m.id,
                    name: m.name,
                    vehicle: m.vehicle,
                    lat: userLocation.lat + latOffset + 0.005, // Slightly ahead/behind
                    lng: userLocation.lng + lngOffset + 0.005,
                    isConvoy: true
                }
            })

            // Filter out MOCK_DRIVERS that match convoy members by name to avoid duplicates
            // (In a real app, we'd use IDs)
            const convoyNames = new Set(memberDrivers.map(d => d.name))
            drivers = [
                ...drivers.filter(d => !convoyNames.has(d.name)),
                ...memberDrivers
            ]
        }

        setNearbyDrivers(drivers)
    }, [squadEnabled, userLocation, drivingMode])

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleStopRecording = () => {
        setRecordingState('paused')
        const date = new Date()
        setTripName(`Trip on ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`)
        setShowSaveModal(true)
    }

    const confirmSaveTrip = () => {
        const newTrip = {
            id: `trip-${Date.now()}`,
            date: new Date().toISOString(),
            routeName: tripName || `Trip on ${new Date().toLocaleDateString()}`,
            distance: (Math.random() * 50 + 10).toFixed(1), // Mock distance
            duration: Math.floor(recordingDuration / 60),
            photos: 0,
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
            notes: "Recorded trip",
            performance: {
                labels: ['0', '10', '20', '30', '40', '50'],
                data: [65, 59, 80, 81, 56, 55]
            }
        }

        if (onSaveTrip) onSaveTrip(newTrip)

        setRecordingState('idle')
        setShowSaveModal(false)
        setToastMessage(`Saved successfully`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
    }

    const cancelSaveTrip = () => {
        setShowSaveModal(false)
        setRecordingState('idle')
    }

    // ─── External Create Trigger ───
    useEffect(() => {
        if (createMode) {
            setShowManualPlanner(true)
            if (onResetCreateMode) onResetCreateMode()
        }
    }, [createMode, onResetCreateMode])

    // ─── External Route Selection Trigger (from Trips tab) ───
    useEffect(() => {
        if (initialRoute) {
            setSelectedRoute(initialRoute)
            // If it has coordinates, fly to them
            if (initialRoute.coordinates?.start) {
                setFlyToTarget({
                    ...initialRoute.coordinates.start,
                    zoom: 14
                })
            } else if (initialRoute.path && initialRoute.path.length > 0) {
                // For curated routes, fly to the path bounds
                setFlyToTarget({
                    path: initialRoute.path,
                    paddingOptions: { paddingTopLeft: [50, 50], paddingBottomRight: [50, 50] }
                })
            }
            setViewMode('map') // Ensure map view is active when opening from another tab
            if (onClearInitialRoute) onClearInitialRoute()
        }
    }, [initialRoute, onClearInitialRoute])

    // ─── Generate Local Routes on Location Found ───
    const handleLocationFound = useCallback((loc) => {
        setUserLocation(loc)
        // Only set center on first load to allow panning
        setMapCenter(prev => prev || loc)
    }, [])

    // ─── Multi-select Filter Toggle ───
    const handleFilterToggle = useCallback((filterId) => {
        setActiveFilters(prev => {
            const next = new Set(prev)
            if (next.has(filterId)) {
                next.delete(filterId)
            } else {
                next.add(filterId)
            }
            return next
        })
    }, [])

    // Auto-zoom when driving mode starts and follow user if not panned
    useEffect(() => {
        if (drivingMode && userLocation) {
            setFlyToTarget({
                lat: userLocation.lat,
                lng: userLocation.lng,
                zoom: 18, // Close-up for driving
                pitch: 60, // Tilt for 3D effect
                isDrivingTrack: true // Offset the marker to bottom 25% of screen
            })
            setShowRecenterBtn(false)
        }
    }, [drivingMode, userLocation])

    // Calculate Approach Route if requested
    useEffect(() => {
        const calculateApproach = async () => {
            console.log('[Discover] calcApproach check', {
                navigateToStart: drivingMode?.navigateToStart,
                hasStartCoords: !!drivingMode?.coordinates?.start,
                userLocation
            })
            if (drivingMode?.navigateToStart && drivingMode.coordinates?.start && userLocation) {
                setRouteLoading(true)
                try {
                    const result = await calculateRoute(
                        userLocation,
                        drivingMode.coordinates.start
                    )
                    // Just take the first one for approach
                    const bestRoute = Array.isArray(result) ? result[0] : result

                    setActiveNavRoute({
                        ...bestRoute,
                        destinationName: `Start: ${drivingMode.title}`
                    })

                    // Auto-zoom to approach route removed per user request: "no zoom-in out effect"
                    /* if (bestRoute?.geometry) {
                        setFlyToTarget({
                            path: bestRoute.geometry.map(pt => ({ lat: pt[0], lng: pt[1] })),
                            paddingOptions: { paddingTopLeft: [50, 50], paddingBottomRight: [50, 400] }
                        })
                    } */
                } catch (err) {
                    console.error('Failed to calculate approach route:', err)
                } finally {
                    setRouteLoading(false)
                }
            }
        }
        calculateApproach()
    }, [drivingMode, userLocation])

    // ─── Filter Logic ───
    const filteredRoutes = useMemo(() => {
        // If in Editor Mode, ONLY show the AI route
        if (viewMode === 'editor' && generatedRoute) {
            return [generatedRoute]
        }

        // Hide discover routes during Navigation, Route Planning, Loading, POI Selection, or Creation
        // But keep the driven curated route visible in orange as a backdrop
        if (drivingMode || activeNavRoute || routeLoading || selectedPOI || createMode) {
            return drivenCuratedRoute ? [drivenCuratedRoute] : []
        }

        let routes = enrichedAllRoutes

        // 1. Text Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            routes = routes.filter(r =>
                r.name.toLowerCase().includes(q) ||
                r.region.toLowerCase().includes(q)
            )
        }

        // 2. Quick Filters
        if (activeFilters.size > 0) {
            // Separate AND-filters (sports, challenging, relaxed) from OR-filters (duration-based)
            const andFilters = ['sports', 'challenging', 'relaxed'].filter(f => activeFilters.has(f))
            const orFilters = ['quick', 'half', 'full', 'multiday'].filter(f => activeFilters.has(f))

            routes = routes.filter(r => {
                // AND filters: route must match ALL of these
                for (const f of andFilters) {
                    switch (f) {
                        case 'sports':
                            if (r.sss < 8.5) return false
                            break
                        case 'challenging':
                            if (r.curvinessIndex < 4 && !r.technical) return false
                            break
                        case 'relaxed':
                            if (r.theme !== 'Relaxed' && (r.curvinessIndex > 3 || r.technical)) return false
                            break

                    }
                }

                // OR filters: route must match ANY of these (if any are active)
                const safeOrFilters = Array.from(orFilters || [])
                if (safeOrFilters.length > 0) {
                    const matchesAny = safeOrFilters.some(f => {
                        switch (f) {
                            case 'quick': return r.duration <= 120
                            case 'half': return r.duration > 120 && r.duration <= 300
                            case 'full': return r.duration > 300 && !r.multiDay
                            case 'multiday': return !!r.multiDay
                            default: return false
                        }
                    })
                    if (!matchesAny) return false
                }

                return true
            })
        }

        // 3. Calculate Distance from User
        // (Distance is now precalculated in enrichedAllRoutes)

        return routes
    }, [searchQuery, activeFilters, enrichedAllRoutes, viewMode, generatedRoute, drivingMode, activeNavRoute, routeLoading, selectedPOI, createMode, drivenCuratedRoute, userLocation])

    // DEBUG LOGGING - SAFELY PLACED
    console.log('[Discover] Render State:', {
        allRoutesLen: allRoutes?.length,
        searchResultsLen: searchResults?.length,
        drivingMode,
        activeNavRoute
    })

    // ─── UI Visibility Control ───
    const isSheetOpen = selectedRoute || detailRoute || showAI || showManualPlanner || (Array.isArray(searchResults) && searchResults.length > 0)
    useEffect(() => {
        const isUIActive = !!(selectedPOI || activeNavRoute || isSheetOpen)
        onToggleNav?.(isUIActive)
    }, [selectedPOI, activeNavRoute, isSheetOpen, onToggleNav])

    const handleBack = useCallback(() => {
        if (activeNavRoute) {
            setActiveNavRoute(null)
            // selectedPOI remains set, so we return to POI summary if it handles it
        } else if (selectedRoute) {
            setSelectedRoute(null)
            setFlyToTarget(null)
            if (returnToViewMode) {
                setViewMode(returnToViewMode)
                setReturnToViewMode(null)
            }
        } else if (selectedPOI) {
            setSelectedPOI(null)
            setFlyToTarget(null)
            setSearchResults([])
        }
    }, [activeNavRoute, selectedRoute, selectedPOI, returnToViewMode])

    // ─── Route Planner Handlers ───
    const handleRouteRequest = async (destination) => {
        setRouteLoading(true)

        try {
            await new Promise(r => setTimeout(r, 600)) // Mock delay

            const start = userLocation || { lat: 47.8, lng: 8.2 } // Fallback

            const mockRoute = {
                id: `nav-${Date.now()}`,
                name: `Route to ${destination.name}`,
                geometry: [[start.lat, start.lng], [destination.lat, destination.lng]], // Line
                distance: 12.5, // Mock
                duration: 18, // Mock
                destinationName: destination.name,
                instructions: [
                    { type: 'Straight', text: 'Head north on Main St', distance: 500 },
                    { type: 'Right', text: 'Turn right onto B500', distance: 2000 },
                    { type: 'Left', text: 'Turn left towards Lake', distance: 8500 },
                    { type: 'Destination', text: `Arrive at ${destination.name}`, distance: 0 }
                ]
            }

            setActiveNavRoute(mockRoute)
        } catch (err) {
            console.error(err)
        } finally {
            setRouteLoading(false)
        }
    }

    // ─── Search Submit Handler ───
    const handleSearchSubmit = useCallback(async (query) => {
        if (!query || query.length < 3) return

        setRouteLoading(true) // Reuse loading indicator
        try {
            const results = await searchPlaces(query, 20, userLocation)
            setSearchResults(results)

            if (results.length > 0) {
                // Clear other views
                setSelectedPOI(null)
                setSelectedRoute(null)

                // Fit bounds to results
                if (results.length > 1) {
                    const lats = results.map(r => r.lat)
                    const lngs = results.map(r => r.lng)
                    const minLat = Math.min(...lats)
                    const maxLat = Math.max(...lats)
                    const minLng = Math.min(...lngs)
                    const maxLng = Math.max(...lngs)

                    // Create a path-like object for flyToBounds
                    setFlyToTarget({
                        path: [
                            { lat: minLat, lng: minLng },
                            { lat: maxLat, lng: maxLng }
                        ],
                        paddingOptions: { padding: [50, 50] }
                    })
                } else {
                    setFlyToTarget({ ...results[0], zoom: 14 })
                }
            } else {
                setToastMessage('No results found')
                setShowToast(true)
                setTimeout(() => setShowToast(false), 3000)
            }
        } catch (err) {
            console.error(err)
            setToastMessage('Search failed')
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000)
        } finally {
            setRouteLoading(false)
        }
    }, [])



    // ─── Map Handlers ───
    const handleRouteTap = useCallback((route) => {
        if (!route) return

        // If coming from list view, remember to go back
        if (viewMode === 'list') {
            setReturnToViewMode('list')
        }

        setFlyToTarget({
            ...route,
            paddingOptions: {
                paddingBottomRight: [50, 400], // Add 400px bottom padding to clear the sheet
                paddingTopLeft: [50, 50]
            }
        })
        setSelectedRoute(route)
        setViewMode('map') // Ensure we switch to map view to see the route
    }, [viewMode])

    const handleExpandToDetail = useCallback(() => {
        if (selectedRoute) {
            setDetailRoute(selectedRoute)
            setSelectedRoute(null)
        }
    }, [selectedRoute])

    const handleCloseSheet = useCallback(() => {
        setSelectedRoute(null)
        setFlyToTarget(null)

        if (returnToViewMode) {
            setViewMode(returnToViewMode)
            setReturnToViewMode(null)
        }
    }, [returnToViewMode])

    const handleCloseDetail = useCallback(() => {
        setDetailRoute(null)
        // Also restore view mode if closing details
        if (returnToViewMode) {
            setViewMode(returnToViewMode)
            setReturnToViewMode(null)
        }
    }, [returnToViewMode])

    const handleAIGenerated = useCallback((route) => {
        setShowAI(false)
        // Ensure waypoints are set as path
        if (route.waypoints) {
            route.path = route.waypoints
        }

        // Use RouteOverviewSheet instead of Editor
        route.isGenerated = true // Flag for specific UI actions
        setSelectedRoute(route)
        setViewMode('map') // Stay in map mode, sheet overlays it

        // Fly to route bounds
        setFlyToTarget({
            path: route.waypoints || route.path,
            paddingOptions: {
                paddingBottomRight: [50, 400],
                paddingTopLeft: [50, 50]
            }
        })
    }, [])

    const handleEditorSave = (finalRoute) => {
        // Add to main database
        setAllRoutes(prev => [finalRoute, ...prev])
        setGeneratedRoute(null)
        setViewMode('discover')

        // Save to My Routes
        if (onSaveMyRoute) onSaveMyRoute(finalRoute)

        // Select it for viewing
        setTimeout(() => {
            setSelectedRoute(finalRoute)
            setFlyToTarget(finalRoute)
        }, 100)
    }

    const handleEditorCancel = () => {
        setGeneratedRoute(null)
        setViewMode('discover')
    }

    const handleEditorPreviewUpdate = (updatedRoute) => {
        setGeneratedRoute(updatedRoute)
    }

    // ─── Map Controls Handlers ───
    const handleMapMove = useCallback((center) => {
        setMapCenter(center)
    }, [])

    const handleStartDrive = (msg) => {
        if (window.confirm(msg || "Send route to McLaren?")) {
            alert("Route sent to McLaren Navigation System.")
        }
    }

    const handleFormConvoy = () => {
        // Pass the currently selected or active route to the convoy creation flow
        const routeToPass = activeNavRoute || selectedRoute || generatedRoute || detailRoute
        if (onRequestConvoy) {
            onRequestConvoy({ route: routeToPass })
        }
    }

    const handleLocationSelect = useCallback((location) => {
        setFlyToTarget({
            lat: location.lat,
            lng: location.lng,
            zoom: location.zoom || 14
        })

        // Show POI Card
        setSelectedPOI(location)

        // Add to history
        addToHistory(location)

        // Close other sheets
        setSelectedRoute(null)
        setDetailRoute(null)

        setViewMode('map') // Switch to map to see the POI
    }, [])


    const handleManualPan = useCallback(() => {
        if (!drivingMode && !showRecenterBtn) {
            setShowRecenterBtn(true)
        }
        handleMapInteraction()
    }, [drivingMode, showRecenterBtn, handleMapInteraction])

    const handleRecenter = () => {
        if (userLocation) {
            setFlyToTarget({ ...userLocation, zoom: 15, pitch: 0 })
            setShowRecenterBtn(false)
        }
    }

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <MapContainer
                routes={
                    detailRoute
                        ? [detailRoute]
                        : selectedRoute?.isGenerated
                            ? [selectedRoute]
                            : activeNavRoute
                                ? []
                                : filteredRoutes
                }
                flyToTarget={flyToTarget}
                onRouteTap={handleRouteTap}
                onLocationFound={handleLocationFound}
                mapStyle={mapStyle}
                onMapMove={handleMapMove}
                selectedRouteId={selectedRoute?.id}
                onManualPan={handleManualPan}
                onMapClick={handleMapInteraction}


                poiMarker={selectedPOI}
                liveSharing={squadEnabled || (drivingMode && drivingMode.memberCount > 0)}
                nearbyDrivers={nearbyDrivers}
                onDriverClick={(driver) => setSelectedDriver(driver)}
                activeNavRoute={activeNavRoute}
                alternativeRoutes={!drivingMode ? availableRoutes.filter(r => r.id !== activeNavRoute?.id) : []}
                onAlternativeRouteSelect={setActiveNavRoute}
                searchResults={searchResults}
                onSearchResultClick={handleLocationSelect}
            />
            {/* Re-center Button removed from Driving Mode */}

            {/* ─── Driving Mode Header OR Turn-by-Turn ─── */}
            {drivingMode && (
                <>
                    {/* If we have route data, show TBT Panel */}
                    {(activeNavRoute || drivingMode.duration || drivingMode.distance) ? (
                        <TurnByTurnPanel
                            route={activeNavRoute || drivingMode}
                            showControls={showNavControls}
                            onEndDrive={() => {
                                setActiveNavRoute(null)
                                setSelectedPOI(null)
                                setGeneratedRoute(null)
                                setDrivenCuratedRoute(null)
                                setShowRecenterBtn(false)
                                setAvailableRoutes([]) // Clear alternatives
                                if (userLocation) {
                                    setFlyToTarget({ ...userLocation, zoom: 15, pitch: 0 })
                                }
                                onEndDrive?.()
                            }}
                            onAddStop={() => setShowAddStopSearch(true)}
                            style={{ position: 'absolute', top: 20, left: 20 }}
                        />
                    ) : (
                        // Fallback/Standard Header for Free Drive (Squad Mode)
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 'var(--z-overlay)',
                            padding: '52px 20px 12px',
                            display: 'flex', alignItems: 'center', gap: 10
                        }}>
                            <button
                                onClick={() => {
                                    setActiveNavRoute(null)
                                    setSelectedPOI(null)
                                    setDrivenCuratedRoute(null)
                                    setShowRecenterBtn(false)
                                    if (userLocation) {
                                        setFlyToTarget({ ...userLocation, zoom: 15, pitch: 0 })
                                    }
                                    onEndDrive?.()
                                }}
                                style={{
                                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
                                    border: 'var(--border-glass)', borderRadius: '50%',
                                    width: 40, height: 40,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', cursor: 'pointer'
                                }}
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div className="glass-panel" style={{ flex: 1, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{drivingMode.title}</span>
                                {drivingMode.memberCount && (
                                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Users size={12} /> {drivingMode.memberCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* List View Overlay — Categorized */}
            {!drivingMode && viewMode === 'list' && (
                <div style={{
                    position: 'absolute', inset: 0,
                    top: 0,
                    background: '#0a0a0c',
                    zIndex: 'var(--z-map)',
                    overflowY: 'auto',
                    paddingTop: 200, // Space for OmniSearch + filters
                    paddingBottom: 120
                }} className="no-scrollbar">

                    {/* Show Search Results Grid if searching or filtering */}
                    {(searchQuery || activeFilters.size > 0) ? (
                        <div style={{ padding: '0 20px' }}>
                            <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                                {(filteredRoutes || []).length} Results
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                                {[...(filteredRoutes || [])].sort((a, b) => (a.duration || 0) - (b.duration || 0)).map(route => (
                                    <RouteCard
                                        key={route.id}
                                        route={route}
                                        onClick={() => handleRouteTap(route)}
                                        style={{ width: '100%', maxWidth: 'none' }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Categorized View
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                            {/* Category 1: Nearby */}
                            <RouteCategoryRow
                                title="Nearby"
                                routes={[...(enrichedAllRoutes || [])].sort((a, b) => parseFloat(a.distanceFromUser || 9999) - parseFloat(b.distanceFromUser || 9999)).slice(0, 10)}
                                onRouteClick={handleRouteTap}
                                showCreateCard
                                createCardPosition="end"
                                onCreateRoute={() => setShowAI(true)}
                            />

                            {/* Category 2: Relaxed Drives */}
                            <RouteCategoryRow
                                title="Relaxed Drives"
                                routes={[...(enrichedAllRoutes || []).filter(r => r.curvinessIndex <= 2 || (r.scenic && r.curvinessIndex <= 3))].sort((a, b) => parseFloat(a.distanceFromUser || 9999) - parseFloat(b.distanceFromUser || 9999))}
                                onRouteClick={handleRouteTap}
                            />

                            {/* Category 3: Challenging Drives */}
                            <RouteCategoryRow
                                title="Challenging Drives"
                                routes={[...(enrichedAllRoutes || []).filter(r => r.curvinessIndex >= 4 || r.technical)].sort((a, b) => parseFloat(a.distanceFromUser || 9999) - parseFloat(b.distanceFromUser || 9999))}
                                onRouteClick={handleRouteTap}
                            />

                            {/* Category 4: Quick escapes (1-2h) */}
                            <RouteCategoryRow
                                title="Quick escapes"
                                routes={[...(enrichedAllRoutes || []).filter(r => r.duration >= 60 && r.duration <= 120)].sort((a, b) => parseFloat(a.distanceFromUser || 9999) - parseFloat(b.distanceFromUser || 9999))}
                                onRouteClick={handleRouteTap}
                            />

                            {/* Category 5: Fun with curves (4-5/5 curves) */}
                            <RouteCategoryRow
                                title="Fun with curves"
                                routes={[...(enrichedAllRoutes || []).filter(r => r.curvinessIndex >= 4)].sort((a, b) => parseFloat(a.distanceFromUser || 9999) - parseFloat(b.distanceFromUser || 9999))}
                                onRouteClick={handleRouteTap}
                            />

                            {/* Category 6: Up and down (high elevation) */}
                            <RouteCategoryRow
                                title="Up and down"
                                routes={[...(enrichedAllRoutes || []).filter(r => r.elevation?.gain > 500)].sort((a, b) => parseFloat(a.distanceFromUser || 9999) - parseFloat(b.distanceFromUser || 9999))}
                                onRouteClick={handleRouteTap}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* ─── Back Button (Top Left) ─── */}
            {(selectedPOI || activeNavRoute) && !drivingMode && (
                <button
                    onClick={handleBack}
                    className="btn-glass"
                    style={{
                        position: 'absolute', top: 20, left: 20,
                        zIndex: 1200,
                        width: 44, height: 44,
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                >
                    <ArrowLeft size={24} strokeWidth={2.5} />
                </button>
            )}

            {/* OmniSearch — hidden when a route sheet is open, driving, or route planning */}
            {!drivingMode && !isSheetOpen && !selectedPOI && !activeNavRoute && !routeLoading && (
                <OmniSearch
                    routes={allRoutes}
                    onRouteSelect={handleRouteTap}
                    onManualPlan={() => setShowAI(true)}
                    onAutoCreate={() => setShowAI(true)}
                    onSearch={setSearchQuery}
                    activeFilters={activeFilters}
                    onFilterToggle={handleFilterToggle}
                    onLocationSelect={handleLocationSelect}
                    history={searchHistory}
                    onSubmit={handleSearchSubmit}
                    location={userLocation}
                />
            )}

            {/* ─── Search Results Sheet ─── */}
            <SearchResultsSheet
                results={searchResults}
                onSelect={(loc) => {
                    handleLocationSelect(loc)
                    setSearchResults([])
                }}
                onClose={() => setSearchResults([])}
            />

            {/* ─── Create Route / Trip Recorder UI ─── */}
            {!drivingMode && selectedPOI && (
                <POICard
                    poi={selectedPOI}
                    userLocation={userLocation}
                    onClose={handleBack}
                    onRoute={async (poi) => {
                        if (!userLocation) {
                            alert('Waiting for your location...')
                            return
                        }
                        setRouteLoading(true)
                        setSelectedPOI(null)
                        setFlyToTarget(null)
                        try {
                            const result = await calculateRoute(userLocation, poi)
                            const routes = Array.isArray(result) ? result : [result]
                            const bestRoute = routes[0]

                            // Store all routes for selection (if we add state for it)
                            const enrichedRoutes = routes.map(r => ({
                                ...r,
                                destinationName: poi.name,
                                destinationAddress: poi.details || null,
                                destinationCoords: { lat: poi.lat, lng: poi.lng },
                                surface: { asphalt: 100 },
                                hazards: { potholes: 0, speedHumps: 0, unpaved: 0 },
                                elevation: { gain: Math.floor((r.distance || 0) * 8), maxGradient: 4 }
                            }))
                            setAvailableRoutes(enrichedRoutes)
                            const bestEnriched = enrichedRoutes[0]

                            setActiveNavRoute(bestEnriched)

                            // Auto-zoom to the calculated route
                            if (bestRoute?.geometry) {
                                setFlyToTarget({
                                    path: bestRoute.geometry.map(pt => ({ lat: pt[0], lng: pt[1] })),
                                    paddingOptions: {
                                        paddingTopLeft: [50, 50],
                                        paddingBottomRight: [50, 400] // Shift view up to clear RoutePlanningPanel at bottom
                                    }
                                })
                            }
                        } catch (err) {
                            console.error('Routing failed:', err)
                            alert('Could not calculate route. Please try again.')
                        } finally {
                            setRouteLoading(false)
                        }
                    }}
                />
            )}

            {/* ─── Map/List Toggle (Bottom Center) ─── */}
            {!drivingMode && !selectedPOI && !activeNavRoute && !routeLoading && (
                <div style={{
                    position: 'absolute',
                    bottom: 110, // Fixed bottom position, hidden when sheet open
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 'var(--z-overlay)',
                    transition: 'all 0.3s ease',
                    opacity: isSheetOpen ? 0 : 1,
                    pointerEvents: isSheetOpen ? 'none' : 'auto'
                }}>
                    <button
                        onClick={() => setViewMode(prev => prev === 'map' ? 'list' : 'map')}
                        style={{
                            background: 'rgba(20, 20, 20, 0.6)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 32,
                            padding: '10px 24px',
                            display: 'flex', alignItems: 'center', gap: 10,
                            color: 'white', fontSize: 13, fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                            transition: 'all 0.2s ease',
                            textTransform: 'uppercase', letterSpacing: 0.5
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(40, 40, 40, 0.8)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(20, 20, 20, 0.6)'}
                    >
                        {viewMode === 'map' ? (
                            <>
                                <List size={18} /> List View
                            </>
                        ) : (
                            <>
                                <MapIcon size={18} /> Map View
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* ─── Satellite Toggle (Top Right, below search area) ─── */}
            <div style={{
                position: 'absolute',
                top: (isSheetOpen || drivingMode || activeNavRoute) ? 20 : 190,
                right: 20,
                display: viewMode === 'list' ? 'none' : 'flex', flexDirection: 'column', gap: 12,
                zIndex: 'var(--z-overlay)',
                transition: 'top 0.3s ease, opacity 0.3s ease',
                opacity: (drivingMode && !showNavControls) ? 0 : 1,
                pointerEvents: (drivingMode && !showNavControls) ? 'none' : 'auto'
            }}>
                <button
                    className={`map-control-btn`}
                    style={{
                        background: 'rgba(20, 20, 20, 0.8)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: 40, height: 40, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => setMapStyle(prev => prev === 'default' ? 'satellite' : 'default')}
                    title={mapStyle === 'default' ? 'Satellite view' : 'Default view'}
                >
                    {mapStyle === 'default' ? <Globe size={20} /> : <MapIcon size={20} />}
                </button>

                {/* ─── Route Overview Toggle ─── */}
                {drivingMode && (
                    <button
                        className="map-control-btn"
                        style={{
                            background: 'rgba(20, 20, 20, 0.8)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                            width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', backdropFilter: 'blur(12px)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'all 0.2s ease'
                        }}
                        onClick={() => {
                            if (isNavOverview) {
                                if (userLocation) {
                                    setFlyToTarget({ lat: userLocation.lat, lng: userLocation.lng, zoom: 18, pitch: 60, isDrivingTrack: true })
                                }
                                setIsNavOverview(false)
                            } else {
                                const targetRoute = activeNavRoute || drivingMode
                                if (targetRoute?.geometry) {
                                    setFlyToTarget({ path: targetRoute.geometry.map(pt => ({ lat: pt[0], lng: pt[1] })), paddingOptions: { padding: [60, 60] } })
                                } else if (targetRoute?.coordinates) {
                                    if (targetRoute.coordinates.start) {
                                        setFlyToTarget({ coordinates: targetRoute.coordinates })
                                    }
                                }
                                setIsNavOverview(true)
                            }
                            handleMapInteraction()
                        }}
                        title={isNavOverview ? "Resume Navigation" : "Route Overview"}
                    >
                        {isNavOverview ? <Navigation size={18} /> : <MapIcon size={18} />}
                    </button>
                )}
            </div>


            {/* ─── Convoy Member List REMOVED (Moved to Unified Panel) ─── */}



            {/* ─── Re-center (Bottom Left) ─── */}
            <div style={{
                position: 'absolute',
                bottom: isSheetOpen ? 320 : 110,
                left: 20,
                zIndex: 'var(--z-overlay)',
                transition: 'all 0.3s ease',
                opacity: !drivingMode && !isSheetOpen && showRecenterBtn && viewMode === 'map' ? 1 : 0,
                transform: !drivingMode && !isSheetOpen && showRecenterBtn && viewMode === 'map' ? 'scale(1)' : 'scale(0.8)',
                pointerEvents: !drivingMode && !isSheetOpen && showRecenterBtn && viewMode === 'map' ? 'auto' : 'none'
            }}>
                <button
                    className="map-control-btn"
                    onClick={handleRecenter}
                    title="Re-center Map"
                >
                    <Crosshair size={20} />
                </button>
            </div>



            {/* ─── PPT Button (Bottom Center, above ETA) ─── */}
            {drivingMode && drivingMode.memberCount > 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: 110,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 'var(--z-overlay)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
                }}>
                    <button
                        onClick={() => {
                            if (!isPTTActive) {
                                setIsPTTActive(true)
                                setPttDuration(0)
                            } else {
                                setIsPTTActive(false)
                            }
                        }}
                        style={{
                            width: 64, height: 64,
                            borderRadius: '50%',
                            background: isPTTActive ? '#00e676' : 'rgba(20, 20, 20, 0.8)',
                            border: `2px solid ${isPTTActive ? '#00e676' : 'rgba(255,255,255,0.2)'}`,
                            color: isPTTActive ? 'black' : 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            backdropFilter: 'blur(12px)',
                            boxShadow: isPTTActive ? '0 0 20px rgba(0, 230, 118, 0.4)' : '0 4px 12px rgba(0,0,0,0.3)',
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            transform: isPTTActive ? 'scale(1.1)' : 'scale(1)'
                        }}
                    >
                        <Mic size={28} fill={isPTTActive ? 'black' : 'none'} />
                    </button>
                    {isPTTActive && (
                        <div style={{
                            background: 'rgba(0, 230, 118, 0.9)',
                            color: 'black',
                            padding: '4px 12px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            animation: 'fadeIn 0.2s ease'
                        }}>
                            {new Date(pttDuration * 1000).toISOString().substr(14, 5)}
                        </div>
                    )}
                </div>
            )}



            {/* ─── Save Trip Modal ─── */}
            {showSaveModal && (
                <div style={{
                    position: 'absolute', inset: 0,
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div style={{
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 24,
                        padding: 24,
                        width: '90%', maxWidth: 320,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        animation: 'scaleUp 0.2s ease'
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'white' }}>
                            Save Trip?
                        </h3>
                        {/* 
                          Use description to explain what happens.
                        */}
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                            Stop recording and save this trip to your history.
                        </p>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: 0.5 }}>
                                TRIP NAME
                            </label>
                            <input
                                type="text"
                                value={tripName}
                                onChange={(e) => setTripName(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 12,
                                    padding: '12px 16px',
                                    color: 'white',
                                    fontSize: 14,
                                    outline: 'none',
                                    fontFamily: 'var(--font-main)'
                                }}
                                onClick={(e) => e.target.select()}
                                autoFocus
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={cancelSaveTrip}
                                style={{
                                    flex: 1, padding: '12px',
                                    borderRadius: 12,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer'
                                }}
                            >
                                Discard
                            </button>
                            <button
                                onClick={confirmSaveTrip}
                                style={{
                                    flex: 1, padding: '12px',
                                    borderRadius: 12,
                                    background: 'var(--primary-apex)',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer'
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Toast Notification ─── */}
            {showToast && (
                <div style={{
                    position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(20, 20, 20, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 32,
                    padding: '12px 24px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    zIndex: 2100,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    animation: 'slideDown 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}>
                    <Check size={18} color="var(--primary-apex)" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{toastMessage}</span>
                </div>
            )}



            {/* ─── Right Side Control Stack (Squad + Trip Recorder) ─── */}
            <div style={{
                position: 'absolute',
                bottom: 120,
                right: 20,
                zIndex: 'var(--z-overlay)',
                display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end'
            }}>
                {/* 1. Squad Button */}
                {(!drivingMode || true) && (
                    <button
                        className={`map-control-btn ${(squadEnabled || (drivingMode && drivingMode.memberCount > 0)) ? 'active-squad' : ''}`}
                        onClick={() => {
                            if (drivingMode && drivingMode.memberCount > 0) {
                                // Active Convoy Mode
                                setShowLeaveModal(true)
                            } else {
                                // Discover Mode
                                if (squadEnabled) {
                                    setSquadEnabled(false) // Toggle off immediately
                                    setToastMessage('Live location sharing disabled')
                                    setShowToast(true)
                                    setTimeout(() => setShowToast(false), 3000)
                                } else {
                                    setShowSquadModal(true)
                                }
                            }
                        }}
                        style={{
                            width: 48, height: 48, borderRadius: '50%',
                            background: (squadEnabled || (drivingMode && drivingMode.memberCount > 0)) ? 'rgba(0, 230, 118, 0.15)' : 'rgba(20, 20, 20, 0.8)',
                            backdropFilter: 'blur(12px)',
                            border: `1px solid ${(squadEnabled || (drivingMode && drivingMode.memberCount > 0)) ? '#00e676' : 'rgba(255,255,255,0.15)'}`,
                            color: (squadEnabled || (drivingMode && drivingMode.memberCount > 0)) ? '#00e676' : 'white',
                            display: (viewMode === 'list' || (!drivingMode && (isSheetOpen || selectedPOI || activeNavRoute || routeLoading))) ? 'none' : 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                            position: 'relative'
                        }}
                        title="Squad"
                    >
                        <Users size={20} />
                        {(drivingMode && drivingMode.memberCount > 0) && (
                            <div style={{
                                position: 'absolute', top: -4, right: -4,
                                background: '#00e676', color: 'black',
                                fontSize: 10, fontWeight: 800,
                                minWidth: 16, height: 16, borderRadius: 8,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid rgba(20,20,20,1)'
                            }}>
                                {drivingMode.members?.length || drivingMode.memberCount}
                            </div>
                        )}
                    </button>
                )}

                {/* 2. Trip Recorder (Moved here) */}
                {drivingMode && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                        animation: 'slideInRight 0.3s ease'
                    }}>
                        {recordingState === 'idle' ? (
                            <button
                                className="map-control-btn"
                                onClick={() => setRecordingState('recording')}
                                title="Start Recording Trip"
                                style={{
                                    width: 48, height: 48, borderRadius: '50%',
                                    background: 'rgba(20, 20, 20, 0.8)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#ff1744',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                                }}
                            >
                                <Circle fill="#ff1744" size={20} />
                            </button>
                        ) : (
                            <div style={{
                                background: 'rgba(20, 20, 20, 0.8)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: 32,
                                padding: '6px 6px 6px 16px',
                                display: 'flex', alignItems: 'center', gap: 12,
                                border: '1px solid rgba(255, 23, 68, 0.3)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                            }}>
                                <div style={{
                                    fontFamily: 'monospace', fontSize: 14, fontWeight: 700,
                                    color: '#ff1744', display: 'flex', alignItems: 'center', gap: 6
                                }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%', background: '#ff1744',
                                        animation: recordingState === 'recording' ? 'pulse 1.5s infinite' : 'none',
                                        opacity: recordingState === 'paused' ? 0.5 : 1
                                    }} />
                                    {formatDuration(recordingDuration)}
                                </div>

                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button
                                        onClick={() => setRecordingState(prev => prev === 'recording' ? 'paused' : 'recording')}
                                        style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: 'none', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {recordingState === 'recording' ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                                    </button>
                                    <button
                                        onClick={handleStopRecording}
                                        style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: '#ff1744',
                                            border: 'none', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Square size={14} fill="white" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ─── Route Loading Indicator ─── */}
            {routeLoading && (
                <div style={{
                    position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(20, 20, 20, 0.9)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32,
                    padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10,
                    zIndex: 2100, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    animation: 'slideDown 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}>
                    <div style={{
                        width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)',
                        borderTopColor: '#4285f4', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Calculating route...</span>
                </div>
            )}

            {/* ─── Active Route Planning Panel ─── */}
            {!drivingMode && activeNavRoute && !routeLoading && (
                <RoutePlanningPanel
                    route={activeNavRoute}
                    routes={availableRoutes} // Pass all options
                    onSelectRoute={setActiveNavRoute}
                    onCancel={() => {
                        setActiveNavRoute(null)
                        setAvailableRoutes([])
                        setRouteStops([])
                    }}
                    onAddStop={handleAddStop}
                    onStart={() => {
                        // Start driving mode with this route
                        onStartDrive?.({
                            ...activeNavRoute,
                            title: activeNavRoute.destinationName,
                            // If it's a solo drive, memberCount undefined is fine
                        })
                    }}
                    onConvoy={handleFormConvoy}
                    userLocation={userLocation}
                />
            )}

            {/* ─── Squad GDPR Modal ─── */}
            {showSquadModal && (
                <div className="squad-modal-overlay">
                    <div className="squad-modal">
                        <Users size={48} color="#00e676" style={{ marginBottom: 16 }} />
                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'white' }}>Activate radar</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
                            To see other drivers and form convoys, we need to share your live location with nearby users.
                            Your data is encrypted and only visible to active squad members.
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setShowSquadModal(false)}
                                className="btn-glass"
                                style={{ flex: 1, justifyContent: 'center', height: 44 }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setSquadEnabled(true)
                                    setShowSquadModal(false)
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(() => { }, () => { })
                                    }
                                }}
                                className="btn-primary"
                                style={{ flex: 1, justifyContent: 'center', height: 44 }}
                            >
                                <Check size={16} style={{ marginRight: 6 }} /> Enable
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Leave Convoy Modal ─── */}
            {showLeaveModal && (
                <div className="squad-modal-overlay">
                    <div className="squad-modal">
                        <Users size={48} color="#ff1744" style={{ marginBottom: 16 }} />
                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'white' }}>Leave Convoy?</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
                            You will stop sharing your location and will no longer see other convoy members. Navigation will continue in solo mode.
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setShowLeaveModal(false)}
                                className="btn-glass"
                                style={{ flex: 1, justifyContent: 'center', height: 44 }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLeaveModal(false)
                                    setSquadEnabled(false)
                                    if (onStartDrive && drivingMode) {
                                        onStartDrive({ ...drivingMode, memberCount: 0, members: [] }) // Restart drive without members
                                    }
                                    if (onLeaveConvoy) onLeaveConvoy()
                                    setToastMessage('Left convoy')
                                    setShowToast(true)
                                    setTimeout(() => setShowToast(false), 3000)
                                }}
                                className="btn-primary"
                                style={{ flex: 1, justifyContent: 'center', height: 44, background: '#ff1744', boxShadow: '0 4px 16px rgba(255, 23, 68, 0.4)' }}
                            >
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Driver Convoy Request Modal ─── */}
            {selectedDriver && (
                <div className="squad-modal-overlay">
                    <div className="squad-modal">
                        <div style={{
                            width: 56, height: 56, borderRadius: '50%',
                            background: 'rgba(0, 230, 118, 0.15)',
                            border: '2px solid #00e676',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 16
                        }}>
                            <Users size={28} color="#00e676" />
                        </div>
                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'white' }}>Request convoy</h3>
                        <p style={{ fontSize: 15, color: 'var(--primary-apex)', fontWeight: 600, marginBottom: 12 }}>
                            {selectedDriver.name} · {selectedDriver.vehicle}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
                            This will set up a new convoy and send a request to {selectedDriver.name.split(' ')[0]} to join your group drive.
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setSelectedDriver(null)}
                                className="btn-glass"
                                style={{ flex: 1, justifyContent: 'center', height: 44 }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (onRequestConvoy) onRequestConvoy(selectedDriver)
                                    setSelectedDriver(null)
                                }}
                                className="btn-primary"
                                style={{ flex: 1, justifyContent: 'center', height: 44 }}
                            >
                                <Users size={16} style={{ marginRight: 6 }} /> Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Route Overview Sheet */}
            {selectedRoute && !detailRoute && (
                <RouteOverviewSheet
                    route={selectedRoute}
                    onClose={handleCloseSheet}
                    onExpand={handleExpandToDetail}
                    onStartDrive={async () => {
                        if (!userLocation) {
                            alert('Waiting for your location...')
                            return
                        }
                        const route = selectedRoute
                        const startCoords = route.coordinates?.start
                        if (!startCoords) {
                            alert('No start coordinates for this route.')
                            return
                        }
                        setRouteLoading(true)
                        setSelectedRoute(null)
                        setFlyToTarget(null)
                        try {
                            // Calculate approach: current location → route start point
                            const result = await calculateRoute(userLocation, startCoords)
                            const approachRoute = Array.isArray(result) ? result[0] : result

                            // Approach geometry only (A→B) — the curated route (B→…→B)
                            // is kept visible in orange separately via drivenCuratedRoute
                            const approachGeometry = approachRoute?.geometry || []

                            // Combined totals (distance in km, duration in minutes) for TBT stats
                            const totalDistance = (approachRoute?.distance || 0) + (route.distance || 0)
                            const totalDuration = (approachRoute?.duration || 0) + (route.duration || 0)

                            const navRoute = {
                                geometry: approachGeometry,   // blue line = approach only
                                distance: totalDistance,       // TBT shows full journey totals
                                duration: totalDuration,
                                destinationName: route.name,
                                destinationCoords: route.coordinates?.end || startCoords,
                                title: route.name,
                            }

                            // Keep the curated route visible in orange as a map backdrop
                            setDrivenCuratedRoute(route)

                            // Set activeNavRoute for the approach line + TBT stats
                            setActiveNavRoute(navRoute)
                            setAvailableRoutes([])

                            // Fly to show both the approach line and the full curated route
                            const allPoints = [
                                ...approachGeometry.map(pt => ({ lat: pt[0], lng: pt[1] })),
                                ...(route.path || [])
                            ]
                            // User requested "no zoom out effect" during active navi
                            /* if (allPoints.length > 0 && !drivingMode) {
                                setFlyToTarget({
                                    path: allPoints,
                                    paddingOptions: { paddingTopLeft: [50, 50], paddingBottomRight: [50, 120] }
                                })
                            } */

                            // Go directly into driving mode — skip RoutePlanningPanel
                            // Go directly into driving mode — skip RoutePlanningPanel
                            onStartDrive?.({
                                ...navRoute,
                                coordinates: route.coordinates,
                            })
                        } catch (err) {
                            console.error('Failed to calculate approach route:', err)
                            alert('Could not calculate route. Please try again.')
                        } finally {
                            setRouteLoading(false)
                        }
                    }}
                    onFormConvoy={handleFormConvoy}
                    isFavorite={favorites.has(selectedRoute.id)}
                    isBucketListed={bucketList.has(selectedRoute.id)}
                    onToggleFavorite={() => onToggleFavorite(selectedRoute.id)}
                    onToggleBucketList={() => onToggleBucketList(selectedRoute.id)}
                    userLocation={userLocation}
                    onSave={() => handleEditorSave(selectedRoute)}
                    onDiscard={() => {
                        setSelectedRoute(null)
                        setFlyToTarget(null)
                    }}
                />
            )}

            {/* Full Route Detail Sheet */}
            {detailRoute && (
                <RouteDetailSheet
                    route={detailRoute}
                    onClose={handleCloseDetail}
                    onStartDrive={() => handleStartDrive()}
                    onFormConvoy={handleFormConvoy}
                    isFavorite={favorites.has(detailRoute.id)}
                    isBucketListed={bucketList.has(detailRoute.id)}
                    onToggleFavorite={() => onToggleFavorite(detailRoute.id)}
                    onToggleBucketList={() => onToggleBucketList(detailRoute.id)}
                />
            )}

            {/* AI Modal */}
            {showAI && (
                <AIArchitectModal
                    onClose={() => setShowAI(false)}
                    onRouteGenerated={handleAIGenerated}
                    userLocation={userLocation}
                />
            )}

            {/* Manual Route Planner (Pre-AI) */}
            {showManualPlanner && (
                <ManualRoutePlanner
                    onClose={() => setShowManualPlanner(false)}
                    onAIEntry={() => {
                        setShowManualPlanner(false)
                        setTimeout(() => setShowAI(true), 10)
                    }}
                    onStart={async (place) => {
                        if (!place || !userLocation) return
                        setShowManualPlanner(false)
                        setRouteLoading(true)
                        try {
                            // 1. Reverse geocode start location for specific address
                            let startAddress = 'Current Location'
                            try {
                                const reversedStart = await reverseGeocode(userLocation.lat, userLocation.lng)
                                if (reversedStart) startAddress = reversedStart
                            } catch (e) { console.warn('Reverse geocode failed', e) }

                            // 2. Calculate routes
                            const results = await calculateRoute(userLocation, { lat: place.lat, lng: place.lng })
                            const best = Array.isArray(results) ? results[0] : results

                            if (best) {
                                // 3. Set Active Route with explicit addresses
                                const enrichedResults = (Array.isArray(results) ? results : [results]).map(r => ({
                                    ...r,
                                    destinationName: place.name,
                                    destinationAddress: place.details || place.address,
                                    startName: startAddress,
                                    destinationCoords: { lat: place.lat, lng: place.lng },
                                    surface: { asphalt: 100 },
                                    hazards: { potholes: 0, speedHumps: 0, unpaved: 0 },
                                    elevation: { gain: Math.floor(r.distance * 8), maxGradient: 4 }
                                }))
                                setAvailableRoutes(enrichedResults)
                                setActiveNavRoute(enrichedResults[0])
                                // View top down
                                setFlyToTarget({
                                    path: best.geometry.map(p => ({ lat: p[0], lng: p[1] })),
                                    paddingOptions: { paddingTopLeft: [50, 50], paddingBottomRight: [50, 400] }
                                })
                            }
                        } catch (err) {
                            console.error('Manual start error:', err)
                        } finally {
                            setRouteLoading(false)
                        }
                    }}
                />
            )}

            {/* Route Editor Overlay */}
            {viewMode === 'editor' && generatedRoute && (
                <RouteEditor
                    route={generatedRoute}
                    onSave={handleEditorSave}
                    onCancel={handleEditorCancel}
                    onUpdatePreview={handleEditorPreviewUpdate}
                />
            )}

            {/* In-Navigation Add Stop Search */}
            {showAddStopSearch && (
                <AddStopSearch
                    onClose={() => setShowAddStopSearch(false)}
                    location={userLocation}
                    onSelect={async (place) => {
                        setShowAddStopSearch(false)
                        if (!activeNavRoute || !userLocation) return

                        const currentDest = activeNavRoute.destinationCoords
                        // 1. Calculate Multi-Stop Route: User -> New Stop -> Original Dest
                        setRouteLoading(true)
                        try {
                            const newRouteParams = [
                                userLocation,
                                { lat: place.lat, lng: place.lng },
                                currentDest
                            ]
                            const result = await calculateMultiStopRoute(newRouteParams)

                            if (result) {
                                // Update Active Route
                                setActiveNavRoute({
                                    ...activeNavRoute,
                                    ...result,
                                    // Append stop name to title or keep original? 
                                    // Let's keep original destination name but maybe add a "via" text later.
                                    // For now, just updating geometry/stats is enough.
                                })
                                setToastMessage(`Added stop: ${place.name}`)
                                setShowToast(true)
                                setTimeout(() => setShowToast(false), 4000)
                            } else {
                                alert('Could not calculate route to stop.')
                            }
                        } catch (e) {
                            console.error('Add stop failed', e)
                        } finally {
                            setRouteLoading(false)
                        }
                    }}
                />
            )}


            {/* ─── Minimalist Member HUD (Top Left, below TBT) ─── */}
            {drivingMode && (squadEnabled || (drivingMode && drivingMode.memberCount > 0)) && (
                <div style={{
                    position: 'absolute',
                    top: 160, // Below TurnByTurnPanel
                    left: 20,
                    zIndex: 'var(--z-overlay)',
                    display: 'flex', flexDirection: 'column', gap: 6,
                    pointerEvents: 'none'
                }}>
                    {displayMembers.filter(m => m.id !== '1' && m.name !== 'You').map((m, idx) => (
                        <div key={m.id || idx} style={{ display: 'flex', alignItems: 'center', gap: 12, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            <span style={{ color: 'white', fontWeight: 600, fontSize: 18, fontFamily: 'var(--font-display)' }}>{m.name}</span>
                            <span style={{ color: '#ff6d00', fontWeight: 700, fontSize: 18, fontFamily: 'monospace' }}>{m.distance}m</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


// ─── Helper: Category Row ───
const RouteCategoryRow = ({ title, routes, onRouteClick, showCreateCard, onCreateRoute, createCardPosition = 'start' }) => {
    if (!routes || routes.length === 0 && !showCreateCard) return null

    const CreateCard = (
        <div
            onClick={onCreateRoute}
            style={{
                minWidth: '140px', height: '300px',
                borderRadius: 24,
                background: 'rgba(255,255,255,0.05)',
                border: '1px dashed rgba(255,255,255,0.2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0
            }}
        >
            <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--primary-apex)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
                boxShadow: '0 4px 16px rgba(255,95,31,0.4)'
            }}>
                <Sparkles size={24} color="white" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Create</span>
        </div>
    )

    return (
        <div>
            <div style={{ padding: '0 20px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: 'white', fontFamily: 'var(--font-display)' }}>{title}</h3>
            </div>
            <div className="no-scrollbar" style={{
                display: 'flex', gap: 16,
                padding: '0 20px', overflowX: 'auto',
                paddingBottom: 20
            }}>
                {showCreateCard && createCardPosition === 'start' && CreateCard}

                {routes.map(route => (
                    <RouteCard
                        key={route.id}
                        route={route}
                        onClick={() => onRouteClick(route)}
                    />
                ))}

                {showCreateCard && createCardPosition === 'end' && CreateCard}
            </div>

        </div>
    )
}

export default Discover
