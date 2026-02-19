import React, { useState, useReducer, useRef, useEffect, useCallback } from 'react'
import { Plus, Users, Share2, MapPin, Navigation, Calendar, Clock, Trash2, Camera, X, MessageSquare, Image as ImageIcon, ArrowLeft, ArrowRight, ChevronRight, ChevronLeft, Info, Settings, MoreVertical, Send, Check, AlertTriangle, Sparkles, Radio, QrCode, Zap, Route, MessageCircle, Wifi, WifiOff, Mic, Map as MapIcon } from 'lucide-react'
import { calculateMultiStopRoute } from '../lib/routing'
import { reverseGeocode } from '../lib/searchService'
import RouteSummaryCard from '../components/RouteSummaryCard'
import { MOCK_ROUTES, MOCK_GROUPS } from '../lib/mockData'

// ... Mock Data ...

// ─── Convoy State Machine ───
const MOCK_CONTACTS = [
    { id: 'u2', name: 'Jasper M.', vehicle: 'Porsche 911 GT3', username: '@jasper_m' },
    { id: 'u3', name: 'Max T.', vehicle: 'BMW M4', username: '@max_t' },
    { id: 'u4', name: 'Lisa R.', vehicle: 'Audi RS6', username: '@lisa_r' },
    { id: 'u5', name: 'Tom W.', vehicle: 'Mercedes AMG GT', username: '@tom_w' },
    { id: 'u6', name: 'Anna B.', vehicle: 'Porsche Cayman GT4', username: '@anna_b' },
    { id: 'u7', name: 'Chris D.', vehicle: 'Nissan GT-R', username: '@chris_d' },
]
const MOCK_USERS = MOCK_CONTACTS

// ─── Mock chat messages ───
const INITIAL_MESSAGES = [
    { id: 'm1', userId: 'u1', name: 'Stefan K.', text: 'Convoy created! Who\'s in? 🏎️', time: '15:30' },
]

// ─── Convoy State Machine ───
const initialState = {
    phase: 'lobby', // lobby | building | summary | driving | ended
    convoy: null,
    tether: { status: 'connected', gaps: [] }
}

function convoyReducer(state, action) {
    switch (action.type) {
        case 'CREATE_CONVOY':
            return {
                ...state,
                phase: 'building',
                convoy: {
                    id: 'convoy-' + Date.now(),
                    title: '',
                    description: '',
                    coverImage: null,
                    code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                    route: null,
                    members: [MOCK_USERS[0]],
                    schedule: 'instant', // 'instant' | ISO date string
                    gallery: [],
                    messages: [...INITIAL_MESSAGES],
                }
            }
        case 'JOIN_CONVOY':
            return {
                ...state,
                phase: 'summary',
                convoy: {
                    id: 'convoy-joined',
                    title: action.payload?.title || 'Joined Convoy',
                    description: 'A group drive with friends',
                    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
                    code: action.payload?.code || '------',
                    route: action.payload?.route || null,
                    members: [MOCK_USERS[0], MOCK_USERS[1]],
                    schedule: 'instant',
                    gallery: [],
                    messages: [...INITIAL_MESSAGES],
                }
            }
        case 'SET_TITLE':
            return { ...state, convoy: { ...state.convoy, title: action.payload } }
        case 'SET_DESCRIPTION':
            return { ...state, convoy: { ...state.convoy, description: action.payload } }
        case 'SET_COVER':
            return { ...state, convoy: { ...state.convoy, coverImage: action.payload } }
        case 'SET_SCHEDULE':
            return { ...state, convoy: { ...state.convoy, schedule: action.payload } }
        case 'ADD_MEMBER':
            if (state.convoy.members.find(m => m.id === action.payload.id)) return state
            return { ...state, convoy: { ...state.convoy, members: [...state.convoy.members, action.payload] } }
        case 'REMOVE_MEMBER':
            return { ...state, convoy: { ...state.convoy, members: state.convoy.members.filter(m => m.id !== action.payload) } }
        case 'SET_ROUTE':
            return { ...state, convoy: { ...state.convoy, route: action.payload } }
        case 'UPDATE_STOP_DETAILS':
            // payload: { index, details }
            const updatedRoute = { ...state.convoy.route }
            // Ensure stops array exists (create from legs/waypoints if needed, but for now assuming we modify existing structure or add metadata)
            // Actually, RouteSummaryCard normalizes it. We need to store this metadata back to the source.
            // For Manual Routes (legs), we might need a parallel 'stops' array if it doesn't exist.
            if (!updatedRoute.stops) updatedRoute.stops = []
            updatedRoute.stops[action.payload.index] = { ...updatedRoute.stops[action.payload.index], ...action.payload.details }
            return { ...state, convoy: { ...state.convoy, route: updatedRoute } }
        case 'CONFIRM_CONVOY':
            return { ...state, phase: 'summary' }
        case 'ADD_GALLERY_IMAGE':
            return { ...state, convoy: { ...state.convoy, gallery: [...state.convoy.gallery, action.payload] } }
        case 'ADD_MESSAGE':
            return { ...state, convoy: { ...state.convoy, messages: [...state.convoy.messages, action.payload] } }
        case 'START_DRIVE':
            return { ...state, phase: 'driving' }
        case 'SET_TETHER':
            return { ...state, tether: { ...state.tether, status: action.payload } }
        case 'END_DRIVE':
            return { ...state, phase: 'ended' }
        case 'UPDATE_ROUTE_STRUCTURE':
            return { ...state, convoy: { ...state.convoy, route: action.payload } }
        case 'BACK_TO_LOBBY':
            return { ...initialState }
        default:
            return state
    }
}

// ─── Shared Styles ───
const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    background: 'rgba(255,255,255,0.05)', border: 'var(--border-glass)',
    color: 'white', fontSize: 15, fontFamily: 'var(--font-main)', outline: 'none'
}

const sectionStyle = { marginBottom: 24 }

const labelStyle = { fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block', color: 'var(--text-secondary)' }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Squad = ({ myRoutes = [], onConvoyChange, initialMembers = [], onClearInitialMembers, initialRoute = null, onClearInitialRoute, onStartDrive, onEndDrive, onBack }) => {
    const [state, dispatch] = useReducer(convoyReducer, initialState)
    const [joinCode, setJoinCode] = useState('')
    const [showJoinInput, setShowJoinInput] = useState(false)
    const [scanning, setScanning] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)
    const [memberSearch, setMemberSearch] = useState('')
    const [summaryTab, setSummaryTab] = useState('route')
    const [chatInput, setChatInput] = useState('')
    const [showRouteSelector, setShowRouteSelector] = useState(false)
    const [scheduleDate, setScheduleDate] = useState('')
    const [scheduleTime, setScheduleTime] = useState('09:00')
    const chatEndRef = useRef(null)
    const fileInputRef = useRef(null)
    const addMemberRef = useRef(null)
    const isDeepLink = useRef(false)
    const [showExitConfirmation, setShowExitConfirmation] = useState(false)
    const [userLocation, setUserLocation] = useState(null)
    const [isEditingRoute, setIsEditingRoute] = useState(false)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                },
                (err) => console.warn('Squad location error', err),
                { enableHighAccuracy: true }
            )
        }
    }, [])

    // Handle saving route edits
    const handleSaveRouteEdit = async (newStops) => {
        // 1. Extract coordinates from stops
        // stops are mixed: start point, waypoints, destination
        // We need an ordered list of coordinates.
        const points = []

        for (const stop of newStops) {
            let coords = stop.coordinates

            // If stop is "Current Location" and has no coords, use userLocation
            if (stop.isCurrentLocation && !coords && userLocation) {
                coords = userLocation
            } else if (stop.isCurrentLocation && !coords) {
                // Fallback if no userLocation? maybe alert user
                alert("Cannot calculate route from current location without permission.")
                return
            }

            if (coords) {
                points.push(coords)
            } else {
                // If a stop has no coordinates (e.g. curated waypoint with just name?), we can't route.
                // But normalizeRoute usually ensures coordinates if available.
                // If it's a curated route, maybe we shouldn't use OSRM routing but just update the list?
                // But if we reorder, we probably want real routing if it was a real route.
                // For now, let's assume if we have coords we reroute.
            }
        }

        if (points.length < 2) {
            alert("Route must have at least 2 points.")
            return
        }

        try {
            const newRouteData = await calculateMultiStopRoute(points)
            if (newRouteData) {
                // Preserve metadata (names, descriptions)
                // We need to map old stops metadata to new route structure.
                // This is tricky if stops were deleted.
                // But newStops has the correct order and metadata.
                // We can construct the new 'stops' array for the route object from newStops.

                const newStopsMetadata = newStops.map(s => ({
                    name: s.name,
                    description: s.description,
                    photos: s.photos,
                    type: s.type
                }))

                const finalRoute = {
                    ...convoy.route,
                    ...newRouteData, // geometry, distance, duration, legs
                    stops: newStopsMetadata,
                    // We might need to update destinationName if it changed
                    destinationName: newStops[newStops.length - 1].name,
                    startAddress: newStops[0].details || newStops[0].name
                }

                dispatch({ type: 'UPDATE_ROUTE_STRUCTURE', payload: finalRoute })
                setIsEditingRoute(false)
            } else {
                alert("Could not calculate new route.")
            }
        } catch (e) {
            console.error(e)
            alert("Error updating route.")
        }
    }

    const handleAddStop = async () => {
        // Create a new stop (placeholder for real search)
        const newStop = {
            name: "New Stop",
            description: "Added waypoint",
            coordinates: userLocation || { lat: 37.7749, lng: -122.4194 }, // Fallback to SF
            type: 'stop',
            isCurrentLocation: !!userLocation
        }
        return newStop
    }

    // ━━━ RENDER ━━━         // Outside-click handler to close member search dropdown
    useEffect(() => {
        if (!showAddMember) return
        const handleClickOutside = (e) => {
            if (addMemberRef.current && !addMemberRef.current.contains(e.target)) {
                setShowAddMember(false)
                setMemberSearch('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showAddMember])

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            dispatch({ type: 'SET_COVER', payload: url })
        }
    }

    // Process initial members (e.g. from live radar click)
    useEffect(() => {
        if (initialMembers.length > 0) {
            if (state.phase === 'lobby') {
                isDeepLink.current = true
                dispatch({ type: 'CREATE_CONVOY' })
            }
            initialMembers.forEach(member => {
                dispatch({ type: 'ADD_MEMBER', payload: member })
            })
            if (onClearInitialMembers) onClearInitialMembers()
        }
    }, [initialMembers, state.phase, onClearInitialMembers])

    // Process initial route (e.g. from Discover > Route Overview > Convoy)
    useEffect(() => {
        if (initialRoute) {
            if (state.phase === 'lobby') {
                isDeepLink.current = true
                dispatch({ type: 'CREATE_CONVOY' })
            }
            // Normalize route object for Squad display (handle OSRM/Manual routes)
            let normalizedRoute = { ...initialRoute }

            // 1. Name fallback
            if (!normalizedRoute.name) {
                if (normalizedRoute.destinationName) {
                    normalizedRoute.name = `To ${normalizedRoute.destinationName}`
                } else {
                    normalizedRoute.name = "Custom Route"
                }
            }

            // 2. Region fallback
            if (!normalizedRoute.region) {
                normalizedRoute.region = "Custom"
            }

            // 3. Distance normalization (Meters -> KM)
            // If it has 'legs' or 'duration', it's likely a raw OSRM route in meters
            if (normalizedRoute.distance && (normalizedRoute.legs || normalizedRoute.duration) && normalizedRoute.distance > 800) {
                normalizedRoute.distance = (normalizedRoute.distance / 1000).toFixed(1)
            }

            // Set the route
            dispatch({ type: 'SET_ROUTE', payload: normalizedRoute })

            // Auto-set title if empty
            if (state.convoy && !state.convoy.title) {
                dispatch({ type: 'SET_TITLE', payload: `${normalizedRoute.name} Run` })
            }

            if (onClearInitialRoute) onClearInitialRoute()
        }
    }, [initialRoute, state.phase, state.convoy?.title, onClearInitialRoute])

    const handleScanQR = () => {
        if (window.confirm("Allow 'Peak Flow' to access your camera?")) {
            setScanning(true)
        }
    }

    const { phase, convoy, tether } = state

    // Report convoy status changes to parent
    useEffect(() => {
        if (onConvoyChange) {
            if (phase !== 'lobby' && phase !== 'ended' && convoy) {
                onConvoyChange({ active: true, memberCount: convoy.members.length, title: convoy.title, phase })
            } else {
                onConvoyChange(null)
            }
        }
    }, [phase, convoy?.members?.length, convoy?.title, onConvoyChange])

    // ━━━ LOBBY PHASE ━━━
    if (phase === 'lobby') {
        return (
            <div style={{ height: '100%', overflow: 'auto', padding: '56px 20px 100px' }} className="no-scrollbar">
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Squad</h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>Your convoy lobby</p>

                <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                    <button onClick={() => dispatch({ type: 'CREATE_CONVOY' })} className="btn-primary"
                        style={{ flex: 1, padding: '18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 15, fontWeight: 700 }}>
                        <Plus size={20} /> Create Convoy
                    </button>
                    <button onClick={() => setShowJoinInput(!showJoinInput)} className="btn-glass"
                        style={{ flex: 1, padding: '18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 15, fontWeight: 600 }}>
                        <Radio size={20} /> Join Convoy
                    </button>
                </div>

                {showJoinInput && (
                    <div className="glass-panel" style={{ padding: 20, marginBottom: 28, animation: 'slideDown 0.2s ease', position: 'relative', overflow: 'hidden' }}>
                        {!scanning ? (
                            <>
                                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Enter 6-digit code</h4>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <input type="text" maxLength={6} placeholder="ABC123" value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                        style={{ ...inputStyle, fontSize: 20, fontWeight: 700, letterSpacing: 8, textAlign: 'center', flex: 1 }} />
                                    <button onClick={() => dispatch({ type: 'JOIN_CONVOY', payload: { code: joinCode } })}
                                        disabled={joinCode.length < 6} className="btn-primary" style={{ padding: '14px 20px', fontSize: 14 }}>Join</button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, color: 'var(--text-muted)' }}>
                                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                                    <span style={{ fontSize: 12 }}>or</span>
                                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                                </div>
                                <button onClick={handleScanQR} style={{
                                    width: '100%', marginTop: 14, padding: '12px', background: 'rgba(255,255,255,0.04)',
                                    border: 'var(--border-glass)', borderRadius: 12, color: 'var(--text-secondary)',
                                    fontFamily: 'var(--font-main)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                }}>
                                    <QrCode size={16} /> Scan QR Code
                                </button>
                            </>
                        ) : (
                            <div style={{ height: 200, background: 'black', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--primary-apex)', borderRadius: 12, opacity: 0.5 }} />
                                <div style={{ width: '80%', height: 2, background: 'var(--primary-apex)', boxShadow: '0 0 10px var(--primary-apex)', animation: 'scan 2s infinite ease-in-out' }} />
                                <p style={{ marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Align QR code within frame</p>
                                <button onClick={() => setScanning(false)} style={{
                                    position: 'absolute', bottom: 10, background: 'rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 12px', borderRadius: 20, fontSize: 12
                                }}>Cancel</button>
                            </div>
                        )}
                    </div>
                )}

                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Upcoming Convoys</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {MOCK_GROUPS.map(group => (
                        <div key={group.id} onClick={() => dispatch({ type: 'JOIN_CONVOY', payload: { title: group.title, code: 'SAMPLE', route: group.route } })} className="glass-panel" style={{ display: 'flex', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <div style={{ width: 90, height: 90, flexShrink: 0, overflow: 'hidden' }}>
                                <img src={group.image} alt={group.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.title}</h4>
                                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={10} /> {group.members}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} /> {group.distance}km</span>
                                </div>
                                <p style={{ fontSize: 12, color: group.countdown === 'Now happening' ? 'var(--sss-apex)' : 'var(--primary-apex)', fontWeight: 600, marginTop: 4 }}>{group.countdown}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-muted)' }}><ChevronRight size={18} /></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // ━━━ BUILDING PHASE (Enhanced Setup) ━━━
    if (phase === 'building') {
        const filteredContacts = MOCK_CONTACTS.filter(c =>
            !convoy.members.find(m => m.id === c.id) &&
            (c.name.toLowerCase().includes(memberSearch.toLowerCase()) || c.username.toLowerCase().includes(memberSearch.toLowerCase()))
        )

        // Combine all available routes: myRoutes (saved) + MOCK_ROUTES as fallback
        const availableRoutes = myRoutes.length > 0 ? myRoutes : MOCK_ROUTES

        return (
            <div style={{ height: '100%', overflow: 'auto', padding: '56px 20px 100px' }} className="no-scrollbar">
                <button onClick={() => {
                    setShowExitConfirmation(true)
                }} style={{
                    background: 'none', border: 'none', color: 'var(--primary-apex)',
                    fontFamily: 'var(--font-main)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', marginBottom: 20, padding: 0, display: 'flex', alignItems: 'center', gap: 6
                }}><ArrowLeft size={16} /> {isDeepLink.current ? 'Back' : 'Back to Lobby'}</button>

                {/* Exit Confirmation Modal */}
                {showExitConfirmation && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 1200,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', p: 20
                    }} onClick={() => setShowExitConfirmation(false)}>
                        <div className="glass-panel" style={{
                            width: '90%', maxWidth: 320, padding: 24,
                            background: '#1a1d24', border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%',
                                background: 'rgba(255, 152, 0, 0.1)', color: '#ff9800',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                            }}>
                                <AlertTriangle size={24} />
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Discard Convoy?</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
                                If you go back now, your convoy setup and all changes will be lost.
                            </p>
                            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                                <button
                                    onClick={() => {
                                        setShowExitConfirmation(false)
                                        if (isDeepLink.current && onBack) {
                                            onBack()
                                        } else {
                                            dispatch({ type: 'BACK_TO_LOBBY' })
                                        }
                                    }}
                                    className="btn-glass"
                                    style={{ flex: 1, padding: '12px', fontSize: 14, color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.3)' }}
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={() => setShowExitConfirmation(false)}
                                    className="btn-primary"
                                    style={{ flex: 1, padding: '12px', fontSize: 14 }}
                                >
                                    Continue Editing
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Set Up Convoy</h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Configure your group drive</p>

                {/* 1. Convoy Title */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Convoy Title *</label>
                    <input type="text" placeholder="e.g. Sunday Morning Blast" value={convoy.title}
                        onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })} style={inputStyle} />
                </div>

                {/* 2. Cover Image (optional) — real file upload */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Cover Image <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect}
                        style={{ display: 'none' }} />
                    {convoy.coverImage ? (
                        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 140 }}>
                            <img src={convoy.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button onClick={() => dispatch({ type: 'SET_COVER', payload: null })} style={{
                                position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%',
                                background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}><X size={14} /></button>
                        </div>
                    ) : (
                        <button onClick={() => fileInputRef.current?.click()}
                            style={{
                                width: '100%', padding: '28px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                                border: '1px dashed rgba(255,255,255,0.12)', color: 'var(--text-muted)', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'var(--font-main)', fontSize: 13
                            }}>
                            <Camera size={24} style={{ opacity: 0.5 }} />
                            <span>Tap to select cover image</span>
                        </button>
                    )}
                </div>

                {/* 3. Description (optional) */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Description <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
                    <textarea placeholder="What's the plan?" value={convoy.description}
                        onChange={(e) => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
                        rows={3} style={{ ...inputStyle, resize: 'none' }} />
                </div>

                {/* 4. Members — with outside-click dismiss */}
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>Members ({convoy.members.length})</label>
                        <button onClick={() => setShowAddMember(!showAddMember)} style={{
                            background: 'none', border: 'none', color: 'var(--primary-apex)', cursor: 'pointer',
                            fontFamily: 'var(--font-main)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4
                        }}><Plus size={14} /> Add</button>
                    </div>

                    {showAddMember && (
                        <div ref={addMemberRef} className="glass-panel" style={{ padding: 12, marginBottom: 12, animation: 'slideDown 0.2s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)' }}>
                                <Search size={14} color="var(--text-muted)" />
                                <input type="text" placeholder="Search by name or @username" value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 13, fontFamily: 'var(--font-main)', outline: 'none', flex: 1 }} />
                            </div>
                            <div style={{ maxHeight: 180, overflow: 'auto' }} className="no-scrollbar">
                                {filteredContacts.map(contact => (
                                    <div key={contact.id} onClick={() => { dispatch({ type: 'ADD_MEMBER', payload: { id: contact.id, name: contact.name, vehicle: contact.vehicle } }); setMemberSearch('') }}
                                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{contact.name.charAt(0)}</div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 13, fontWeight: 600 }}>{contact.name}</p>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{contact.username} · {contact.vehicle}</p>
                                        </div>
                                        <Plus size={16} color="var(--primary-apex)" />
                                    </div>
                                ))}
                                {filteredContacts.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>No contacts found</p>}
                            </div>
                        </div>
                    )}

                    <div className="glass-panel" style={{ padding: 12 }}>
                        {convoy.members.map((user, i) => (
                            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < convoy.members.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg, var(--primary-apex), #ff8f00)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{user.name.charAt(0)}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 14, fontWeight: 600 }}>{user.name} {i === 0 && <span style={{ fontSize: 10, color: 'var(--primary-apex)', fontWeight: 700 }}>ADMIN</span>}</p>
                                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.vehicle}</p>
                                </div>
                                {i > 0 && <button onClick={() => dispatch({ type: 'REMOVE_MEMBER', payload: user.id })} style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.7)', cursor: 'pointer', padding: 4 }}><X size={14} /></button>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Schedule — date + time */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Schedule</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => dispatch({ type: 'SET_SCHEDULE', payload: 'instant' })}
                            style={{
                                flex: 1, padding: '14px', borderRadius: 12, cursor: 'pointer', fontFamily: 'var(--font-main)',
                                background: convoy.schedule === 'instant' ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.03)',
                                border: convoy.schedule === 'instant' ? '1px solid rgba(255,95,31,0.4)' : 'var(--border-glass)',
                                color: convoy.schedule === 'instant' ? 'var(--primary-apex)' : 'var(--text-secondary)',
                                fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}><Zap size={16} /> Drive Now</button>
                        <button onClick={() => {
                            const d = new Date(Date.now() + 7 * 86400000)
                            const dateStr = d.toISOString().split('T')[0]
                            setScheduleDate(dateStr)
                            dispatch({ type: 'SET_SCHEDULE', payload: `${dateStr}T${scheduleTime}` })
                        }}
                            style={{
                                flex: 1, padding: '14px', borderRadius: 12, cursor: 'pointer', fontFamily: 'var(--font-main)',
                                background: convoy.schedule !== 'instant' ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.03)',
                                border: convoy.schedule !== 'instant' ? '1px solid rgba(255,95,31,0.4)' : 'var(--border-glass)',
                                color: convoy.schedule !== 'instant' ? 'var(--primary-apex)' : 'var(--text-secondary)',
                                fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}><Calendar size={16} /> Schedule</button>
                    </div>
                    {convoy.schedule !== 'instant' && (
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <input type="date" value={scheduleDate}
                                onChange={(e) => { setScheduleDate(e.target.value); dispatch({ type: 'SET_SCHEDULE', payload: `${e.target.value}T${scheduleTime}` }) }}
                                style={{ ...inputStyle, flex: 1, colorScheme: 'dark' }} />
                            <input type="time" value={scheduleTime}
                                onChange={(e) => { setScheduleTime(e.target.value); dispatch({ type: 'SET_SCHEDULE', payload: `${scheduleDate}T${e.target.value}` }) }}
                                style={{ ...inputStyle, flex: 1, colorScheme: 'dark' }} />
                        </div>
                    )}
                </div>

                {/* 6. Route (optional) — two options */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Route <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional — can add later)</span></label>
                    {convoy.route ? (
                        <RouteSummaryCard
                            route={convoy.route}
                            userLocation={userLocation}
                            onStopUpdate={(index, details) => dispatch({ type: 'UPDATE_STOP_DETAILS', payload: { index, details } })}
                        />
                    ) : (
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowRouteSelector(true)} style={{
                                flex: 1, padding: '16px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                                border: '1px dashed rgba(255,255,255,0.12)', color: 'var(--text-muted)', cursor: 'pointer',
                                fontFamily: 'var(--font-main)', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                            }}><MapIcon size={20} style={{ opacity: 0.5 }} /><span>Select Route</span></button>
                            <button onClick={() => alert('Switch to the Discover tab to create a new route using Manual or AI route builder.')} style={{
                                flex: 1, padding: '16px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                                border: '1px dashed rgba(255,255,255,0.12)', color: 'var(--text-muted)', cursor: 'pointer',
                                fontFamily: 'var(--font-main)', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                            }}><Sparkles size={20} style={{ opacity: 0.5 }} /><span>Create Route</span></button>
                        </div>
                    )}
                </div>

                {/* Confirm Button */}
                <button onClick={() => dispatch({ type: 'CONFIRM_CONVOY' })} disabled={!convoy.title}
                    className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: convoy.title ? 1 : 0.4 }}>
                    ✓ Create Convoy
                </button>

                {/* Route Selector Modal */}
                {showRouteSelector && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '56px 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button onClick={() => setShowRouteSelector(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}><ArrowLeft size={18} /></button>
                            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Select a Route</h2>
                        </div>
                        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 40px' }} className="no-scrollbar">
                            {availableRoutes.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <Route size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 12 }} />
                                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No saved routes yet</p>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Create routes from the Discover tab first</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {availableRoutes.map(route => (
                                        <div key={route.id} onClick={() => { dispatch({ type: 'SET_ROUTE', payload: route }); setShowRouteSelector(false) }}
                                            className="glass-panel" style={{ display: 'flex', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                            <div style={{ width: 80, height: 80, flexShrink: 0, overflow: 'hidden' }}>
                                                <img src={route.image} alt={route.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{route.name}</h4>
                                                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
                                                    <span>{route.distance}km</span>
                                                    <span>{route.region}</span>
                                                    {route.waypoints && <span>{route.waypoints.length} waypoints</span>}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-muted)' }}><ChevronRight size={16} /></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // ━━━ SUMMARY PHASE (Convoy Dashboard) ━━━
    if (phase === 'summary') {
        const isInstant = convoy.schedule === 'instant'
        const scheduleLabel = isInstant ? 'Happening Now' : new Date(convoy.schedule).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

        const TABS = [
            { id: 'route', icon: <Route size={16} />, label: 'Route' },
            { id: 'members', icon: <Users size={16} />, label: 'Members' },
            { id: 'gallery', icon: <ImageIcon size={16} />, label: 'Gallery' },
            { id: 'chat', icon: <MessageCircle size={16} />, label: 'Chat' },
        ]

        const handleSendMessage = () => {
            if (!chatInput.trim()) return
            dispatch({ type: 'ADD_MESSAGE', payload: { id: 'm' + Date.now(), userId: 'u1', name: 'Stefan K.', text: chatInput, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) } })
            setChatInput('')
        }

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header with cover */}
                <div style={{ flexShrink: 0, position: 'relative' }}>
                    {convoy.coverImage ? (
                        <div style={{ height: 180, position: 'relative' }}>
                            <img src={convoy.coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,17,21,0.3) 0%, rgba(15,17,21,0.95) 100%)' }} />
                        </div>
                    ) : (
                        <div style={{ height: 100, background: 'linear-gradient(135deg, rgba(255,95,31,0.15), rgba(255,95,31,0.05))' }} />
                    )}
                    <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
                        <button onClick={() => {
                            if (isDeepLink.current && onBack) {
                                onBack()
                            } else {
                                dispatch({ type: 'BACK_TO_LOBBY' })
                            }
                        }} style={{
                            background: 'rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: 44, height: 44,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}><ArrowLeft size={22} strokeWidth={2.5} /></button>
                    </div>
                    <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800 }}>{convoy.title || 'Untitled Convoy'}</h2>
                        <p style={{ fontSize: 13, color: isInstant ? 'var(--sss-apex)' : 'var(--primary-apex)', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isInstant ? <Zap size={14} /> : <Calendar size={14} />} {scheduleLabel}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Code: <span style={{ color: 'var(--primary-apex)', fontWeight: 700, letterSpacing: 2 }}>{convoy.code}</span></p>
                    </div>
                </div>

                {/* Tab Bar */}
                <div style={{ display: 'flex', gap: 0, padding: '0 16px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,17,21,0.8)', backdropFilter: 'blur(12px)' }}>
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setSummaryTab(tab.id)} style={{
                            flex: 1, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
                            color: summaryTab === tab.id ? 'var(--primary-apex)' : 'var(--text-muted)',
                            fontFamily: 'var(--font-main)', fontSize: 11, fontWeight: 600,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            borderBottom: summaryTab === tab.id ? '2px solid var(--primary-apex)' : '2px solid transparent',
                            transition: 'all 0.2s'
                        }}>{tab.icon}{tab.label}</button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ flex: 1, overflow: 'auto', padding: summaryTab === 'chat' ? 0 : '16px 20px 160px' }} className="no-scrollbar">

                    {/* MEMBERS TAB */}
                    {summaryTab === 'members' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Members ({convoy.members.length})</h3>
                                <button onClick={() => setShowAddMember(!showAddMember)} style={{
                                    background: 'rgba(255,95,31,0.1)', border: '1px solid rgba(255,95,31,0.3)', borderRadius: 8,
                                    color: 'var(--primary-apex)', padding: '6px 12px', cursor: 'pointer', fontFamily: 'var(--font-main)',
                                    fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4
                                }}><Plus size={12} /> Add</button>
                            </div>

                            {showAddMember && (
                                <div className="glass-panel" style={{ padding: 12, marginBottom: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)' }}>
                                        <Search size={14} color="var(--text-muted)" />
                                        <input type="text" placeholder="Search contacts..." value={memberSearch}
                                            onChange={(e) => setMemberSearch(e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 13, fontFamily: 'var(--font-main)', outline: 'none', flex: 1 }} />
                                    </div>
                                    {MOCK_CONTACTS.filter(c => !convoy.members.find(m => m.id === c.id) && (c.name.toLowerCase().includes(memberSearch.toLowerCase()) || c.username.toLowerCase().includes(memberSearch.toLowerCase()))).map(contact => (
                                        <div key={contact.id} onClick={() => dispatch({ type: 'ADD_MEMBER', payload: { id: contact.id, name: contact.name, vehicle: contact.vehicle } })}
                                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{contact.name.charAt(0)}</div>
                                            <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 600 }}>{contact.name}</p><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{contact.vehicle}</p></div>
                                            <Plus size={14} color="var(--primary-apex)" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {convoy.members.map((user, i) => (
                                <div key={user.id} className="glass-panel" style={{ padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg, var(--primary-apex), #ff8f00)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>{user.name.charAt(0)}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600 }}>{user.name} {i === 0 && <span style={{ fontSize: 10, color: 'var(--primary-apex)' }}>ADMIN</span>}</p>
                                        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.vehicle}</p>
                                    </div>
                                    {i > 0 && <button onClick={() => dispatch({ type: 'REMOVE_MEMBER', payload: user.id })} style={{ background: 'none', border: 'none', color: 'rgba(255,60,60,0.6)', cursor: 'pointer', padding: 4 }}><Trash2 size={14} /></button>}
                                </div>
                            ))}

                        </div>
                    )}

                    {/* GALLERY TAB */}
                    {summaryTab === 'gallery' && (
                        <div>
                            <button onClick={() => dispatch({ type: 'ADD_GALLERY_IMAGE', payload: `https://picsum.photos/seed/${Date.now()}/400/300` })}
                                style={{
                                    width: '100%', padding: '20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                                    border: '1px dashed rgba(255,255,255,0.12)', color: 'var(--text-muted)', cursor: 'pointer',
                                    fontFamily: 'var(--font-main)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16
                                }}><Camera size={18} /> Upload Photo</button>
                            {convoy.gallery.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <ImageIcon size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 12 }} />
                                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No photos yet</p>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Upload pics from your convoy drive!</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                    {convoy.gallery.map((img, i) => (
                                        <div key={i} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
                                            <img src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ROUTE TAB */}
                    {/* ROUTE TAB */}
                    {summaryTab === 'route' && (
                        convoy.route ? (
                            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                                <div style={{ height: 160, position: 'relative' }}>
                                    <img src={convoy.route.image} alt={convoy.route.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))' }} />
                                    <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 800 }}>{convoy.route.name}</h3>
                                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{convoy.route.region}</p>
                                    </div>
                                </div>
                                <div style={{ padding: '16px' }}>
                                    {/* Description */}
                                    {convoy.description && (
                                        <div style={{ marginBottom: 20 }}>
                                            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>ABOUT THIS DRIVE</p>
                                            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>{convoy.description}</p>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distance</p>
                                            <p style={{ fontSize: 15, fontWeight: 700 }}>{convoy.route.distance} km</p>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</p>
                                            <p style={{ fontSize: 15, fontWeight: 700 }}>{convoy.route.duration} min</p>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Curviness</p>
                                            <p style={{ fontSize: 15, fontWeight: 700 }}>{convoy.route.curvinessIndex}/5</p>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                                        <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>ROUTE TIMELINE</p>
                                        <RouteSummaryCard
                                            route={convoy.route}
                                            userLocation={userLocation}
                                            // Enable editing
                                            readOnly={false}
                                            isEditing={isEditingRoute}
                                            onEdit={() => setIsEditingRoute(true)}
                                            onCancelEdit={() => setIsEditingRoute(false)}
                                            onSaveEdit={handleSaveRouteEdit}
                                            onAddStop={handleAddStop}
                                            onStopUpdate={(index, details) => dispatch({ type: 'UPDATE_STOP_DETAILS', payload: { index, details } })}
                                            showHeader={false}
                                        />
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div style={{ padding: '0 16px 16px', display: 'flex', gap: 10 }}>
                                    <button style={{
                                        flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                                        color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                                    }}>
                                        Change Route
                                    </button>
                                    <button style={{
                                        flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                                        color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                                    }}>
                                        Details
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <Route size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 12 }} />
                                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No route set yet</p>
                                <button style={{
                                    marginTop: 16, padding: '12px 24px', borderRadius: 12,
                                    background: 'rgba(255,95,31,0.1)', border: '1px solid rgba(255,95,31,0.3)',
                                    color: 'var(--primary-apex)', cursor: 'pointer', fontFamily: 'var(--font-main)',
                                    fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8
                                }}><Route size={16} /> Select Route</button>
                            </div>
                        )
                    )
                    }

                    {/* CHAT TAB */}
                    {
                        summaryTab === 'chat' && (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 8px' }} className="no-scrollbar">
                                    {convoy.messages.map((msg) => {
                                        const isMe = msg.userId === 'u1'
                                        return (
                                            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                                                <div style={{
                                                    maxWidth: '75%', padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                    background: isMe ? 'rgba(255,95,31,0.2)' : 'rgba(255,255,255,0.06)',
                                                    border: isMe ? '1px solid rgba(255,95,31,0.2)' : '1px solid rgba(255,255,255,0.04)'
                                                }}>
                                                    {!isMe && <p style={{ fontSize: 11, color: 'var(--primary-apex)', fontWeight: 600, marginBottom: 4 }}>{msg.name}</p>}
                                                    <p style={{ fontSize: 14, lineHeight: 1.4 }}>{msg.text}</p>
                                                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{msg.time}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={chatEndRef} />
                                </div>
                                <div style={{ flexShrink: 0, padding: '8px 16px 170px', display: 'flex', gap: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <input type="text" placeholder="Type a message..." value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        style={{ ...inputStyle, padding: '12px 14px', fontSize: 14 }} />
                                    <button onClick={handleSendMessage} className="btn-primary" style={{ padding: '12px 16px', borderRadius: 12, flexShrink: 0 }}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* Floating Start Drive Button */}
                <div style={{
                    position: 'absolute', bottom: 90, left: 20, right: 20,
                    zIndex: 'var(--z-overlay)'
                }}>
                    <button
                        onClick={() => {
                            dispatch({ type: 'START_DRIVE' })
                            if (onStartDrive) onStartDrive({
                                title: convoy.title || 'Convoy',
                                memberCount: convoy.members.length,
                                navigateToStart: true,
                                ...(convoy.route || {})
                            })
                        }}
                        className="btn-primary"
                        style={{
                            width: '100%', padding: '16px', fontSize: 15, fontWeight: 700,
                            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 8px 32px rgba(255,95,31,0.4)'
                        }}
                    >
                        <Navigation size={18} /> Start Drive
                    </button>
                </div>
            </div>
        )
    }

    // ━━━ DRIVING PHASE ━━━
    if (phase === 'driving') {
        const tetherColors = {
            connected: { bg: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.3)', color: 'var(--sss-apex)', label: 'Connected', icon: <Wifi size={14} /> },
            fragmented: { bg: 'rgba(255,145,0,0.12)', border: '1px solid rgba(255,145,0,0.3)', color: 'var(--sss-good)', label: 'Fragmented', icon: <WifiOff size={14} /> },
            disconnected: { bg: 'rgba(255,23,68,0.12)', border: '1px solid rgba(255,23,68,0.3)', color: 'var(--sss-danger)', label: 'Disconnected', icon: <WifiOff size={14} /> }
        }
        const tc = tetherColors[tether.status]

        return (
            <div style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(20,24,32,1) 0%, #0a0c10 100%)' }}>
                    <div style={{ position: 'absolute', inset: '-50%', background: 'linear-gradient(90deg, rgba(255,95,31,0.02) 1px, transparent 1px), linear-gradient(rgba(255,95,31,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 20, height: 20, borderRadius: '50%', background: 'var(--primary-apex)', boxShadow: '0 0 20px var(--primary-glow)', animation: 'pulseGlow 2s ease infinite' }} />
                    {convoy.members.slice(1).map((_, i) => (
                        <div key={i} style={{ position: 'absolute', top: `${45 + (i * 3)}%`, left: `${52 + (i * 5)}%`, width: 14, height: 14, borderRadius: '50%', background: 'var(--sss-apex)', border: '2px solid var(--bg-dark)', boxShadow: '0 0 8px rgba(0,230,118,0.4)' }} />
                    ))}
                </div>

                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 20px 12px', zIndex: 'var(--z-overlay)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => {
                        dispatch({ type: 'END_DRIVE' })
                        if (onEndDrive) onEndDrive()
                    }} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', border: 'var(--border-glass)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}><ArrowLeft size={18} /></button>
                    <div className="glass-overlay" style={{ flex: 1, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{convoy.title || 'Convoy'}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}><Users size={12} /> {convoy.members.length}</span>
                    </div>
                </div>

                <div style={{ position: 'absolute', top: 110, left: 20, right: 20, zIndex: 'var(--z-overlay)' }}>
                    <div style={{ padding: '10px 16px', borderRadius: 12, background: tc.bg, border: tc.border, display: 'flex', alignItems: 'center', gap: 8, animation: tether.status !== 'connected' ? 'pulseAlert 1.5s ease infinite' : 'none' }}>
                        {tc.icon}<span style={{ fontSize: 13, fontWeight: 600, color: tc.color }}>Digital Tether: {tc.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        {['connected', 'fragmented', 'disconnected'].map(s => (
                            <button key={s} onClick={() => dispatch({ type: 'SET_TETHER', payload: s })} style={{ padding: '6px 10px', fontSize: 10, borderRadius: 8, background: tether.status === s ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', border: 'var(--border-glass)', color: 'var(--text-secondary)', fontFamily: 'var(--font-main)', cursor: 'pointer', textTransform: 'capitalize' }}>{s}</button>
                        ))}
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: 100, left: 0, right: 0, zIndex: 'var(--z-overlay)', display: 'flex', justifyContent: 'center', gap: 16, padding: '0 20px' }}>
                    <div className="glass-overlay" style={{ padding: '12px 20px', textAlign: 'center' }}><p style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>72</p><p style={{ fontSize: 10, color: 'var(--text-muted)' }}>km/h</p></div>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Mic size={24} color="var(--text-secondary)" /></div>
                    <div className="glass-overlay" style={{ padding: '12px 20px', textAlign: 'center' }}><p style={{ fontSize: 16, fontWeight: 700 }}>12 min</p><p style={{ fontSize: 10, color: 'var(--text-muted)' }}>ETA</p></div>
                </div>
            </div>
        )
    }

    // ━━━ ENDED PHASE ━━━
    if (phase === 'ended') {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Drive Complete!</h2>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>Great run with your squad.</p>
                <button onClick={() => dispatch({ type: 'BACK_TO_LOBBY' })} className="btn-primary" style={{ padding: '16px 40px', fontSize: 15, fontWeight: 700 }}>Back to Lobby</button>
            </div>
        )
    }

    return null
}

export default Squad
