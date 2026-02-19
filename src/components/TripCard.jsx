import React from 'react'
import { MapPin, Clock, Camera, ChevronRight, Trash2 } from 'lucide-react'

const TripCard = ({ trip, onClick, onDelete }) => {
    return (
        <div
            onClick={onClick}
            className="glass-panel"
            style={{
                display: 'flex',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative' // Added for internal delete positioning context
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.01)'
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            {/* Thumbnail */}
            <div style={{ width: 100, height: 100, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                <img
                    src={trip.image}
                    alt={trip.routeName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, #1a1d24, #2c3e50)' }}
                />
                {trip.photos > 0 && (
                    <div style={{
                        position: 'absolute', bottom: 4, right: 4,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                        padding: '2px 6px', borderRadius: 6,
                        fontSize: 10, display: 'flex', alignItems: 'center', gap: 3
                    }}>
                        <Camera size={9} /> {trip.photos}
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {trip.routeName}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    {new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={10} /> {trip.distance} km
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={10} /> {trip.duration} min
                    </span>
                </div>
            </div>

            {/* Actions (Delete + Arrow) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', color: 'var(--text-muted)' }}>
                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: 30, height: 30,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                            e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                            e.currentTarget.style.color = 'var(--text-muted)'
                        }}
                    >
                        <Trash2 size={14} />
                    </button>
                )}
                <ChevronRight size={18} />
            </div>
        </div>
    )
}

export default TripCard
