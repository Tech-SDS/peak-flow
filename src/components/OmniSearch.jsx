import React, { useState, useMemo, useEffect } from 'react'
import { Search, X, MapPin, Plus, Clock, Sparkles } from 'lucide-react'
import { searchPlaces } from '../lib/searchService'

const FILTERS = [
    { id: 'sports', label: '🏎️ Sports car' },
    { id: 'quick', label: '⏱️ 1-2h' },
    { id: 'half', label: '🌤️ 3-5h' },
    { id: 'full', label: '🌍 >5h' },
    { id: 'multiday', label: '🗓️ >1 day' },
    { id: 'challenging', label: '🔥 Challenging' },
    { id: 'relaxed', label: '🧘 Relaxed' }
]

const OmniSearch = ({ routes = [], onRouteSelect, onManualPlan, onAutoCreate, onSearch, activeFilters = new Set(), onFilterToggle, onLocationSelect, history = [], onSubmit, location }) => {
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)

    // Debounced Search Handler
    useEffect(() => {
        if (!query || query.length < 3) {
            setSearchResults([])
            return
        }

        const timeoutId = setTimeout(async () => {
            try {
                const results = await searchPlaces(query, 5, location)
                setSearchResults(results)
            } catch (err) {
                console.error('Autocomplete failed', err)
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query, location])

    const showDropdown = isFocused && (query.length > 0 || history.length > 0)

    const handleResultClick = (result) => {
        setQuery(result.name)
        setIsFocused(false)
        if (onLocationSelect) {
            onLocationSelect({
                id: result.id,
                lat: result.lat,
                lng: result.lng,
                name: result.name,
                details: result.details,
                type: result.type,
                zoom: 14
            })
        }
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            padding: '56px 20px 0',
            zIndex: 'var(--z-overlay)',
            pointerEvents: 'none'
        }}>
            {/* Search Row: Search Bar + Create Button */}
            <div style={{ display: 'flex', gap: 10, pointerEvents: 'auto', alignItems: 'stretch' }}>

                {/* Search Bar Container */}
                <div className="glass-overlay" style={{
                    flex: isFocused ? 1 : 3, // 100% when focused (since sibling hides), else 75%
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: isFocused ? '1px solid rgba(255,95,31,0.3)' : undefined
                }}>
                    <Search size={18} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Where next?"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value) }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSubmit?.(query)
                                setIsFocused(false)
                            }
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            flex: 1,
                            fontSize: 15,
                            fontFamily: 'var(--font-main)',
                            outline: 'none',
                            minWidth: 0 // Prevents flex issues
                        }}
                    />
                    {query && (
                        <button
                            onClick={() => { setQuery(''); onSearch?.('') }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Create Button - Hides when search is focused */}
                <button
                    onClick={onManualPlan}
                    style={{
                        flex: 1, // 25% relative to search bar's 3
                        padding: '0 16px',
                        display: isFocused ? 'none' : 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: 'linear-gradient(135deg, rgba(255,95,31,0.15) 0%, rgba(255,95,31,0.08) 100%)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,95,31,0.35)',
                        borderRadius: 'var(--border-radius)',
                        color: 'var(--primary-apex)',
                        fontSize: 13, fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(255,95,31,0.15)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        opacity: isFocused ? 0 : 1,
                        width: isFocused ? 0 : 'auto',
                        transform: isFocused ? 'scale(0.95)' : 'scale(1)'
                    }}
                >
                    <Sparkles size={16} />
                    <span>Create</span>
                </button>
            </div>

            {/* Quick Filters */}
            <div style={{
                marginTop: 12,
                display: 'flex', gap: 8,
                overflowX: 'auto',
                paddingBottom: 4,
                pointerEvents: 'auto',
                scrollbarWidth: 'none'
            }} className="no-scrollbar">
                {FILTERS.map(filter => (
                    <div
                        key={filter.id}
                        className={`filter-chip ${activeFilters.has(filter.id) ? 'active' : ''}`}
                        onClick={() => onFilterToggle?.(filter.id)}
                    >
                        {filter.label}
                    </div>
                ))}
            </div>

            {/* ─── Search Results Dropdown ─── */}
            {showDropdown && (
                <div style={{
                    marginTop: 8,
                    position: 'absolute',
                    top: 100, // Just below search bar (56px padding + ~44px height)
                    left: 20, right: 20,
                    zIndex: 2000,
                    background: 'rgba(20, 24, 32, 0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: 16,
                    border: 'var(--border-glass)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    animation: 'slideDown 0.2s ease-out'
                }}>
                    {isSearching ? (
                        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                            Searching...
                        </div>
                    ) : (query.length === 0 && history.length > 0) ? (
                        <div>
                            <div style={{
                                padding: '12px 16px 4px', fontSize: 11, fontWeight: 700,
                                color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase'
                            }}>
                                Recent Controls
                            </div>
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleResultClick(item)}
                                    style={{
                                        padding: '12px 16px',
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        cursor: 'pointer',
                                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Clock size={16} color="var(--text-secondary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{item.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.details}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <div
                                key={result.id}
                                onClick={() => handleResultClick(result)}
                                style={{
                                    padding: '12px 16px',
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    cursor: 'pointer',
                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <MapPin size={16} color="var(--text-secondary)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{result.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{result.details}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default OmniSearch
