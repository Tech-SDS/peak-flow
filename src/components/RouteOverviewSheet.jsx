import React, { useState, useEffect, useCallback } from 'react'
import { Navigation, Heart, Users, Star, MapPin, Clock, Infinity, ArrowLeft, Trash2, Save } from 'lucide-react'
import SSSInfoCard from './SSSInfoCard'
import RouteSummaryCard from './RouteSummaryCard'
import RouteDetailsSection from './RouteDetailsSection'
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
    const [isSaved, setIsSaved] = useState(false)
    const [toast, setToast] = useState(null) // { message, key }

    // Auto-dismiss toast
    useEffect(() => {
        if (!toast) return
        const t = setTimeout(() => setToast(null), 2200)
        return () => clearTimeout(t)
    }, [toast])

    const showToast = useCallback((msg) => {
        setToast({ message: msg, key: Date.now() })
    }, [])

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
                    width: '100%',
                    maxWidth: 'none',
                    height: isExpanded ? '92vh' : '460px',
                    transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 500, /* Must be above NavDock (z-dock: 400) */
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
                            <h2 style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.1, marginBottom: 4, fontFamily: 'var(--font-display)' }} className="truncate-2">
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
                    position: 'relative', // For absolute positioning of fade
                    minHeight: 0
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

                    <RouteDetailsSection route={route} />

                    {/* Mock Waypoints / Stops */}

                </div>


                {/* ─── Unified Action Bar ─── */}
                <div style={{
                    padding: '12px 20px',
                    paddingBottom: 90, /* Clear NavDock (80px + safe area) */
                    display: 'flex', gap: 8,
                    alignItems: 'center',
                    marginTop: 'auto',
                    flexShrink: 0,
                    borderTop: '1px solid rgba(255,255,255,0.06)'
                }}>
                    {/* Start Navigation */}
                    <button onClick={onStartDrive} className="btn-primary" style={{
                        flex: 2, padding: '10px 14px', height: 44,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        fontSize: 14, fontWeight: 700
                    }}>
                        <Navigation size={15} />
                        <span>Start</span>
                        {distanceToStart !== null && (
                            <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>
                                · {Math.round(distanceToStart)} km away
                            </span>
                        )}
                    </button>

                    {/* Create Convoy */}
                    <button onClick={onFormConvoy} className="btn-glass" style={{
                        padding: '10px 14px', height: 44,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        fontSize: 13, fontWeight: 600
                    }}>
                        <Users size={15} /> Convoy
                    </button>

                    {/* Save (for user/AI-generated routes) */}
                    {onSave && (
                        <button onClick={() => {
                            const willSave = !isSaved
                            setIsSaved(willSave)
                            if (willSave) onSave()
                            showToast(willSave ? '✓ Route saved' : 'Route unsaved')
                        }} className="action-icon-btn" style={{
                            width: 44, height: 44,
                            background: isSaved ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.1)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: isSaved ? '1px solid rgba(255,95,31,0.3)' : '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            color: isSaved ? 'var(--primary-apex)' : 'white',
                            transition: 'all 0.25s'
                        }} title={isSaved ? 'Saved' : 'Save route'}>
                            <Save size={18} fill={isSaved ? 'var(--primary-apex)' : 'none'} />
                        </button>
                    )}

                    {/* Wishlist (Star) */}
                    <button
                        className={`action-icon-btn ${isBucketListed ? 'star-active' : ''}`}
                        onClick={() => {
                            onToggleBucketList()
                            showToast(isBucketListed ? 'Removed from wishlist' : '⭐ Added to wishlist')
                        }}
                        style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: isBucketListed ? '#fbbf24' : 'white', transition: 'all 0.25s' }}
                        title="Add to wishlist"
                    >
                        <Star size={18} fill={isBucketListed ? '#fbbf24' : 'none'} />
                    </button>

                    {/* Favorite (Heart) */}
                    <button
                        className={`action-icon-btn ${isFavorite ? 'heart-active' : ''}`}
                        onClick={() => {
                            onToggleFavorite()
                            showToast(isFavorite ? 'Removed from favourites' : '❤️ Added to favourites')
                        }}
                        style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.25s' }}
                        title="Favourite"
                    >
                        <Heart size={18} fill={isFavorite ? '#ff1744' : 'none'} color={isFavorite ? '#ff1744' : 'white'} />
                    </button>
                </div>
            </div >

            {/* SSS Info Overlay */}
            {showSSSInfo && <SSSInfoCard onClose={() => setShowSSSInfo(false)} />}

            {/* Toast */}
            {toast && (
                <div key={toast.key} style={{
                    position: 'fixed',
                    bottom: 160, left: '50%', transform: 'translateX(-50%)',
                    padding: '10px 24px',
                    background: 'rgba(30,33,40,0.95)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 24,
                    color: 'white',
                    fontSize: 13, fontWeight: 600,
                    zIndex: 9999,
                    pointerEvents: 'none',
                    animation: 'fadeIn 0.2s ease, fadeOut 0.3s ease 1.9s forwards',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    whiteSpace: 'nowrap'
                }}>
                    {toast.message}
                </div>
            )}
        </>
    )
}

export default RouteOverviewSheet
