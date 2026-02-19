import React from 'react'
import { MapPin, Activity, ArrowRight, Clock, Heart, Navigation, Flag } from 'lucide-react'
import { getSSSColor, formatDuration } from '../lib/sssEngine'

const RouteCard = ({ route, onClick, style }) => {
    const sssInfo = getSSSColor(route.sss)
    const stopsCount = route.waypoints?.length || 0

    return (
        <div
            className="glass-panel"
            onClick={onClick}
            style={{
                minWidth: '260px',
                maxWidth: '260px',
                height: '300px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                ...style
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            {/* Hero Image Area */}
            <div style={{ height: '55%', background: '#1a1d24', position: 'relative', overflow: 'hidden' }}>
                <img
                    src={route.image || `https://picsum.photos/seed/${route.id}/800/600`}
                    alt={route.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, #1a1d24, #2c3e50)' }}
                />
                {/* Gradient overlay for text readability */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '50%',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                    pointerEvents: 'none'
                }} />

                {/* SSS Ring Badge */}
                <div style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 42, height: 42,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(6px)',
                    border: `2px solid ${sssInfo.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: sssInfo.color, lineHeight: 1 }}>{route.sss}</span>
                    <span style={{ fontSize: 7, color: sssInfo.color, letterSpacing: 0.5 }}>SSS</span>
                </div>

                {/* Duration chip */}
                <div style={{
                    position: 'absolute', bottom: 10, left: 10,
                    background: 'rgba(20, 20, 20, 0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                    <Clock size={14} /> {formatDuration(route.duration)}
                </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '10px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, lineHeight: 1.2 }} className="truncate-2">{route.name}</h3>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>{route.region}</p>

                {/* Distance to start + Stops */}
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Navigation size={10} color="var(--primary-apex)" />
                        {route.distanceFromUser ? `${route.distanceFromUser} km away` : '— km'}
                    </span>
                    {stopsCount > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Flag size={10} />
                            {stopsCount} {stopsCount === 1 ? 'stop' : 'stops'}
                        </span>
                    )}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <MapPin size={11} /> {route.distance}km
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Activity size={11} /> {route.curvinessIndex || '—'}/5
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Heart size={11} /> {route.hearts || 0}
                        </span>
                    </div>
                    <button style={{
                        background: 'var(--primary-apex)',
                        border: 'none', borderRadius: '50%',
                        width: '28px', height: '28px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(255,95,31,0.3)',
                        transition: 'transform 0.2s'
                    }}>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RouteCard
