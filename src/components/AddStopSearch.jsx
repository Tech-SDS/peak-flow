import React, { useState, useEffect } from 'react'
import { X, Search, MapPin } from 'lucide-react'
import { searchPlaces } from '../lib/searchService'

const AddStopSearch = ({ onClose, onSelect, location }) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        if (!query || query.length < 3) {
            setResults([])
            return
        }

        setIsSearching(true)
        const timer = setTimeout(async () => {
            try {
                const data = await searchPlaces(query, 5, location)
                setResults(data)
            } catch (err) {
                console.error('Search failed', err)
            } finally {
                setIsSearching(false)
            }
        }, 400)

        return () => clearTimeout(timer)
    }, [query, location])

    return (
        <div style={{
            position: 'absolute', inset: 0,
            zIndex: 2500,
            background: 'rgba(10, 10, 12, 0.95)',
            backdropFilter: 'blur(12px)',
            display: 'flex', flexDirection: 'column',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            {/* Header / Search Bar */}
            <div style={{
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: '10px 14px'
                }}>
                    <Search size={18} color="var(--text-secondary)" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search for a stop..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            background: 'transparent', border: 'none', color: 'white',
                            flex: 1, fontSize: 16, fontFamily: 'var(--font-main)', outline: 'none'
                        }}
                    />
                    {isSearching && (
                        <div style={{
                            width: 16, height: 16,
                            border: '2px solid rgba(255,255,255,0.2)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite'
                        }} />
                    )}
                </div>
            </div>

            {/* Results */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
                {results.length > 0 ? (
                    results.map((r, i) => (
                        <button
                            key={r.id || i}
                            onClick={() => onSelect(r)}
                            style={{
                                width: '100%',
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '16px 0',
                                background: 'none', border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                color: 'white', cursor: 'pointer', textAlign: 'left'
                            }}
                        >
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <MapPin size={18} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{r.name}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.details}</div>
                            </div>
                        </button>
                    ))
                ) : (
                    query.length > 2 && !isSearching && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No results found
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default AddStopSearch
