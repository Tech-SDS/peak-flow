import React, { useState } from 'react'
import { X, Navigation, MapPin, Clock, Ruler, Mountain, ChevronDown, ChevronUp, Heart, Star, Users, Save, AlertTriangle } from 'lucide-react'

const AIRouteResultSheet = ({ route, onClose, onStartNavigation, onFormConvoy, onSave, isFavorite, isBucketListed, onToggleFavorite, onToggleBucketList }) => {
    const [expanded, setExpanded] = useState(false)

    if (!route) return null

    const stops = route.stops || []
    const sheetHeight = expanded ? '75vh' : '45vh'

    return (
        <div className="glass-sheet" style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: sheetHeight,
            maxHeight: expanded ? 700 : 450,
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 -10px 50px rgba(0,0,0,0.6)',
            animation: 'sheetUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 250,
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            transition: 'height 0.3s ease, max-height 0.3s ease'
        }}>
            {/* Drag Handle */}
            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    padding: '12px 0 4px',
                    display: 'flex', justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Header */}
            <div style={{ padding: '8px 20px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{route.name}</h2>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        marginTop: 8, flexWrap: 'wrap'
                    }}>
                        {/* Stats Row */}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                            <Ruler size={13} /> {route.distance} km
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                            <Clock size={13} /> {route.duration < 60 ? `${route.duration} min` : `${Math.floor(route.duration / 60)}h ${route.duration % 60 ? route.duration % 60 + 'min' : ''}`}
                        </span>
                        {route.elevation && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                                <Mountain size={13} /> {route.elevation.gain}m ↑
                            </span>
                        )}
                        {route.isLoop && (
                            <span style={{
                                fontSize: 11, fontWeight: 600, padding: '3px 8px',
                                borderRadius: 6, background: 'rgba(255,95,31,0.12)',
                                color: 'var(--primary-apex)'
                            }}>Loop</span>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        style={{
                            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
                            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer'
                        }}
                    >
                        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
                            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer'
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Stops List */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 20px 12px'
            }} className="no-scrollbar">
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {stops.length} Stops along the route
                </p>

                {/* Timeline */}
                <div style={{ position: 'relative', paddingLeft: 28 }}>
                    {/* Vertical line */}
                    <div style={{
                        position: 'absolute', left: 8, top: 8, bottom: 8,
                        width: 2, background: 'linear-gradient(to bottom, var(--primary-apex), rgba(255,95,31,0.15))',
                        borderRadius: 1
                    }} />

                    {stops.map((stop, i) => (
                        <div key={i} style={{
                            position: 'relative',
                            padding: '10px 0',
                            display: 'flex', alignItems: 'flex-start', gap: 14
                        }}>
                            {/* Dot */}
                            <div style={{
                                position: 'absolute', left: -24,
                                width: 18, height: 18,
                                borderRadius: '50%',
                                background: 'rgba(15,17,21,0.95)',
                                border: `2px solid ${getStopColor(stop.type)}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 9, lineHeight: 1,
                                marginTop: 2
                            }}>
                                {stop.icon || '📍'}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{stop.name}</span>
                                </div>
                                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.4 }}>
                                    {stop.description}
                                </p>
                                <span style={{
                                    display: 'inline-block', marginTop: 4,
                                    fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                                    color: getStopColor(stop.type),
                                    letterSpacing: 0.3
                                }}>
                                    {stop.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Route Surface & Alerts (shown when expanded) */}
                {expanded && route.surface && (
                    <div style={{ marginTop: 16, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Surface & Alerts</p>
                        <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                            <div style={{ width: `${route.surface.asphalt || 0}%`, background: 'var(--primary-apex)' }} />
                            <div style={{ width: `${route.surface.gravel || 0}%`, background: 'var(--sss-danger)' }} />
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Asphalt {route.surface.asphalt || 100}%</p>
                        {route.hazards?.potholes > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: '#ff4444' }}>
                                <AlertTriangle size={12} /> Potholes reported
                            </div>
                        )}
                        {route.hazards?.speedHumps > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12, color: '#ffbb33' }}>
                                <AlertTriangle size={12} /> {route.hazards.speedHumps} speed humps
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div style={{
                padding: '14px 20px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', gap: 10, alignItems: 'center',
                flexShrink: 0
            }}>
                {/* Start Nav */}
                <button
                    onClick={() => onStartNavigation && onStartNavigation(route)}
                    className="btn-primary"
                    style={{
                        flex: 2,
                        padding: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontSize: 14, fontWeight: 700
                    }}
                >
                    <Navigation size={16} /> Start Navigation
                </button>

                {/* Form Convoy */}
                <button
                    onClick={() => onFormConvoy && onFormConvoy(route)}
                    className="btn-glass"
                    style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}
                >
                    <Users size={15} /> Convoy
                </button>

                {/* Save / Fav / Wishlist */}
                <div style={{ display: 'flex', gap: 6 }}>
                    <button
                        onClick={() => onSave && onSave(route)}
                        className="action-icon-btn"
                        style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'white' }}
                        title="Save route"
                    >
                        <Save size={18} />
                    </button>
                    <button
                        onClick={() => onToggleBucketList && onToggleBucketList()}
                        className={`action-icon-btn ${isBucketListed ? 'star-active' : ''}`}
                        style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: isBucketListed ? '#fbbf24' : 'white' }}
                        title="Add to wishlist"
                    >
                        <Star size={18} fill={isBucketListed ? '#fbbf24' : 'none'} />
                    </button>
                    <button
                        onClick={() => onToggleFavorite && onToggleFavorite()}
                        className={`action-icon-btn ${isFavorite ? 'heart-active' : ''}`}
                        style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                        title="Favourite"
                    >
                        <Heart size={18} fill={isFavorite ? '#ff1744' : 'none'} color={isFavorite ? '#ff1744' : 'white'} />
                    </button>
                </div>
            </div>
        </div>
    )
}

function getStopColor(type) {
    switch (type) {
        case 'scenic': return 'var(--primary-apex)'
        case 'cafe': return '#a0522d'
        case 'landmark': return 'var(--sss-caution)'
        case 'driving': return 'var(--sss-apex)'
        case 'fuel': return 'var(--sss-good)'
        default: return 'var(--text-secondary)'
    }
}

export default AIRouteResultSheet
