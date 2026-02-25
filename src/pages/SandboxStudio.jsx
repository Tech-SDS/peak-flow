import React, { useState, useRef, useCallback } from 'react'
import { ArrowLeft, Pause, Sliders, PlayCircle, Loader } from 'lucide-react'
import MapboxContainer from '../components/MapboxContainer'
import { MOCK_ROUTES } from '../lib/mockData'
import { calculateRoute } from '../lib/routing'

export default function SandboxStudio({ onBack }) {
    const defaultRoute = MOCK_ROUTES[1] // Alpine Pass Sprint

    const [selectedRoute, setSelectedRoute] = useState(defaultRoute)
    const [isFlyoverActive, setIsFlyoverActive] = useState(false)
    const [showUi, setShowUi] = useState(true)
    const [routeGeometry, setRouteGeometry] = useState(null)
    const [isLoadingRoute, setIsLoadingRoute] = useState(false)
    const [flyoverProgress, setFlyoverProgress] = useState(0)

    const mapContainerRef = useRef(null)
    const loadingControllerRef = useRef(null)

    const loadRoute = useCallback((route) => {
        if (!route?.coordinates) return
        loadingControllerRef.current?.abort()
        const ctrl = new AbortController()
        loadingControllerRef.current = ctrl

        setIsLoadingRoute(true)
        setRouteGeometry(null)
        setIsFlyoverActive(false)
        setShowUi(true)
        setFlyoverProgress(0)

        calculateRoute(route.coordinates.start, route.coordinates.end)
            .then(result => {
                if (ctrl.signal.aborted) return
                const firstRoute = Array.isArray(result) ? result[0] : result
                if (firstRoute?.geometry) setRouteGeometry(firstRoute.geometry)
                setIsLoadingRoute(false)
            })
            .catch(() => { if (!ctrl.signal.aborted) setIsLoadingRoute(false) })
    }, [])

    // Load on mount + when route changes
    React.useEffect(() => { loadRoute(selectedRoute) }, [selectedRoute, loadRoute])

    const startFlyover = () => {
        setFlyoverProgress(0)
        setIsFlyoverActive(true)
        setShowUi(false)
    }

    const stopFlyover = () => {
        setIsFlyoverActive(false)
        setShowUi(true)
    }

    const handleScrubChange = (e) => {
        const val = parseFloat(e.target.value)
        setFlyoverProgress(val)
        mapContainerRef.current?.seekToProgress(val)
    }

    const handleRouteSelect = (route) => {
        setSelectedRoute(route)
    }

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', background: 'black', overflow: 'hidden' }}>
            {/* Map */}
            <div style={{ position: 'absolute', inset: 0 }}>
                <MapboxContainer
                    ref={mapContainerRef}
                    route={selectedRoute}
                    routeGeometry={routeGeometry}
                    isFlyoverActive={isFlyoverActive}
                    onProgressUpdate={setFlyoverProgress}
                    onFlyoverComplete={() => {
                        setIsFlyoverActive(false)
                        setShowUi(true)
                    }}
                />
            </div>

            {/* UI Overlay — fades during flyover */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                transition: 'opacity 0.6s ease', opacity: showUi ? 1 : 0
            }}>
                {/* Top Nav */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    padding: '60px 20px 20px', display: 'flex', justifyContent: 'space-between',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
                    pointerEvents: showUi ? 'auto' : 'none'
                }}>
                    <button onClick={onBack} style={{
                        background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)', color: 'white',
                        width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{
                        background: 'rgba(0,0,0,0.45)', border: '1px solid var(--primary-apex)',
                        color: 'var(--primary-apex)', padding: '8px 16px', borderRadius: 20,
                        fontSize: 12, fontWeight: 700, letterSpacing: 1, backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', gap: 6
                    }}>
                        <Sliders size={14} /> 3D STUDIO
                    </div>
                </div>

                {/* Bottom Controls */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 20px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 20%, transparent)',
                    pointerEvents: showUi ? 'auto' : 'none', display: 'flex', flexDirection: 'column', gap: 16
                }}>
                    <div className="glass-panel" style={{ padding: 20, borderRadius: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{selectedRoute.name}</h2>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                    {selectedRoute.region} · {selectedRoute.distance} km
                                    {isLoadingRoute && <span style={{ color: 'var(--primary-apex)', marginLeft: 8 }}>· loading route...</span>}
                                </p>
                            </div>
                            <div style={{ background: 'rgba(255,95,31,0.15)', color: 'var(--primary-apex)', padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 800 }}>
                                {selectedRoute.curves} Curves
                            </div>
                        </div>

                        <button
                            onClick={startFlyover}
                            disabled={isLoadingRoute || !routeGeometry}
                            className="btn-primary"
                            style={{ width: '100%', padding: '16px', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, opacity: (isLoadingRoute || !routeGeometry) ? 0.4 : 1 }}
                        >
                            {isLoadingRoute ? <><Loader size={18} className="spin-icon" /> Loading road...</> : <><PlayCircle size={20} /> Cinematic Flyover</>}
                        </button>
                    </div>

                    {/* Route Selector Carousel */}
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10 }} className="no-scrollbar">
                        {MOCK_ROUTES.map(route => (
                            <div key={route.id} onClick={() => handleRouteSelect(route)} style={{
                                width: 140, flexShrink: 0, height: 80, borderRadius: 16, overflow: 'hidden', position: 'relative',
                                border: selectedRoute.id === route.id ? '2px solid var(--primary-apex)' : '2px solid transparent',
                                cursor: 'pointer', transition: 'transform 0.2s', transform: selectedRoute.id === route.id ? 'scale(1.05)' : 'scale(1)'
                            }}>
                                <img src={route.image} alt={route.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', display: 'flex', alignItems: 'flex-end', padding: 8 }}>
                                    <p style={{ fontSize: 10, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{route.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Flyover Controls — visible during flyover */}
            {isFlyoverActive && (
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '0 20px 40px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 60%, transparent)',
                    animation: 'fadeIn 0.5s ease'
                }}>
                    {/* Progress scrubber */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Route progress</span>
                            <span style={{ fontSize: 11, color: 'var(--primary-apex)', fontWeight: 700 }}>
                                {Math.round(flyoverProgress * selectedRoute.distance)} / {selectedRoute.distance} km
                            </span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.001"
                            value={flyoverProgress}
                            onChange={handleScrubChange}
                            style={{
                                width: '100%', height: 4, borderRadius: 2,
                                appearance: 'none', cursor: 'pointer',
                                background: `linear-gradient(to right, #ff5f1f ${flyoverProgress * 100}%, rgba(255,255,255,0.15) ${flyoverProgress * 100}%)`
                            }}
                        />
                    </div>

                    <button onClick={stopFlyover} style={{
                        width: '100%', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                        padding: '14px', borderRadius: 16, fontSize: 14, backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontWeight: 600
                    }}>
                        <Pause size={16} /> Stop Flyover
                    </button>
                </div>
            )}
        </div>
    )
}
