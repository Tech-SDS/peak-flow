import React, { useState, useRef, useEffect } from 'react'
import { Shield, Car, Settings, ChevronRight, Edit3, RefreshCw, Plus, Check, Trash2, Star, Camera, Volume2, VolumeX, Bell, X, Map } from 'lucide-react'

const INITIAL_GARAGE = [
    { id: 1, make: 'McLaren', model: '720S', year: 2024, power: '720 PS (530 kW)', active: true, image: null },
    { id: 2, make: 'Porsche', model: '911 GT3 RS', year: 2023, power: '525 PS (386 kW)', active: false, image: null },
]

const Profile = ({ onOpenSandbox }) => {
    const [garage, setGarage] = useState(() => {
        const saved = localStorage.getItem('pf_garage')
        return saved ? JSON.parse(saved) : INITIAL_GARAGE
    })
    const [showAddCar, setShowAddCar] = useState(false)
    const [newCar, setNewCar] = useState({ make: '', model: '', year: '', power: '' })
    const [isUpdating, setIsUpdating] = useState(false)

    // Editable user name
    const [userName, setUserName] = useState(() => {
        return localStorage.getItem('pf_username') || 'Stefan S.'
    })
    const [isEditingName, setIsEditingName] = useState(false)
    const [nameDraft, setNameDraft] = useState(userName)

    // Alert preferences
    const [alertPrefs, setAlertPrefs] = useState(() => {
        const saved = localStorage.getItem('pf_alertPrefs')
        if (saved) return JSON.parse(saved)
        return {
            speedHumps: true,
            roadDamage: true,
            speedCameras: true,
            dynamicEvents: false,
        }
    })

    // Sound preference
    const [soundPref, setSoundPref] = useState(() => {
        return localStorage.getItem('pf_soundPref') || 'unmute'
    }) // 'unmute' | 'alerts' | 'muted'

    // Car photo file input refs
    const carPhotoRef = useRef(null)
    const [photoTargetId, setPhotoTargetId] = useState(null)

    // Persist to localStorage
    useEffect(() => { localStorage.setItem('pf_garage', JSON.stringify(garage)) }, [garage])
    useEffect(() => { localStorage.setItem('pf_username', userName) }, [userName])
    useEffect(() => { localStorage.setItem('pf_alertPrefs', JSON.stringify(alertPrefs)) }, [alertPrefs])
    useEffect(() => { localStorage.setItem('pf_soundPref', soundPref) }, [soundPref])

    const activeCar = garage.find(c => c.active) || garage[0]

    const handleSetActive = (id) => {
        setGarage(prev => prev.map(c => ({ ...c, active: c.id === id })))
    }

    const handleDeleteCar = (id) => {
        if (garage.length <= 1) return alert("You need at least one car in your garage.")
        const wasActive = garage.find(c => c.id === id)?.active
        setGarage(prev => {
            const updated = prev.filter(c => c.id !== id)
            if (wasActive && updated.length > 0) updated[0].active = true
            return updated
        })
    }

    const handleAddCar = () => {
        if (!newCar.make || !newCar.model) return
        const car = {
            id: Date.now(),
            make: newCar.make,
            model: newCar.model,
            year: parseInt(newCar.year) || new Date().getFullYear(),
            power: newCar.power || '—',
            active: garage.length === 0,
            image: null
        }
        setGarage(prev => [...prev, car])
        setNewCar({ make: '', model: '', year: '', power: '' })
        setShowAddCar(false)
    }

    const handleCarPhoto = (carId) => {
        setPhotoTargetId(carId)
        carPhotoRef.current?.click()
    }

    const handlePhotoSelected = (e) => {
        const file = e.target.files?.[0]
        if (!file || !photoTargetId) return

        // Use FileReader to get base64 data URL so we can save it to localStorage
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64Url = reader.result
            setGarage(prev => prev.map(c => c.id === photoTargetId ? { ...c, image: base64Url } : c))
            setPhotoTargetId(null)
            e.target.value = '' // Reset so same file can be selected again
        }
        reader.readAsDataURL(file)
    }

    const handleSaveName = () => {
        const trimmed = nameDraft.trim()
        if (trimmed) setUserName(trimmed)
        setIsEditingName(false)
    }

    const handleAppUpdate = async () => {
        setIsUpdating(true)
        if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.getRegistration()
            if (reg) {
                await reg.update()
                if (reg.waiting) {
                    reg.waiting.postMessage({ type: 'SKIP_WAITING' })
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        window.location.reload()
                    })
                } else {
                    setTimeout(() => setIsUpdating(false), 1000)
                }
            } else {
                setIsUpdating(false)
            }
        } else {
            setIsUpdating(false)
        }
    }

    const toggleAlert = (key) => {
        setAlertPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div style={{ height: '100%', overflow: 'auto', padding: '56px 20px 100px' }} className="no-scrollbar">
            {/* Hidden file input for car photos */}
            <input type="file" accept="image/*" ref={carPhotoRef} onChange={handlePhotoSelected} style={{ display: 'none' }} />

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
                    {userName.charAt(0).toUpperCase()}
                </div>

                {/* Editable Name */}
                {isEditingName ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <input
                            autoFocus
                            value={nameDraft}
                            onChange={e => setNameDraft(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,95,31,0.4)',
                                borderRadius: 10, padding: '8px 14px',
                                color: 'white', fontSize: 20, fontWeight: 500,
                                fontFamily: 'var(--font-display)',
                                outline: 'none', textAlign: 'center', width: 200
                            }}
                        />
                        <button onClick={handleSaveName} style={{
                            background: 'rgba(255,95,31,0.15)', border: '1px solid rgba(255,95,31,0.3)',
                            borderRadius: 8, width: 36, height: 36,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--primary-apex)', cursor: 'pointer'
                        }}><Check size={16} /></button>
                        <button onClick={() => { setNameDraft(userName); setIsEditingName(false) }} style={{
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8, width: 36, height: 36,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-muted)', cursor: 'pointer'
                        }}><X size={16} /></button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <h1 style={{ fontSize: 32, fontWeight: 500, fontFamily: 'var(--font-display)' }}>{userName}</h1>
                        <button onClick={() => { setNameDraft(userName); setIsEditingName(true) }} style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                            padding: 4, display: 'flex', alignItems: 'center'
                        }}><Edit3 size={16} /></button>
                    </div>
                )}

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

            {/* ─── My Garage ─── */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 500, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Car size={18} color="var(--primary-apex)" /> My Garage
                    </h3>
                    <button onClick={() => setShowAddCar(!showAddCar)} style={{
                        background: 'none', border: 'none', color: 'var(--primary-apex)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                        fontFamily: 'var(--font-main)', fontSize: 13, fontWeight: 500
                    }}>
                        <Plus size={14} /> Add Car
                    </button>
                </div>

                {/* Car List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {garage.map(car => (
                        <div key={car.id} style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '14px 16px',
                            background: car.active ? 'rgba(255,95,31,0.08)' : 'rgba(255,255,255,0.03)',
                            border: car.active ? '1px solid rgba(255,95,31,0.25)' : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 14,
                            transition: 'all 0.2s'
                        }}>
                            {/* Car Image or Icon */}
                            <div
                                onClick={() => handleCarPhoto(car.id)}
                                style={{
                                    width: 52, height: 52, borderRadius: 12,
                                    background: car.image
                                        ? `url(${car.image}) center/cover no-repeat`
                                        : car.active
                                            ? 'linear-gradient(135deg, var(--primary-apex), var(--primary-deep))'
                                            : 'rgba(255,255,255,0.06)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, cursor: 'pointer',
                                    position: 'relative', overflow: 'hidden'
                                }}
                                title="Tap to add photo"
                            >
                                {!car.image && <Car size={20} color={car.active ? 'white' : 'var(--text-muted)'} />}
                                {/* Camera overlay */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.2s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                                >
                                    <Camera size={16} color="white" />
                                </div>
                            </div>

                            {/* Car Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>
                                    {car.make} {car.model}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                                    {car.year} · {car.power}
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                {car.active ? (
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, color: 'var(--primary-apex)',
                                        textTransform: 'uppercase', letterSpacing: 0.5,
                                        display: 'flex', alignItems: 'center', gap: 4,
                                        padding: '4px 10px', borderRadius: 8,
                                        background: 'rgba(255,95,31,0.12)'
                                    }}>
                                        <Check size={12} /> Active
                                    </span>
                                ) : (
                                    <button onClick={() => handleSetActive(car.id)} style={{
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8, padding: '6px 12px', color: 'var(--text-secondary)',
                                        fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-main)'
                                    }}>
                                        Select
                                    </button>
                                )}
                                {garage.length > 1 && (
                                    <button onClick={() => handleDeleteCar(car.id)} style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: 4, display: 'flex', color: 'var(--text-muted)'
                                    }}>
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Car Form */}
                {showAddCar && (
                    <div style={{
                        marginTop: 14, padding: 16,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 14
                    }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Add a new car</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                            <input
                                placeholder="Make (e.g. Porsche)"
                                value={newCar.make}
                                onChange={e => setNewCar(p => ({ ...p, make: e.target.value }))}
                                style={inputStyle}
                            />
                            <input
                                placeholder="Model (e.g. 911 GT3)"
                                value={newCar.model}
                                onChange={e => setNewCar(p => ({ ...p, model: e.target.value }))}
                                style={inputStyle}
                            />
                            <input
                                placeholder="Year"
                                value={newCar.year}
                                onChange={e => setNewCar(p => ({ ...p, year: e.target.value }))}
                                style={inputStyle}
                                type="number"
                            />
                            <input
                                placeholder="Power (e.g. 502 PS)"
                                value={newCar.power}
                                onChange={e => setNewCar(p => ({ ...p, power: e.target.value }))}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={handleAddCar} className="btn-primary" style={{
                                flex: 1, padding: '12px', fontSize: 13, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                            }}>
                                <Plus size={14} /> Add to Garage
                            </button>
                            <button onClick={() => setShowAddCar(false)} className="btn-glass" style={{
                                padding: '12px 16px', fontSize: 13
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Navigation Preferences ─── */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 500, fontFamily: 'var(--font-display)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Settings size={18} color="var(--primary-apex)" /> Navigation Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <PreferenceRow label="Preferred Roads" value="Mountain Passes, Forest Roads" />
                    <PreferenceRow label="Avoid" value="Highways, Tolls, Unpaved, Speed Humps" />
                    <PreferenceRow label="Units" value="Metric (km/h)" />
                </div>

                {/* Alerts Section */}
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Alerts
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <ToggleRow label="Speed Humps" sublabel="200m advance warning" active={alertPrefs.speedHumps} onToggle={() => toggleAlert('speedHumps')} />
                        <ToggleRow label="Road Damage" sublabel="Potholes, cracks, debris" active={alertPrefs.roadDamage} onToggle={() => toggleAlert('roadDamage')} />
                        <ToggleRow label="Speed Cameras" sublabel="Fixed and mobile cameras" active={alertPrefs.speedCameras} onToggle={() => toggleAlert('speedCameras')} />
                        <ToggleRow label="Dynamic Events" sublabel="Accidents, closures, hazards" active={alertPrefs.dynamicEvents} onToggle={() => toggleAlert('dynamicEvents')} />
                    </div>
                </div>

                {/* Sound Preference */}
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Navigation Sound
                    </p>
                    <div style={{
                        display: 'flex', gap: 0,
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: 12, overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                        {[
                            { key: 'unmute', label: 'Unmute', icon: <Volume2 size={14} /> },
                            { key: 'alerts', label: 'Alerts only', icon: <Bell size={14} /> },
                            { key: 'muted', label: 'Muted', icon: <VolumeX size={14} /> },
                        ].map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setSoundPref(opt.key)}
                                style={{
                                    flex: 1, padding: '12px 8px',
                                    background: soundPref === opt.key ? 'rgba(255,95,31,0.15)' : 'transparent',
                                    border: 'none',
                                    borderRight: opt.key !== 'muted' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                    color: soundPref === opt.key ? 'var(--primary-apex)' : 'var(--text-muted)',
                                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                    fontFamily: 'var(--font-main)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {opt.icon} {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 500, fontFamily: 'var(--font-display)', marginBottom: 16 }}>
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

                    <button
                        onClick={onOpenSandbox}
                        className="btn-glass"
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 16px', borderColor: 'var(--primary-apex)', color: 'white', borderRadius: 12
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}><Map size={18} color="var(--primary-apex)" /> 3D Flyover Studio</span>
                        <ChevronRight size={16} color="var(--primary-apex)" />
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
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

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: 'white',
    fontSize: 13,
    fontFamily: 'var(--font-main)',
    outline: 'none'
}

const PreferenceRow = ({ label, value }) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12
    }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{value}</span>
    </div>
)

const ToggleRow = ({ label, sublabel, active, onToggle }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12
    }}>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{label}</div>
            {sublabel && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sublabel}</div>}
        </div>
        <button onClick={onToggle} style={{
            width: 44, height: 24, borderRadius: 12,
            background: active ? 'var(--primary-apex)' : 'rgba(255,255,255,0.12)',
            border: 'none', cursor: 'pointer',
            position: 'relative', transition: 'background 0.25s', flexShrink: 0, padding: 0
        }}>
            <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'white',
                position: 'absolute', top: 3,
                left: active ? 23 : 3,
                transition: 'left 0.25s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }} />
        </button>
    </div>
)

const StatCard = ({ label, value, color }) => (
    <div style={{
        padding: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14, textAlign: 'center'
    }}>
        <p style={{ fontSize: 24, fontWeight: 800, color: color || 'white', marginBottom: 4 }}>{value}</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
    </div>
)

export default Profile
