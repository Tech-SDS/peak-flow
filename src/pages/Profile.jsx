import React, { useState } from 'react'
import { Shield, Car, Settings, ChevronRight, Edit3, RefreshCw } from 'lucide-react'

const Profile = () => {
    const [sssThreshold, setSSSThreshold] = useState(7.0)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleAppUpdate = async () => {
        setIsUpdating(true)
        if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.getRegistration()
            if (reg) {
                await reg.update()
                if (reg.waiting) {
                    reg.waiting.postMessage({ type: 'SKIP_WAITING' })
                    // Wait for controller change then reload
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        window.location.reload()
                    })
                } else {
                    // Slight delay to show interaction if no update found
                    setTimeout(() => setIsUpdating(false), 1000)
                }
            } else {
                setIsUpdating(false)
            }
        } else {
            setIsUpdating(false)
        }
    }

    return (
        <div style={{ height: '100%', overflow: 'auto', padding: '56px 20px 100px' }} className="no-scrollbar">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                    width: 80, height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-apex), #ff8f00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, fontWeight: 800,
                    margin: '0 auto 14px',
                    boxShadow: '0 4px 24px var(--primary-glow)'
                }}>
                    S
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>Stefan K.</h1>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    marginTop: 8, padding: '6px 14px',
                    background: 'rgba(0,230,118,0.1)',
                    border: '1px solid rgba(0,230,118,0.2)',
                    borderRadius: 20,
                    color: 'var(--sss-apex)', fontSize: 13, fontWeight: 600
                }}>
                    <Shield size={14} /> Verified Pilot
                </div>
            </div>

            {/* Vehicle Card */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Car size={18} color="var(--primary-apex)" /> My Vehicle
                    </h3>
                    <button style={{
                        background: 'none', border: 'none', color: 'var(--primary-apex)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                        fontFamily: 'var(--font-main)', fontSize: 13, fontWeight: 500
                    }}>
                        <Edit3 size={13} /> Edit
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <InfoRow label="Make / Model" value="McLaren 720S" />
                    <InfoRow label="Year" value="2024" />
                    <InfoRow label="VIN" value="•••••••9982" />
                    <InfoRow label="Ground Clearance" value="120mm" highlight />
                    <InfoRow label="Power" value="720 PS (530 kW)" />
                </div>
            </div>

            {/* Driving Preferences */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Settings size={18} color="var(--primary-apex)" /> Preferences
                </h3>

                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Minimum SSS Threshold</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-apex)' }}>{sssThreshold.toFixed(1)}</span>
                    </div>
                    <input
                        type="range"
                        min={0} max={10} step={0.5}
                        value={sssThreshold}
                        onChange={(e) => setSSSThreshold(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary-apex)' }}
                    />
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        Routes below this score will show a warning
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <PreferenceRow label="Preferred Roads" value="Mountain Passes, Forest Roads" />
                    <PreferenceRow label="Avoid" value="Speed Humps, Unpaved" />
                    <PreferenceRow label="Units" value="Metric (km/h)" />
                    <PreferenceRow label="Hump Alerts" value="200m warning" />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-panel" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                    📊 Statistics
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    <StatCard label="Total Drives" value="47" />
                    <StatCard label="Total Distance" value="2,840 km" />
                    <StatCard label="Avg. SSS" value="8.9" color="var(--sss-apex)" />
                    <StatCard label="Best G-Force" value="1.8G" color="var(--primary-apex)" />
                </div>
            </div>

            {/* App Settings */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                    App Info
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Version</span>
                        <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>v1.0.2</span>
                    </div>
                    <button
                        onClick={handleAppUpdate}
                        disabled={isUpdating}
                        className="btn-glass"
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            marginTop: 8, borderColor: 'var(--primary-apex)', color: 'var(--primary-apex)'
                        }}
                    >
                        <RefreshCw size={14} className={isUpdating ? 'spin-icon' : ''} />
                        {isUpdating ? 'Checking...' : 'Update App'}
                    </button>
                </div>
            </div>
        </div>
    )
}

const InfoRow = ({ label, value, highlight }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{
            fontSize: 14, fontWeight: 600,
            color: highlight ? 'var(--sss-caution)' : 'var(--text-primary)'
        }}>{value}</span>
    </div>
)

const PreferenceRow = ({ label, value }) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)'
    }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>
            {value}
            <ChevronRight size={14} color="var(--text-muted)" />
        </div>
    </div>
)

const StatCard = ({ label, value, color }) => (
    <div style={{
        padding: '14px', textAlign: 'center',
        background: 'rgba(255,255,255,0.03)',
        border: 'var(--border-glass)',
        borderRadius: 12
    }}>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: color || 'white' }}>{value}</p>
    </div>
)

export default Profile
