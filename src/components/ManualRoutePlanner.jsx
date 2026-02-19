import React, { useState, useEffect } from 'react'
import { X, MapPin, Plus, Sparkles, Navigation, Search } from 'lucide-react'
import { searchPlaces } from '../lib/searchService'

const ManualRoutePlanner = ({ onClose, onAIEntry, onStart }) => {
    const [startLocation, setStartLocation] = useState('Current Location')
    const [destination, setDestination] = useState('')
    const [destinationPlace, setDestinationPlace] = useState(null)
    const [results, setResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        if (!destination || destination.length < 3) {
            setResults([])
            return
        }
        setIsSearching(true)
        const timer = setTimeout(async () => {
            const data = await searchPlaces(destination, 5)
            setResults(data)
            setIsSearching(false)
        }, 400)
        return () => clearTimeout(timer)
    }, [destination])

    const handleSelectResult = (place) => {
        setDestination(place.name)
        setDestinationPlace(place)
        setResults([])
    }

    return (
        <div className="glass-sheet" style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '60vh',
            maxHeight: 500,
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 -10px 50px rgba(0,0,0,0.6)',
            animation: 'sheetUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 'var(--z-panel)',
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{ padding: '20px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Plan Route</h2>
                <button onClick={onClose} style={{
                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', cursor: 'pointer'
                }}>
                    <X size={18} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '0 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }} className="no-scrollbar">

                {/* Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Start */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-apex)' }} />
                        <input
                            type="text"
                            value={startLocation}
                            onChange={(e) => setStartLocation(e.target.value)}
                            style={{
                                background: 'transparent', border: 'none', color: 'white',
                                flex: 1, fontSize: 15, fontFamily: 'var(--font-main)', outline: 'none'
                            }}
                        />
                    </div>

                    {/* Destination */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 16px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderColor: destinationPlace ? 'var(--primary-apex)' : 'rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid white' }} />
                            <input
                                type="text"
                                placeholder="Where to?"
                                value={destination}
                                onChange={(e) => {
                                    setDestination(e.target.value)
                                    if (destinationPlace) setDestinationPlace(null)
                                }}
                                style={{
                                    background: 'transparent', border: 'none', color: 'white',
                                    flex: 1, fontSize: 15, fontFamily: 'var(--font-main)', outline: 'none'
                                }}
                            />
                            {isSearching ? (
                                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <Search size={18} color="var(--text-muted)" />
                            )}
                        </div>

                        {/* Search Results */}
                        {results.length > 0 && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                                background: 'rgba(25, 27, 32, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12, overflow: 'hidden', zIndex: 100
                            }}>
                                {results.map((r, i) => (
                                    <button
                                        key={r.id || i}
                                        onClick={() => handleSelectResult(r)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '12px 16px', background: 'none', border: 'none',
                                            borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                            color: 'white', cursor: 'pointer', textAlign: 'left'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <MapPin size={16} color="var(--primary-apex)" />
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.details}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Entry Point */}
                <button
                    onClick={onAIEntry}
                    style={{
                        padding: '16px',
                        marginTop: 8,
                        background: 'linear-gradient(135deg, rgba(255,95,31,0.15), rgba(255,95,31,0.05))',
                        border: '1px dashed rgba(255,95,31,0.4)',
                        borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        color: 'var(--primary-apex)',
                        fontSize: 15, fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <Sparkles size={18} />
                    AI route generator
                </button>

            </div>

            {/* Footer Action */}
            <div style={{
                padding: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                marginTop: 'auto'
            }}>
                <button
                    onClick={() => onStart(destinationPlace)}
                    disabled={!destinationPlace}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: 12,
                        background: destinationPlace ? 'var(--primary-apex)' : 'rgba(255,255,255,0.1)',
                        color: destinationPlace ? 'white' : 'rgba(255,255,255,0.3)',
                        border: 'none',
                        fontSize: 15, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        cursor: destinationPlace ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s'
                    }}
                >
                    <Navigation size={18} />
                    Generate Route
                </button>
            </div>
        </div>
    )
}

export default ManualRoutePlanner
