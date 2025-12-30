import React, { useState } from 'react';

export function GameManager({ games, toggleGameActive, addCustomGame, onBack }) {
  const [newGame, setNewGame] = useState({ name: '', brief: '', icon: '🎮' });

  const handleAddGame = () => {
    if (newGame.name.trim()) {
      addCustomGame(newGame);
      setNewGame({ name: '', brief: '', icon: '🎮' });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', height: '100%' }}>
      
      {/* Left: Game Control Panel */}
      <div>
        <h3 style={{ fontSize: '1.2rem', color: '#636e72', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Active Modules
        </h3>
        
        <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem',
            maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' 
        }}>
          {games.map(game => (
            <div 
                key={game.id} 
                style={{
                    background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '1rem',
                    border: '1px solid rgba(255,255,255,0.6)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{game.icon}</span>
                    <span style={{ fontWeight: 600, color: '#2d3436' }}>{game.name}</span>
                </div>
                
                <label className="glass-toggle">
                    <input 
                        type="checkbox" 
                        checked={game.active} 
                        onChange={() => toggleGameActive(game.id)} 
                    />
                    <span className="slider"></span>
                </label>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Add New Module */}
      <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '24px', padding: '2rem', border: '1px solid white' }}>
         <h3 style={{ fontSize: '1.2rem', color: '#636e72', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Initialize New Protocol
         </h3>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3436' }}>Icon (Emoji)</label>
                <input 
                    className="glass-input" 
                    value={newGame.icon} 
                    onChange={e => setNewGame({...newGame, icon: e.target.value})} 
                    style={{ fontSize: '2rem', width: '60px', textAlign: 'center' }}
                />
            </div>
            
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3436' }}>Protocol Name</label>
                <input 
                    className="glass-input" 
                    placeholder="e.g. Laser Tag"
                    value={newGame.name}
                    onChange={e => setNewGame({...newGame, name: e.target.value})}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3436' }}>Mission Brief</label>
                <textarea 
                    className="glass-input" 
                    rows="3"
                    placeholder="Describe the objective..."
                    value={newGame.brief}
                    onChange={e => setNewGame({...newGame, brief: e.target.value})}
                />
            </div>

            <button className="glass-btn" onClick={handleAddGame} style={{ marginTop: '1rem' }}>
                Deploy Module
            </button>
         </div>
      </div>
    </div>
  );
}
