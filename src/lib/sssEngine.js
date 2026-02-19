// ─── Peak Flow v13.0 — Supercar Suitability Score Engine ───
// Formula: SSS = 10 − (D_unpaved + D_hump + D_pothole)

// Deduction weights per hazard type
const DEDUCTION_WEIGHTS = {
    speedHump: 0.3,   // per hump
    pothole: 0.5,     // per pothole
    unpaved: 0.8      // per % of unpaved road
}

/**
 * Calculate SSS from route hazard data.
 * @param {Object} route - Route with hazards: { speedHumps, potholes, unpaved }
 * @returns {number} Score from 0.0 to 10.0
 */
export const calculateSSS = (route) => {
    if (!route?.hazards) return 10.0

    const { speedHumps = 0, potholes = 0, unpaved = 0 } = route.hazards

    const D_hump = speedHumps * DEDUCTION_WEIGHTS.speedHump
    const D_pothole = potholes * DEDUCTION_WEIGHTS.pothole
    const D_unpaved = unpaved * DEDUCTION_WEIGHTS.unpaved

    const raw = 10 - (D_unpaved + D_hump + D_pothole)
    return Math.max(0, Math.min(10, parseFloat(raw.toFixed(1))))
}

/**
 * Map SSS score to a color tier.
 * @param {number} score
 * @returns {{ tier: string, color: string, label: string }}
 */
export const getSSSColor = (score) => {
    if (score >= 9.0) return { tier: 'apex', color: '#00e676', label: 'Apex' }
    if (score >= 7.0) return { tier: 'good', color: '#ff9100', label: 'Good' }
    if (score >= 5.0) return { tier: 'caution', color: '#ffd600', label: 'Caution' }
    return { tier: 'danger', color: '#ff1744', label: 'Danger' }
}

/**
 * Get itemized chassis threat deductions for a route.
 * @param {Object} route
 * @returns {Array<{ type: string, count: number, deduction: number, label: string }>}
 */
export const getChassisThreats = (route) => {
    if (!route?.hazards) return []

    const threats = []
    const { speedHumps = 0, potholes = 0, unpaved = 0 } = route.hazards

    if (speedHumps > 0) {
        threats.push({
            type: 'speedHump',
            count: speedHumps,
            deduction: speedHumps * DEDUCTION_WEIGHTS.speedHump,
            label: `${speedHumps} Speed Hump${speedHumps > 1 ? 's' : ''} detected`,
            icon: '⚠️'
        })
    }

    if (potholes > 0) {
        threats.push({
            type: 'pothole',
            count: potholes,
            deduction: potholes * DEDUCTION_WEIGHTS.pothole,
            label: `${potholes} Pothole${potholes > 1 ? 's' : ''} reported`,
            icon: '🕳️',
            timeAgo: '24m ago'
        })
    }

    if (unpaved > 0) {
        threats.push({
            type: 'unpaved',
            count: unpaved,
            deduction: unpaved * DEDUCTION_WEIGHTS.unpaved,
            label: `${unpaved}% Unpaved surface`,
            icon: '🚧'
        })
    }

    return threats
}

/**
 * Simulate a 200m speed hump alert.
 * Returns alert data when distance to hump ≤ 200m.
 * @param {number} distanceToHump - meters to the next hump
 * @returns {Object|null}
 */
export const simulateHumpAlert = (distanceToHump) => {
    if (distanceToHump <= 200) {
        return {
            type: 'hump_warning',
            distance: distanceToHump,
            message: `Speed hump in ${distanceToHump}m — reduce speed`,
            severity: distanceToHump <= 50 ? 'critical' : 'warning'
        }
    }
    return null
}

/**
 * Simulate a real-time pothole flash interrupt.
 * @returns {Object}
 */
export const simulatePotholeFlash = () => {
    return {
        type: 'pothole_flash',
        message: 'Pothole reported ahead — caution',
        severity: 'critical',
        timestamp: Date.now()
    }
}

/**
 * Format duration minutes to human-readable string.
 * @param {number} minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}min`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
}

/**
 * Curviness Index label mapper.
 * @param {number} ci - 1 to 5
 * @returns {string}
 */
export const getCurvinessLabel = (ci) => {
    const labels = { 1: 'Straight', 2: 'Gentle', 3: 'Moderate', 4: 'Technical', 5: 'Extreme' }
    return labels[ci] || 'Unknown'
}
