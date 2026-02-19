import React, { useMemo } from 'react'
import { ArrowRight, ArrowUp, ArrowLeft, Navigation, Clock, X, MapPin, Search } from 'lucide-react'

// Helper to format ETA
const formatETA = (durationMinutes) => {
    const now = new Date()
    const arrival = new Date(now.getTime() + durationMinutes * 60000)
    return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Helper: Format duration (Xh Ymin)
const formatTime = (minutes) => {
    if (!minutes) return '0 min'
    if (minutes < 60) return `${minutes} min`
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}min`
}

const TurnByTurnPanel = ({ route, onEndDrive, onAddStop, style }) => {
    // Mock Step Data (fixed for demo since ORS route doesn't easily give steps without parsing)
    // In a real app, we'd parse `route.segments[0].steps[0]`
    const nextStep = {
        instruction: "Turn right onto",
        street: "Main Street",
        distance: "200 m",
        icon: <ArrowRight size={32} color="white" />
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            zIndex: 'var(--z-overlay)',
            pointerEvents: 'none'
        }}>
            {/* ─── Top Left: Next Maneuver ─── */}
            <div className="glass-panel" style={{
                position: 'absolute',
                top: 20, left: 20,
                pointerEvents: 'auto',
                padding: 16, borderRadius: 20,
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                display: 'flex', gap: 16, alignItems: 'center',
                maxWidth: 360, width: '100%'
            }}>
                {/* Turn Icon */}
                <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'var(--primary-apex)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 4px 16px rgba(255, 95, 31, 0.4)'
                }}>
                    {nextStep.icon}
                </div>

                {/* Info: Distance & Street */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: 4 }}>
                        {nextStep.distance}
                    </div>
                    {/* Instruction Removed as requested */}
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {nextStep.street}
                    </div>
                </div>

                {/* End Drive Button */}
                <button
                    onClick={onEndDrive}
                    style={{
                        position: 'absolute', top: 12, right: 12,
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', border: 'none',
                        color: 'var(--text-secondary)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <X size={14} />
                </button>
            </div>

            {/* ─── Search Button (Above Stats) ─── */}
            <div style={{
                position: 'absolute',
                bottom: 120, left: 20,
                pointerEvents: 'auto',
                zIndex: 10
            }}>
                <button
                    onClick={onAddStop}
                    style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: 'rgba(20, 20, 20, 0.9)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        cursor: 'pointer'
                    }}
                >
                    <Search size={24} />
                </button>
            </div>

            {/* ─── Bottom Left: Stats ─── */}
            <div className="glass-panel" style={{
                position: 'absolute',
                bottom: 40, left: 20,
                pointerEvents: 'auto',
                padding: '12px 20px', borderRadius: 16,
                background: 'rgba(20, 20, 20, 0.85)',
                backdropFilter: 'blur(12px)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                maxWidth: 360, width: '100%',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                {/* Remaining Time */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#00e676' }}>{formatTime(route.duration)}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Remaining</span>
                </div>

                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

                {/* ETA */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{formatETA(route.duration)}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>ETA</span>
                </div>

                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

                {/* Distance Left */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{route.distance} km</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Distance</span>
                </div>
            </div>
        </div>
    )
}

export default TurnByTurnPanel
