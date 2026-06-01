/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GameConfig, Memory, CoinReason, InsideJoke, Boss } from './types';
import { audioSynth } from './utils/audio';
import { INITIAL_GAME_CONFIG } from './utils/defaultData';
import {
  NonoSprite,
  NanaSprite,
  RetroCloud,
  MysteryBlockSprite,
  RetroCoinSprite,
  GreenPipeSprite,
  HeartSprite,
  CastleSprite,
  BossSprite
} from './components/PixelSprites';

export default function App() {
  // Game Config State (tries to load from localStorage, falls back to default with auto-migrations)
  const [config, setConfig] = useState<GameConfig>(() => {
    const saved = localStorage.getItem('super_nono_bros_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Direct migration if the client's cached local storage config still contains '22'
        if (parsed.nonoAge === 22) {
          parsed.nonoAge = 20;
          if (parsed.finalCastleMsg && typeof parsed.finalCastleMsg.para3 === 'string') {
            parsed.finalCastleMsg.para3 = parsed.finalCastleMsg.para3.replace(/Level\s*22/gi, 'Level 20');
          }
          localStorage.setItem('super_nono_bros_config', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved config, using initial', e);
      }
    }
    return INITIAL_GAME_CONFIG;
  });

  // Editor Panel Open State
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Active Screen: 'title' | 'intro' | 'adventure' | 'secret_pipe' | 'boss_battle' | 'final_castle' | 'credits'
  const [activeScreen, setActiveScreen] = useState<'title' | 'intro' | 'adventure' | 'secret_pipe' | 'boss_battle' | 'final_castle' | 'credits'>('title');

  // Interactive Game Map Active Tab (inside 'adventure' screen): 'level1' | 'level2' | 'level3'
  const [mapLevel, setMapLevel] = useState<'level1' | 'level2' | 'level3'>('level1');

  // Lives, sound, music, and scores
  const [lives, setLives] = useState(999);
  const [coinsCount, setCoinsCount] = useState(0);
  const [score, setScore] = useState(160606); // Retro highscore/Nono's level representation
  const [isMuted, setIsMuted] = useState(false); // Default music ON

  // Memory Blocks (which were punched)
  const [punchedBlocks, setPunchedBlocks] = useState<Record<number, boolean>>({});
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Coin Reasons collection states
  const [reasons, setReasons] = useState<CoinReason[]>(() => config.coins);
  const [currentReasonPopup, setCurrentReasonPopup] = useState<CoinReason | null>(null);
  
  // Custom interactive 100 coins state
  const [additionalCoinsCollected, setAdditionalCoinsCollected] = useState(0);
  const [unlockedInfiniteCoins, setUnlockedInfiniteCoins] = useState(false);

  // Boss combat state
  const [activeBossIndex, setActiveBossIndex] = useState(0);
  const [bosses, setBosses] = useState<Boss[]>([
    {
      id: 'overthinking',
      name: '😈 Overthinking',
      description: 'The ghost that makes Nono doubt himself and worry too much.',
      hp: 3,
      maxHp: 3,
      icon: 'overthinking',
      defeatMsg: 'Nono defeated Overthinking! Brain is peaceful and clear now!'
    },
    {
      id: 'baddays',
      name: '😈 Bad Days',
      description: 'The dark stormy clouds that try to bring rain and sadness to Nono.',
      hp: 4,
      maxHp: 4,
      icon: 'baddays',
      defeatMsg: 'Nono cleared the storm clouds! Brighter sunny days are locked in!'
    },
    {
      id: 'stress',
      name: '😈 Stress',
      description: 'The flaming sparks of tight deadlines and hectic responsibilities.',
      hp: 5,
      maxHp: 5,
      icon: 'stress',
      defeatMsg: 'Nono chilled the fire of Stress! Calm and cozy vibes restored!'
    }
  ]);
  const [isBossFightWon, setIsBossFightWon] = useState(false);
  const [bossBattleNarrative, setBossBattleNarrative] = useState('A wild obstacle appears! Support Nono by tapping ATTACK with love!');

  // Secret pipe state
  const [enteredPipe, setEnteredPipe] = useState(false);
  const [selectedSecretJoke, setSelectedSecretJoke] = useState<InsideJoke | null>(null);

  // Typewriter line for story intro
  const [storyLineIndex, setStoryLineIndex] = useState(0);

  // Particle explosion effects (fireworks on victory!)
  const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  // Local state for image file reader uploads so Nana can upload directly
  const [tempMemoryImageUrl, setTempMemoryImageUrl] = useState<string>('');

  useEffect(() => {
    // Sync coins list if config changes
    setReasons(config.coins);
  }, [config]);

  // Handle saving the config
  const saveConfig = (newConfig: GameConfig) => {
    setConfig(newConfig);
    localStorage.setItem('super_nono_bros_config', JSON.stringify(newConfig));
  };

  // Sound handler
  const handleMuteToggle = () => {
    const nextMuted = audioSynth.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      audioSynth.playLevelUp();
      audioSynth.startBGM();
    } else {
      audioSynth.stopBGM();
    }
  };

  // Launch fireworks animation
  const trigerFireworks = () => {
    const colors = ['#FFD84D', '#E52521', '#43B047', '#FF4081', '#00E5FF'];
    const newFireworks = Array.from({ length: 6 }).map((_, i) => ({
      id: Math.random() + i,
      x: 20 + Math.random() * 60, // Percentage width
      y: 20 + Math.random() * 50, // Percentage height
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setFireworks((prev) => [...prev, ...newFireworks]);
    // Clear after animation
    setTimeout(() => {
      setFireworks((prev) => prev.slice(6));
    }, 1500);
  };

  // Handle Screen transitions with vintage audio cues
  const transitionTo = (screen: typeof activeScreen) => {
    if (isMuted === false) {
      if (screen === 'adventure') {
        audioSynth.playLevelUp();
      } else if (screen === 'secret_pipe') {
        audioSynth.playSecretFound();
      } else if (screen === 'boss_battle') {
        audioSynth.playHit();
      } else if (screen === 'final_castle') {
        audioSynth.playVictory();
        trigerFireworks();
      } else {
        audioSynth.playJump();
      }
    }
    setActiveScreen(screen);
  };

  // Puzzle Memory block punch
  const handlePunchBlock = (id: number) => {
    if (punchedBlocks[id]) {
      // Already punched, just open detail
      const mem = config.memories.find((m) => m.id === id);
      if (mem) {
        setSelectedMemory(mem);
        audioSynth.playJump();
      }
      return;
    }

    // Punch block!
    audioSynth.playCoin();
    setCoinsCount((prev) => prev + 10);
    setScore((prev) => prev + 2000);
    setPunchedBlocks((prev) => ({ ...prev, [id]: true }));
    const mem = config.memories.find((m) => m.id === id);
    if (mem) {
      setSelectedMemory(mem);
    }
  };

  // Quality Coin tap
  const handleCollectCoin = (id: number) => {
    const coin = reasons.find((r) => r.id === id);
    if (coin && !coin.isCollected) {
      audioSynth.playCoin();
      setCoinsCount((prev) => prev + 1);
      setScore((prev) => prev + 1000);
      setCurrentReasonPopup(coin);

      const updatedCoins = reasons.map((r) =>
        r.id === id ? { ...r, isCollected: true } : r
      );
      setReasons(updatedCoins);
      
      // Update config
      const updatedConfig = { ...config, coins: updatedCoins };
      saveConfig(updatedConfig);
    } else if (coin) {
      // Re-show detail
      setCurrentReasonPopup(coin);
      audioSynth.playJump();
    }
  };

  // Fast-collect fun virtual coins to hit 100 benchmark
  const handleCollectVirtualCoin = () => {
    audioSynth.playCoin();
    setCoinsCount((prev) => prev + 1);
    setAdditionalCoinsCollected((prev) => {
      const nextVal = prev + 1;
      if (nextVal + reasons.filter(r => r.isCollected).length >= 100) {
        setUnlockedInfiniteCoins(true);
      }
      return nextVal;
    });
  };

  // Boss Battle Attack Turn
  const handleBossAttack = () => {
    if (isBossFightWon) return;

    audioSynth.playJump();
    
    // Animate a heart being thrown or damage hit
    const currentBoss = bosses[activeBossIndex];
    const newHp = currentBoss.hp - 1;
    
    // Update active boss state
    const updatedBosses = bosses.map((b, idx) =>
      idx === activeBossIndex ? { ...b, hp: Math.max(0, newHp) } : b
    );
    setBosses(updatedBosses);

    if (newHp <= 0) {
      audioSynth.playLevelUp();
      setBossBattleNarrative(currentBoss.defeatMsg);
      setScore((prev) => prev + 5000);
      
      const nextIndex = activeBossIndex + 1;
      if (nextIndex < bosses.length) {
        setTimeout(() => {
          setActiveBossIndex(nextIndex);
          setBossBattleNarrative(`Get ready! A stronger challenge emerges: ${bosses[nextIndex].name}!`);
        }, 1500);
      } else {
        // All bosses defeated!
        setIsBossFightWon(true);
        audioSynth.playVictory();
      }
    } else {
      const hitsResponses = [
        `Nono jumps with Nana's support! ${currentBoss.name} is losing grip!`,
        `Perfect attack! ${currentBoss.name} feels the power of love!`,
        `Direct hit! Stress levels are dropping fast!`
      ];
      setBossBattleNarrative(hitsResponses[Math.floor(Math.random() * hitsResponses.length)]);
    }
  };

  // Reset Boss Arena
  const resetBossBattle = () => {
    setBosses([
      {
        id: 'overthinking',
        name: '😈 Overthinking',
        description: 'The ghost that makes Nono doubt himself and worry too much.',
        hp: 3,
        maxHp: 3,
        icon: 'overthinking',
        defeatMsg: 'Nono defeated Overthinking! Brain is peaceful and clear now!'
      },
      {
        id: 'baddays',
        name: '😈 Bad Days',
        description: 'The dark stormy clouds that try to bring rain and sadness to Nono.',
        hp: 4,
        maxHp: 4,
        icon: 'baddays',
        defeatMsg: 'Nono cleared the storm clouds! Brighter sunny days are locked in!'
      },
      {
        id: 'stress',
        name: '😈 Stress',
        description: 'The fire of hectic responsibilities and worries.',
        hp: 5,
        maxHp: 5,
        icon: 'stress',
        defeatMsg: 'Nono chilled the fire of Stress! Calm and cozy vibes restored!'
      }
    ]);
    setActiveBossIndex(0);
    setIsBossFightWon(false);
    setBossBattleNarrative('A wild obstacle appears! Support Nono by tapping ATTACK with love!');
  };

  // Convert files to base64 for image storage directly in LocalStorage so Nana can upload real pictures
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'world1' | number | 'joke1' | 'joke2') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        if (target === 'world1') {
          saveConfig({
            ...config,
            world1FirstEncounter: {
              ...config.world1FirstEncounter,
              imageUrl: base64String
            }
          });
        } else if (target === 'joke1' || target === 'joke2') {
          const idx = target === 'joke1' ? 0 : 1;
          const updatedJokes = [...config.insideJokes];
          if (updatedJokes[idx]) {
            updatedJokes[idx].imageUrl = base64String;
            saveConfig({ ...config, insideJokes: updatedJokes });
          }
        } else {
          // target is ID of memory array
          const updatedMemories = config.memories.map((m) =>
            m.id === target ? { ...m, imageUrl: base64String } : m
          );
          saveConfig({ ...config, memories: updatedMemories });
        }
        audioSynth.playLevelUp();
      };
      reader.readAsDataURL(file);
    }
  };

  // Complete clean state reset for testing
  const handleResetToDefaults = () => {
    if (window.confirm('Reset all stories and images back to initial default?')) {
      saveConfig(INITIAL_GAME_CONFIG);
      setPunchedBlocks({});
      setCoinsCount(0);
      setAdditionalCoinsCollected(0);
      setUnlockedInfiniteCoins(false);
      resetBossBattle();
      audioSynth.playLevelUp();
    }
  };

  return (
    <div id="super-nono-bros-container" className="min-h-screen bg-[#5C94FC] text-black font-sans relative flex flex-col justify-between overflow-x-hidden">
      
      {/* 8-bit Sound controller and Static Stat Bar HUD */}
      <header id="game-hud" className="bg-black text-white p-3 border-b-4 border-black font-mono text-xs md:text-sm z-50 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-red-500 text-lg">❤</span>
            <span className="font-press-start text-[9px] md:text-xs">x {lives}</span>
          </div>
          <div className="flex items-center gap-1">
            <RetroCoinSprite className="w-5 h-5" spinning={true} />
            <span className="font-press-start text-[9px] md:text-xs text-[#FFD84D]">x {coinsCount + additionalCoinsCollected}</span>
          </div>
          <div>
            <span className="text-[#A5D6A7]">WORLD:</span>
            <span className="font-press-start text-[9px] md:text-xs ml-1">{config.nonoAge}-1</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <span className="text-gray-400">SCORE:</span>
            <span className="font-press-start text-xs ml-1 text-white">{score}</span>
          </div>
          
          {/* Mute toggle button */}
          <button
            id="retro-sound-toggle"
            onClick={handleMuteToggle}
            className={`px-3 py-1 font-press-start text-[9px] md:text-xs pixel-box-retro-sm transition-all focus:outline-none ${
              isMuted ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-green-600 text-white hover:bg-green-500'
            }`}
          >
            {isMuted ? '🔇 MUTE: ON' : '🔊 MUSIC: ON'}
          </button>

          {/* Level Designer toggler */}
          <button
            id="toggle-creator-panel"
            onClick={() => {
              setIsEditorOpen(!isEditorOpen);
              audioSynth.playJump();
            }}
            className="px-2 py-1 font-press-start text-[9px] bg-yellow-500 text-black hover:bg-yellow-400 pixel-box-retro-sm"
          >
            🔧 EDIT QUEST
          </button>
        </div>
      </header>

      {/* Main Content screens viewport with retro retro-screen scanline effects */}
      <main className="flex-grow flex items-center justify-center p-4 retro-screen relative bg-[#5C94FC] z-10">
        
        {/* Sky Background Props (Floating retro-style animated pixel clouds) */}
        <RetroCloud className="absolute top-10 left-5 w-16 h-8 opacity-40 pointer-events-none animate-cloud-slow" />
        <RetroCloud className="absolute top-28 right-10 w-24 h-12 opacity-60 pointer-events-none animate-cloud-fast" />
        <RetroCloud className="absolute top-48 left-1/3 w-20 h-10 opacity-50 pointer-events-none animate-cloud-slow" />

        {/* --- SCREEN 1: TITLE SCREEN --- */}
        {activeScreen === 'title' && (
          <div id="screen-title" className="max-w-xl w-full text-center bg-gradient-to-br from-yellow-50 to-amber-100 p-6 vibrant-board z-20 flex flex-col items-center">
            <h1 className="font-press-start text-rose-600 text-3xl md:text-5xl tracking-tighter leading-none drop-shadow-[4px_4px_0_rgba(0,0,0,1)] select-none mt-2 animate-bounce">
              SUPER
            </h1>
            <h1 className="font-press-start text-yellow-500 text-4xl md:text-6xl tracking-tight leading-none uppercase drop-shadow-[5px_5px_0_rgba(0,0,0,1)] font-extrabold my-3">
              NONO BROS
            </h1>
            <p className="font-press-start text-[11px] md:text-xs text-rose-700 tracking-wider mb-6 bg-yellow-200/60 px-3 py-1.5 rounded-md border-2 border-dashed border-rose-400 font-bold">
              ★ {config.nonoAge}TH BIRTHDAY EDITION ★
            </p>

            {/* Pixels Character Display Case */}
            <div className="flex justify-center items-end gap-12 my-6 bg-emerald-400 p-4 border-4 border-black w-full relative overflow-hidden rounded shadow-[6px_6px_0_#000000]">
              {/* Floor brick decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-800 border-t border-black"></div>
              <div className="flex flex-col items-center hover:scale-110 transition-transform cursor-pointer">
                <NonoSprite pose="stand" />
                <span className="font-press-start text-[9px] text-[#212121] mt-2 bg-white px-1.5 py-0.5 rounded border-2 border-black font-bold">NONO</span>
              </div>
              <div className="flex flex-col items-center hover:scale-110 transition-transform cursor-pointer">
                <NanaSprite />
                <span className="font-press-start text-[9px] text-pink-600 mt-2 bg-white px-1.5 py-0.5 rounded border-2 border-black font-bold">NANA</span>
              </div>
            </div>

            {/* Menu options buttons */}
            <div className="w-full flex flex-col gap-3.5 my-4">
              <button
                id="btn-start-quest"
                onClick={() => {
                  if (!isMuted) {
                    audioSynth.startBGM();
                  } else {
                    // Try to unlock audio on first principal user click
                    handleMuteToggle();
                  }
                  transitionTo('intro');
                }}
                className="w-full font-press-start text-sm bg-[#facc15] hover:bg-[#eab308] text-black p-3.5 border-4 border-black shadow-[6px_6px_0px_#000000] active:translate-y-1 active:shadow-[2px_2px_0px_#000000] transition-all animate-pulse duration-700"
              >
                ▶ START ADVENTURE
              </button>
              
              <button
                id="btn-fast-castle"
                onClick={() => {
                  if (!isMuted) {
                    audioSynth.startBGM();
                  }
                  transitionTo('final_castle');
                }}
                className="w-full font-press-start text-[11px] bg-rose-500 hover:bg-rose-600 text-white p-3 border-4 border-black shadow-[6px_6px_0px_#000000] active:translate-y-1 active:shadow-[2px_2px_0px_#000000] transition-all"
              >
                🏰 SKIP TO FINAL CASTLE
              </button>
            </div>

            {/* Scoreboard info */}
            <div className="text-left w-full border-t-4 border-dashed border-amber-400 pt-4 mt-2 flex justify-between text-[11px] font-mono font-bold text-rose-800">
              <span>CREATED BY: NANA ❤️</span>
              <span>LEVEL 20 UNLOCKED</span>
            </div>
          </div>
        )}

        {/* --- SCREEN 2: STORY INTRO ONCE UPON A TIME --- */}
        {activeScreen === 'intro' && (
          <div id="screen-intro" className="max-w-xl w-full bg-gradient-to-br from-indigo-950 to-blue-900 text-white p-6 md:p-8 border-4 border-black shadow-[10px_10px_0px_#000000] pixel-box-blue z-20">
            <h2 className="font-press-start text-yellow-400 text-xs md:text-sm border-b-4 border-dashed border-blue-900 pb-3 mb-6 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
              PROLOGUE: THE LEGEND OF NONO
            </h2>
            
            <div className="min-h-48 font-press-start text-[10px] md:text-xs leading-relaxed space-y-4 text-left">
              {config.storyIntroLines.slice(0, storyLineIndex + 1).map((line, idx) => (
                <p key={idx} className="text-[#00FF66] animate-mini-jump font-bold">
                  {idx === storyLineIndex ? '► ' : '✓ '} {line}
                </p>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t-4 border-blue-900 gap-4">
              <span className="font-press-start text-[9px] text-[#00E5FF]">Phase {storyLineIndex + 1} of {config.storyIntroLines.length}</span>
              
              {storyLineIndex < config.storyIntroLines.length - 1 ? (
                <button
                  id="btn-next-story"
                  onClick={() => {
                    audioSynth.playJump();
                    setStoryLineIndex((p) => p + 1);
                  }}
                  className="bg-[#facc15] hover:bg-[#eab308] text-black px-4 py-2 border-2 border-black shadow-[3px_3px_0px_#000000] font-press-start text-[10px]"
                >
                  NEXT ▶
                </button>
              ) : (
                <button
                  id="btn-complete-story"
                  onClick={() => transitionTo('adventure')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 border-4 border-black shadow-[4px_4px_0px_#000000] font-press-start text-[11px] animate-bounce"
                >
                  START QUEST 🕹
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- SCREEN 3: INTERACTIVE ADVENTURE GAME MAP --- */}
        {activeScreen === 'adventure' && (
          <div id="screen-adventure" className="max-w-4xl w-full bg-gradient-to-br from-yellow-50 to-amber-100/50 p-4 md:p-6 vibrant-board z-20 flex flex-col">
            
            {/* Retro level status and subtitle */}
            <div className="border-b-4 border-black pb-3 mb-4 flex flex-wrap justify-between items-center gap-2 bg-yellow-100 p-2 border-4 border-black rounded shadow-[4px_4px_0_#000000]">
              <div className="flex items-center gap-2.5">
                <NonoSprite pose="walk" className="w-10 h-10 animate-walk" />
                <div>
                  <h2 className="font-press-start text-xs md:text-sm text-rose-600 block leading-tight drop-shadow-[2px_2px_0_white]">THE QUEST OF NONO</h2>
                  <span className="font-mono text-xs text-amber-950 font-extrabold">Help Nono clear all worlds to find Nana!</span>
                </div>
              </div>

              {/* Step Navigator indicators */}
              <div className="flex gap-2">
                {(['level1', 'level2', 'level3'] as const).map((lvl, index) => (
                  <button
                    key={lvl}
                    id={`tab-map-${lvl}`}
                    onClick={() => {
                      audioSynth.playJump();
                      setMapLevel(lvl);
                    }}
                    className={`px-3.5 py-2 font-press-start text-[9px] md:text-xs border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000] transition-all focus:outline-none rounded font-bold ${
                      mapLevel === lvl ? 'bg-amber-500 text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    W{index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* MAP CONTENT WINDOW */}
            <div className="flex-grow min-h-96 flex flex-col justify-between">
              
              {/* === WORLD 1: THE BEGINNING === */}
              {mapLevel === 'level1' && (
                <div id="world1-card" className="flex flex-col md:flex-row gap-6 items-center p-2">
                  <div className="w-full md:w-1/2 flex flex-col text-left">
                    <span className="bg-rose-500 text-white font-press-start border-2 border-black text-[9px] px-2.5 py-1 w-max mb-2 rounded shadow-[2px_2px_0_rgba(0,0,0,1)]">WORLD 1</span>
                    <h3 className="font-press-start text-sm text-stone-900 md:text-base mb-2 font-bold">{config.world1FirstEncounter.title}</h3>
                    <span className="font-mono text-xs text-amber-800 font-extrabold mb-3">📅 {config.world1FirstEncounter.date}</span>
                    <p className="font-mono text-sm text-gray-800 bg-white p-4 border-4 border-black rounded shadow-[6px_6px_0_rgba(0,0,0,0.1)] leading-relaxed">
                      {config.world1FirstEncounter.description}
                    </p>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <div className="relative border-4 border-black p-2 bg-white shadow-[6px_6px_0_#000000] rounded rotate-[-2deg] hover:rotate-[0deg] transition-all duration-300">
                      <img
                        src={config.world1FirstEncounter.imageUrl}
                        alt="The Beginning First Encounter photo"
                        className="w-full max-h-64 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-2 bottom-4 bg-black/75 p-1.5 text-center rounded">
                        <span className="text-white text-xs font-press-start text-[9px]">♥ FIRST PIC</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-press-start text-stone-600 mt-5 text-center">★ Hit Next World to Explore ⭐ Memory Kingdom ★</span>
                  </div>
                </div>
              )}

              {/* === WORLD 2: MEMORY KINGDOM === */}
              {mapLevel === 'level2' && (
                <div id="world2-card" className="flex flex-col items-center">
                  <span className="bg-orange-500 text-white font-press-start border-2 border-black text-[9px] px-2.5 py-1 mb-2 rounded shadow-[2px_2px_0_rgba(0,0,0,1)]">WORLD 2</span>
                  <h3 className="font-press-start text-sm md:text-base text-stone-950 mb-2 font-bold">⭐ MEMORY KINGDOM</h3>
                  <p className="font-mono text-xs text-stone-700 text-center mb-6 max-w-lg font-bold">
                    Punch the yellow <b>Mystery Blocks</b> to reveal the memories & stories of us!
                  </p>

                  {/* 3 mystery blocks grid layout */}
                  <div className="grid grid-cols-3 gap-6 md:gap-14 my-6">
                    {config.memories.map((mem) => {
                      const isPunched = !!punchedBlocks[mem.id];
                      return (
                        <div key={mem.id} className="flex flex-col items-center gap-3">
                          <button
                            id={`btn-punch-block-${mem.id}`}
                            onClick={() => handlePunchBlock(mem.id)}
                            className="focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                          >
                            <MysteryBlockSprite isPunched={isPunched} className="w-14 h-14 md:w-16 md:h-16" />
                          </button>
                          <span className="font-press-start text-[8px] md:text-[9px] text-stone-800 font-bold bg-white border border-black px-1.5 py-0.5 rounded shadow-[1.5px_1.5px_0_#000]">
                            {isPunched ? 'UNLOCKED' : 'PUNCH ME'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Popup Modal detail of punched memory */}
                  {selectedMemory && (
                    <div className="w-full bg-[#fef08a] border-4 border-black p-4 rounded-xl mt-4 flex flex-col md:flex-row gap-4 py-4 px-4 shadow-[8px_8px_0_#000000] relative animate-mini-jump">
                      <button
                        id="btn-close-memory"
                        onClick={() => {
                          setSelectedMemory(null);
                          audioSynth.playHit();
                        }}
                        className="absolute top-2 right-2 font-mono text-black font-extrabold h-6 w-6 border-2 border-black bg-rose-400 hover:bg-rose-500 rounded text-center leading-none text-xs flex justify-center items-center cursor-pointer shadow-[2px_2px_0_#000]"
                      >
                        X
                      </button>

                      {/* Cover Photo */}
                      <div className="w-full md:w-5/12">
                        <img
                          src={selectedMemory.imageUrl}
                          alt={selectedMemory.title}
                          className="w-full h-44 object-cover border-4 border-black rounded shadow-[4px_4px_0_rgba(0,0,0,0.15)]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Details content */}
                      <div className="w-full md:w-7/12 flex flex-col justify-center text-left">
                        <h4 className="font-press-start text-xs text-amber-950 font-bold leading-snug">{selectedMemory.title}</h4>
                        <span className="font-mono text-xs text-amber-900 border-b border-amber-300 pb-1 italic mt-1 font-extrabold">{selectedMemory.date}</span>
                        <p className="font-mono text-sm text-gray-800 mt-2 bg-white p-3 rounded-lg border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.05)] leading-relaxed">
                          {selectedMemory.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === WORLD 3: COLLECT THE COINS === */}
              {mapLevel === 'level3' && (
                <div id="world3-card" className="flex flex-col items-center">
                  <span className="bg-emerald-500 text-white font-press-start border-2 border-black text-[9px] px-2.5 py-1 mb-2 rounded shadow-[2px_2px_0_rgba(0,0,0,1)]">WORLD 3</span>
                  <h3 className="font-press-start text-sm md:text-base text-stone-950 mb-1.5 font-bold">🪙 THE AMAZING COIN KINGDOM</h3>
                  <p className="font-mono text-xs text-emerald-950 font-extrabold mb-6">
                    Collect {config.coins.length} coins of Nono's sweet qualities and try to reach <b>100 reasons!</b>
                  </p>

                  {/* Reasons Coins List */}
                  <div className="flex flex-wrap justify-center gap-4 my-4 max-w-2xl">
                    {config.coins.map((coin) => {
                      const isCollected = !!reasons.find((r) => r.id === coin.id)?.isCollected;
                      return (
                        <button
                          key={coin.id}
                          id={`btn-collect-coin-${coin.id}`}
                          onClick={() => handleCollectCoin(coin.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-black rounded-full hover:scale-105 active:scale-95 transition-all text-xs font-mono font-bold shadow-[4px_4px_0_#000000] cursor-pointer ${
                            isCollected ? 'bg-yellow-100 text-yellow-800 border-yellow-500 shadow-[2px_2px_0_#000000]' : 'text-gray-700'
                          }`}
                        >
                          <RetroCoinSprite className="w-5 h-5" spinning={!isCollected} />
                          <span>{coin.quality}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Extra interactive gold coins for 100 benchmark */}
                  <div className="bg-amber-100 p-4 border-4 border-black shadow-[6px_6px_0_rgba(0,0,0,0.15)] rounded-xl w-full max-w-md my-4 text-center">
                    <span className="font-press-start text-[9px] text-amber-900 block mb-2 font-bold">★ 100 REASONS CHALLENGE ★</span>
                    <button
                      id="btn-fast-coins"
                      onClick={handleCollectVirtualCoin}
                      className="bg-yellow-400 hover:bg-yellow-300 active:translate-y-1 font-press-start text-[10px] py-2 px-4 border-2 border-black shadow-[3px_3px_0_#000] transition-all cursor-pointer font-bold"
                    >
                      🪙 PUNCH TO UNLOCK MORE REASONS ({additionalCoinsCollected + reasons.filter(r => r.isCollected).length} / 100)
                    </button>
                    {unlockedInfiniteCoins && (
                      <p className="text-rose-600 font-press-start text-[9px] mt-3 leading-normal animate-pulse font-bold">
                        🎉 GOAL REACHED! You collected 100 reasons why Nono is the absolute best Boyfriend ever! ❤
                      </p>
                    )}
                  </div>

                  {/* Reason Details card */}
                  {currentReasonPopup && (
                    <div className="bg-yellow-50 border-4 border-black p-4 rounded-xl text-left mt-2 shadow-[6px_6px_0px_#000000] w-full max-w-lg animate-mini-jump">
                      <div className="flex items-center gap-2 border-b-2 border-yellow-250 pb-1.5 mb-2">
                        <RetroCoinSprite className="w-7 h-7" spinning={false} />
                        <h4 className="font-press-start text-xs text-yellow-900 font-bold leading-none">{currentReasonPopup.quality}</h4>
                      </div>
                      <p className="font-mono text-sm text-gray-800 italic bg-white p-3 border-2 border-gray-300 rounded shadow-inner">
                        "{currentReasonPopup.description}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* NAVIGATING DOWNWARDS AND SECRET GREEN SEWER PIPE */}
              <div id="game-map-footer" className="mt-8 border-t-4 border-dotted border-black pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Cute secret pipe area */}
                <div className="flex items-center gap-3 bg-emerald-50 px-3.5 py-2.5 border-4 border-black rounded-lg shadow-[4px_4px_0_#000]">
                  <span className="font-press-start text-[8px] md:text-[9px] text-emerald-900 font-extrabold">
                    SECRET ROUTE FOUND?
                  </span>
                  <button
                    id="btn-enter-pipe"
                    onClick={() => {
                      setEnteredPipe(true);
                      transitionTo('secret_pipe');
                    }}
                    className="hover:scale-110 active:scale-90 transition-transform focus:outline-none cursor-pointer"
                    title="Click green pipe to drop down into subterranean vault!"
                  >
                    <GreenPipeSprite className="w-10 h-10 hover:brightness-110" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {mapLevel === 'level1' && (
                    <button
                      id="btn-nav-level2"
                      onClick={() => {
                        audioSynth.playJump();
                        setMapLevel('level2');
                      }}
                      className="bg-[#FF9100] hover:bg-[#FF3D00] text-white px-4 py-2 font-press-start text-[10px] pixel-box-retro-sm"
                    >
                      GO TO WORLD 2 ▶
                    </button>
                  )}
                  {mapLevel === 'level2' && (
                    <button
                      id="btn-nav-level3"
                      onClick={() => {
                        audioSynth.playJump();
                        setMapLevel('level3');
                      }}
                      className="bg-[#29B6F6] hover:bg-[#0288D1] text-white px-4 py-2 font-press-start text-[10px] pixel-box-retro-sm"
                    >
                      GO TO WORLD 3 ▶
                    </button>
                  )}
                  {mapLevel === 'level3' && (
                    <button
                      id="btn-nav-boss"
                      onClick={() => {
                        audioSynth.playLevelUp();
                        transitionTo('boss_battle');
                      }}
                      className="bg-[#E52521] hover:bg-red-600 text-white px-5 py-2.5 font-press-start text-[10px] pixel-box-retro text-center animate-bounce duration-500"
                    >
                      ⚔ TRIGGER BOSS BATTLE ⚔
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- SCREEN 4: UNDERGROUND VAULT - SECRET GREEN PIPE LEVEL --- */}
        {activeScreen === 'secret_pipe' && (
          <div id="screen-secret-pipe" className="max-w-3xl w-full bg-gradient-to-br from-zinc-950 to-emerald-950 text-white p-6 vibrant-board z-20 flex flex-col justify-between shadow-[12px_12px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black pb-3 mb-4 flex justify-between items-center bg-gray-950 p-2.5 rounded border-2 border-green-500 shadow-[4px_4px_0_#000]">
              <div className="flex items-center gap-2">
                <GreenPipeSprite className="w-10 h-10 rotate-180" />
                <div>
                  <span className="text-emerald-400 font-press-start text-xs block leading-tight drop-shadow-[2px_2px_0_black]">SECRET VAULT FOUND!</span>
                  <span className="text-gray-400 font-mono text-[11px] font-bold">Nana's Special Inside Jokes & Letter Cabinet</span>
                </div>
              </div>
              <button
                id="btn-leave-pipe"
                onClick={() => {
                  setEnteredPipe(false);
                  transitionTo('adventure');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 font-press-start text-[9px] py-1.5 px-3 border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                RETURN UP ⇧
              </button>
            </div>

            {/* Custom inside jokes & private cards panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              {config.insideJokes.map((joke) => (
                <div
                  key={joke.id}
                  id={`joke-box-${joke.id}`}
                  onClick={() => {
                    audioSynth.playJump();
                    setSelectedSecretJoke(joke);
                  }}
                  className="bg-zinc-900 hover:bg-zinc-850 p-4 border-4 border-black shadow-[4px_4px_0_#10b981] rounded-xl cursor-pointer transform hover:-translate-y-1 transition-all"
                >
                  <span className="font-press-start text-[9px] text-emerald-400 block mb-1">/{joke.subtitle}</span>
                  <h4 className="font-press-start text-xs text-yellow-400 leading-snug mb-2">{joke.title}</h4>
                  <p className="font-mono text-xs text-gray-300 leading-normal line-clamp-3">
                    {joke.content}
                  </p>
                  <span className="text-[9px] text-emerald-400 block mt-3 font-press-start">▶ TAP FOR CONFIDENTIAL MEME</span>
                </div>
              ))}
            </div>

            {/* Pipe joke detail lightbox popup */}
            {selectedSecretJoke && (
              <div className="bg-zinc-900 border-4 border-black p-4 rounded-xl mt-4 flex flex-col md:flex-row gap-4 relative animate-mini-jump shadow-[6px_6px_0_#10b981]">
                <button
                  id="btn-close-joke"
                  onClick={() => {
                    setSelectedSecretJoke(null);
                    audioSynth.playHit();
                  }}
                  className="absolute top-2 right-2 font-mono text-white bg-rose-600 border border-black hover:bg-rose-700 font-extrabold h-6 w-6 rounded text-center leading-none text-xs cursor-pointer shadow-[2px_2px_0_#000]"
                >
                  X
                </button>
                <div className="w-full md:w-5/12">
                  <img
                    src={selectedSecretJoke.imageUrl}
                    alt={selectedSecretJoke.title}
                    className="w-full h-44 object-cover border-4 border-black rounded shadow-[2px_2px_0_#000]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-full md:w-7/12 text-left flex flex-col justify-center">
                  <h4 className="font-press-start text-xs text-yellow-400 leading-none">{selectedSecretJoke.title}</h4>
                  <span className="font-mono text-xs text-[#00E5FF] font-bold mt-1">{selectedSecretJoke.subtitle}</span>
                  <p className="font-mono text-xs text-gray-200 bg-black p-3 mt-2 rounded border-2 border-green-800 leading-relaxed shadow-inner">
                    {selectedSecretJoke.content}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 border-t-2 border-emerald-900 pt-4 flex justify-between items-center text-[10px] text-emerald-500 font-mono font-bold">
              <span>VAULT SECURE 🛡</span>
              <span>PROPERTY OF NANA & NONO</span>
            </div>
          </div>
        )}

        {/* --- SCREEN 5: BOSS BATTLE WITH ADVERSARIES --- */}
        {activeScreen === 'boss_battle' && (
          <div id="screen-boss-battle" className="max-w-2xl w-full bg-gradient-to-tr from-slate-950 via-indigo-950 to-rose-950 text-white p-5 vibrant-board z-20 shadow-[12px_12px_0px_#000000]">
            
            {/* Arena Header */}
            <div className="border-b-4 border-black pb-2 mb-4 flex justify-between items-center bg-black/40 p-2 border-2 border-red-500 rounded shadow-[3px_3px_0_#000]">
              <span className="font-press-start text-yellow-400 text-[10px] md:text-xs">
                ⚔ BOSS ARENA L: {activeBossIndex + 1}/3
              </span>
              <span className="bg-rose-600 text-white text-[9px] font-press-start px-2 py-1 border border-black shadow-[1.5px_1.5px_0_rgba(0,0,0,1)] rounded">
                DANGER
              </span>
            </div>

            {/* Boss visual arena row */}
            <div className="flex flex-col md:flex-row items-center gap-6 justify-around bg-black/60 p-4 border-4 border-black rounded-xl min-h-60 shadow-inner">
              
              {/* Nono Side */}
              <div className="flex flex-col items-center">
                <NonoSprite pose="jump" className="w-20 h-20" />
                <span className="font-press-start text-[10px] text-white mt-2 bg-blue-600 px-2 py-1.5 border-2 border-black rounded shadow-[2px_2px_0_#000]">
                  🎒 PLAYER 1: NONO
                </span>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-yellow-450 text-xs font-mono font-bold">SUPPORT:</span>
                  <HeartSprite className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              {/* Retro VS Indicator */}
              <div className="font-press-start text-rose-500 text-2xl my-1 select-none animate-pulse drop-shadow-[3px_3px_0_rgba(0,0,0,1)] font-extrabold">
                VS
              </div>

              {/* Active Obstacle Boss Side */}
              {!isBossFightWon ? (
                <div className="flex flex-col items-center">
                  <BossSprite type={bosses[activeBossIndex].icon} className="w-24 h-24" />
                  <span className="font-press-start text-[10px] text-yellow-400 mt-2 text-center font-bold">
                    {bosses[activeBossIndex].name}
                  </span>
                  
                  {/* Boss HP Bar */}
                  <div className="w-32 bg-gray-800 border-2 border-black h-4 mt-2.5 relative rounded overflow-hidden shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    <div
                      className="bg-[#e11d48] h-full transition-all duration-300"
                      style={{ width: `${(bosses[activeBossIndex].hp / bosses[activeBossIndex].maxHp) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 flex justify-center items-center font-press-start text-[8px] text-white drop-shadow-md">
                      HP: {bosses[activeBossIndex].hp}/{bosses[activeBossIndex].maxHp}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center max-w-xs animate-mini-jump">
                  <div className="text-4xl">🏆</div>
                  <h4 className="font-press-start text-xs text-green-400 mt-2">ALL ENEMIES DEFEATED!</h4>
                  <p className="font-mono text-xs text-gray-300 mt-2">
                    Nana & Nono's positive energy overcame Overthinking, Bad Days, and Stress!
                  </p>
                </div>
              )}
            </div>

            {/* Battle log Narrative and combat buttons */}
            <div className="bg-black/90 border-4 border-black p-3.5 mt-4 text-center rounded-xl shadow-inner">
              <p className="font-press-start text-[9px] text-[#00FF66] leading-relaxed">
                "{bossBattleNarrative}"
              </p>
            </div>

            <div className="flex justify-between items-center mt-6 pt-3.5 border-t-4 border-black gap-4">
              <button
                id="btn-retry-boss"
                onClick={() => {
                  audioSynth.playHit();
                  resetBossBattle();
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white font-press-start text-[9px] px-3.5 py-2 border-2 border-black shadow-[2.5px_2.5px_0_#000] cursor-pointer"
              >
                🔄 RESTART
              </button>

              {!isBossFightWon ? (
                <button
                  id="btn-attack-boss"
                  onClick={handleBossAttack}
                  className="bg-[#e11d48] hover:bg-rose-500 text-white font-press-start text-xs px-6 py-3 border-4 border-black shadow-[4px_4px_0px_#000000] hover:scale-105 active:scale-95 transition-all text-center uppercase cursor-pointer"
                >
                  ❤️ ATTACK WITH LOVE!
                </button>
              ) : (
                <button
                  id="btn-victory-proceed"
                  onClick={() => {
                    audioSynth.playLevelUp();
                    transitionTo('final_castle');
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-press-start text-xs px-6 py-3 border-4 border-black shadow-[4px_4px_0px_#000000] hover:scale-105 active:scale-95 transition-all animate-bounce cursor-pointer"
                >
                  PROCEED TO CASTLE 🏰
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- SCREEN 6: THE FINAL CASTLE END CASTLE --- */}
        {activeScreen === 'final_castle' && (
          <div id="screen-final-castle" className="max-w-2xl w-full bg-gradient-to-br from-rose-500 to-red-600 p-1 pb-2 border-4 border-black shadow-[12px_12px_0px_#000000] rounded-xl z-20 overflow-hidden">
            
            {/* Castle animation cover flag banner */}
            <div className="bg-gradient-to-br from-[#3b82f6] to-indigo-950 p-4 text-center border-b-4 border-black flex flex-col items-center relative overflow-hidden min-h-48 justify-center rounded-t-lg">
              
              {/* Confetti particles container */}
              {fireworks.map((fw) => (
                <div
                  key={fw.id}
                  className="absolute rounded-full w-2 h-2 animate-pulse"
                  style={{
                    top: `${fw.y}%`,
                    left: `${fw.x}%`,
                    backgroundColor: fw.color,
                    boxShadow: `0 0 8px ${fw.color}`
                  }}
                ></div>
              ))}

              <CastleSprite className="w-24 h-24" />
              <h2 className="font-press-start text-yellow-300 text-xs md:text-sm tracking-tight leading-none uppercase mt-3 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                ★ MISSION COMPLETE ★
              </h2>
              <span className="font-press-start text-[9px] text-emerald-400 mt-1.5 block animate-pixel-blink font-bold">
                CONGRATULATIONS PLAYER 1 HAS LEVELED UP!
              </span>
            </div>

            {/* Heartfelt wish note section */}
            <div className="bg-[#FFFEE5] text-stone-900 p-6 md:p-8 space-y-4 text-left border-t-4 border-black relative">
              <div className="absolute top-3 right-3 text-red-500 font-bold hover:scale-125 transition-transform text-lg select-none">❤️</div>
              
              <h1 className="font-press-start text-rose-600 text-base md:text-lg border-b-2 border-dashed border-rose-200 pb-2 mb-4 leading-tight font-extrabold">
                {config.finalCastleMsg.heading}
              </h1>

              <div id="birthday-letter-body" className="font-mono text-sm leading-relaxed space-y-4 text-stone-800 font-medium">
                <p>{config.finalCastleMsg.para1}</p>
                <p>{config.finalCastleMsg.para2}</p>
                <p>{config.finalCastleMsg.para3}</p>
                <p className="font-extrabold text-rose-600 pt-2 text-base">{config.finalCastleMsg.signOff}</p>
              </div>

              {/* Castle visual signatures code */}
              <div className="flex justify-end gap-2 items-center pt-4 border-t-2 border-stone-200">
                <NanaSprite className="w-10 h-10" />
                <span className="font-press-start text-[9px] text-stone-500 font-bold">WITH LOVE, NANA 👧❤</span>
              </div>
            </div>

            {/* Move to Credits or restart map buttons */}
            <div className="p-3 bg-amber-50 flex flex-wrap justify-between items-center gap-2 rounded-b border-t-4 border-black">
              <button
                id="btn-return-adventure"
                onClick={() => {
                  audioSynth.playJump();
                  transitionTo('adventure');
                }}
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 border-2 border-black shadow-[3px_3px_0_#000] font-press-start text-[10px] cursor-pointer"
              >
                ◀ QUEST MAP
              </button>
              
              <button
                id="btn-nav-credits"
                onClick={() => transitionTo('credits')}
                className="bg-black hover:bg-stone-900 text-white px-5 py-2.5 border-4 border-black shadow-[4px_4px_0_#000] font-press-start text-[10px] animate-bounce cursor-pointer"
              >
                READ STAFF END CREDITS 🎬
              </button>
            </div>
          </div>
        )}

        {/* --- SCREEN 7: END CREDITS --- */}
        {activeScreen === 'credits' && (
          <div id="screen-credits" className="max-w-xl w-full bg-gradient-to-br from-zinc-950 to-stone-900 border-4 border-black p-6 vibrant-board z-20 flex flex-col justify-between shadow-[12px_12px_0px_rgba(0,0,0,1)]">
            <h2 className="font-press-start text-yellow-400 text-xs md:text-sm text-center border-b-4 border-dashed border-stone-800 pb-3 mb-6 font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
              GAME STAFF LIST
            </h2>

            <div className="text-center font-press-start uppercase leading-relaxed text-[10px] md:text-xs my-6 space-y-6">
              <div>
                <p className="text-gray-500 text-[8px] mb-1 tracking-wider font-extrabold">MAIN CHARACTER</p>
                <p className="text-yellow-400 text-sm animate-mini-jump font-bold">NONO 👦</p>
              </div>

              <div>
                <p className="text-gray-500 text-[8px] mb-1 tracking-wider font-extrabold">QUEST CREATOR & GAME WRITER</p>
                <p className="text-rose-400 text-sm font-bold">NANA 👧</p>
              </div>

              <div>
                <p className="text-gray-500 text-[8px] mb-1 tracking-wider font-extrabold">SPECIAL THANKS</p>
                <p className="text-[#00E5FF] tracking-widest text-xs font-bold">FOR BEING BORN IN THIS WORLD</p>
              </div>

              <div>
                <p className="text-gray-500 text-[8px] mb-1 tracking-wider font-extrabold">PRODUCED BY</p>
                <p className="text-rose-500 animate-pulse text-base font-extrabold drop-shadow-[2px_2px_0_black]">NANA'S LOVE CO. ❤️</p>
              </div>

              <div className="pt-4 text-center border-t border-stone-850">
                <span className="font-press-start text-[11px] text-gray-400 block leading-tight font-extrabold">★ THE END ★</span>
                <span className="font-mono text-sm text-yellow-100/80 italic mt-1 block">"Terima kasih untuk petualangan yang tak tergantikan"</span>
              </div>
            </div>

            <div className="flex gap-2 justify-center border-t-4 border-black pt-5">
              <button
                id="btn-replay-game"
                onClick={() => {
                  audioSynth.playLevelUp();
                  transitionTo('title');
                }}
                className="bg-[#e11d48] hover:bg-rose-500 text-white px-5 py-3 border-4 border-black shadow-[4px_4px_0px_#000000] font-press-start text-[10px] hover:scale-105 active:translate-y-1 active:shadow-[1px_1px_0_#000] transition-all text-center cursor-pointer font-bold"
              >
                🔄 REPLAY ADVENTURE
              </button>
            </div>
          </div>
        )}

      </main>

      {/* --- NANA'S QUEST CREATOR - LEVEL ENVIRONMENT EDITOR PANEL --- */}
      {isEditorOpen && (
        <div id="quest-creator-panel" className="bg-[#FFF3E0] border-t-8 border-black font-mono text-xs z-50 p-4 shadow-2xl relative block animate-mini-jump">
          
          {/* Header indicator bar */}
          <div className="border-b-4 border-black pb-2 mb-4 flex justify-between items-center bg-orange-100 p-2 border-2 border-black rounded text-black">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🔧</span>
              <span className="font-press-start text-[10px] md:text-xs">NANA'S RETRO QUEST DESIGN PANEL (creator mode)</span>
            </div>
            
            <button
              id="btn-close-editor"
              onClick={() => {
                setIsEditorOpen(false);
                audioSynth.playHit();
              }}
              className="px-3 py-1 font-press-start text-[9px] bg-red-600 hover:bg-red-500 text-white pixel-box-retro-sm"
            >
              CLOSE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[45vh] overflow-y-auto pr-2">
            
            {/* Column 1: Core details */}
            <div className="space-y-4 bg-white p-3 border-2 border-black rounded shadow-sm text-black">
              <span className="font-press-start text-[9px] text-[#E52521] block mb-2 border-b-2 border-gray-100 pb-1">★ PROFILE CONFIG ★</span>
              
              <div>
                <label className="block font-bold text-xs mb-1">👦 Character Nickname:</label>
                <input
                  type="text"
                  maxLength={16}
                  value="Nono"
                  disabled
                  className="w-full bg-gray-100 p-2 border-2 border-black rounded font-mono font-bold"
                />
                <span className="text-[10px] text-gray-500 block italic leading-tight mt-1">
                  Fixed as "Nono" (requested by user).
                </span>
              </div>

              <div>
                <label className="block font-bold text-xs mb-1">🎮 Unlock New Level (Age):</label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={config.nonoAge}
                  onChange={(e) => saveConfig({ ...config, nonoAge: parseInt(e.target.value) || 20 })}
                  className="w-full bg-orange-50 p-2 border-2 border-black rounded font-mono font-bold text-orange-950 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-xs mb-1">🌍 World 1 Banner Photo Address:</label>
                <input
                  type="text"
                  value={config.world1FirstEncounter.imageUrl}
                  onChange={(e) =>
                    saveConfig({
                      ...config,
                      world1FirstEncounter: {
                        ...config.world1FirstEncounter,
                        imageUrl: e.target.value
                      }
                    })
                  }
                  placeholder="URL of first encounter"
                  className="w-full bg-orange-50 p-2 border-2 border-black rounded text-xs leading-normal select-all font-mono"
                />
                <div className="mt-2">
                  <label className="block font-bold text-[10.5px] text-amber-900 mb-1">🎨 Or Upload Image directly:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'world1')}
                    className="w-full text-xs font-mono file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 file:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: World 2 Memories stories */}
            <div className="space-y-4 bg-white p-3 border-2 border-black rounded shadow-sm text-black">
              <span className="font-press-start text-[9px] text-[#FFB300] block mb-2 border-b-2 border-gray-100 pb-1">★ WORLD 2 BLOCK DIALOGUES ★</span>
              
              {config.memories.map((mem, index) => (
                <div key={mem.id} className="border-b pb-3 mb-2 last:border-b-0 space-y-1">
                  <h4 className="font-bold text-[11px] text-[#8D6E63] flex justify-between">
                    <span>📦 block #{index + 1} Memory</span>
                    <span className="text-[10px] text-gray-500">{mem.date}</span>
                  </h4>
                  <input
                    type="text"
                    value={mem.title}
                    onChange={(e) => {
                      const updated = config.memories.map((m) =>
                        m.id === mem.id ? { ...m, title: e.target.value } : m
                      );
                      saveConfig({ ...config, memories: updated });
                    }}
                    className="w-full bg-orange-50 p-1 border border-black rounded text-xs"
                  />
                  <textarea
                    rows={2}
                    value={mem.description}
                    onChange={(e) => {
                      const updated = config.memories.map((m) =>
                        m.id === mem.id ? { ...m, description: e.target.value } : m
                      );
                      saveConfig({ ...config, memories: updated });
                    }}
                    className="w-full bg-orange-50 p-1 border border-black rounded text-xs block resize-none leading-normal font-mono"
                  />
                  
                  <div className="mt-2">
                    <label className="block font-bold text-[10px] text-amber-800 mb-0.5">Edit Memory Photo:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, mem.id)}
                      className="w-full text-xs font-mono file:mr-1 file:py-0.5 file:px-1.5 file:rounded file:text-[10px] file:bg-yellow-500 file:text-black file:cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3: World 4 Castle & letters */}
            <div className="space-y-4 bg-white p-3 border-2 border-black rounded shadow-sm text-black">
              <span className="font-press-start text-[9px] text-[#43B047] block mb-2 border-b-2 border-gray-100 pb-1">★ FINAL CASTLE HEARTH LETTER ★</span>
              
              <div>
                <label className="block font-bold text-xs mb-1">Heading Title:</label>
                <input
                  type="text"
                  value={config.finalCastleMsg.heading}
                  onChange={(e) =>
                    saveConfig({
                      ...config,
                      finalCastleMsg: { ...config.finalCastleMsg, heading: e.target.value }
                    })
                  }
                  className="w-full bg-orange-50 p-2 border border-black rounded font-semibold font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-xs mb-1">Para 1 (Happy Wishes):</label>
                <textarea
                  rows={2}
                  value={config.finalCastleMsg.para1}
                  onChange={(e) =>
                    saveConfig({
                      ...config,
                      finalCastleMsg: { ...config.finalCastleMsg, para1: e.target.value }
                    })
                  }
                  className="w-full bg-orange-50 p-1 text-xs border border-black rounded resize-none leading-normal"
                />
              </div>

              <div>
                <label className="block font-bold text-xs mb-1">Para 2 (Thank You For):</label>
                <textarea
                  rows={2}
                  value={config.finalCastleMsg.para2}
                  onChange={(e) =>
                    saveConfig({
                      ...config,
                      finalCastleMsg: { ...config.finalCastleMsg, para2: e.target.value }
                    })
                  }
                  className="w-full bg-orange-50 p-1 text-xs border border-black rounded resize-none leading-normal"
                />
              </div>

              <div>
                <label className="block font-bold text-xs mb-1">Para 3 (Wishing All Best):</label>
                <textarea
                  rows={2}
                  value={config.finalCastleMsg.para3}
                  onChange={(e) =>
                    saveConfig({
                      ...config,
                      finalCastleMsg: { ...config.finalCastleMsg, para3: e.target.value }
                    })
                  }
                  className="w-full bg-orange-50 p-1 text-xs border border-black rounded resize-none leading-normal"
                />
              </div>

              <div>
                <label className="block font-bold text-xs mb-1">Sign Off Message:</label>
                <input
                  type="text"
                  value={config.finalCastleMsg.signOff}
                  onChange={(e) =>
                    saveConfig({
                      ...config,
                      finalCastleMsg: { ...config.finalCastleMsg, signOff: e.target.value }
                    })
                  }
                  className="w-full bg-orange-50 p-2 border border-black rounded text-xs select-all text-pink-600 font-bold"
                />
              </div>
            </div>

          </div>

          {/* Quick utility controls block */}
          <div className="mt-4 border-t-2 border-stone-400 pt-4 flex flex-wrap justify-between items-center gap-2">
            <span className="text-[11px] text-gray-500 font-bold leading-none">
              💡 Tip: All changes are live-synced and persistent using the browser's localStorage. Nono will see exactly what you prepare!
            </span>
            <div className="flex gap-2">
              <button
                id="btn-reset-original"
                onClick={handleResetToDefaults}
                className="bg-red-600 hover:bg-red-500 text-white font-press-start text-[9px] px-3 py-2 pixel-box-retro-sm transition-all"
              >
                🚨 RESET ALL ORIGINAL
              </button>
            </div>
          </div>

        </div>
      )}

      {/* --- CUTE RETRO GROUND GRASS / SOIL DIRT STRIP FOOTER --- */}
      <footer id="game-floor" className="bg-[#8B5A2B] text-white p-4 border-t-8 border-[#3A1F13] font-mono text-center relative z-20 flex flex-col items-center">
        {/* Retro green bushes pattern border */}
        <div className="absolute top-[-10px] left-0 right-0 h-2 bg-[#43B047]"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl font-press-start text-[9px] text-yellow-300/90 gap-2">
          <span>SUPER NONO BROS — LEVEL 20 QUEST</span>
          <span className="text-pink-300">CRAFTED FOR NONO BY NANA WITH RETRO LOVE ❤️</span>
        </div>
      </footer>

    </div>
  );
}
