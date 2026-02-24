import React from 'react'
import { AlertTriangle, Mountain, Layers } from 'lucide-react'

/**
 * Unified Route Details Section — Surface, Alerts & Elevation
 * Used across RouteOverviewSheet, RouteDetailSheet, RoutePlanningPanel, and Squad.
 *
 * Props:
 *   route — the route object (must have .surface, .hazards, .elevation)
 *   compact — if true, uses tighter spacing (convoy/planning panel)
 */

const SURFACE_COLORS = {
    asphalt: { color: 'var(--sss-apex)', label: 'Asphalt' },
    concrete: { color: 'var(--sss-good)', label: 'Concrete' },
    cobblestone: { color: 'var(--sss-caution)', label: 'Cobbles' },
    gravel: { color: 'var(--sss-danger)', label: 'Gravel' },
}

const RouteDetailsSection = ({ route, compact = false }) => {
    if (!route) return null

    const { surface, hazards, elevation } = route
    const hasSurface = surface && Object.values(surface).some(v => v > 0)

    // Collect real hazard alerts (only when values > 0)
    const alerts = []
    if (hazards?.potholes > 0) alerts.push({ icon: '🕳️', text: 'Potholes reported on this route', severity: 'danger' })
    if (hazards?.speedHumps > 0) alerts.push({ icon: '⚠️', text: `${hazards.speedHumps} speed humps along route`, severity: 'warning' })
    if (hazards?.unpaved > 0) alerts.push({ icon: '🪨', text: 'Unpaved sections present', severity: 'warning' })
    if (surface?.gravel > 0) alerts.push({ icon: '⛰️', text: `${surface.gravel}% gravel — high chassis risk`, severity: 'danger' })
    if (surface?.cobblestone > 10) alerts.push({ icon: '🧱', text: 'Significant cobblestone sections', severity: 'warning' })

    const hasAlerts = alerts.length > 0
    const hasElevation = elevation && (elevation.gain > 0 || elevation.maxGradient > 0)
    const hasAnything = hasSurface || hasAlerts || hasElevation

    if (!hasAnything) return null

    return (
        <div style={{ marginTop: compact ? 16 : 20 }}>
            {/* Section Header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 14
            }}>
                <Layers size={14} color="var(--primary-apex)" />
                <span style={{
                    fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)',
                    textTransform: 'uppercase', letterSpacing: 0.8
                }}>Route Details</span>
            </div>

            {/* Surface Composition */}
            {hasSurface && (
                <div style={{
                    padding: compact ? 14 : 16,
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    marginBottom: hasAlerts || hasElevation ? 10 : 0
                }}>
                    {/* Composition Bar */}
                    <div style={{
                        display: 'flex', height: 8, borderRadius: 4,
                        overflow: 'hidden', marginBottom: 12,
                        background: 'rgba(255,255,255,0.04)'
                    }}>
                        {Object.entries(SURFACE_COLORS).map(([key, { color }]) => {
                            const pct = surface[key] || 0
                            if (pct <= 0) return null
                            return <div key={key} style={{ width: `${pct}%`, background: color, transition: 'width 0.4s' }} />
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: compact ? 10 : 14 }}>
                        {Object.entries(SURFACE_COLORS).map(([key, { color, label }]) => {
                            const pct = surface[key] || 0
                            if (pct <= 0) return null
                            return (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        background: color, flexShrink: 0
                                    }} />
                                    <span style={{
                                        fontSize: 12, color: key === 'gravel' ? 'var(--sss-danger)' : 'var(--text-secondary)',
                                        fontWeight: key === 'asphalt' ? 600 : 400
                                    }}>
                                        {label} <span style={{ fontWeight: 700, color: 'white' }}>{pct}%</span>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Alerts — only shown when there are actual issues */}
            {hasAlerts && (
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: 8,
                    marginBottom: hasElevation ? 10 : 0
                }}>
                    {alerts.map((alert, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px',
                            background: alert.severity === 'danger'
                                ? 'rgba(255,23,68,0.06)'
                                : 'rgba(255,214,0,0.05)',
                            border: `1px solid ${alert.severity === 'danger'
                                ? 'rgba(255,23,68,0.15)'
                                : 'rgba(255,214,0,0.15)'}`,
                            borderRadius: 12,
                        }}>
                            <span style={{ fontSize: 16, flexShrink: 0 }}>{alert.icon}</span>
                            <span style={{
                                fontSize: 12, fontWeight: 500,
                                color: alert.severity === 'danger' ? 'var(--sss-danger)' : 'var(--sss-caution)',
                                lineHeight: 1.3
                            }}>
                                {alert.text}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Elevation */}
            {hasElevation && (
                <div style={{
                    padding: compact ? 14 : 16,
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    display: 'flex', gap: compact ? 12 : 20
                }}>
                    {elevation.gain > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: 'rgba(255,95,31,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Mountain size={16} color="var(--primary-apex)" />
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                                    Elevation
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>
                                    +{elevation.gain}m
                                </div>
                            </div>
                        </div>
                    )}
                    {elevation.maxGradient > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: 'rgba(255,255,255,0.04)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <span style={{ fontSize: 14 }}>📐</span>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                                    Max Gradient
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>
                                    {elevation.maxGradient}%
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default RouteDetailsSection
