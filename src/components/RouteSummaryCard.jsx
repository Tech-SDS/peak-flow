import React, { useState, useEffect } from 'react'
import { MapPin, Clock, Infinity, MoreVertical, Edit2, Camera, Plus, ChevronDown, ChevronUp, Navigation, ArrowUp, ArrowDown, Trash2, Save, X } from 'lucide-react'
import { reverseGeocode } from '../lib/searchService'
import { normalizeRoute } from '../lib/routeUtils'

// Helper to format duration
const formatDuration = (minutes) => {
    if (!minutes) return '0 min'
    if (minutes < 60) return `${minutes} min`
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}min`
}

// Helper to format distance
const formatDistance = (meters) => {
    if (!meters) return '0 m'
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
    return `${Math.round(meters)} m`
}

const RouteSummaryCard = ({
    route,
    onEdit,         // Callback to enter full edit mode
    onCancelEdit,   // Callback to cancel edit mode
    onSaveEdit,     // Callback to save changes
    isEditing = false,
    onStopUpdate,   // Callback when a stop is updated (desc/photos)
    readOnly = false, // If true, hides edit/add info controls
    showStartButton = false,
    showHeader = true,
    onStartDrive,
    userLocation // Need user location to reverse geocode if route start is current location
}) => {
    const [expandedStop, setExpandedStop] = useState(null) // ID or index of expanded stop for enrichment
    const [normalizedStops, setNormalizedStops] = useState([])
    const [editingStops, setEditingStops] = useState([])

    // Data Normalization Effect
    useEffect(() => {
        const loadStops = async () => {
            if (!route) return
            const stops = await normalizeRoute(route, userLocation)
            setNormalizedStops(stops)
            if (!isEditing) {
                setEditingStops(stops)
            }
        }
        loadStops()
    }, [route, userLocation])

    // Sync editing stops when entering edit mode
    useEffect(() => {
        if (isEditing) {
            setEditingStops([...normalizedStops])
        }
    }, [isEditing, normalizedStops])


    const handleMove = (index, direction) => {
        const newStops = [...editingStops]
        if (direction === 'up' && index > 0) {
            // Swap with prev, skipping if prev is start/immutable? Usually start is fixed? 
            // Let's assume start (index 0) is movable for now, or maybe only intermediate?
            // Usually Start/End are special. But let's allow full reorder for flexibility.
            // If index 0 is swapped, it's just the new start.
            [newStops[index], newStops[index - 1]] = [newStops[index - 1], newStops[index]]
        } else if (direction === 'down' && index < newStops.length - 1) {
            [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]]
        }
        setEditingStops(newStops)
    }

    const handleDelete = (index) => {
        const newStops = editingStops.filter((_, i) => i !== index)
        setEditingStops(newStops)
    }

    const stopsToRender = isEditing ? editingStops : normalizedStops

    if (!route) return null

    return (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* Header section */}
            {showHeader && (
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 4 }}>
                                {isEditing ? 'Editing Route' : route.name}
                            </h3>
                            {!isEditing && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                                        <Navigation size={12} />
                                        <span>{route.distance}km</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                                        <Clock size={12} />
                                        <span>{formatDuration(route.duration)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                                        <Infinity size={12} />
                                        <span>{route.curvinessIndex || route.curviness || '-'}/5</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!readOnly && (
                            isEditing ? (
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={onCancelEdit} style={{
                                        background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8,
                                        padding: 8, color: 'var(--text-secondary)', cursor: 'pointer'
                                    }}>
                                        <X size={16} />
                                    </button>
                                    <button onClick={() => onSaveEdit(editingStops)} style={{
                                        background: 'var(--primary-apex)', border: 'none', borderRadius: 8,
                                        padding: 8, color: 'white', cursor: 'pointer'
                                    }}>
                                        <Save size={16} />
                                    </button>
                                </div>
                            ) : (
                                onEdit && (
                                    <button onClick={onEdit} style={{
                                        background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8,
                                        padding: 8, color: 'var(--text-secondary)', cursor: 'pointer'
                                    }}>
                                        <Edit2 size={16} />
                                    </button>
                                )
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Timeline Section */}
            <div className="waypoint-timeline" style={{ padding: '20px 20px 20px 36px' }}>
                {stopsToRender.map((stop, i) => (
                    <React.Fragment key={i}>
                        {/* Connector Line (skip for first item) */}
                        {i > 0 && (
                            <div style={{
                                paddingLeft: 16, paddingBottom: 12, paddingTop: 4, marginLeft: -16,
                                borderLeft: '2px solid rgba(255, 95, 31, 0.2)',
                                fontSize: 11, color: 'var(--text-muted)',
                                display: 'flex', alignItems: 'center',
                                position: 'relative', left: -7 // Align with dots
                            }}>
                                <span style={{ background: '#1a1d24', padding: '2px 6px', borderRadius: 4, marginLeft: 8 }}>
                                    {isEditing ? '---' : formatDistance(stop.distanceFromPrev)}
                                </span>
                            </div>
                        )}

                        {/* Stop Item */}
                        <div className="waypoint-item" style={{ marginLeft: -8, paddingRight: isEditing ? 8 : 0 }}>
                            {/* Dot Indicator */}
                            <div style={{
                                width: 12, height: 12, borderRadius: '50%',
                                background: stop.type === 'start' ? 'var(--primary-apex)' : (stop.type === 'destination' ? 'var(--sss-apex)' : '#1a1d24'),
                                border: `2px solid ${stop.type === 'start' ? 'var(--primary-apex)' : (stop.type === 'destination' ? 'var(--sss-apex)' : 'white')}`,
                                position: 'absolute', left: -28, zIndex: 2, top: 4
                            }}></div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div className="waypoint-name" style={{ fontSize: 14, fontWeight: 600 }}>{stop.name}</div>
                                        <div className="waypoint-type" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                            {stop.details || (stop.type === 'start' ? 'Start Point' : stop.type === 'destination' ? 'Destination' : 'Stop')}
                                        </div>
                                    </div>

                                    {/* Edit Controls vs Enrichment Trigger */}
                                    {!readOnly && (
                                        isEditing ? (
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <button onClick={() => handleMove(i, 'up')} disabled={i === 0} style={{ background: 'none', border: 'none', color: i === 0 ? 'rgba(255,255,255,0.1)' : 'var(--text-secondary)', cursor: i === 0 ? 'default' : 'pointer', padding: 4 }}>
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button onClick={() => handleMove(i, 'down')} disabled={i === stopsToRender.length - 1} style={{ background: 'none', border: 'none', color: i === stopsToRender.length - 1 ? 'rgba(255,255,255,0.1)' : 'var(--text-secondary)', cursor: i === stopsToRender.length - 1 ? 'default' : 'pointer', padding: 4 }}>
                                                    <ArrowDown size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(i)} style={{ background: 'none', border: 'none', color: 'var(--sss-danger)', cursor: 'pointer', padding: 4, marginLeft: 8 }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            stop.type === 'stop' && (
                                                <button
                                                    onClick={() => setExpandedStop(expandedStop === i ? null : i)}
                                                    style={{ background: 'none', border: 'none', color: stop.description || stop.photos ? 'var(--primary-apex)' : 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                                                >
                                                    {expandedStop === i ? <ChevronUp size={16} /> : (stop.description || stop.photos ? <MoreVertical size={16} /> : <Plus size={16} />)}
                                                </button>
                                            )
                                        )
                                    )}
                                </div>

                                {/* Expanded Enrichment UI (Only in View Mode) */}
                                {!isEditing && expandedStop === i && (
                                    <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <textarea
                                            placeholder="What's happening here? (e.g. Lunch break)"
                                            value={stop.description || ''}
                                            onChange={(e) => onStopUpdate && onStopUpdate(stop.index, { description: e.target.value })}
                                            style={{
                                                width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 6, padding: 8, color: 'white', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', minHeight: 60
                                            }}
                                        />
                                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                            <button style={{
                                                display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                                                background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)',
                                                color: 'var(--text-secondary)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer'
                                            }}>
                                                <Camera size={14} /> Add Photo
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                ))}

                {/* Add Stop Button in Edit Mode */}
                {isEditing && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <button onClick={async () => {
                            if (onAddStop) {
                                const newStop = await onAddStop()
                                if (newStop) {
                                    setEditingStops(prev => [...prev, newStop])
                                }
                            }
                        }} style={{
                            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
                            background: 'rgba(255,95,31,0.1)', border: '1px dashed var(--primary-apex)',
                            color: 'var(--primary-apex)', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', width: '100%', justifyContent: 'center'
                        }}>
                            <Plus size={16} /> Add Stop
                        </button>
                    </div>
                )}
            </div>

            {/* Optional Footer Action */}
            {showStartButton && !isEditing && (
                <div style={{ padding: 20, paddingTop: 0 }}>
                    <button onClick={onStartDrive} className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: 48 }}>
                        <Navigation size={18} style={{ marginRight: 8 }} /> Start Navigation
                    </button>
                </div>
            )}
        </div>
    )
}

export default RouteSummaryCard
