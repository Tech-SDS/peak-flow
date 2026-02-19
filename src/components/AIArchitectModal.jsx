import React, { useState, useEffect } from 'react'
import { X, Mic, MicOff, Sliders, Sparkles, Compass, Clock, Info, RefreshCw } from 'lucide-react'
import { generateAIRouteIntent, generateFromParameters } from '../lib/aiArchitect'

const AIArchitectModal = ({ onClose, onRouteGenerated, userLocation }) => {
    const [mode, setMode] = useState('voice') // 'voice' | 'parameters'
    const [isLoading, setIsLoading] = useState(false)
    const [showVoiceInfo, setShowVoiceInfo] = useState(false)

    // Voice state
    const [isRecording, setIsRecording] = useState(false)
    const [voiceTranscript, setVoiceTranscript] = useState('')
    const [voiceDone, setVoiceDone] = useState(false)

    // Parameter state
    const [durationStep, setDurationStep] = useState(2)
    const [direction, setDirection] = useState('S')
    const [style, setStyle] = useState(0.5)
    const [isLoop, setIsLoop] = useState(true)

    const durationOptions = [
        { label: '30 min', value: 30 },
        { label: '2 hours', value: 120 },
        { label: '4 hours', value: 240 },
        { label: 'Day trip', value: 480 },
        { label: 'Multiple days', value: 1440 }
    ]

    const directions = [
        { key: 'N', label: 'N' },
        { key: 'NE', label: 'NE' },
        { key: 'E', label: 'E' },
        { key: 'SE', label: 'SE' },
        { key: 'S', label: 'S' },
        { key: 'SW', label: 'SW' },
        { key: 'W', label: 'W' },
        { key: 'NW', label: 'NW' },
    ]



    // ─── Voice: Real Implementation ───
    const recognitionRef = React.useRef(null)

    useEffect(() => {
        // Initialize SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = true
            recognition.lang = 'en-US' // Could make this dynamic later

            recognition.onstart = () => {
                setIsRecording(true)
                setVoiceTranscript('')
                setVoiceDone(false)
            }

            recognition.onresult = (event) => {
                let interimTranscript = ''
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    interimTranscript += event.results[i][0].transcript
                }
                setVoiceTranscript(interimTranscript)
            }

            recognition.onerror = (event) => {
                console.error('[AI] Voice error:', event.error)
                setIsRecording(false)
                if (event.error === 'not-allowed') {
                    alert('Microphone access denied. Please check your system/browser permissions.')
                } else if (event.error === 'no-speech') {
                    // Ignore, just stopped hearing
                } else {
                    alert('Voice input error: ' + event.error)
                }
            }

            recognition.onend = () => {
                setIsRecording(false)
                // Only trigger "done" if we actually got some text
                setVoiceTranscript(prev => {
                    if (prev && prev.trim().length > 0) {
                        setVoiceDone(true)
                    }
                    return prev
                })
            }

            recognitionRef.current = recognition
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort()
            }
        }
    }, [])

    const handleVoiceToggle = () => {
        if (!recognitionRef.current) {
            alert('Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.')
            return
        }

        if (isRecording) {
            recognitionRef.current.stop()
        } else {
            recognitionRef.current.start()
        }
    }

    // ─── Auto-generate when voice is done ───
    useEffect(() => {
        // Only run if done AND we have text AND we aren't already loading
        if (!voiceDone || !voiceTranscript || isLoading) return

        setIsLoading(true)
        generateAIRouteIntent(voiceTranscript, userLocation)
            .then(result => {
                if (result?.route_proposal) {
                    onRouteGenerated(result.route_proposal)
                }
            })
            .catch(err => console.error('[AI] Voice error:', err))
            .finally(() => setIsLoading(false))
    }, [voiceDone, voiceTranscript])

    // ─── Parameter: Generate ───
    const handleParamGenerate = async () => {
        setIsLoading(true)
        try {
            const selectedDuration = durationOptions[durationStep].value
            const result = await generateFromParameters({
                duration: selectedDuration,
                direction,
                style,
                style,
                isLoop
            }, userLocation)
            if (result?.route_proposal) {
                onRouteGenerated(result.route_proposal)
            }
        } catch (err) {
            console.error('[AI] Param error:', err)
        }
        setIsLoading(false)
    }

    // ─── Styles ───
    const tabStyle = (active) => ({
        flex: 1,
        padding: '10px 16px',
        borderRadius: 10,
        border: 'none',
        background: active
            ? 'linear-gradient(135deg, var(--primary-apex), var(--primary-deep))'
            : 'transparent',
        color: active ? 'white' : 'var(--text-secondary)',
        fontWeight: active ? 700 : 500,
        fontSize: 14,
        fontFamily: 'var(--font-main)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        transition: 'all 0.2s'
    })

    return (
        <div style={{
            position: 'fixed', inset: 0,
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
            animation: 'fadeIn 0.2s ease'
        }}>
            {/* Backdrop */}
            <div onClick={onClose} style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)'
            }} />

            {/* Modal */}
            <div style={{
                position: 'relative',
                width: '100%', maxWidth: 440,
                maxHeight: '85vh',
                overflowY: 'auto',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                border: 'var(--border-glass-strong)',
                background: 'rgba(22, 25, 32, 0.98)',
                borderRadius: 'var(--border-radius)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }} onClick={(e) => e.stopPropagation()} className="no-scrollbar">

                {/* Header */}
                <div style={{
                    padding: '24px 24px 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Sparkles size={20} color="var(--primary-apex)" /> AI route generator
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
                        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', cursor: 'pointer'
                    }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Tab Switcher */}
                <div style={{
                    display: 'flex', gap: 4,
                    margin: '16px 24px',
                    padding: 4,
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.05)'
                }}>
                    <button
                        onClick={() => { setMode('voice'); setVoiceDone(false); setVoiceTranscript(''); }}
                        style={tabStyle(mode === 'voice')}
                    >
                        <Mic size={15} /> Voice
                    </button>
                    <button
                        onClick={() => setMode('parameters')}
                        style={tabStyle(mode === 'parameters')}
                    >
                        <Sliders size={15} /> Parameters
                    </button>
                </div>

                {/* Subtitle */}
                <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '0 24px', marginBottom: 4 }}>
                    {mode === 'voice'
                        ? 'Describe your ideal route with your voice'
                        : 'Fine-tune your route with exact parameters'
                    }
                </p>

                <div style={{ padding: '0 24px 24px' }}>

                    {/* ─────── VOICE TAB ─────── */}
                    {mode === 'voice' && (
                        <div style={{ margin: '20px 0 0', textAlign: 'center' }}>

                            {/* Info Toggle */}
                            {!voiceDone && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
                                    <button
                                        onClick={() => setShowVoiceInfo(!showVoiceInfo)}
                                        style={{
                                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 20, padding: '6px 14px',
                                            color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                            fontFamily: 'var(--font-main)'
                                        }}
                                    >
                                        <Info size={13} /> How does it work?
                                    </button>
                                </div>
                            )}

                            {showVoiceInfo && !voiceDone && (
                                <div style={{
                                    padding: 14, marginBottom: 20,
                                    background: 'rgba(255,95,31,0.06)', borderRadius: 12,
                                    border: '1px solid rgba(255,95,31,0.15)',
                                    fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, textAlign: 'left'
                                }}>
                                    <strong style={{ color: 'var(--primary-apex)' }}>Tap the microphone</strong> and describe your ideal drive. For example:
                                    <ul style={{ marginTop: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <li>"I want a 3-hour drive with lakes and challenging curves"</li>
                                        <li>"Give me an iconic Black Forest route with a café stop"</li>
                                        <li>"A fast 2-hour autobahn route to test top speed"</li>
                                    </ul>
                                </div>
                            )}

                            {/* Not done yet: show mic */}
                            {!voiceDone && (
                                <>
                                    <div
                                        onClick={handleVoiceToggle}
                                        style={{
                                            width: 90, height: 90,
                                            borderRadius: '50%',
                                            background: isRecording
                                                ? 'linear-gradient(135deg, var(--primary-apex), var(--sss-danger))'
                                                : 'rgba(255,255,255,0.06)',
                                            border: isRecording
                                                ? '3px solid var(--primary-apex)'
                                                : '2px solid rgba(255,255,255,0.12)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 20px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            animation: isRecording ? 'pulseGlow 1.5s ease infinite' : 'none',
                                            boxShadow: isRecording ? '0 0 30px rgba(255,95,31,0.3)' : 'none'
                                        }}
                                    >
                                        {isRecording
                                            ? <MicOff size={36} color="white" />
                                            : <Mic size={36} color="var(--text-secondary)" />
                                        }
                                    </div>

                                    <p style={{ fontSize: 14, color: isRecording ? 'var(--primary-apex)' : 'var(--text-muted)', fontWeight: isRecording ? 600 : 400 }}>
                                        {isRecording ? '🔴 Listening... Tap to finish' : 'Tap to start speaking'}
                                    </p>
                                </>
                            )}

                            {/* Voice done: transcript + loading */}
                            {voiceDone && (
                                <div style={{ marginTop: 12 }}>
                                    {/* Transcript */}
                                    <div style={{
                                        padding: 16,
                                        background: 'rgba(255,255,255,0.04)',
                                        borderRadius: 14,
                                        border: '1px solid rgba(255,95,31,0.15)',
                                        textAlign: 'left',
                                        fontSize: 15, fontStyle: 'italic', color: 'white',
                                        lineHeight: 1.5
                                    }}>
                                        <span style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'normal', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                                            Your request:
                                        </span>
                                        "{voiceTranscript}"
                                    </div>

                                    {/* Loading indicator */}
                                    {isLoading && (
                                        <div style={{
                                            marginTop: 24,
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
                                        }}>
                                            <div style={{
                                                width: 48, height: 48,
                                                border: '3px solid rgba(255,95,31,0.2)',
                                                borderTopColor: 'var(--primary-apex)',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }} />
                                            <div>
                                                <p style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Generating your route...</p>
                                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Analyzing roads, stops & conditions</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Retry button if done loading but still here */}
                                    {!isLoading && (
                                        <button
                                            onClick={() => { setVoiceDone(false); setVoiceTranscript(''); }}
                                            style={{
                                                marginTop: 20, padding: '12px 20px',
                                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 12, color: 'var(--text-secondary)',
                                                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                margin: '20px auto 0',
                                                fontFamily: 'var(--font-main)'
                                            }}
                                        >
                                            <RefreshCw size={14} /> Try again
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─────── PARAMETERS TAB ─────── */}
                    {mode === 'parameters' && (
                        <div style={{ marginTop: 20 }}>

                            {/* Duration Slider */}
                            <div style={{ marginBottom: 28 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                    <Clock size={14} color="var(--primary-apex)" /> Duration
                                </label>
                                <input
                                    type="range"
                                    min={0} max={4} step={1}
                                    value={durationStep}
                                    onChange={(e) => setDurationStep(parseInt(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--primary-apex)' }}
                                />
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    marginTop: 8, fontSize: 11, color: 'var(--text-muted)'
                                }}>
                                    {durationOptions.map((opt, i) => (
                                        <span key={i} style={{
                                            color: i === durationStep ? 'var(--primary-apex)' : 'inherit',
                                            fontWeight: i === durationStep ? 700 : 400
                                        }}>
                                            {opt.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Direction Selector */}
                            <div style={{ marginBottom: 28 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                    <Compass size={14} color="var(--primary-apex)" /> Preferred Direction
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                                    {directions.map(d => (
                                        <button
                                            key={d.key}
                                            onClick={() => setDirection(d.key)}
                                            style={{
                                                padding: '10px 8px',
                                                borderRadius: 10,
                                                border: direction === d.key
                                                    ? '1px solid rgba(255,95,31,0.4)'
                                                    : 'var(--border-glass)',
                                                background: direction === d.key
                                                    ? 'rgba(255,95,31,0.12)'
                                                    : 'rgba(255,255,255,0.03)',
                                                color: direction === d.key
                                                    ? 'var(--primary-apex)'
                                                    : 'var(--text-secondary)',
                                                fontWeight: 600, fontSize: 14,
                                                fontFamily: 'var(--font-main)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Driving Style Slider */}
                            <div style={{ marginBottom: 28 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                    <Sparkles size={14} color="var(--primary-apex)" /> Driving Style
                                </label>
                                <input
                                    type="range"
                                    min={0} max={1} step={0.1}
                                    value={style}
                                    onChange={(e) => setStyle(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--primary-apex)' }}
                                />
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    marginTop: 8, fontSize: 12, color: 'var(--text-muted)'
                                }}>
                                    <span style={{ color: style <= 0.3 ? 'var(--sss-apex)' : 'inherit' }}>Relaxing</span>
                                    <span style={{ color: style >= 0.7 ? 'var(--primary-apex)' : 'inherit' }}>Challenging</span>
                                </div>
                            </div>

                            {/* Loop Toggle */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '16px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: 14,
                                border: 'var(--border-glass)',
                                marginBottom: 20
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <RefreshCw size={16} color={isLoop ? 'var(--primary-apex)' : 'var(--text-muted)'} />
                                    <div>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Loop Route</span>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Return to starting point</p>
                                    </div>
                                </div>
                                <div
                                    onClick={() => setIsLoop(!isLoop)}
                                    style={{
                                        width: 50, height: 28,
                                        borderRadius: 14,
                                        background: isLoop
                                            ? 'linear-gradient(135deg, var(--primary-apex), var(--primary-deep))'
                                            : 'rgba(255,255,255,0.1)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        position: 'relative',
                                        flexShrink: 0
                                    }}
                                >
                                    <div style={{
                                        width: 22, height: 22,
                                        borderRadius: '50%',
                                        background: 'white',
                                        position: 'absolute',
                                        top: 3,
                                        left: isLoop ? 25 : 3,
                                        transition: 'left 0.3s',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                                    }} />
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleParamGenerate}
                                disabled={isLoading}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    fontSize: 15, fontWeight: 700
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <div style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} /> Generate Route
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AIArchitectModal
