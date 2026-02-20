import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MapContainer as LeafletMap, TileLayer, useMap, useMapEvents, CircleMarker, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import SmartRoute from './SmartRoute'

// ─── Navigation Arrow Icon (CCP) ───
const createArrowIcon = (liveSharing = false) => {
    const color = liveSharing ? '#00e676' : '#00e5ff'
    return L.divIcon({
        className: 'ccp-arrow-icon',
        html: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="ccp-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${color}" flood-opacity="0.6"/>
                </filter>
            </defs>
            <polygon points="16,2 26,28 16,22 6,28" fill="${color}" stroke="white" stroke-width="1.5" filter="url(#ccp-glow)"/>
        </svg>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    })
}

// ─── Sub-component: Metric scale bar ───


// ─── Sub-component: handles fly-to and location tracking ───
const MapController = ({ flyToTarget, userLocation }) => {
    const map = useMap()
    const hasFlown = useRef(false)

    // Fly to user location on first load
    useEffect(() => {
        if (userLocation && !hasFlown.current) {
            map.flyTo(userLocation, 13, { duration: 1.5 })
            hasFlown.current = true
        }
    }, [userLocation, map])

    // Fly to a specific route target
    useEffect(() => {
        if (flyToTarget?.path && flyToTarget.path.length > 1) {
            const bounds = flyToTarget.path.map(w => [w.lat, w.lng])
            // Allow padding override
            const options = {
                padding: [60, 60],
                duration: 1.5,
                ...(flyToTarget.paddingOptions || {})
            }
            map.flyToBounds(bounds, options)
        } else if (flyToTarget?.waypoints && flyToTarget.waypoints.length > 1 && flyToTarget.waypoints[0].lat) {
            const bounds = flyToTarget.waypoints.map(w => [w.lat, w.lng])
            const options = {
                padding: [60, 60],
                duration: 1.5,
                ...(flyToTarget.paddingOptions || {})
            }
            map.flyToBounds(bounds, options)
        } else if (flyToTarget?.coordinates) {
            const { start } = flyToTarget.coordinates
            map.flyTo([start.lat, start.lng], 13, { duration: 1.2 })
        } else if (flyToTarget?.lat && flyToTarget?.lng) {
            if (flyToTarget.isDrivingTrack) {
                const targetPoint = map.project([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom || 14)
                // Shift target point UP by 25% of map height so CCP renders lower (at 25% from bottom)
                const mapHeight = map.getSize().y || window.innerHeight
                targetPoint.y -= mapHeight * 0.25
                const offsetLatLng = map.unproject(targetPoint, flyToTarget.zoom || 14)
                // Use setView for continuous tracking updates to avoid flyTo animation cancellation
                map.setView(offsetLatLng, flyToTarget.zoom || 14, { animate: true, duration: 0.8 })
            } else {
                map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom || 14, { duration: 1.2 })
            }
        }
    }, [flyToTarget, map])

    return null
}

// ─── Sub-component: Handle Map Events ───
const MapEvents = ({ onMapMove, onMapClick, onManualPan }) => {
    const map = useMapEvents({
        moveend: () => {
            if (onMapMove) onMapMove(map.getCenter())
        },
        click: (e) => {
            if (onMapClick) onMapClick(e)
        },
        dragstart: () => {
            if (onManualPan) onManualPan()
        },
        // Also catch touch moves that might not trigger dragstart immediately
        movestart: (e) => {
            // Distinguish between flyTo (programmatic) and user interaction
            // Leaflet doesn't always make this easy, but dragstart is reliable for mouse/touch drag.
            // We can primarily rely on dragstart.
        }
    })
    return null
}

// ─── Sub-component: Renders routes and handles interaction ───
const RouteLayer = ({ routes, onRouteTap, selectedRouteId }) => {
    const map = useMap()
    const [visibleRoutes, setVisibleRoutes] = useState([])

    const updateVisibleRoutes = useCallback(() => {
        const bounds = map.getBounds()
        const visible = routes.filter(route => {
            const points = route.path || (route.coordinates ? [route.coordinates.start, route.coordinates.end] : [])
            if (!points.length) return false
            const paddedBounds = bounds.pad(0.5)
            return points.some(p => paddedBounds.contains([p.lat, p.lng]))
        })
        setVisibleRoutes(visible)
    }, [routes, map])

    useEffect(() => {
        updateVisibleRoutes()
    }, [updateVisibleRoutes])

    useMapEvents({
        moveend: updateVisibleRoutes,
        zoomend: updateVisibleRoutes,
    })

    const handleRouteClick = (route, e) => {
        if (e && e.originalEvent) e.originalEvent.stopPropagation()
        onRouteTap && onRouteTap(route)
    }

    return (
        <>
            {visibleRoutes.map(route => {
                let waypoints = []

                if (route.path && Array.isArray(route.path)) {
                    waypoints = route.path
                } else if (route.coordinates) {
                    waypoints = [
                        route.coordinates.start,
                        route.coordinates.end
                    ]
                } else {
                    return null
                }

                return (
                    <SmartRoute
                        key={route.id}
                        waypoints={waypoints}
                        color='#ff5f1f'
                        isSelected={selectedRouteId === route.id}
                        image={route.image}
                        onRouteClick={(r, e) => handleRouteClick(route, e)}
                    />
                )
            })}
        </>
    )
}



// ─── POI Marker Icon ───
const createPOIIcon = () => L.divIcon({
    className: 'poi-marker-icon',
    html: `<svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="poi-shadow" x="-30%" y="-10%" width="160%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.4"/>
            </filter>
        </defs>
        <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0z" fill="#ff5f1f" filter="url(#poi-shadow)"/>
        <circle cx="18" cy="18" r="7" fill="white"/>
    </svg>`,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48]
})

const poiIcon = createPOIIcon()

const createDriverIcon = (name, vehicle) => {
    // Simple heuristic: remove the first word (Brand)
    const model = vehicle ? vehicle.split(' ').slice(1).join(' ') : ''

    return L.divIcon({
        className: 'driver-marker',
        html: `<div style="position: relative; width: 0; height: 0;">
        <div style="position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); background: white; padding: 6px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; color: black; box-shadow: 0 4px 12px rgba(0,0,0,0.4); white-space: nowrap; pointer-events: none; display: flex; flex-direction: column; align-items: center; gap: 2px;">
            <div style="line-height: 1;">${name}</div>
            ${model ? `<div style="font-size: 9px; font-weight: 500; color: #666; line-height: 1;">${model}</div>` : ''}
        </div>
        <div style="position: absolute; top: -6px; left: -6px; width: 12px; height: 12px; background: #00e676; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px #00e676;"></div>
    </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
    })
}

const MapContainerComponent = ({ routes = [], routeGeometry, flyToTarget, onRouteTap, onLocationFound, mapStyle = 'default', onMapMove, onMapClick, selectedRouteId, poiMarker, liveSharing = false, nearbyDrivers = [], onDriverClick, activeNavRoute, alternativeRoutes = [], onAlternativeRouteSelect, searchResults = [], onSearchResultClick, onManualPan }) => {
    const [userLocation, setUserLocation] = useState(null)
    const [locationError, setLocationError] = useState(null)

    useEffect(() => {
        if (!navigator.geolocation) {
            console.warn("Geolocation is not supported by this browser.")
            return
        }

        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                const loc = { lat: latitude, lng: longitude }
                setUserLocation(loc)
                if (onLocationFound) onLocationFound(loc)
            },
            (error) => {
                console.warn("Error getting user location:", error)
                setLocationError(true)
                // Fallback to Munich so users without GPS can still view local features
                const fallbackLoc = { lat: 48.1371, lng: 11.5754 }
                setUserLocation(fallbackLoc)
                if (onLocationFound) onLocationFound(fallbackLoc)
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        )
    }, [])

    const defaultCenter = [50.1109, 8.6821]
    const center = userLocation || defaultCenter

    const tileUrl = mapStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

    const attribution = mapStyle === 'satellite'
        ? '&copy; <a href="https://www.esri.com/">Esri</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            zIndex: 'var(--z-map)'
        }}>
            <LeafletMap
                key={mapStyle}
                center={center}
                zoom={13}
                style={{ width: '100%', height: '100%', background: '#0f1115' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url={tileUrl}
                    attribution={attribution}
                    subdomains={mapStyle === 'satellite' ? [] : "abcd"}
                    maxZoom={20}
                />

                {/* Satellite Overlays: Roads & Labels */}
                {mapStyle === 'satellite' && (
                    <>
                        <TileLayer
                            className="grayscale-tiles"
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
                            maxZoom={20}
                            opacity={0.4}
                        />
                        <TileLayer
                            className="grayscale-tiles"
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                            maxZoom={20}
                            opacity={0.7}
                        />
                    </>
                )}

                <MapEvents onMapMove={onMapMove} onMapClick={onMapClick} onManualPan={onManualPan} />

                {/* Interactive Route Layer */}
                <RouteLayer routes={routes} onRouteTap={onRouteTap} />

                {/* User Location — Navigation Arrow + Accuracy Halo */}
                {userLocation && (
                    <>
                        {/* Arrow marker (CCP) */}
                        <Marker
                            position={userLocation}
                            icon={createArrowIcon(liveSharing)}
                            zIndexOffset={1000}
                        />
                        {/* Accuracy halo */}
                        <CircleMarker
                            center={userLocation}
                            radius={20}
                            pathOptions={{
                                color: liveSharing ? '#00e676' : '#00e5ff',
                                fillColor: liveSharing ? '#00e676' : '#00e5ff',
                                fillOpacity: 0.15,
                                weight: 0
                            }}
                        />
                    </>
                )}

                {/* POI Marker Pin */}
                {poiMarker && (
                    <Marker
                        position={[poiMarker.lat, poiMarker.lng]}
                        icon={poiIcon}
                        zIndexOffset={900}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e)
                            }
                        }}
                    />
                )}

                {/* Nearby Drivers */}
                {nearbyDrivers.map(driver => (
                    <Marker
                        key={driver.id}
                        position={[driver.lat, driver.lng]}
                        icon={createDriverIcon(driver.name, driver.vehicle)}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e)
                                if (onDriverClick) onDriverClick(driver)
                            }
                        }}
                        zIndexOffset={950}
                    />
                ))}

                {/* Search Results Markers */}
                {searchResults.map((result, index) => (
                    <Marker
                        key={result.id || index}
                        position={[result.lat, result.lng]}
                        icon={poiIcon}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e)
                                if (onSearchResultClick) onSearchResultClick(result)
                            }
                        }}
                        zIndexOffset={800}
                    />
                ))}

                {/* Alternative Routes (Dimmed) */}
                {alternativeRoutes && alternativeRoutes.map((route, i) => (
                    <Polyline
                        key={route.id || `alt-${i}`}
                        positions={route.geometry}
                        pathOptions={{
                            color: '#ffffff',
                            weight: 6,
                            opacity: 0.3,
                            lineCap: 'round',
                            lineJoin: 'round',
                            dashArray: '1, 10' // Dotted line for unselected? Or just solid dim? User said "brightness". Let's do solid dim.
                        }}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e)
                                if (onAlternativeRouteSelect) onAlternativeRouteSelect(route)
                            }
                        }}
                    >
                        {/* Invisible thicker line for easier clicking */}
                        <Polyline
                            positions={route.geometry}
                            pathOptions={{
                                color: 'transparent',
                                weight: 20,
                                opacity: 0
                            }}
                            eventHandlers={{
                                click: (e) => {
                                    L.DomEvent.stopPropagation(e)
                                    if (onAlternativeRouteSelect) onAlternativeRouteSelect(route)
                                }
                            }}
                        />
                    </Polyline>
                ))}

                {/* Active Navigation Route */}
                {activeNavRoute?.geometry?.length > 1 && (
                    <>
                        <Polyline
                            positions={activeNavRoute.geometry}
                            pathOptions={{
                                color: '#1565c0',
                                weight: 6,
                                opacity: 0.85,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }}
                        />
                        {/* White border underneath for contrast */}
                        <Polyline
                            positions={activeNavRoute.geometry}
                            pathOptions={{
                                color: '#ffffff',
                                weight: 10,
                                opacity: 0.3,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }}
                        />
                        {/* Destination pin */}
                        <CircleMarker
                            center={activeNavRoute.geometry[activeNavRoute.geometry.length - 1]}
                            radius={8}
                            pathOptions={{
                                color: '#1565c0',
                                fillColor: '#ffffff',
                                fillOpacity: 1,
                                weight: 3
                            }}
                        />
                    </>
                )}

                <MapController flyToTarget={flyToTarget} userLocation={userLocation} />
            </LeafletMap>
        </div>
    )
}

export default MapContainerComponent
