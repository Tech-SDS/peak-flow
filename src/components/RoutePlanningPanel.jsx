import React, { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, Clock, Navigation, MapPin, Users, Settings, Play, ArrowUp, ArrowRight, ArrowUpRight, ArrowUpLeft, Flag, Plus, Circle, Infinity, X, Search } from 'lucide-react'
import RouteSummaryCard from './RouteSummaryCard'
import { searchPlaces } from '../lib/searchService'

// Helper to format time (minutes -> h min) - matches RouteOverviewSheet
const formatTime = (minutes) => {
    if (!minutes) return '0 min'
    if (minutes < 60) return `${minutes} min`
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}min`
}

const RoutePlanningPanel = ({ route, routes, onSelectRoute, onStart, onCancel, onConvoy, onAddStop, userLocation }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [dragStartY, setDragStartY] = useState(null)

    // ─── Add Stop Search State ───
    const [showStopSearch, setShowStopSearch] = useState(false)
    const [stopQuery, setStopQuery] = useState('')
    const [stopResults, setStopResults] = useState([])
    const [isSearchingStop, setIsSearchingStop] = useState(false)

    useEffect(() => {
        if (!stopQuery || stopQuery.length < 3) { setStopResults([]); return }
        setIsSearchingStop(true)
        const timer = setTimeout(async () => {
            const results = await searchPlaces(stopQuery, 5)
            setStopResults(results)
            setIsSearchingStop(false)
        }, 350)
        return () => clearTimeout(timer)
    }, [stopQuery])

    const handleSelectStop = (place) => {
        onAddStop?.(place)
        setShowStopSearch(false)
        setStopQuery('')
        setStopResults([])
    }

    const closeStopSearch = () => {
        setShowStopSearch(false)
        setStopQuery('')
        setStopResults([])
    }

    // Touch Handlers for Drag
    const onTouchStart = (e) => {
        setDragStartY(e.touches[0].clientY)
    }

    const onTouchMove = (e) => {
        if (!dragStartY) return
        const currentY = e.touches[0].clientY
        // Dragging UP = start > current
        const diff = dragStartY - currentY

        if (diff > 50 && !isExpanded) {
            setIsExpanded(true)
            setDragStartY(null)
        } else if (diff < -50 && isExpanded) {
            setIsExpanded(false)
            setDragStartY(null)
        }
    }

    const onTouchEnd = () => {
        setDragStartY(null)
    }

    if (!route) return null

    // Generate a consistent "Curviness" for the UI if not present (mocking for manual routes)
    const curviness = route.curvinessIndex || (route.id ? (route.id.charCodeAt(0) % 5) + 1 : 3)
    // Cover Image: Use route image or picsum fallback based on destination
    const coverImage = route.image || `https://picsum.photos/seed/${route.destinationName || 'route'}/800/400`

    return (
        <div
            className="glass-sheet"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0, right: 0,
                // left: '50%', transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: 'none',
                height: isExpanded ? '92vh' : '400px',
                transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 'var(--z-panel)',
                borderTopLeftRadius: 24, borderTopRightRadius: 24,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
                pointerEvents: 'auto',
            }}
        >
            {/* ─── Hero Image with Drag Handle Overlay ─── */}
            <div style={{ position: 'relative', height: 140, flexShrink: 0, cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
                <img
                    src={coverImage}
                    alt={route.destinationName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, #1a1d24, #2c3e50)' }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(20, 24, 32, 1) 100%)' // Fade to background color at bottom
                }} />

                {/* Drag Handle */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.4)' }} />
                </div>

                {/* Back Button (Top Left) - Overlaid on Image */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onCancel()
                    }}
                    style={{
                        position: 'absolute', top: 12, left: 12,
                        zIndex: 30,
                        background: 'rgba(0,0,0,0.4)',
                        border: 'none', borderRadius: '50%',
                        width: 32, height: 32,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <ArrowLeft size={18} />
                </button>
            </div>

            {/* ─── Content ─── */}
            {/* Negative margin to pull up over the gradient fade if desired, or just standard padding */}
            <div style={{ padding: '0 20px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, marginBottom: 4 }} className="truncate-2">
                            {route.destinationName}
                        </h2>
                        {route.destinationAddress && (
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                {route.destinationAddress}
                            </p>
                        )}
                    </div>
                </div>

                {/* Route Options (if multiple) */}
                {routes && routes.length > 1 && (
                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, marginBottom: 10 }} className="no-scrollbar">
                        {routes.map((r, idx) => {
                            const isSelected = r.id === route.id
                            return (
                                <div
                                    key={r.id || idx}
                                    onClick={() => onSelectRoute && onSelectRoute(r)}
                                    style={{
                                        minWidth: 100,
                                        padding: '10px 12px',
                                        background: isSelected ? 'rgba(255, 95, 31, 0.15)' : 'rgba(255,255,255,0.05)',
                                        border: isSelected ? '1px solid var(--primary-apex)' : '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 12,
                                        cursor: 'pointer',
                                        opacity: isSelected ? 1 : 0.6,
                                        display: 'flex', flexDirection: 'column', gap: 4
                                    }}
                                >
                                    <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? 'var(--primary-apex)' : 'var(--text-secondary)' }}>
                                        {r.label || (idx === 0 ? 'Fastest' : `Option ${idx + 1}`)}
                                    </span>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>
                                        {formatTime(r.duration)}
                                    </span>
                                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                        {r.distance} km
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* ─── Add Stop ─── */}
                {!showStopSearch ? (
                    <button
                        onClick={() => setShowStopSearch(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px dashed rgba(255,255,255,0.2)',
                            borderRadius: 10, padding: '8px 14px',
                            color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', marginBottom: 12, alignSelf: 'flex-start'
                        }}
                    >
                        <Plus size={15} /> Add stop
                    </button>
                ) : (
                    <div style={{ marginBottom: 12 }}>
                        {/* Search input row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <div style={{
                                flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 10, padding: '8px 12px'
                            }}>
                                <Search size={14} color="var(--text-muted)" />
                                <input
                                    autoFocus
                                    value={stopQuery}
                                    onChange={e => setStopQuery(e.target.value)}
                                    placeholder="Search for a stop..."
                                    style={{
                                        flex: 1, background: 'none', border: 'none', outline: 'none',
                                        color: 'white', fontSize: 13, fontFamily: 'inherit'
                                    }}
                                />
                                {isSearchingStop && (
                                    <div style={{
                                        width: 12, height: 12,
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        borderTopColor: 'white', borderRadius: '50%',
                                        animation: 'spin 0.7s linear infinite', flexShrink: 0
                                    }} />
                                )}
                            </div>
                            <button
                                onClick={closeStopSearch}
                                style={{
                                    background: 'rgba(255,255,255,0.06)', border: 'none',
                                    borderRadius: '50%', width: 32, height: 32,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0
                                }}
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Results list */}
                        {stopResults.length > 0 && (
                            <div style={{
                                background: 'rgba(20,20,20,0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10, overflow: 'hidden'
                            }}>
                                {stopResults.map((place, i) => (
                                    <button
                                        key={place.id || i}
                                        onClick={() => handleSelectStop(place)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '10px 12px', background: 'none', border: 'none',
                                            borderBottom: i < stopResults.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                            color: 'white', cursor: 'pointer', textAlign: 'left'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <MapPin size={14} color="var(--primary-apex)" flexShrink={0} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{place.name}</div>
                                            {place.details && (
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{place.details}</div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Action Bar (Conditionally Rendered) ─── */}
                {!isExpanded && (
                    <div style={{
                        padding: '10px 0 20px',
                        display: 'flex', gap: 10,
                        alignItems: 'center',
                    }}>
                        <button onClick={onStart} className="btn-primary" style={{
                            flex: 2, padding: '12px 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            fontSize: 15, fontWeight: 700
                        }}>
                            <Navigation size={16} />
                            <span>Start Navigation</span>
                        </button>
                        <button onClick={onConvoy} className="btn-glass" style={{
                            flex: 1, padding: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            fontSize: 14, fontWeight: 600
                        }}>
                            <Users size={16} /> Create convoy
                        </button>
                    </div>
                )}

                {/* Unified Route Summary */}
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20, minHeight: 0 }} className="no-scrollbar">
                    <RouteSummaryCard
                        route={route}
                        userLocation={userLocation}
                        showHeader={true}
                    />
                    {/* ─── Route Details (Surface, Hazards, Elevation) ─── */}
                    <div style={{ padding: '0 20px 0' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Route Details
                        </div>
                        {/* Route Attributes Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                            {/* Surface Types */}
                            {route.surface && (
                                <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)' }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Surface</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {Object.entries(route.surface).map(([type, pct]) => pct > 0 && (
                                            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                                <div style={{ flex: 1, textTransform: 'capitalize' }}>{type}</div>
                                                <div style={{ fontWeight: 700, color: 'var(--primary-apex)' }}>{pct}%</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Hazards / Alerts */}
                            {route.hazards && (
                                <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)' }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Alerts</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                            <span style={{ color: route.hazards.potholes > 0 ? '#ff4444' : 'var(--text-muted)' }}>●</span>
                                            <span style={{ color: route.hazards.potholes > 0 ? 'white' : 'var(--text-muted)' }}>Potholes: {route.hazards.potholes > 0 ? 'Yes' : 'None'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                            <span style={{ color: route.hazards.speedHumps > 0 ? '#ffbb33' : 'var(--text-muted)' }}>●</span>
                                            <span style={{ color: route.hazards.speedHumps > 0 ? 'white' : 'var(--text-muted)' }}>Speed Humps: {route.hazards.speedHumps}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                            <span style={{ color: route.hazards.unpaved > 0 ? '#ffbb33' : 'var(--text-muted)' }}>●</span>
                                            <span style={{ color: route.hazards.unpaved > 0 ? 'white' : 'var(--text-muted)' }}>Unpaved: {route.hazards.unpaved > 0 ? 'Yes' : 'None'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Elevation Profile (Simple Stats) */}
                        {route.elevation && (
                            <div style={{ marginBottom: 24, padding: '0 4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                    <span>Elevation Gain</span>
                                    <span style={{ color: 'white', fontWeight: 700 }}>+{route.elevation.gain}m</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
                                    <span>Max Gradient</span>
                                    <span style={{ color: 'white', fontWeight: 700 }}>{route.elevation.maxGradient}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Bar (Expanded Mode - Pinned to bottom) */}
                {isExpanded && (
                    <div style={{
                        padding: '0 0 20px',
                        display: 'flex', gap: 10,
                        alignItems: 'center',
                        marginTop: 'auto',
                        flexShrink: 0
                    }}>
                        <button onClick={onStart} className="btn-primary" style={{
                            flex: 2, padding: '12px 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            fontSize: 15, fontWeight: 700
                        }}>
                            <Navigation size={16} />
                            <span>Start Navigation</span>
                        </button>
                        <button onClick={onConvoy} className="btn-glass" style={{
                            flex: 1, padding: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            fontSize: 14, fontWeight: 600
                        }}>
                            <Users size={16} /> Create convoy
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default RoutePlanningPanel
