import React from 'react'
import { X, Activity, AlertTriangle, Gauge } from 'lucide-react'

const SSSInfoCard = ({ onClose }) => {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, animation: 'fadeIn 0.2s ease'
        }}>
            <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
            <div className="glass-panel" style={{
                position: 'relative', width: '100%', maxWidth: 360,
                padding: 24, borderRadius: 24,
                boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
                animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'none', border: 'none', color: 'var(--text-secondary)',
                    cursor: 'pointer'
                }}><X size={20} /></button>

                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Gauge size={48} color="var(--primary-apex)" style={{ marginBottom: 12 }} />
                    <h3 style={{ fontSize: 20, fontWeight: 800 }}>Supercar Suitability Score</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>The Peak Flow standard for driving roads</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ padding: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 12, height: 'fit-content' }}>
                            <Activity size={20} color="#4ade80" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: 14, fontWeight: 700 }}>Curviness & Flow</h4>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                Evaluation of bends, hairpins, and rhythm. Higher scores mean more dynamic driving.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ padding: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 12, height: 'fit-content' }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--sss-good)' }} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: 14, fontWeight: 700 }}>Surface Quality</h4>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                Impact of potholes, gravel, and uneven pavement. Smooth asphalt boosts the score.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ padding: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 12, height: 'fit-content' }}>
                            <AlertTriangle size={20} color="var(--sss-caution)" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: 14, fontWeight: 700 }}>Hazards & Traffic</h4>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                Presence of speed bumps, narrow lanes, and heavy traffic reduces the score.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 24, padding: 12, background: 'var(--primary-apex-dim)', borderRadius: 12, textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: 'var(--primary-apex)', fontWeight: 600 }}>
                        9.0+ = Elite Driving Road
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SSSInfoCard
