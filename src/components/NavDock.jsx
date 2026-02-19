import React from 'react'
import { Compass, Users, Clock, User } from 'lucide-react'

const NavDock = ({ activeTab, onTabChange, activeConvoy, hidden, squadEnabled }) => {
    if (hidden) return null
    const navItems = [
        { id: 'discover', label: 'Discover', icon: Compass },
        { id: 'squad', label: 'Squad', icon: Users },
        { id: 'trips', label: 'Trips', icon: Clock },
        { id: 'profile', label: 'Profile', icon: User },
    ]

    return (
        <div className="glass-dock" style={{
            position: 'fixed',
            bottom: 0, left: 0,
            width: '100%', height: '80px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 'var(--z-dock)',
            paddingBottom: '16px'
        }}>
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                const isConvoyActive = (item.id === 'squad' && activeConvoy?.active) || (item.id === 'discover' && squadEnabled)
                return (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        style={{
                            background: 'none', border: 'none',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: '4px',
                            cursor: 'pointer',
                            color: isConvoyActive
                                ? 'var(--sss-apex)'
                                : isActive ? 'var(--primary-apex)' : 'var(--text-secondary)',
                            transition: 'color 0.2s, transform 0.2s',
                            transform: isActive ? 'translateY(-2px)' : 'none',
                            padding: '6px 16px',
                            position: 'relative'
                        }}
                    >
                        <div style={{ position: 'relative' }}>
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                            {/* Green pulsing dot when convoy is active */}
                            {isConvoyActive && (
                                <div style={{
                                    position: 'absolute', top: -3, right: -5,
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: 'var(--sss-apex)',
                                    boxShadow: '0 0 6px rgba(0,230,118,0.6)',
                                    animation: 'pulseGlow 2s ease infinite'
                                }} />
                            )}
                        </div>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: isActive || isConvoyActive ? 700 : 500,
                            fontFamily: 'var(--font-main)',
                            letterSpacing: isActive ? '0.5px' : '0'
                        }}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div style={{
                                position: 'absolute', top: -1,
                                width: 20, height: 3,
                                borderRadius: 2,
                                background: isConvoyActive ? 'var(--sss-apex)' : 'var(--primary-apex)',
                                boxShadow: isConvoyActive ? '0 0 8px rgba(0,230,118,0.5)' : '0 0 8px var(--primary-glow)'
                            }} />
                        )}
                    </button>
                )
            })}

            {/* Active Convoy Member Count Pill — recording-style indicator */}
            {activeConvoy?.active && activeTab !== 'squad' && (
                <div
                    onClick={() => onTabChange('squad')}
                    style={{
                        position: 'absolute',
                        top: -18,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '5px 14px 5px 10px',
                        borderRadius: 20,
                        background: 'rgba(0,230,118,0.15)',
                        border: '1px solid rgba(0,230,118,0.3)',
                        backdropFilter: 'blur(12px)',
                        cursor: 'pointer',
                        animation: 'pulseGlow 3s ease infinite',
                        zIndex: 1
                    }}
                >
                    {/* Pulsing live dot */}
                    <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: 'var(--sss-apex)',
                        boxShadow: '0 0 6px rgba(0,230,118,0.6)',
                        animation: 'pulseGlow 1.5s ease infinite'
                    }} />
                    <Users size={12} color="var(--sss-apex)" />
                    <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: 'var(--sss-apex)',
                        fontFamily: 'var(--font-main)'
                    }}>
                        {activeConvoy.memberCount}
                    </span>
                </div>
            )}
        </div>
    )
}

export default NavDock
