import React, { useState } from 'react'
import { Plus, ArrowUpRight, Sparkles, Navigation } from 'lucide-react'

// ─── Route Builder Panel ───
// Mimics Porsche Roads style: Glassmorphism list items for Start (filled) and Dest (empty)
const RouteBuilderPanel = ({ onAIRequest, onClose, onCalculate }) => {
    const [startLocation, setStartLocation] = useState('Current GPS Location')
    const [destination, setDestination] = useState('')

    const handleAddDestination = () => {
        const dest = window.prompt("Enter destination (Mock Input):")
        if (dest) setDestination(dest)
    }

    return (
        <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            zIndex: 'var(--z-sheet)',
            padding: '20px 20px 40px',
            background: 'linear-gradient(to top, rgba(15,17,21,0.98) 60%, transparent 100%)',
            animation: 'slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            display: 'flex', flexDirection: 'column', gap: 16
        }}>
            {/* Header / Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Plan Route</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
                    Cancel
                </button>
            </div>

            {/* Location List */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Start Location */}
                <div style={{
                    padding: '16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    borderBottom: 'var(--border-glass)'
                }}>
                    <Navigation size={18} fill="var(--primary-apex)" color="var(--primary-apex)" />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Start</p>
                        <p style={{ fontSize: 15, fontWeight: 500 }}>{startLocation}</p>
                    </div>
                </div>

                {/* Destination */}
                <div
                    onClick={handleAddDestination}
                    style={{
                        padding: '16px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        background: destination ? 'rgba(255,255,255,0.03)' : 'transparent'
                    }}>
                    {destination ? (
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid white' }} />
                    ) : (
                        <Plus size={18} color="var(--text-secondary)" />
                    )}

                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Destination</p>
                        <p style={{ fontSize: 15, fontWeight: 500, color: destination ? 'white' : 'var(--text-muted)' }}>
                            {destination || "Add destination"}
                        </p>
                    </div>
                </div>
            </div>

            {/* AI Generator CTA */}
            <button
                onClick={onAIRequest}
                className="glass-panel"
                style={{
                    width: '100%',
                    padding: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'rgba(255, 95, 31, 0.15)', // Orange tint
                    border: '1px solid rgba(255, 95, 31, 0.3)',
                    color: 'var(--primary-apex)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <Sparkles size={16} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Automatic Route Generator</span>
            </button>

            {/* Calculate Button */}
            <button
                onClick={onCalculate}
                disabled={!destination}
                className="btn-primary"
                style={{
                    width: '100%',
                    marginTop: 8,
                    background: destination ? 'var(--text-primary)' : 'var(--bg-card)', // Grayscale primary
                    color: destination ? 'var(--bg-dark)' : 'var(--text-muted)',
                    boxShadow: 'none',
                    border: 'var(--border-glass)'
                }}
            >
                Calculate Route
            </button>
        </div>
    )
}

export default RouteBuilderPanel
