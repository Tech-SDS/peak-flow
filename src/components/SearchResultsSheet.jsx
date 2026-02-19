import React from 'react'
import { X, MapPin, Navigation } from 'lucide-react'

const SearchResultsSheet = ({
    results = [],
    onSelect,
    onClose
}) => {
    if (!results || results.length === 0) return null

    return (
        <div
            className="glass-sheet"
            style={{
                position: 'absolute', bottom: 70, left: 0, right: 0,
                maxHeight: '60%', // Takes up to 60% of screen
                zIndex: 'var(--z-panel)',
                borderTopLeftRadius: 24, borderTopRightRadius: 24,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                background: 'rgba(20, 24, 32, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '20px 20px 10px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                        Search Results
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {results.length} places found
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="btn-icon"
                    style={{ background: 'rgba(255,255,255,0.05)', width: 32, height: 32 }}
                >
                    <X size={18} />
                </button>
            </div>

            {/* List */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px 0',
                scrollbarWidth: 'thin'
            }} className="no-scrollbar">
                {results.map((result, index) => (
                    <div
                        key={result.id || index}
                        onClick={() => onSelect(result)}
                        style={{
                            padding: '16px 20px',
                            display: 'flex', alignItems: 'center', gap: 16,
                            cursor: 'pointer',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        {/* Icon */}
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'rgba(255,95,31,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <MapPin size={20} color="var(--primary-apex)" />
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 2 }} className="truncate">
                                {result.name}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }} className="truncate">
                                {result.details || 'Location'}
                            </div>
                        </div>

                        {/* Arrow */}
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Navigation size={14} color="var(--text-secondary)" style={{ transform: 'rotate(90deg)' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchResultsSheet
