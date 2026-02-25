import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY
const FLYOVER_DURATION_MS = 240000 // 4 minutes — slow, cinematic

function calcBearing(from, to) {
    const toRad = d => d * Math.PI / 180
    const toDeg = r => r * 180 / Math.PI
    const dLng = toRad(to[1] - from[1])
    const lat1 = toRad(from[0]), lat2 = toRad(to[0])
    const y = Math.sin(dLng) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
    return (toDeg(Math.atan2(y, x)) + 360) % 360
}

function lerp(a, b, t) { return a + (b - a) * t }

// Returns position and bearing at a given progress ratio [0..1]
function getPositionAtProgress(geometry, progress) {
    const totalSeg = geometry.length - 1
    const rawIdx = Math.min(progress * totalSeg, totalSeg)
    const i = Math.min(Math.floor(rawIdx), totalSeg - 1)
    const t = rawIdx - i
    const from = geometry[i]
    const to = geometry[Math.min(i + 1, geometry.length - 1)]
    // Look far ahead for bearing (40 points) to ignore micro-zigzags
    const lookAhead = geometry[Math.min(i + 40, geometry.length - 1)]
    return {
        lat: lerp(from[0], to[0], t),
        lng: lerp(from[1], to[1], t),
        bearing: calcBearing(from, lookAhead)
    }
}

// MapboxContainer — uncontrolled mode (initialViewState)
// Exposes seekToProgress() for the scrubber
const MapboxContainer = forwardRef(function MapboxContainer(
    { route, routeGeometry, isFlyoverActive, onFlyoverComplete, onProgressUpdate },
    ref
) {
    const mapRef = useRef(null)
    const animState = useRef({
        active: false,
        startTime: null,
        manualProgress: null,  // set when user scrubs
        phase: 'idle'
    })
    const t1Ref = useRef(null)
    const t2Ref = useRef(null)

    const smoothBearingRef = useRef(0) // persists across frames — updated lazily
    const startCoords = route?.coordinates?.start || { lat: 47.44, lng: 11.10 }

    // GeoJSON orange route
    const geoJsonRoute = routeGeometry ? {
        type: 'Feature', properties: {},
        geometry: { type: 'LineString', coordinates: routeGeometry.map(([lat, lng]) => [lng, lat]) }
    } : null

    // Expose seekToProgress for the scrubber slider
    useImperativeHandle(ref, () => ({
        seekToProgress: (progress) => {
            if (!routeGeometry?.length || !mapRef.current) return
            animState.current.manualProgress = progress
            animState.current.startTime = performance.now() - progress * FLYOVER_DURATION_MS
            const map = mapRef.current.getMap()
            const pos = getPositionAtProgress(routeGeometry, progress)
            map.jumpTo({ center: [pos.lng, pos.lat], zoom: 14.8, pitch: 70, bearing: pos.bearing })
            // Update the dot immediately when scrubbing
            const dotSrc = map.getSource('progress-dot')
            if (dotSrc) dotSrc.setData({ type: 'Feature', geometry: { type: 'Point', coordinates: [pos.lng, pos.lat] } })
        }
    }), [routeGeometry])

    // Reset camera on route change
    useEffect(() => {
        const map = mapRef.current?.getMap()
        if (!map || !route?.coordinates) return
        animState.current.active = false
        animState.current.phase = 'idle'
        map.stop()
        map.jumpTo({ center: [startCoords.lng, startCoords.lat], zoom: 10, pitch: 50, bearing: 0 })
    }, [route])

    // Main flyover effect
    useEffect(() => {
        const map = mapRef.current?.getMap()
        if (!map) return

        // Always stop any running animation first
        animState.current.active = false
        animState.current.phase = 'idle'
        clearTimeout(t1Ref.current)
        clearTimeout(t2Ref.current)
        map.stop()
        map.off('render', onMapRender)

        if (!isFlyoverActive || !routeGeometry?.length) return

        function onMapRender() {
            const state = animState.current
            if (!state.active) return

            const elapsed = performance.now() - state.startTime
            const progress = Math.min(elapsed / FLYOVER_DURATION_MS, 1)

            const pos = getPositionAtProgress(routeGeometry, progress)

            // Lazy bearing: ease 1.5% per frame toward target — ignores small wiggles
            let bearingDiff = pos.bearing - smoothBearingRef.current
            if (bearingDiff > 180) bearingDiff -= 360
            else if (bearingDiff < -180) bearingDiff += 360
            smoothBearingRef.current += bearingDiff * 0.015

            map.jumpTo({ center: [pos.lng, pos.lat], zoom: 14.8, pitch: 70, bearing: smoothBearingRef.current })

            // Update progress dot on the route line
            const dotSrc = map.getSource('progress-dot')
            if (dotSrc) dotSrc.setData({ type: 'Feature', geometry: { type: 'Point', coordinates: [pos.lng, pos.lat] } })

            // Report progress to parent for the scrubber
            onProgressUpdate?.(progress)

            if (progress >= 1) {
                animState.current.active = false
                animState.current.phase = 'done'
                map.off('render', onMapRender)
                onFlyoverComplete?.()
            } else {
                map.triggerRepaint()
            }
        }

        const first = routeGeometry[0]
        const lookAhead = routeGeometry[Math.min(8, routeGeometry.length - 1)]

        // Phase 1: overview
        map.flyTo({ center: [startCoords.lng, startCoords.lat], zoom: 10, pitch: 35, bearing: 0, duration: 2500, essential: true })

        // Phase 2: swoop to start
        t1Ref.current = setTimeout(() => {
            if (!isFlyoverActive) return
            map.flyTo({
                center: [first[1], first[0]], zoom: 14, pitch: 68,
                bearing: calcBearing(first, lookAhead), duration: 3000, essential: true
            })
            // Phase 3: start render-loop flyover
            t2Ref.current = setTimeout(() => {
                if (!isFlyoverActive) return
                animState.current.startTime = performance.now()
                animState.current.active = true
                animState.current.phase = 'flying'
                map.on('render', onMapRender)
                map.triggerRepaint()
            }, 3100)
        }, 2600)

        return () => {
            animState.current.active = false
            clearTimeout(t1Ref.current)
            clearTimeout(t2Ref.current)
            map.off('render', onMapRender)
        }
    }, [isFlyoverActive]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!MAPBOX_TOKEN) {
        return (
            <div style={{ padding: 20, color: 'white', background: '#111', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Missing <code>VITE_MAPBOX_API_KEY</code></p>
            </div>
        )
    }

    return (
        <Map
            ref={mapRef}
            initialViewState={{ longitude: startCoords.lng, latitude: startCoords.lat, zoom: 10, pitch: 50, bearing: 0 }}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
            terrain={{ source: 'mapbox-dem', exaggeration: 1.7 }}
        >
            <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />
            <Layer id="sky" type="sky" paint={{ 'sky-type': 'atmosphere', 'sky-atmosphere-sun': [0, 0], 'sky-atmosphere-sun-intensity': 15 }} />
            {geoJsonRoute && (
                <Source id="route-source" type="geojson" data={geoJsonRoute}>
                    <Layer id="route-glow" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#ff5f1f', 'line-width': 22, 'line-opacity': 0.18, 'line-blur': 12 }} />
                    <Layer id="route-core" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#ff5f1f', 'line-width': 5, 'line-opacity': 1 }} />
                </Source>
            )}
            {/* Progress dot — position updated imperatively in the render loop */}
            <Source id="progress-dot" type="geojson" data={{ type: 'Feature', geometry: { type: 'Point', coordinates: [startCoords.lng, startCoords.lat] } }}>
                <Layer id="progress-dot-glow" type="circle" paint={{ 'circle-radius': 18, 'circle-color': '#ff5f1f', 'circle-opacity': 0.25, 'circle-blur': 0.6 }} />
                <Layer id="progress-dot-core" type="circle" paint={{ 'circle-radius': 8, 'circle-color': '#ff5f1f', 'circle-stroke-width': 2.5, 'circle-stroke-color': '#ffffff', 'circle-opacity': 1 }} />
            </Source>
            <NavigationControl position="top-right" />
            <FullscreenControl position="top-right" />
        </Map>
    )
})

export default MapboxContainer
