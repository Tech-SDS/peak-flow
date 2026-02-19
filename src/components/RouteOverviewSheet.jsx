import React, { useState } from 'react'
import { Navigation, Heart, Users, Star, MapPin, Clock, Infinity, ArrowLeft, Trash2, Save } from 'lucide-react'
import SSSInfoCard from './SSSInfoCard'
import RouteSummaryCard from './RouteSummaryCard'
import { formatDuration } from '../lib/sssEngine'

const formatTime = (minutes) => {
    if (!minutes) return '0 min'
    if (minutes < 60) return `${minutes} min`
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}min`
}

const RouteOverviewSheet = ({
    route,
    onClose,
    onExpand,
    onStartDrive,
    onFormConvoy,
    isFavorite,
    isBucketListed,
    onToggleFavorite,
    onToggleBucketList,
    userLocation,
    onSave,
    onDiscard
}) => {
    const [showSSSInfo, setShowSSSInfo] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [dragStartY, setDragStartY] = useState(null)

    // Touch Handlers for Drag
    const onTouchStart = (e) => {
        setDragStartY(e.touches[0].clientY)
    }

    const onTouchMove = (e) => {
        if (!dragStartY) return
        const currentY = e.touches[0].clientY
        // Dragging UP = negative diff if start > current (wait, simple logic: start - current)
        // If start=500, current=400, diff=100 (dragged up)
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

    // Haversine Distance Calculation
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null
        const R = 6371 // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180)
        const dLon = (lon2 - lon1) * (Math.PI / 180)
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const d = R * c // Distance in km
        return d
    }

    const distanceToStart = route?.coordinates?.start && userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, route.coordinates.start.lat, route.coordinates.start.lng)
        : null

    if (!route) return null

    return (
        <>
            <div
                className="glass-sheet"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                    position: 'absolute', bottom: 0,
                    left: 0, right: 0,
                    // left: '50%', transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: 'none',
                    height: isExpanded ? '92vh' : '460px', // Increased from 420px for better sneak peek
                    transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 'var(--z-panel)',
                    borderTopLeftRadius: 24, borderTopRightRadius: 24,
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
                }}
            >
                {/* ─── Hero Image with Drag Handle Overlay ─── */}
                <div style={{ position: 'relative', height: 140, flexShrink: 0, cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
                    <img
                        src={route.image || `https://picsum.photos/seed/${route.id}/800/400`}
                        alt={route.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, #1a1d24, #2c3e50)' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)'
                    }} />

                    {/* Drag Handle */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                    }}>
                        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.4)' }} />
                    </div>

                    {/* Back Button (Top Left Overlay) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onClose()
                        }}
                        style={{
                            position: 'absolute', top: 12, left: 12,
                            zIndex: 10,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: 36, height: 36,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '4px 20px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, marginBottom: 4 }} className="truncate-2">
                                {route.name}
                            </h2>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                {route.authorVerified ? 'Verified Route' : 'Community Route'} • by {route.author}
                            </p>
                        </div>
                        {/* SSS Badge */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowSSSInfo(true); }}
                            style={{
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                                padding: '6px 10px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                cursor: 'help', flexShrink: 0
                            }}
                        >
                            <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary-apex)', lineHeight: 1 }}>{route.sss}</span>
                            <span style={{ fontSize: 8, color: 'var(--text-secondary)', fontWeight: 600 }}>SSS</span>
                        </button>
                    </div>

                    {/* Meta Row with Icons */}
                    <div style={{
                        display: 'flex', gap: 12, marginBottom: 16,
                        padding: '12px 0',
                        borderTop: '1px solid rgba(255,255,255,0.06)'
                    }}>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 16,
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <MapPin size={18} color="var(--primary-apex)" />
                            <div>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Distance</p>
                                <p style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{route.distance} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>km</span></p>
                            </div>
                        </div>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 16,
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <Clock size={18} color="var(--primary-apex)" />
                            <div>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Duration</p>
                                <p style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{formatTime(route.duration)}</p>
                            </div>
                        </div>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 16,
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <Infinity size={18} color="var(--primary-apex)" />
                            <div>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Curviness</p>
                                <p style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{route.curvinessIndex || '—'}<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>/5</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expanded Details Section - Always rendered for preview */}
                <div style={{
                    flex: 1,
                    overflowY: isExpanded ? 'auto' : 'hidden',
                    padding: '0 20px 20px',
                    position: 'relative' // For absolute positioning of fade
                }} className="no-scrollbar">
                    {/* Fade Overlay for Collapsed State */}
                    {!isExpanded && (
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
                            background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0), rgba(15, 17, 21, 1))',
                            zIndex: 10, pointerEvents: 'none'
                        }} />
                    )}


                    {/* Expanded Details Section (Surface, Hazards, Elevation) */}
                    {/* Unified Route Summary (Itinerary) - Moved Up */}
                    <div style={{ marginTop: 24, marginBottom: 24 }}>
                        <RouteSummaryCard
                            route={route}
                            userLocation={userLocation}
                            readOnly={true}
                        />
                    </div>

                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Route Details
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
                        {route.description || route.details || "A scenic route through the best driving roads in the region. Features a mix of tight hairpins and sweeping curves."}
                    </p>

                    {/* ─── Route Attributes Grid ─── */}
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

                    {/* Mock Waypoints / Stops */}

                </div>


                {/* Action Bar — 2 CTAs only in preview */}
                <div style={{
                    padding: '0 20px 20px',
                    display: 'flex', gap: 10,
                    alignItems: 'center',
                    marginTop: 'auto' // Push to bottom if expanded
                }}>
                    {route.isGenerated ? (
                        <>

                            {/* Save */}
                            <button onClick={() => {
                                onSave()
                                alert("Route saved to 'My Routes'")
                            }} className="btn-glass" style={{
                                flex: 1, padding: '14px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                fontSize: 14, fontWeight: 600
                            }}>
                                <Save size={18} /> Save
                            </button>

                            {/* Start Navigation */}
                            <button onClick={onStartDrive} className="btn-primary" style={{
                                flex: 2, padding: '12px 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                fontSize: 15, fontWeight: 700
                            }}>
                                <Navigation size={18} />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span>Start</span>
                                    {distanceToStart !== null && (
                                        <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>
                                            {Math.round(distanceToStart)} km to start
                                        </span>
                                    )}
                                </div>
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={onStartDrive} className="btn-primary" style={{
                                flex: 2, padding: '12px 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                fontSize: 15, fontWeight: 700
                            }}>
                                <Navigation size={16} />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span>Start Navigation</span>
                                    <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>
                                        Distance to start: {distanceToStart ? Math.round(distanceToStart) : '?'} km
                                    </span>
                                </div>
                            </button>
                            <button onClick={onFormConvoy} className="btn-glass" style={{
                                flex: 1, padding: '14px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                fontSize: 14, fontWeight: 600
                            }}>
                                <Users size={16} /> Create convoy
                            </button>
                        </>
                    )}
                </div>
            </div >

            {/* SSS Info Overlay */}
            {showSSSInfo && <SSSInfoCard onClose={() => setShowSSSInfo(false)} />}
        </>
    )
}

export default RouteOverviewSheet
