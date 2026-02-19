import React, { useState, useEffect, useCallback } from 'react'
import { MapPin, Navigation, Save, X, Plus, Trash2, RotateCcw } from 'lucide-react'
import { searchPlaces, reverseGeocode } from '../lib/searchService'

const RouteEditor = ({ route, onSave, onCancel, onUpdatePreview }) => {
    const [name, setName] = useState(route.name || "Custom Route")
    const [stops, setStops] = useState([]) // Array of { address: string, lat, lng }
    const [isProcessing, setIsProcessing] = useState(false)

    // Init stops from route waypoints
    useEffect(() => {
        const initStops = async () => {
            if (!route.waypoints) return
            setIsProcessing(true)
            const loadedStops = await Promise.all(route.waypoints.map(async (wp) => {
                // If we already have a name/address, use it. Otherwise reverse geocode.
                const address = wp.name || await reverseGeocode(wp.lat, wp.lng)
                return { ...wp, address }
            }))
            setStops(loadedStops)
            setIsProcessing(false)
        }
        initStops()
    }, [route]) // Run once on mount (or when route changes)

    const handleAddressChange = (index, val) => {
        const newStops = [...stops]
        newStops[index] = { ...newStops[index], address: val }
        setStops(newStops)
    }

    const handleAddressBlur = async (index) => {
        const stop = stops[index]
        if (!stop.address) return

        setIsProcessing(true)
        const results = await searchPlaces(stop.address, 1)
        if (results && results.length > 0) {
            const coords = results[0]
            const newStops = [...stops]
            newStops[index] = { ...newStops[index], lat: coords.lat, lng: coords.lng, name: coords.name }
            setStops(newStops)
            // Trigger preview update
            onUpdatePreview({ ...route, waypoints: newStops, name })
        }
        setIsProcessing(false)
    }

    const addStop = () => {
        setStops([...stops, { address: '', lat: 0, lng: 0 }])
    }

    const removeStop = (index) => {
        const newStops = stops.filter((_, i) => i !== index)
        setStops(newStops)
        onUpdatePreview({ ...route, waypoints: newStops, name })
    }

    const handleSave = () => {
        onSave({ ...route, waypoints: stops, name })
    }

    return (
        <div style={{
            position: 'absolute', top: 20, left: 20,
            height: 'calc(100% - 40px)', // Dynamic height
            maxHeight: 800,
            width: 360,
            zIndex: 'var(--z-panel)',
            display: 'flex', flexDirection: 'column',
            boxSizing: 'border-box'
        }} className="glass-panel no-scrollbar">

            {/* Header */}
            <div style={{ padding: 20, borderBottom: 'var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Navigation size={20} color="var(--primary-apex)" /> Edit Route
                </h2>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: 20, overflowY: 'auto' }} className="no-scrollbar">

                {/* Route Name */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>ROUTE NAME</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            color: 'white', fontSize: 14, fontWeight: 600,
                            fontFamily: 'var(--font-main)',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Route Summary */}
                <div style={{
                    display: 'flex', gap: 12, marginBottom: 24,
                    padding: '12px', background: 'rgba(255,255,255,0.03)',
                    borderRadius: 12, border: 'var(--border-glass)'
                }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>
                            {route.distance}<span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 2 }}>km</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distance</div>
                    </div>
                    <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>
                            {Math.floor(route.duration / 60)}<span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 2 }}>h</span> {route.duration % 60}<span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 2 }}>m</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</div>
                    </div>
                    {route.sss && (
                        <>
                            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: route.sss >= 9 ? 'var(--sss-apex)' : 'var(--sss-good)' }}>
                                    {route.sss}
                                </div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>SSS</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Stops */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>STOPS</label>

                    {stops.map((stop, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8 }}>
                            <div style={{ paddingTop: 10 }}>
                                <MapPin size={16} color={i === 0 ? 'var(--sss-good)' : i === stops.length - 1 ? 'var(--sss-apex)' : 'var(--text-muted)'} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <input
                                    value={stop.address}
                                    onChange={e => handleAddressChange(i, e.target.value)}
                                    onBlur={() => handleAddressBlur(i)}
                                    placeholder={i === 0 ? "Start location" : i === stops.length - 1 ? "Destination" : "Stop"}
                                    style={{
                                        width: '100%', padding: '10px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        color: 'white', fontSize: 13,
                                        fontFamily: 'var(--font-main)',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            {stops.length > 2 && (
                                <button
                                    onClick={() => removeStop(i)}
                                    style={{ background: 'none', border: 'none', color: 'var(--sss-danger)', cursor: 'pointer', opacity: 0.6 }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={addStop}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            padding: '8px', marginTop: 8,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px dashed rgba(255,255,255,0.2)',
                            borderRadius: 8,
                            color: 'var(--text-secondary)', fontSize: 12,
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={14} /> Add Stop
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div style={{ padding: 20, borderTop: 'var(--border-glass)', display: 'flex', gap: 10, flexShrink: 0 }}>
                <button
                    onClick={onCancel}
                    className="btn-glass"
                    style={{ flex: 1, justifyContent: 'center' }}
                >
                    Discard
                </button>
                <button
                    onClick={handleSave}
                    className="btn-primary"
                    disabled={isProcessing}
                    style={{ flex: 1, justifyContent: 'center' }}
                >
                    {isProcessing ? 'Updating...' : <><Save size={16} style={{ marginRight: 6 }} /> Save Route</>}
                </button>
            </div>
        </div>
    )
}

export default RouteEditor
