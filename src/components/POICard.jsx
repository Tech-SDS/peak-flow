import React, { useMemo, useState } from 'react'
import { MapPin, Navigation, Star, ArrowRight, X, ArrowLeft } from 'lucide-react'

const POICard = ({ poi, userLocation, onClose, onRoute }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [dragStartY, setDragStartY] = useState(null)

    // Touch Handlers for Drag
    const onTouchStart = (e) => {
        setDragStartY(e.touches[0].clientY)
    }

    const onTouchMove = (e) => {
        if (!dragStartY) return
        const currentY = e.touches[0].clientY
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
    // Mock Data Generators (consistent per POI based on ID)
    const mockData = useMemo(() => {
        if (!poi) return {}

        // Simple hash from ID for consistency
        const hash = poi.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

        const rating = (4.0 + (hash % 10) / 10).toFixed(1) // 4.0 - 4.9
        const reviews = 20 + (hash % 200)
        // Dynamic image based on POI type/id
        const imageId = (hash % 50) + 10 // Picsum ID
        const imageUrl = `https://picsum.photos/id/${imageId}/600/400`

        return { rating, reviews, imageUrl }
    }, [poi?.id])

    if (!poi) return null

    // Calculate distance if user location is known
    const distanceKm = userLocation ? (
        // Simple Haversine approximation
        (() => {
            const R = 6371
            const dLat = (poi.lat - userLocation.lat) * Math.PI / 180
            const dLng = (poi.lng - userLocation.lng) * Math.PI / 180
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(poi.lat * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            return (R * c).toFixed(1)
        })()
    ) : null

    return (
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                // left: '50%', transform: 'translateX(-50%)', // Removed centering
                width: '100%',
                maxWidth: 'none', // Removed max-width
                // If expanded, take up most of screen, else auto height
                height: isExpanded ? '92vh' : 'auto', // Increased expanded height slightly
                transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 1100,
                display: 'flex', flexDirection: 'column',
                pointerEvents: 'none',
            }}>
            <div className="glass-panel" style={{
                width: '100%',
                height: '100%',
                pointerEvents: 'auto',
                borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
                borderTopLeftRadius: 24, borderTopRightRadius: 24,
                padding: 0,
                overflow: 'hidden',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column'
            }}>

                {/* Drag Handle Overlay */}
                <div
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 30, zIndex: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.4)' }} />
                </div>
                {/* Back Button (Top Left) - Larger Hit Area */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                    }}
                    style={{
                        position: 'absolute', top: 12, left: 12,
                        zIndex: 40, // Higher than everything
                        background: 'rgba(0,0,0,0.6)', // Slightly darker for visibility
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: 44, height: 44, // Larger tap target
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>

                {/* Close Button (Top Right) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                    }}
                    style={{
                        position: 'absolute', top: 12, right: 12,
                        zIndex: 30,
                        background: 'rgba(0,0,0,0.4)',
                        border: 'none', borderRadius: '50%',
                        width: 32, height: 32,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <X size={18} />
                </button>

                {/* Hero Image */}
                <div style={{ height: 160, position: 'relative' }}>
                    <img
                        src={mockData.imageUrl}
                        alt={poi.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(20,24,32,0.95))'
                    }} />

                    {/* Badge */}
                    <div style={{
                        position: 'absolute', bottom: 16, left: 20,
                        background: 'rgba(255, 95, 31, 0.9)', // Apex color
                        color: 'white',
                        padding: '4px 10px', borderRadius: 4,
                        fontSize: 11, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: 0.5
                    }}>
                        {poi.type || 'Point of Interest'}
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    padding: '4px 20px 20px',
                    flex: 1,
                    overflowY: isExpanded ? 'auto' : 'hidden',
                    position: 'relative',
                    maxHeight: isExpanded ? 'none' : '200px'
                }} className="no-scrollbar">
                    {/* Fade Overlay for Collapsed State */}
                    {!isExpanded && (
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
                            background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0), rgba(15, 17, 21, 1))',
                            zIndex: 10, pointerEvents: 'none'
                        }} />
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', color: 'white' }}>{poi.name}</h2>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{poi.details}</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Star size={14} fill="#FFD700" color="#FFD700" />
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{mockData.rating}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({mockData.reviews})</span>
                        </div>

                        {distanceKm && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Navigation size={14} color="var(--primary-apex)" />
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                    {distanceKm} km away
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => onRoute?.(poi)}
                        className="btn-primary"
                        style={{
                            width: '100%', marginTop: 20,
                            display: 'flex', justifyContent: 'center', gap: 8
                        }}
                    >
                        <span>Routes</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default POICard
