import { useState } from 'react';
import { usePartyData } from './hooks/usePartyData';
import { Setup } from './components/Setup';
import { GameReveal } from './components/GameReveal';
import { Leaderboard } from './components/Leaderboard';
import { GameManager } from './components/GameManager';
import { HomeHero } from './components/HomeHero';
import { Podium } from './components/Podium';
import { SoundProvider, useSound } from './hooks/useSound.jsx';

// GameZone Card with 3D Sticker Icon
const GameZoneCard = ({ game, onClick, onRemove }) => {
  const isCompleted = game.completed;
  const { playSound } = useSound();

  return (
    <div
      className="glass-card"
      onClick={() => { playSound('click'); playSound('open'); onClick(); }}
      onMouseEnter={() => playSound('hover')}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '280px', textAlign: 'center', cursor: 'pointer',
        background: isCompleted
          ? 'linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1), white)'
          : 'rgba(255, 255, 255, 0.45)', // Changed color logic
        position: 'relative',
        border: isCompleted ? '2px solid #2ecc71' : '1px solid white',
        boxShadow: isCompleted ? '0 10px 30px rgba(46, 204, 113, 0.3)' : '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Remove Button */}
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
        }}
        title="Remove Game"
      >
        ✕
      </button>

      {/* Glowing Tick Overlay for Completed Games */}
      {isCompleted && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontSize: '10rem', color: '#2ecc71', opacity: 0.1, zIndex: 0, pointerEvents: 'none',
          filter: 'drop-shadow(0 0 20px #2ecc71)'
        }}>
          ✓
        </div>
      )}

      {/* Main Content */}
      <div className="icon-3d" style={{ marginBottom: '2rem', zIndex: 1 }}>
        {game.icon}
      </div>

      <h3 style={{ fontSize: '1.6rem', color: '#2d3436', fontWeight: 800, marginBottom: '0.5rem', zIndex: 1 }}>
        {game.name}
      </h3>

      {isCompleted ? (
        <div style={{
          color: 'white', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em',
          textTransform: 'uppercase', background: '#2ecc71', padding: '8px 24px', borderRadius: '50px',
          zIndex: 1, boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          COMPLETED
        </div>
      ) : (
        <div style={{
          color: '#6c5ce7', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em',
          textTransform: 'uppercase', background: 'white', padding: '8px 20px', borderRadius: '50px',
          zIndex: 1, boxShadow: '0 4px 15px rgba(108, 92, 231, 0.15)',
          transition: 'all 0.3s ease'
        }}>
          START MISSION
        </div>
      )}
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

// Cute Alert Modal
const CuteAlert = ({ message, type, onConfirm, onCancel }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      animation: 'fadeIn 0.2s'
    }}>
      <div className="glass-card" style={{
        background: 'white', maxWidth: '400px', textAlign: 'center',
        padding: '2rem', borderRadius: '24px', animation: 'bounceUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {type === 'delete' ? '🗑️' : '👻'}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2d3436' }}>
          {type === 'delete' ? 'Delete Forever?' : 'Hide This Game?'}
        </h3>
        <p style={{ color: '#636e72', marginBottom: '2rem', fontSize: '1.1rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            className="cute-btn cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`cute-btn confirm ${type}`}
          >
            {type === 'delete' ? 'Yes, Delete!' : 'Hide it!'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounceUp { from { transform: scale(0.8) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        
        .cute-btn {
          padding: 0.8rem 2rem;
          border-radius: 50px;
          border: none;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cute-btn:hover { transform: scale(1.1) rotate(-2deg); }
        .cute-btn:active { transform: scale(0.95); }

        .cute-btn.cancel {
          background: #dfe6e9;
          color: #636e72;
        }
        .cute-btn.confirm.delete {
          background: linear-gradient(135deg, #ff7675, #fab1a0);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 118, 117, 0.4);
        }
        .cute-btn.confirm.hide {
          background: linear-gradient(135deg, #74b9ff, #a29bfe);
          color: white;
          box-shadow: 0 4px 15px rgba(116, 185, 255, 0.4);
        }
      `}</style>
    </div >
  );
};

const SoundToggle = () => {
  const { isBgmOn, toggleBgm } = useSound();
  return (
    <button onClick={toggleBgm} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }} title="Toggle Background Music">
      {isBgmOn ? '🎵' : '🔇'}
    </button>
  );
};



function App() {
  const { players, games, addPlayer, removePlayer, updatePlayerAvatar, updateScore, toggleGameActive, toggleGameComplete, updateGame, addCustomGame, deleteGame, resetGameScores, resetAllData, resetScores, isLoaded } = usePartyData();
  const [view, setView] = useState('LANDING');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null); // { message, type, onConfirm }

  if (!isLoaded) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  const handleGameSelect = (gameId) => {
    setSelectedGameId(gameId);
    setView('GAME_REVEAL');
  };

  const handleRemoveRequest = (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    if (game.isCustom) {
      // Permanent Delete for Custom Games
      setAlertConfig({
        type: 'delete',
        message: `This will permanently delete "${game.name}". You can't undo this!`,
        onConfirm: () => {
          deleteGame(gameId);
          setAlertConfig(null);
        }
      });
    } else {
      // Soft Hide for Default Games
      setAlertConfig({
        type: 'hide',
        message: `Do you want to hide "${game.name}" from the arcade? You can bring it back later in Config.`,
        onConfirm: () => {
          toggleGameActive(gameId);
          setAlertConfig(null);
        }
      });
    }
  };

  const getActiveGame = () => games.find(g => g.id === selectedGameId);

  if (view === 'LANDING') {
    return <HomeHero onEnter={() => setView('HOME')} />;
  }

  return (
    <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '4rem' }}>

      {alertConfig && (
        <CuteAlert
          message={alertConfig.message}
          type={alertConfig.type}
          onConfirm={alertConfig.onConfirm}
          onCancel={() => setAlertConfig(null)}
        />
      )}

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

        <nav className="app-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <SoundToggle />
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
                onRemove={handleRemoveRequest}
              />
            ))}

            {/* Plus Card to Add Game */}
            <AddGameCard onClick={() => setView('GAME_MANAGER')} />
          </div>
        )}

        {view === 'SETUP' && (
          <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: '#6c5ce7', fontSize: '2.5rem' }}>Player Registry</h2>
            <Setup players={players} addPlayer={addPlayer} removePlayer={removePlayer} updatePlayerAvatar={updatePlayerAvatar} />
          </div>
        )}

        {view === 'GAME_REVEAL' && selectedGameId && (
          <GameReveal
            game={getActiveGame()}
            players={players}
            updateScore={updateScore}
            toggleGameComplete={toggleGameComplete}
            updateGame={updateGame}
            resetGameScores={resetGameScores}
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
              onReset={() => {
                setAlertConfig({
                  type: 'delete',
                  message: '⚠️ FATAL WARNING: This will purge all scores, players, and custom data forever. Are you absolutely sure?',
                  onConfirm: () => {
                    resetAllData();
                    setAlertConfig(null);
                  }
                });
              }}
              onResetScores={() => {
                setAlertConfig({
                  type: 'delete',
                  message: 'This will reset ALL scores to zero. Players and Games will remain. Continue?',
                  onConfirm: () => {
                    resetScores();
                    setAlertConfig(null);
                  }
                });
              }}
            />
          </div>
        )}



        {view === 'LEADERBOARD' && (
          <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
              <h2 style={{ background: 'linear-gradient(45deg, #f1c40f, #e67e22)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem' }}>Hall of Fame</h2>
              <button className="glass-btn-ghost" onClick={() => setView('HOME')}>Close</button>
            </div>
            <Leaderboard
              players={players}
              games={games}
              onReset={() => {
                setAlertConfig({
                  type: 'delete',
                  message: 'This will reset ALL scores to zero. Players and Games will remain. Continue?',
                  onConfirm: () => {
                    resetScores();
                    setAlertConfig(null);
                  }
                });
              }}
              onShowPodium={() => setView('PODIUM')}
            />
          </div>
        )}

        {view === 'PODIUM' && (
          <Podium players={players} onBack={() => setView('LEADERBOARD')} />
        )}
      </main>
    </div>
  );
}

export default function Root() {
  return (
    <SoundProvider>
      <App />
    </SoundProvider>
  );
}
