import React, { useState, useCallback, useEffect } from 'react'
import NavDock from './components/NavDock'
import Discover from './pages/Discover'
import Squad from './pages/Squad'
import Trips from './pages/Trips'
import Profile from './pages/Profile'
import SandboxStudio from './pages/SandboxStudio'
import { MOCK_TRIPS } from './lib/mockData'
import SplashScreen from './components/SplashScreen'

function App() {
    const [activeTab, setActiveTab] = useState('discover')

    // ─── User Lists State ───
    // ─── User Lists State ───
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('pf_favorites')
        return saved ? new Set(JSON.parse(saved)) : new Set()
    })
    const [bucketList, setBucketList] = useState(() => {
        const saved = localStorage.getItem('pf_bucketList')
        return saved ? new Set(JSON.parse(saved)) : new Set()
    })
    const [myRoutes, setMyRoutes] = useState(() => {
        const saved = localStorage.getItem('pf_myRoutes')
        return saved ? JSON.parse(saved) : []
    })
    const [trips, setTrips] = useState(() => {
        const saved = localStorage.getItem('pf_trips')
        return saved ? JSON.parse(saved) : [...MOCK_TRIPS]
    })

    // Persistence Hooks
    useEffect(() => { localStorage.setItem('pf_favorites', JSON.stringify([...favorites])) }, [favorites])
    useEffect(() => { localStorage.setItem('pf_bucketList', JSON.stringify([...bucketList])) }, [bucketList])
    useEffect(() => { localStorage.setItem('pf_myRoutes', JSON.stringify(myRoutes)) }, [myRoutes])
    useEffect(() => {
        if (trips.length === 0) {
            setTrips([...MOCK_TRIPS].slice(0, 2))
        } else {
            localStorage.setItem('pf_trips', JSON.stringify(trips))
        }
    }, [trips])

    const toggleFavorite = (id) => {
        setFavorites(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const toggleBucketList = (id) => {
        setBucketList(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    // ─── My Routes ───
    const addMyRoute = useCallback((route) => {
        setMyRoutes(prev => {
            if (prev.some(r => r.id === route.id)) return prev
            return [...prev, route]
        })
    }, [])

    const removeMyRoute = useCallback((id) => {
        setMyRoutes(prev => prev.filter(r => r.id !== id))
    }, [])

    // ─── Delete & Clear Handlers ───
    const removeTrip = useCallback((id) => {
        setTrips(prev => prev.filter(t => t.id !== id))
    }, [])

    const addTrip = useCallback((trip) => {
        setTrips(prev => [trip, ...prev])
    }, [])

    const clearTrips = useCallback(() => setTrips([]), [])
    const clearFavorites = useCallback(() => setFavorites(new Set()), [])
    const clearBucketList = useCallback(() => setBucketList(new Set()), [])
    const clearMyRoutes = useCallback(() => setMyRoutes([]), [])

    // ─── Cross-Tab Actions ───
    const [createMode, setCreateMode] = useState(false)
    const [squadEnabled, setSquadEnabled] = useState(false)
    const [activeConvoy, setActiveConvoy] = useState(null)
    const [initialSquadMembers, setInitialSquadMembers] = useState([])
    const [initialSquadRoute, setInitialSquadRoute] = useState(null)
    const [drivingMode, setDrivingMode] = useState(null) // { title, memberCount }
    const [isNavHidden, setIsNavHidden] = useState(false)

    const handleCreateRouteRequest = useCallback(() => {
        setActiveTab('discover')
        setCreateMode(true)
    }, [])

    const handleRequestConvoy = useCallback((data) => {
        // data can be a member object OR a valid route object OR an object containing { route, member }
        // For simplicity, let's assume if it has 'id' and 'name' but no 'coordinates', it's a member (unless it's a route with those props).
        // Better: Expect specific keys or handle distinct generic arguments.

        // Let's support an object: { member?: ..., route?: ... }
        if (data?.member) setInitialSquadMembers([data.member])
        if (data?.route) setInitialSquadRoute(data.route)

        // Fallback for legacy calls (if any) passing just a member
        if (data?.id && !data.coordinates && !data.route) {
            setInitialSquadMembers([data])
        }

        setActiveTab('squad')
    }, [])

    const handleStartDrive = useCallback((convoyData) => {
        setDrivingMode(convoyData) // { title, memberCount }
        setActiveTab('discover')
    }, [])

    const handleSquadEndDrive = useCallback(() => {
        setDrivingMode(null)
    }, [])

    const [initialDiscoverRoute, setInitialDiscoverRoute] = useState(null)

    const handleDiscoverEndDrive = useCallback(() => {
        setDrivingMode(null)
        setInitialDiscoverRoute(null)
        setActiveConvoy(null)
        setActiveTab('discover')
    }, [])

    const handleSelectDiscoverRoute = useCallback((route) => {
        setInitialDiscoverRoute(route)
        setActiveTab('discover')
    }, [])

    // ...



    const renderContent = () => {
        switch (activeTab) {
            // ...
            case 'squad': return (
                <Squad
                    myRoutes={myRoutes}
                    onConvoyChange={setActiveConvoy}
                    initialMembers={initialSquadMembers}
                    onClearInitialMembers={() => setInitialSquadMembers([])}
                    initialRoute={initialSquadRoute}
                    onClearInitialRoute={() => setInitialSquadRoute(null)}
                    onStartDrive={handleStartDrive}
                    onEndDrive={handleSquadEndDrive}
                    onBack={() => setActiveTab('discover')}
                    activeNavRoute={initialDiscoverRoute}
                    isSoloNavActive={!!drivingMode}
                />
            )
            case 'trips': return (
                <Trips
                    favorites={favorites}
                    bucketList={bucketList}
                    myRoutes={myRoutes}
                    trips={trips}
                    onToggleFavorite={toggleFavorite}
                    onToggleBucketList={toggleBucketList}
                    onRemoveTrip={removeTrip}
                    onRemoveMyRoute={removeMyRoute}
                    onClearTrips={clearTrips}
                    onClearFavorites={clearFavorites}
                    onClearBucketList={clearBucketList}
                    onClearMyRoutes={clearMyRoutes}
                    onCreateRoute={handleCreateRouteRequest}
                    onSelectRoute={handleSelectDiscoverRoute}
                />
            )
            case 'sandbox': return (
                <SandboxStudio onBack={() => setActiveTab('profile')} />
            )
            case 'profile': return <Profile onOpenSandbox={() => setActiveTab('sandbox')} />
            default: return (
                <Discover
                    favorites={favorites}
                    bucketList={bucketList}
                    onToggleFavorite={toggleFavorite}
                    onToggleBucketList={toggleBucketList}
                    onSaveMyRoute={addMyRoute}
                    onSaveTrip={addTrip}
                    createMode={createMode}
                    onResetCreateMode={() => setCreateMode(false)}
                    initialRoute={initialDiscoverRoute}
                    onClearInitialRoute={() => setInitialDiscoverRoute(null)}
                    onRequestConvoy={handleRequestConvoy}
                    drivingMode={drivingMode}
                    onStartDrive={handleStartDrive}
                    onEndDrive={handleDiscoverEndDrive}
                    squadEnabled={squadEnabled}
                    setSquadEnabled={setSquadEnabled}
                    onLeaveConvoy={() => setActiveConvoy(null)}
                />
            )
        }
    }

    const [showSplash, setShowSplash] = useState(true)

    return (
        <div className="app-container" style={{
            height: '100vh',
            width: '100vw',
            position: 'relative',
            overflow: 'hidden',
            background: '#000000', // Hard safety background
            color: 'white'
        }}>
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

            <main style={{ height: '100%' }}>
                {renderContent()}
            </main>
            {activeTab !== 'sandbox' && (
                <NavDock activeTab={activeTab} onTabChange={setActiveTab} activeConvoy={activeConvoy} hidden={!!drivingMode || isNavHidden} squadEnabled={squadEnabled} />
            )}
        </div>
    )
}

export default App

