import { useState } from 'react';
import { usePartyData } from './hooks/usePartyData';
import { Setup } from './components/Setup';
import { GameReveal } from './components/GameReveal';
import { Leaderboard } from './components/Leaderboard';
import { GameManager } from './components/GameManager';
import { HomeHero } from './components/HomeHero';

// GameZone Card with 3D Sticker Icon
const GameZoneCard = ({ game, onClick, onRemove }) => {
  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '280px', textAlign: 'center', cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.45)',
        position: 'relative'
      }}
    >
      {/* Remove Button (Cute Cross) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(game.id);
        }}
        style={{
          position: 'absolute', top: '15px', right: '15px',
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'rgba(255, 118, 117, 0.2)', color: '#d63031',
          border: '1px solid rgba(255, 118, 117, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', cursor: 'pointer', zIndex: 10,
          transition: 'all 0.2s'
        }}
        title="Remove Game"
      >
        ✕
      </button>

      {/* Tech Grid Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: 'linear-gradient(rgba(108, 92, 231, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(108, 92, 231, 0.03) 1px, transparent 1px)',
        backgroundSize: '20px 20px', zIndex: 0
      }} />

      <div className="icon-3d" style={{ marginBottom: '2rem', zIndex: 1 }}>
        {game.icon}
      </div>

      <h3 style={{ fontSize: '1.6rem', color: '#2d3436', fontWeight: 800, marginBottom: '0.5rem', zIndex: 1 }}>
        {game.name}
      </h3>

      <div style={{
        color: '#6c5ce7', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', background: 'rgba(108, 92, 231, 0.1)', padding: '5px 12px', borderRadius: '10px',
        zIndex: 1
      }}>
        START MISSION
      </div>
    </div>
  );
};

// New "Add Game" Card
const AddGameCard = ({ onClick }) => {
  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '280px', textAlign: 'center', cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.2)', border: '2px dashed rgba(108, 92, 231, 0.3)'
      }}
    >
      <div style={{
        fontSize: '4rem', color: '#a29bfe', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)'
      }}>
        +
      </div>
      <h3 style={{ fontSize: '1.2rem', color: '#636e72', fontWeight: 700 }}>ADD GAME</h3>
    </div>
  );
};

function App() {
  const { players, games, addPlayer, removePlayer, updateScore, toggleGameActive, addCustomGame, isLoaded } = usePartyData();
  const [view, setView] = useState('LANDING');
  const [selectedGameId, setSelectedGameId] = useState(null);

  if (!isLoaded) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  const handleGameSelect = (gameId) => {
    setSelectedGameId(gameId);
    setView('GAME_REVEAL');
  };

  const getActiveGame = () => games.find(g => g.id === selectedGameId);

  if (view === 'LANDING') {
    return <HomeHero onEnter={() => setView('HOME')} />;
  }

  return (
    <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '4rem' }}>

      {/* Solid Static Navbar */}
      <header className="app-header">
        <div
          onClick={() => setView('HOME')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{
            width: '40px', height: '40px', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 900, fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(108, 92, 231, 0.3)'
          }}>
            F
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#2d3436', letterSpacing: '-0.02em' }}>Funfinity</span>
          <span style={{ fontSize: '0.8rem', background: '#ffeaa7', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, color: '#d35400' }}>ZONE</span>
        </div>

        <nav className="app-nav">
          <button className="glass-btn-ghost" onClick={() => setView('SETUP')}>PLAYERS</button>
          <button className="glass-btn-ghost" onClick={() => setView('LEADERBOARD')}>SCORES</button>
          <button className="glass-btn-ghost" onClick={() => setView('GAME_MANAGER')}>CONFIG</button>
        </nav>
      </header>

      {/* Main Views */}
      <main>
        {view === 'HOME' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            {games.filter(g => g.active).map((game) => (
              <GameZoneCard
                key={game.id}
                game={game}
                onClick={() => handleGameSelect(game.id)}
                onRemove={toggleGameActive}
              />
            ))}

            {/* Plus Card to Add Game */}
            <AddGameCard onClick={() => setView('GAME_MANAGER')} />
          </div>
        )}

        {view === 'SETUP' && (
          <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: '#6c5ce7', fontSize: '2.5rem' }}>Player Registry</h2>
            <Setup players={players} addPlayer={addPlayer} removePlayer={removePlayer} />
          </div>
        )}

        {view === 'GAME_REVEAL' && selectedGameId && (
          <GameReveal
            game={getActiveGame()}
            players={players}
            updateScore={updateScore}
            onBack={() => setView('HOME')}
          />
        )}

        {view === 'GAME_MANAGER' && (
          <div className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem', height: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>⚙️</span>
                <h2>System Configuration</h2>
              </div>
              <button className="glass-btn" onClick={() => setView('HOME')} style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>Save & Exit</button>
            </div>
            <GameManager
              games={games}
              toggleGameActive={toggleGameActive}
              addCustomGame={addCustomGame}
              onBack={() => setView('HOME')}
            />
          </div>
        )}

        {view === 'LEADERBOARD' && (
          <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
              <h2 style={{ background: 'linear-gradient(45deg, #f1c40f, #e67e22)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem' }}>Hall of Fame</h2>
              <button className="glass-btn-ghost" onClick={() => setView('HOME')}>Close</button>
            </div>
            <Leaderboard players={players} games={games} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
