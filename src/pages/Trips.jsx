import React, { useState, useRef, useEffect } from 'react'
import { Clock, Heart, Star, Route, Trash2, Share2, X } from 'lucide-react'
import TripCard from '../components/TripCard'
import RouteCard from '../components/RouteCard'
import PerformancePanel from '../components/PerformancePanel'
import { MOCK_ROUTES } from '../lib/mockData'
import { ROUTE_DATABASE } from '../lib/mockRoutes'

const Trips = ({
    favorites, bucketList, myRoutes = [], trips = [],
    onToggleFavorite, onToggleBucketList, onRemoveTrip, onRemoveMyRoute,
    onClearTrips, onClearFavorites, onClearBucketList, onClearMyRoutes,
    onSelectRoute, onCreateRoute
}) => {
    const [subTab, setSubTab] = useState('history')
    const [selectedTrip, setSelectedTrip] = useState(null)
    const [showPerformance, setShowPerformance] = useState(false)
    const [isFullscreenVideo, setIsFullscreenVideo] = useState(false)

    // Refs for video sync
    const inlineVideoRef = useRef(null)
    const [syncTime, setSyncTime] = useState(0)

    const tabs = [
        { key: 'history', label: 'History', icon: <Clock size={14} /> },
        { key: 'favorites', label: 'Favorites', icon: <Heart size={14} /> },
        { key: 'bucketList', label: 'Bucket List', icon: <Star size={14} /> },
        { key: 'myRoutes', label: 'My Routes', icon: <Route size={14} /> },
    ]

    const handleTripTap = (trip) => {
        setSelectedTrip(trip)
        setShowPerformance(false)
    }

    // Combine all known routes for lookups
    const ALL_ROUTES = [...ROUTE_DATABASE, ...MOCK_ROUTES]
    const findRoute = (id) => ALL_ROUTES.find(r => r.id === id)

    // Filter routes for lists
    const favoriteRoutes = [...favorites].map(findRoute).filter(Boolean)
    const bucketListRoutes = [...bucketList].map(findRoute).filter(Boolean)

    // ─── Delete button for individual items ───
    const DeleteBtn = ({ onClick }) => (
        <button
            onClick={(e) => { e.stopPropagation(); onClick() }}
            style={{
                position: 'absolute', top: 8, right: 8, zIndex: 10,
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(6px)'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.transform = 'scale(1)'
            }}
            title="Delete"
        >
            <Trash2 size={14} />
        </button>
    )

    // ─── Clear All button ───
    const ClearAllBtn = ({ onClick, label = 'Clear All' }) => (
        <button
            onClick={onClick}
            style={{
                width: '100%', padding: '14px',
                marginTop: 12,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                color: 'var(--text-secondary)',
                fontWeight: 600, fontSize: 13,
                fontFamily: 'var(--font-main)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.color = 'var(--text-secondary)'
            }}
        >
            <Trash2 size={14} /> {label}
        </button>
    )

    return (
        <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '56px 20px 0', flexShrink: 0 }}>
                <h1 style={{ fontSize: 32, fontWeight: 500, marginBottom: 4, fontFamily: 'var(--font-display)' }}>Trips</h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                    Your drive memories & future adventures
                </p>

                {/* Sub-tabs */}
                <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(255,255,255,0.04)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setSubTab(tab.key); setSelectedTrip(null) }}
                            style={{
                                flex: 1, padding: '10px',
                                borderRadius: 10, border: 'none',
                                background: subTab === tab.key ? 'rgba(255,95,31,0.12)' : 'transparent',
                                color: subTab === tab.key ? 'var(--primary-apex)' : 'var(--text-secondary)',
                                fontWeight: 600, fontSize: 12,
                                fontFamily: 'var(--font-main)',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{
                flex: 1, overflowY: 'auto',
                padding: '20px 20px 100px'
            }} className="no-scrollbar">
                {/* Trip Detail View */}
                {selectedTrip ? (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        {/* Back */}
                        <button
                            onClick={() => setSelectedTrip(null)}
                            style={{
                                background: 'none', border: 'none',
                                color: 'var(--primary-apex)',
                                fontFamily: 'var(--font-main)',
                                fontSize: 13, fontWeight: 600,
                                cursor: 'pointer', marginBottom: 16,
                                padding: 0
                            }}
                        >
                            ← All Trips
                        </button>

                        {/* Trip Hero */}
                        <div
                            style={{
                                borderRadius: 16, overflow: 'hidden',
                                marginBottom: 20, position: 'relative',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                if (inlineVideoRef.current) {
                                    setSyncTime(inlineVideoRef.current.currentTime)
                                }
                                setIsFullscreenVideo(true)
                            }}
                        >
                            {true ? (
                                <>
                                    <video
                                        ref={inlineVideoRef}
                                        src={selectedTrip.video?.includes('V2') ? selectedTrip.video : '/Video/Peak Flow Video V2.mp4'}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        style={{ width: '100%', height: 180, objectFit: 'cover' }}
                                    />
                                </>
                            ) : null}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(transparent 30%, rgba(15,17,21,0.9) 100%)'
                            }} />
                            <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                                <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 4, fontFamily: 'var(--font-display)' }}>{selectedTrip.routeName}</h2>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                    {new Date(selectedTrip.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (navigator.share) {
                                            navigator.share({
                                                title: selectedTrip.routeName,
                                                text: 'Check out this awesome drive on Peak Flow!',
                                                url: window.location.href,
                                            }).catch(console.error)
                                        } else {
                                            alert('Sharing is not supported on your browser/device.')
                                        }
                                    }}
                                    style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                                    }}
                                    title="Share Trip"
                                >
                                    <Share2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 10, marginBottom: 20
                        }}>
                            <StatBox label="Distance" value={`${selectedTrip.distance} km`} />
                            <StatBox label="Duration" value={`${selectedTrip.duration} min`} />
                            <StatBox label="Photos" value={selectedTrip.photos} />
                        </div>

                        {/* Notes — "The Scrapbook" */}
                        <div className="glass-panel" style={{ padding: 16, marginBottom: 20 }}>
                            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                📝 Notes
                            </h4>
                            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                                {selectedTrip.notes}
                            </p>
                        </div>

                        {/* Performance Toggle */}
                        <button
                            onClick={() => setShowPerformance(!showPerformance)}
                            style={{
                                width: '100%', padding: '14px',
                                background: showPerformance ? 'rgba(255,95,31,0.12)' : 'rgba(255,255,255,0.04)',
                                border: showPerformance ? '1px solid rgba(255,95,31,0.3)' : 'var(--border-glass)',
                                borderRadius: 14,
                                color: showPerformance ? 'var(--primary-apex)' : 'var(--text-secondary)',
                                fontWeight: 600, fontSize: 14,
                                fontFamily: 'var(--font-main)',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s',
                                marginBottom: 16
                            }}
                        >
                            📊 {showPerformance ? 'Hide' : 'Show'} Performance Data
                        </button>

                        {/* Performance Panel */}
                        {showPerformance && selectedTrip.performance && (
                            <PerformancePanel data={selectedTrip.performance} />
                        )}
                    </div>
                ) : (
                    /* Main View Switcher */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* ─── History Tab ─── */}
                        {subTab === 'history' && (
                            trips.length > 0 ? (
                                <>
                                    {trips.map(trip => (
                                        <div key={trip.id} style={{ position: 'relative' }}>
                                            <TripCard
                                                trip={trip}
                                                onClick={() => handleTripTap(trip)}
                                                onDelete={() => onRemoveTrip && onRemoveTrip(trip.id)}
                                            />
                                        </div>
                                    ))}
                                    <ClearAllBtn onClick={() => onClearTrips && onClearTrips()} label="Clear History" />
                                </>
                            ) : (
                                <EmptyState icon="Clock" title="No trips yet" desc="Start driving to build your history" />
                            )
                        )}

                        {/* ─── Favorites Tab ─── */}
                        {subTab === 'favorites' && (
                            favoriteRoutes.length > 0 ? (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                                        {favoriteRoutes.map(route => (
                                            <div key={route.id} style={{ position: 'relative' }}>
                                                <DeleteBtn onClick={() => onToggleFavorite && onToggleFavorite(route.id)} />
                                                <RouteCard
                                                    route={route}
                                                    onClick={() => onSelectRoute && onSelectRoute(route)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <ClearAllBtn onClick={() => onClearFavorites && onClearFavorites()} label="Clear Favorites" />
                                </>
                            ) : (
                                <EmptyState icon="Heart" title="No favorites yet" desc="Heart routes while browsing Discover to save them here" />
                            )
                        )}

                        {/* ─── Bucket List Tab ─── */}
                        {subTab === 'bucketList' && (
                            bucketListRoutes.length > 0 ? (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                                        {bucketListRoutes.map(route => (
                                            <div key={route.id} style={{ position: 'relative' }}>
                                                <DeleteBtn onClick={() => onToggleBucketList && onToggleBucketList(route.id)} />
                                                <RouteCard
                                                    route={route}
                                                    onClick={() => onSelectRoute && onSelectRoute(route)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <ClearAllBtn onClick={() => onClearBucketList && onClearBucketList()} label="Clear Bucket List" />
                                </>
                            ) : (
                                <EmptyState icon="Star" title="Your bucket list is empty" desc="Star routes in Discover to add them to your must-drive list" />
                            )
                        )}

                        {/* ─── My Routes Tab ─── */}
                        {subTab === 'myRoutes' && (
                            myRoutes.length > 0 ? (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                                        {myRoutes.map(route => (
                                            <div key={route.id} style={{ position: 'relative' }}>
                                                <DeleteBtn onClick={() => onRemoveMyRoute && onRemoveMyRoute(route.id)} />
                                                <RouteCard
                                                    route={route}
                                                    onClick={() => onSelectRoute && onSelectRoute(route)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <ClearAllBtn onClick={() => onClearMyRoutes && onClearMyRoutes()} label="Clear My Routes" />
                                </>
                            ) : (
                                <EmptyState
                                    icon="Route"
                                    title="No saved routes yet"
                                    desc="Create your own custom routes to see them here"
                                    action={
                                        <button
                                            onClick={onCreateRoute}
                                            style={{
                                                marginTop: 16,
                                                padding: '12px 24px',
                                                background: 'var(--primary-apex)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 12,
                                                fontWeight: 600,
                                                fontSize: 14,
                                                cursor: 'pointer',
                                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                                boxShadow: '0 4px 12px rgba(255, 95, 31, 0.3)'
                                            }}
                                        >
                                            <Route size={16} /> Create Route
                                        </button>
                                    }
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {/* ─── Fullscreen Video Overlay ─── */}
            {isFullscreenVideo && selectedTrip && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'black', display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{
                        position: 'absolute', top: 40, left: 20, right: 20,
                        display: 'flex', justifyContent: 'space-between', zIndex: 10
                    }}>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: selectedTrip.routeName,
                                        text: 'Check out this awesome drive on Peak Flow!',
                                        url: window.location.href,
                                    }).catch(console.error)
                                } else {
                                    alert('Sharing is not supported on your browser/device.')
                                }
                            }}
                            style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(10px)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Share2 size={20} />
                        </button>
                        <button
                            onClick={(e) => {
                                setIsFullscreenVideo(false)
                                // Extract the video element by targeting the previous sibling (the video itself)
                                // or simply let the inline video resume from its normal loop for now
                            }}
                            style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(10px)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <video
                        src={selectedTrip.video?.includes('V2') ? selectedTrip.video : '/Video/Peak Flow Video V2.mp4'}
                        autoPlay
                        loop
                        controls
                        playsInline
                        onLoadedMetadata={(e) => {
                            if (syncTime > 0) {
                                e.target.currentTime = syncTime
                            }
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>
            )}
        </div>
    )
}

// ─── Sub-components ───
const StatBox = ({ label, value }) => (
    <div style={{
        padding: '14px 10px',
        background: 'rgba(255,255,255,0.03)',
        border: 'var(--border-glass)',
        borderRadius: 12,
        textAlign: 'center'
    }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 18, fontWeight: 800 }}>{value}</p>
    </div>
)

const EmptyState = ({ icon, title, desc, action }) => (
    <div style={{ textAlign: 'center', padding: '40px 20px', marginTop: 20 }}>
        <div style={{
            fontSize: 48, marginBottom: 16,
            opacity: 0.5, filter: 'grayscale(1)'
        }}>
            {icon === 'Heart' ? '❤️' : icon === 'Star' ? '⭐' : icon === 'Route' ? '🗺️' : '🕰️'}
        </div>
        <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: 18 }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 280, margin: '0 auto', lineHeight: 1.5 }}>
            {desc}
        </p>
        {action && action}
    </div>
)

export default Trips
