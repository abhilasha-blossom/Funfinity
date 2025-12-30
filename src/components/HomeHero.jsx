import React from 'react';

export function HomeHero({ onEnter }) {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Background Blobs (Pure CSS Animation) */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '600px', height: '600px',
                background: 'linear-gradient(135deg, #a29bfe 0%, #74b9ff 100%)',
                borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, animation: 'float 8s infinite alternate'
            }} />
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px',
                background: 'linear-gradient(135deg, #ff7675 0%, #fab1a0 100%)',
                borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, animation: 'float 6s infinite alternate-reverse'
            }} />

            {/* Glass Monolith */}
            <div
                className="glass-card"
                style={{
                    padding: '5rem',
                    textAlign: 'center',
                    zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ marginBottom: '1rem', letterSpacing: '0.2em', fontSize: '1rem', color: '#636e72', fontWeight: 600 }}>
                    THE ULTIMATE COLLECTION
                </div>

                <h1 style={{
                    fontSize: '6rem',
                    fontWeight: 900,
                    background: 'linear-gradient(45deg, #6c5ce7, #ff7675)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem',
                    lineHeight: 1.1
                }}>
                    Funfinity
                </h1>

                <p style={{ fontSize: '1.4rem', color: '#2d3436', marginBottom: '3rem', opacity: 0.8 }}>
                    Experience the next level of party gaming.
                </p>

                <button
                    onClick={onEnter}
                    className="glass-btn"
                    style={{ fontSize: '1.3rem', padding: '1.2rem 3.5rem' }}
                >
                    Enter Experience
                </button>
            </div>

            <style>{`
          @keyframes float { from { transform: translate(0,0); } to { transform: translate(50px, 50px); } }
      `}</style>
        </div>
    );
}
