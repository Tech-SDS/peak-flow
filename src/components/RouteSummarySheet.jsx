import React from 'react'
import { MapPin, Clock, Activity, Heart, ChevronUp, Verified } from 'lucide-react'
import { getSSSColor, formatDuration, getCurvinessLabel } from '../lib/sssEngine'

const RouteSummarySheet = ({ route, onClose, onExpand, onStartDrive, onFormConvoy }) => {
    if (!route) return null

    const sssInfo = getSSSColor(route.sss)

    return (
        <div className="glass-sheet" style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '42%',
            zIndex: 'var(--z-sheet)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
            animation: 'sheetUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            {/* Drag Handle */}
            <div
                onClick={onExpand}
                style={{
                    display: 'flex', justifyContent: 'center',
                    padding: '10px 0 4px',
                    cursor: 'pointer'
                }}
            >
                <div style={{
                    width: 36, height: 4,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.2)'
                }} />
            </div>

            {/* Content */}
            <div style={{ padding: '4px 20px 0', flex: 1, overflowY: 'auto' }}>
                {/* Hero Row */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                    <img
                        src={route.image || `https://picsum.photos/seed/${route.id}/200/140`}
                        alt={route.name}
                        style={{
                            width: 80, height: 80,
                            borderRadius: 12,
                            objectFit: 'cover',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 4 }}>
                            {route.name}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                            {route.authorVerified && <Verified size={13} color="var(--primary-apex)" />}
                            <span>{route.author || 'Peak Flow Curated'}</span>
                        </div>
                    </div>
                </div>

                {/* Vitals Bar */}
                <div style={{
                    display: 'flex',
                    gap: 0,
                    padding: '14px 0',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                    {/* Distance */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
                            <MapPin size={13} color="var(--text-secondary)" />
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Distance</span>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{route.distance} km</span>
                    </div>

                    {/* Duration */}
                    <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
                            <Clock size={13} color="var(--text-secondary)" />
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Est. Time</span>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{formatDuration(route.duration)}</span>
                    </div>

                    {/* SSS Badge */}
                    <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>SSS</span>
                        </div>
                        <span className={`sss-badge sss-badge--${sssInfo.tier}`}>
                            {route.sss}
                        </span>
                    </div>

                    {/* Curviness */}
                    <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
                            <Activity size={13} color="var(--text-secondary)" />
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Curves</span>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{route.curvinessIndex || '—'}/5</span>
                    </div>
                </div>

                {/* Hearts */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 0', fontSize: 13, color: 'var(--text-secondary)'
                }}>
                    <Heart size={14} color="var(--primary-apex)" fill="var(--primary-apex)" />
                    <span>{route.hearts || 0} favorites</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>Swipe up for details</span>
                    <ChevronUp size={14} color="var(--text-muted)" />
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div style={{
                padding: '12px 20px',
                paddingBottom: 20,
                display: 'flex', gap: 10,
                borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
                <button onClick={onStartDrive} className="btn-primary" style={{
                    flex: 2, padding: '14px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontSize: 15, fontWeight: 700
                }}>
                    ▶ Start Drive
                </button>
                <button onClick={onFormConvoy} className="btn-glass" style={{
                    flex: 1, padding: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontSize: 13
                }}>
                    👥 Convoy
                </button>
            </div>
        </div>
    )
}

export default RouteSummarySheet
