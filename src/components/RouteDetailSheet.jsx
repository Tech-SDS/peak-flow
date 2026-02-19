import React, { useState } from 'react'
import { X, MapPin, Clock, Activity, Heart, Share2, Navigation, Users, AlertTriangle, Mountain, Gauge, Camera, Flag, Verified, Star, Infinity } from 'lucide-react'
import { getSSSColor, getChassisThreats, formatDuration, getCurvinessLabel } from '../lib/sssEngine'
import SSSInfoCard from './SSSInfoCard'

const RouteDetailSheet = ({
    route,
    onClose,
    onStartDrive,
    onFormConvoy,
    isFavorite,
    isBucketListed,
    onToggleFavorite,
    onToggleBucketList
}) => {
    if (!route) return null

    const [showSSSInfo, setShowSSSInfo] = useState(false)

    const sssInfo = getSSSColor(route.sss)
    const threats = getChassisThreats(route)

    return (
        <>
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 'var(--z-modal)',
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.25s ease'
            }}>
                {/* Backdrop */}
                <div
                    onClick={onClose}
                    style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)'
                    }}
                />

                {/* Sheet */}
                <div className="glass-sheet" style={{
                    position: 'absolute',
                    bottom: 70, left: 0, right: 0,
                    height: '85vh',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 -10px 50px rgba(0,0,0,0.6)',
                    animation: 'sheetUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    {/* Header with hero image */}
                    <div style={{ position: 'relative', height: 200, flexShrink: 0, overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
                        <img
                            src={route.image || `https://picsum.photos/seed/${route.id}/800/400`}
                            alt={route.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, #1a1d24, #2c3e50)' }}
                        />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(transparent 30%, rgba(15,17,21,0.95) 100%)'
                        }} />

                        {/* Close */}
                        <button onClick={onClose} style={{
                            position: 'absolute', top: 16, right: 16,
                            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                            border: 'none', borderRadius: '50%',
                            width: 36, height: 36,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer'
                        }}>
                            <X size={18} />
                        </button>

                        {/* Title overlay */}
                        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, marginBottom: 4 }}>{route.name}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
                                <span>{route.region}</span>
                                <span style={{ opacity: 0.4 }}>·</span>
                                <span style={{ color: 'var(--text-muted)' }}>Curated by</span>
                                {route.authorVerified && <Verified size={13} color="var(--primary-apex)" />}
                                <span style={{ fontWeight: 500 }}>{route.author || 'Peak Flow'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }} className="no-scrollbar">
                        {/* Vitals Grid */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 8, marginBottom: 24
                        }}>
                            <VitalCard icon={<MapPin size={16} />} label="Total Distance" value={`${route.distance} km`} />
                            <VitalCard icon={<Clock size={16} />} label="Est. Time" value={formatDuration(route.duration)} />
                            <VitalCard
                                icon={<Gauge size={16} color={sssInfo.color} />}
                                label="SSS"
                                value={route.sss}
                                valueColor={sssInfo.color}
                                badge={sssInfo.label}
                                onInfoClick={() => setShowSSSInfo(true)}
                            />
                            <VitalCard icon={<Infinity size={18} color="var(--primary-apex)" />} label="Curviness" value={`${route.curvinessIndex}/5`} sub={getCurvinessLabel(route.curvinessIndex)} />
                        </div>

                        {/* Gallery & Waypoints — placed above Route Details */}
                        {(route.gallery?.length > 0 || route.waypoints?.length > 0) && (
                            <Section title="Gallery & Waypoints">
                                {/* Gallery */}
                                {route.gallery?.length > 0 && (
                                    <div style={{ marginBottom: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                            <Camera size={13} color="var(--text-secondary)" />
                                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Community Photos</span>
                                        </div>
                                        <div className="gallery-strip">
                                            {route.gallery.map((url, i) => (
                                                <img key={i} src={url} alt={`Gallery ${i + 1}`} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Waypoints Timeline */}
                                {route.waypoints?.length > 0 && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                            <Flag size={13} color="var(--text-secondary)" />
                                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Planned Stops</span>
                                        </div>
                                        <div className="waypoint-timeline">
                                            {route.waypoints.map((wp, i) => (
                                                <div key={i} className={`waypoint-item waypoint-${wp.type}`}>
                                                    <span className="waypoint-name">{wp.name}</span>
                                                    <span className={`waypoint-type waypoint-type-${wp.type}`}>
                                                        {wp.type === 'scenic' ? '📸 Scenic' : wp.type === 'fuel' ? '⛽ Fuel' : '☕ Rest'}
                                                    </span>
                                                    <span className="waypoint-dist">{wp.distanceKm} km</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Section>
                        )}

                        {/* ─── Route Details ─── */}
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#fff' }}>Route Details</h3>

                        {/* Surface Composition */}
                        {route.surface && (
                            <Section title="Surface Composition">
                                <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                                    <div style={{ width: `${route.surface.asphalt || 0}%`, background: 'var(--sss-apex)' }} />
                                    <div style={{ width: `${route.surface.concrete || 0}%`, background: 'var(--sss-good)' }} />
                                    <div style={{ width: `${route.surface.cobblestone || 0}%`, background: 'var(--sss-caution)' }} />
                                    <div style={{ width: `${route.surface.gravel || 0}%`, background: 'var(--sss-danger)' }} />
                                </div>
                                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sss-apex)' }} /> Asphalt {route.surface.asphalt || 0}%
                                    </span>
                                    {(route.surface.concrete > 0) && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sss-good)' }} /> Concrete {route.surface.concrete}%
                                        </span>
                                    )}
                                    {(route.surface.cobblestone > 0) && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sss-caution)' }} /> Cobbles {route.surface.cobblestone}%
                                        </span>
                                    )}
                                    {(route.surface.gravel > 0) && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--sss-danger)' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sss-danger)' }} /> Gravel {route.surface.gravel}%
                                        </span>
                                    )}
                                </div>
                                {(route.surface.gravel > 0) && (
                                    <div className="surface-alert">
                                        <AlertTriangle size={14} />
                                        <span>⚠️ {route.surface.gravel}% of this route is gravel — high chassis risk</span>
                                    </div>
                                )}
                                {(route.surface.cobblestone > 10) && (
                                    <div className="surface-alert" style={{ background: 'rgba(255, 214, 0, 0.08)', borderColor: 'rgba(255, 214, 0, 0.2)', color: 'var(--sss-caution)' }}>
                                        <AlertTriangle size={14} />
                                        <span>⚠️ Significant cobblestone sections detected</span>
                                    </div>
                                )}
                            </Section>
                        )
                        }

                        {/* Elevation Profile */}
                        {route.elevation && (
                            <Section title="Elevation & Gradient Profile">
                                <div style={{
                                    height: 140, borderRadius: 12,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: 'var(--border-glass)',
                                    position: 'relative',
                                    marginBottom: 10,
                                    padding: '10px 10px 20px 30px' // Added padding for axes
                                }}>
                                    {/* Axis Titles */}
                                    <div style={{ position: 'absolute', top: 5, left: 5, fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>Elevation (m)</div>
                                    <div style={{ position: 'absolute', bottom: 5, right: 10, fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>Distance (km)</div>

                                    {/* Y-Axis Labels */}
                                    <div style={{ position: 'absolute', left: 4, top: 30, fontSize: 8, color: 'var(--text-secondary)' }}>{route.elevation.max}</div>
                                    <div style={{ position: 'absolute', left: 4, bottom: 30, fontSize: 8, color: 'var(--text-secondary)' }}>{route.elevation.min || 0}</div>

                                    <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="elevGradDt" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--primary-apex)" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="var(--primary-apex)" stopOpacity="0.02" />
                                            </linearGradient>
                                        </defs>

                                        {/* Grid Lines */}
                                        <line x1="0" y1="0" x2="300" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2 2" />
                                        <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2 2" />
                                        <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                                        <path d="M0,85 C30,80 50,55 75,48 C100,40 120,60 150,30 C180,12 200,25 220,18 C240,22 260,38 280,35 L300,40 L300,100 L0,100 Z" fill="url(#elevGradDt)" />
                                        <path d="M0,85 C30,80 50,55 75,48 C100,40 120,60 150,30 C180,12 200,25 220,18 C240,22 260,38 280,35 L300,40" fill="none" stroke="var(--primary-apex)" strokeWidth="2" />

                                        {/* X-Axis Labels */}
                                        <text x="0" y="115" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter" textAnchor="start">0</text>
                                        <text x="150" y="115" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter" textAnchor="middle">{Math.round(route.distance / 2)}</text>
                                        <text x="300" y="115" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter" textAnchor="end">{route.distance}</text>
                                    </svg>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 12 }}>
                                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, textAlign: 'center' }}>
                                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Elevation Gain</p>
                                        <p style={{ fontWeight: 700 }}>{route.elevation.gain}m</p>
                                    </div>
                                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, textAlign: 'center' }}>
                                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Max Altitude</p>
                                        <p style={{ fontWeight: 700 }}>{route.elevation.max}m</p>
                                    </div>
                                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, textAlign: 'center' }}>
                                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Max Grade</p>
                                        <p style={{ fontWeight: 700, color: Math.abs(route.elevation.maxGradient) >= 10 ? 'var(--primary-apex)' : '#fff' }}>
                                            +{route.elevation.maxGradient}%
                                        </p>
                                    </div>
                                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, textAlign: 'center' }}>
                                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Min Grade</p>
                                        <p style={{ fontWeight: 700 }}>{route.elevation.minGradient}%</p>
                                    </div>
                                </div>
                            </Section>
                        )}

                        {/* Chassis Threats */}
                        {threats.length > 0 && (
                            <Section title="Chassis Threats">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {threats.map((threat, i) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '10px 14px',
                                            background: 'rgba(255,23,68,0.06)',
                                            border: '1px solid rgba(255,23,68,0.12)',
                                            borderRadius: 12
                                        }}>
                                            <span style={{ fontSize: 18 }}>{threat.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 13, fontWeight: 500 }}>{threat.label}</p>
                                                {threat.timeAgo && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Reported {threat.timeAgo}</p>}
                                                <p style={{ fontSize: 11, color: 'var(--sss-danger)' }}>−{threat.deduction.toFixed(1)} SSS points</p>
                                            </div>
                                            <AlertTriangle size={16} color="var(--sss-danger)" />
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}



                        {/* Hearts / Social */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 16,
                            padding: '16px 0',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            fontSize: 14
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                                <Heart size={16} color="var(--primary-apex)" fill="var(--primary-apex)" /> {route.hearts || 0} favorites
                            </span>
                        </div>
                    </div>

                    {/* ─── Standardized Sticky Action Bar ─── */}
                    <div style={{
                        padding: '14px 20px 24px',
                        display: 'flex', gap: 10,
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        flexShrink: 0,
                        alignItems: 'center'
                    }}>
                        <button onClick={onStartDrive} className="btn-primary" style={{
                            flex: 2, padding: '12px 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            fontSize: 15, fontWeight: 700
                        }}>
                            <Navigation size={18} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span>Start Navigation</span>
                                <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>Distance to start: {route.distanceFromUser || '?'} km</span>
                            </div>
                        </button>
                        <button onClick={onFormConvoy} className="btn-glass" style={{
                            flex: 1, padding: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            fontSize: 13, minWidth: '100px'
                        }}>
                            <Users size={16} /> Convoy
                        </button>

                        <div style={{ display: 'flex', gap: 6 }}>
                            {/* Bucket List (Star) */}
                            <button
                                className={`action-icon-btn ${isBucketListed ? 'star-active' : ''}`}
                                onClick={onToggleBucketList}
                                style={{ color: isBucketListed ? '#fbbf24' : 'white', width: 48, height: 48 }}
                            >
                                <Star size={20} fill={isBucketListed ? '#fbbf24' : 'none'} />
                            </button>

                            {/* Favorites (Heart) */}
                            <button
                                className={`action-icon-btn ${isFavorite ? 'heart-active' : ''}`}
                                onClick={onToggleFavorite}
                                style={{ width: 48, height: 48 }}
                            >
                                <Heart size={20} fill={isFavorite ? '#ff1744' : 'none'} color={isFavorite ? '#ff1744' : 'white'} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SSS Info Overlay */}
            {showSSSInfo && <SSSInfoCard onClose={() => setShowSSSInfo(false)} />}
        </>
    )
}

// ─── Helper Components ───
const Section = ({ title, children }) => (
    <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</h4>
        {children}
    </div>
)

const VitalCard = ({ icon, label, value, valueColor, sub, badge, onInfoClick }) => (
    <div style={{
        padding: '14px 6px',
        background: 'rgba(255,255,255,0.03)',
        border: 'var(--border-glass)',
        borderRadius: 12,
        textAlign: 'center'
    }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, color: 'var(--text-secondary)' }}>{icon}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, marginBottom: 4 }}>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</p>
            {onInfoClick && (
                <button className="sss-info-btn" onClick={(e) => { e.stopPropagation(); onInfoClick() }}>i</button>
            )}
        </div>
        <p style={{ fontSize: 16, fontWeight: 800, color: valueColor || 'white' }}>{value}</p>
        {badge && <span style={{ fontSize: 9, color: valueColor, fontWeight: 600 }}>{badge}</span>}
        {sub && <p style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{sub}</p>}
    </div>
)

export default RouteDetailSheet
