import React, { useState, useEffect } from 'react'

const QUOTES = [
    { text: 'Straight roads are for fast cars, turns are for fast drivers.', author: 'Colin McRae' },
    { text: "If you have everything under control, you're not moving fast enough.", author: 'Mario Andretti' },
    { text: 'A racing car is an animal with a thousand adjustments.', author: 'Mario Andretti' },
    { text: 'There’s a point at 7,000 RPM where everything fades. The machine becomes weightless. It just disappears.', author: 'Ken Miles' },
    { text: 'To win a race, the fastest way is to go as slow as possible as fast as possible.', author: 'Jackie Stewart' },
    { text: "When you're racing, it's life. Anything that happens before or after is just waiting.", author: 'Steve McQueen' },
    { text: 'Speed has never killed anyone, suddenly becoming stationary… that’s what gets you.', author: 'Jeremy Clarkson' },
    { text: 'Fast cars are my only vice.', author: 'Michael Landon' },
    { text: 'Racing is the only time I feel whole.', author: 'James Dean' },
    { text: 'I’ve always been a fan of fast cars. It’s a great way to clear the head.', author: 'Jenson Button' },
    { text: 'Driving is the most fun you can have with your clothes on.', author: 'Julian Richards' },
    { text: 'A car is like a mother-in-law — if you let it, it will rule your life.', author: 'Jaime Alguersuari' },
    { text: 'The best therapy is a long drive and a loud engine.', author: 'David Brown' },
    { text: 'Life is too short to drive boring cars.', author: 'Hanan Mazouzi' },
    { text: 'Everything in life is somewhere else, and you get there in a car.', author: 'E.B. White' }
]

const SplashScreen = ({ onFinish }) => {
    const [quote, setQuote] = useState(null)
    const [isFading, setIsFading] = useState(false)

    useEffect(() => {
        // distinct randomness
        const randomIndex = Math.floor(Math.random() * QUOTES.length)
        setQuote(QUOTES[randomIndex])

        // 5 seconds visible, then fade
        const timer = setTimeout(() => {
            setIsFading(true)
        }, 5000)

        // Wait for fade animation (1s) then finish
        const cleanup = setTimeout(() => {
            if (onFinish) onFinish()
        }, 6000)

        return () => {
            clearTimeout(timer)
            clearTimeout(cleanup)
        }
    }, [onFinish])

    if (!quote) return null

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000000',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            transition: 'opacity 1s ease-out',
            opacity: isFading ? 0 : 1,
            pointerEvents: isFading ? 'none' : 'auto',
            overflow: 'hidden'
        }}>
            {/* ─── Background Image Layer ─── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/splash-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.5, // Subtle visibility
                zIndex: 0,
                filter: 'grayscale(0.2) contrast(1.1) saturate(0.8)' // Cinematic look
            }} />

            {/* ─── Gradient Overlay (Vignette) ─── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(26, 29, 36, 0.4) 0%, #000000 100%)',
                zIndex: 1
            }} />

            <div style={{ maxWidth: '680px', position: 'relative', zIndex: 10 }}>
                {/* Decorative quote mark */}
                <div style={{
                    position: 'absolute',
                    top: -40,
                    left: -20,
                    fontSize: '120px',
                    lineHeight: 1,
                    fontFamily: 'serif',
                    color: 'rgba(255, 95, 31, 0.1)',
                    pointerEvents: 'none'
                }}>“</div>

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 300,
                    lineHeight: 1.4,
                    color: '#ffffff',
                    marginBottom: '32px',
                    fontFamily: 'Didot, "Didot LT STD", "Hoefler Text", Garamond, "Times New Roman", serif',
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    {quote.text}
                </h1>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    opacity: 0,
                    animation: 'fadeInUp 1s ease-out 0.5s forwards'
                }}>
                    <div style={{ width: 40, height: 1, background: 'var(--primary-apex)', opacity: 0.6 }} />
                    <p style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-main)'
                    }}>
                        {quote.author}
                    </p>
                    <div style={{ width: 40, height: 1, background: 'var(--primary-apex)', opacity: 0.6 }} />
                </div>
            </div>

            {/* Minimal Loading Line */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: 'transparent'
            }}>
                <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, var(--primary-apex), transparent)',
                    width: '50%',
                    opacity: 0.8,
                    animation: 'scanline 2s ease-in-out infinite'
                }} />
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scanline {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    )
}

export default SplashScreen
