import React from 'react'
import { Gauge, Zap, Fuel, Activity } from 'lucide-react'

const PerformancePanel = ({ data }) => {
    if (!data) return null

    return (
        <div style={{ animation: 'slideUp 0.3s ease' }}>
            {/* Summary KPIs */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 10, marginBottom: 20
            }}>
                <KPICard
                    icon={<Gauge size={18} color="var(--primary-apex)" />}
                    label="Top Speed"
                    value={`${data.maxSpeed} km/h`}
                    sub={`Avg: ${data.avgSpeed} km/h`}
                />
                <KPICard
                    icon={<Zap size={18} color="var(--sss-caution)" />}
                    label="Peak G-Force"
                    value={`${data.maxGForce}G`}
                    sub={`Avg: ${data.avgGForce}G`}
                />
                <KPICard
                    icon={<Fuel size={18} color="var(--sss-good)" />}
                    label="Fuel Used"
                    value={`${data.fuelUsed}L`}
                />
                <KPICard
                    icon={<Activity size={18} color="var(--sss-apex)" />}
                    label="Gear Changes"
                    value={data.gearChanges}
                />
            </div>

            {/* G-Force Heatmap (Mock CSS Gradient) */}
            <div className="glass-panel" style={{ padding: 16, marginBottom: 20 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    G-Force Heatmap
                </h4>
                <div style={{
                    height: 60, borderRadius: 10,
                    background: `linear-gradient(90deg, 
                        rgba(0,230,118,0.3) 0%, 
                        rgba(0,230,118,0.5) 15%, 
                        rgba(255,145,0,0.5) 25%, 
                        rgba(0,230,118,0.4) 35%, 
                        rgba(255,214,0,0.6) 45%, 
                        rgba(255,23,68,0.7) 50%, 
                        rgba(255,214,0,0.5) 55%, 
                        rgba(0,230,118,0.4) 65%, 
                        rgba(255,145,0,0.6) 75%, 
                        rgba(255,23,68,0.5) 82%, 
                        rgba(255,145,0,0.4) 90%, 
                        rgba(0,230,118,0.3) 100%)`,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Peak marker */}
                    <div style={{
                        position: 'absolute', left: '50%', top: 0, bottom: 0,
                        width: 2, background: 'var(--sss-danger)',
                        opacity: 0.8
                    }} />
                    <div style={{
                        position: 'absolute', left: 'calc(50% - 20px)', top: 4,
                        fontSize: 9, fontWeight: 700, color: 'var(--sss-danger)',
                        background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4
                    }}>
                        Peak: {data.maxGForce}G
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--text-muted)' }}>
                    <span>Start</span>
                    <span style={{ display: 'flex', gap: 10 }}>
                        <span style={{ color: 'var(--sss-apex)' }}>● Low</span>
                        <span style={{ color: 'var(--sss-caution)' }}>● Med</span>
                        <span style={{ color: 'var(--sss-danger)' }}>● High</span>
                    </span>
                    <span>End</span>
                </div>
            </div>

            {/* Sector Benchmarking */}
            {data.sectors && data.sectors.length > 0 && (
                <div className="glass-panel" style={{ padding: 16 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Sector Breakdown
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {data.sectors.map((sector, i) => {
                            const maxSpeed = Math.max(...data.sectors.map(s => s.speed))
                            const pct = (sector.speed / maxSpeed * 100)

                            return (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, fontWeight: 500 }}>{sector.name}</span>
                                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sector.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            flex: 1, height: 6, borderRadius: 3,
                                            background: 'rgba(255,255,255,0.06)',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${pct}%`, height: '100%',
                                                borderRadius: 3,
                                                background: pct > 80
                                                    ? 'linear-gradient(90deg, var(--primary-apex), #ff8f00)'
                                                    : pct > 50
                                                        ? 'var(--sss-good)'
                                                        : 'var(--sss-apex)',
                                                transition: 'width 0.6s ease'
                                            }} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 700, minWidth: 56, textAlign: 'right' }}>
                                            {sector.speed} km/h
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── KPI Card ───
const KPICard = ({ icon, label, value, sub }) => (
    <div className="glass-panel" style={{
        padding: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center'
    }}>
        <div style={{ marginBottom: 8 }}>{icon}</div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 20, fontWeight: 800 }}>{value}</p>
        {sub && <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</p>}
    </div>
)

export default PerformancePanel
