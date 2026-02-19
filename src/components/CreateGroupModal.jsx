import React, { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Upload, Calendar, Users, Map, Sparkles, Search, Image as ImageIcon } from 'lucide-react'

const CreateGroupModal = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        coverImage: null,
        coverImagePreview: null,
        members: [],
        startTime: 'now', // 'now' or Date object
        scheduleDate: '',
        scheduleTime: '',
        routeMethod: null, // 'manual' | 'ai' | 'discover'
        routeData: null
    })

    const totalSteps = 5

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            updateFormData('coverImage', file)
            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                updateFormData('coverImagePreview', reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleNext = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handleCreate = () => {
        console.log('Creating group with data:', formData)
        // TODO: Implement actual group creation logic
        alert('Group created successfully!')
        onClose()
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.title.length >= 3
            case 4:
                return formData.routeMethod !== null
            default:
                return true
        }
    }

    if (!isOpen) return null

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 'var(--z-modal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={onClose}
        >
            <div
                className="glass-panel"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideUp 0.3s ease-out'
                }}
            >
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Create Group</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map(step => (
                            <div
                                key={step}
                                style={{
                                    flex: 1,
                                    height: '4px',
                                    borderRadius: '2px',
                                    background: step <= currentStep ? 'var(--primary-apex)' : 'rgba(255,255,255,0.1)',
                                    transition: 'background 0.3s'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Basic Information</h3>

                                <label style={{ display: 'block', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                                        Title <span style={{ color: 'var(--primary-apex)' }}>*</span>
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => updateFormData('title', e.target.value)}
                                        placeholder="e.g., PEX team roadtrip to Arlberg"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </label>

                                <label style={{ display: 'block', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                                        Description
                                    </span>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => updateFormData('description', e.target.value)}
                                        placeholder="Add details about your convoy..."
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '14px',
                                            outline: 'none',
                                            resize: 'vertical'
                                        }}
                                    />
                                </label>

                                <div>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                                        Cover Image
                                    </span>

                                    {formData.coverImagePreview ? (
                                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                                            <img
                                                src={formData.coverImagePreview}
                                                alt="Cover preview"
                                                style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                                            />
                                            <button
                                                onClick={() => {
                                                    updateFormData('coverImage', null)
                                                    updateFormData('coverImagePreview', null)
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: 'rgba(0,0,0,0.7)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '8px',
                                                    cursor: 'pointer',
                                                    color: 'white'
                                                }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label style={{
                                            display: 'block',
                                            padding: '32px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '2px dashed rgba(255,255,255,0.2)',
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}>
                                            <ImageIcon size={32} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                                Click to upload cover image
                                            </p>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>
                                                JPG, PNG or WEBP (max 5MB)
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Members */}
                    {currentStep === 2 && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Add Members</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                                Invite others to join your convoy (optional)
                            </p>

                            <div style={{
                                padding: '40px 20px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <Users size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                    Member invitation feature coming soon!
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px' }}>
                                    You can add members after creating the group
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Schedule */}
                    {currentStep === 3 && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>When do you want to start?</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    onClick={() => updateFormData('startTime', 'now')}
                                    className="glass-panel"
                                    style={{
                                        padding: '20px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        background: formData.startTime === 'now' ? 'rgba(255, 107, 0, 0.15)' : 'var(--bg-glass)',
                                        border: formData.startTime === 'now' ? '2px solid var(--primary-apex)' : '1px solid rgba(255,255,255,0.1)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: '2px solid ' + (formData.startTime === 'now' ? 'var(--primary-apex)' : 'rgba(255,255,255,0.3)'),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {formData.startTime === 'now' && (
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-apex)' }} />
                                            )}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '16px', fontWeight: 600 }}>Start Now</p>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                Begin the convoy immediately
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => updateFormData('startTime', 'scheduled')}
                                    className="glass-panel"
                                    style={{
                                        padding: '20px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        background: formData.startTime === 'scheduled' ? 'rgba(255, 107, 0, 0.15)' : 'var(--bg-glass)',
                                        border: formData.startTime === 'scheduled' ? '2px solid var(--primary-apex)' : '1px solid rgba(255,255,255,0.1)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: '2px solid ' + (formData.startTime === 'scheduled' ? 'var(--primary-apex)' : 'rgba(255,255,255,0.3)'),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {formData.startTime === 'scheduled' && (
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-apex)' }} />
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '16px', fontWeight: 600 }}>Schedule for Later</p>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                Pick a date and time
                                            </p>
                                        </div>
                                    </div>

                                    {formData.startTime === 'scheduled' && (
                                        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="date"
                                                value={formData.scheduleDate}
                                                onChange={(e) => updateFormData('scheduleDate', e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    fontSize: '14px'
                                                }}
                                            />
                                            <input
                                                type="time"
                                                value={formData.scheduleTime}
                                                onChange={(e) => updateFormData('scheduleTime', e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Route Selection */}
                    {currentStep === 4 && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                                Choose Route <span style={{ color: 'var(--primary-apex)' }}>*</span>
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                                Select how you want to plan your route
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { id: 'manual', icon: Map, title: 'Plan Route Manually', desc: 'Use traditional route planning tools', color: '#3B82F6' },
                                    { id: 'ai', icon: Sparkles, title: 'AI Generate Route', desc: 'Describe your route with voice or text', color: '#8B5CF6' },
                                    { id: 'discover', icon: Search, title: 'Browse Existing Routes', desc: 'Choose from curated routes in Discover', color: '#10B981' }
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => updateFormData('routeMethod', method.id)}
                                        className="glass-panel"
                                        style={{
                                            padding: '20px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            background: formData.routeMethod === method.id ? 'rgba(255, 107, 0, 0.15)' : 'var(--bg-glass)',
                                            border: formData.routeMethod === method.id ? '2px solid var(--primary-apex)' : '1px solid rgba(255,255,255,0.1)',
                                            transition: 'all 0.2s',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: formData.routeMethod === method.id ? 'var(--primary-apex)' : method.color + '20',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <method.icon size={24} color={formData.routeMethod === method.id ? 'black' : method.color} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '16px', fontWeight: 600 }}>{method.title}</p>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                {method.desc}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 5 && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Review & Create</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {formData.coverImagePreview && (
                                    <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                        <img src={formData.coverImagePreview} alt="Cover" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                                    </div>
                                )}

                                <div className="glass-panel" style={{ padding: '16px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>TITLE</p>
                                    <p style={{ fontSize: '16px', fontWeight: 600 }}>{formData.title || 'Untitled'}</p>
                                </div>

                                {formData.description && (
                                    <div className="glass-panel" style={{ padding: '16px' }}>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>DESCRIPTION</p>
                                        <p style={{ fontSize: '14px' }}>{formData.description}</p>
                                    </div>
                                )}

                                <div className="glass-panel" style={{ padding: '16px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>START TIME</p>
                                    <p style={{ fontSize: '14px' }}>
                                        {formData.startTime === 'now' ? 'Now' : `${formData.scheduleDate} at ${formData.scheduleTime}`}
                                    </p>
                                </div>

                                <div className="glass-panel" style={{ padding: '16px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>ROUTE METHOD</p>
                                    <p style={{ fontSize: '14px' }}>
                                        {formData.routeMethod === 'manual' && 'Manual Planning'}
                                        {formData.routeMethod === 'ai' && 'AI Generated'}
                                        {formData.routeMethod === 'discover' && 'From Discover'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px' }}>
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            className="btn-glass"
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <ChevronLeft size={20} />
                            Back
                        </button>
                    )}

                    {currentStep < totalSteps ? (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="btn-primary"
                            style={{
                                flex: currentStep === 1 ? 1 : 2,
                                padding: '12px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: canProceed() ? 1 : 0.5,
                                cursor: canProceed() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleCreate}
                            className="btn-primary"
                            style={{
                                flex: 2,
                                padding: '12px',
                                borderRadius: '12px',
                                fontWeight: 600
                            }}
                        >
                            Create Group
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateGroupModal
