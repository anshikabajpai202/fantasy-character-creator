import React, { useState, useEffect, useCallback } from 'react';
import { FantasyCharacter, CharacterClass } from './types/character';
import { generateFantasyCharacter, generateCustomBackstory } from './utils/characterGenerator';
import { CLASS_METADATA } from './data/fantasyData';
import { TopBar } from './components/TopBar';
import { CharacterCard } from './components/CharacterCard';
import { GeneratorControls } from './components/GeneratorControls';
import { ClassGuide } from './components/ClassGuide';
import { MyDeck } from './components/MyDeck';
import { DiceRoller } from './components/DiceRoller';
import { History, Layers } from 'lucide-react';
import { playClickSound, playRollSound } from './utils/audio';

import workbenchBg from './assets/images/ancient_alchemist_workbench_1792615784127.jpg';

const STORAGE_KEY = 'fantasy_my_deck_v1';

export default function App() {
  const [character, setCharacter] = useState<FantasyCharacter>(() =>
    generateFantasyCharacter()
  );
  const [history, setHistory] = useState<FantasyCharacter[]>([character]);
  const [selectedClassFilter, setSelectedClassFilter] = useState<
    CharacterClass | 'Random'
  >('Random');
  const [activeTab, setActiveTab] = useState<'creator' | 'classes' | 'deck'>('creator');
  const [isRolling, setIsRolling] = useState(false);
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Persistent "My Deck" in localStorage
  const [deck, setDeck] = useState<FantasyCharacter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
    } catch {
      // Storage unavailable or full
    }
  }, [deck]);

  // Main character generation handler: Generates brand new random stats for every new character
  const handleGenerate = useCallback(
    (forcedClass?: CharacterClass) => {
      setIsRolling(true);

      const targetClass =
        forcedClass || (selectedClassFilter === 'Random' ? undefined : selectedClassFilter);

      setTimeout(() => {
        const newChar = generateFantasyCharacter({ forcedClass: targetClass });
        setCharacter(newChar);
        setHistory((prev) => [newChar, ...prev.slice(0, 7)]);
        setIsRolling(false);
      }, 180);
    },
    [selectedClassFilter]
  );

  // Commit updates to the current character while keeping stats unchanged
  const commitCharacterUpdate = useCallback((updated: FantasyCharacter) => {
    setCharacter(updated);
    setHistory((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setDeck((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  // Generate cartoon/video-game-style portrait for the current character (stats remain strictly unchanged)
  const handleGeneratePortrait = async () => {
    setIsGeneratingPortrait(true);
    const variationNum = 1;

    try {
      const response = await fetch('/api/generate-portrait', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: character.name,
          characterClass: character.characterClass,
          race: character.race,
          variation: variationNum,
        }),
      });

      let nextPortraitUrl = '';
      if (response.ok) {
        const data = await response.json();
        if (data.source === 'gemini' && data.imageUrl) {
          nextPortraitUrl = data.imageUrl;
        }
      }

      if (!nextPortraitUrl) {
        const classMeta = CLASS_METADATA[character.characterClass];
        const cartoonPool = classMeta.cartoonPortraits;
        nextPortraitUrl = cartoonPool[0] || classMeta.defaultPortrait;
      }

      // Stats (Health, Mana, Strength) remain completely unchanged!
      const updated: FantasyCharacter = {
        ...character,
        portraitUrl: nextPortraitUrl,
        hasCustomPortrait: true,
        portraitVariation: variationNum,
        portraitStyle: 'cartoon',
      };

      commitCharacterUpdate(updated);
    } catch (err) {
      console.warn('Using client cartoon fallback:', err);
      const classMeta = CLASS_METADATA[character.characterClass];
      const nextPortraitUrl = classMeta.cartoonPortraits[0] || classMeta.defaultPortrait;
      const updated: FantasyCharacter = {
        ...character,
        portraitUrl: nextPortraitUrl,
        hasCustomPortrait: true,
        portraitVariation: variationNum,
        portraitStyle: 'cartoon',
      };
      commitCharacterUpdate(updated);
    } finally {
      setIsGeneratingPortrait(false);
    }
  };

  // Regenerate a DIFFERENT cartoon/video-game-style portrait for the same character (stats remain strictly unchanged)
  const handleRegeneratePortrait = async () => {
    setIsGeneratingPortrait(true);
    const nextVariation = (character.portraitVariation || 1) + 1;

    try {
      const response = await fetch('/api/generate-portrait', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: character.name,
          characterClass: character.characterClass,
          race: character.race,
          variation: nextVariation,
        }),
      });

      let nextPortraitUrl = '';
      if (response.ok) {
        const data = await response.json();
        if (data.source === 'gemini' && data.imageUrl) {
          nextPortraitUrl = data.imageUrl;
        }
      }

      if (!nextPortraitUrl) {
        const classMeta = CLASS_METADATA[character.characterClass];
        const cartoonPool = classMeta.cartoonPortraits;
        const index = (nextVariation - 1) % cartoonPool.length;
        nextPortraitUrl = cartoonPool[index] || classMeta.defaultPortrait;
      }

      // Stats (Health, Mana, Strength) remain completely unchanged!
      const updated: FantasyCharacter = {
        ...character,
        portraitUrl: nextPortraitUrl,
        hasCustomPortrait: true,
        portraitVariation: nextVariation,
        portraitStyle: 'cartoon',
      };

      commitCharacterUpdate(updated);
    } catch (err) {
      console.warn('Using client cartoon fallback for regenerate:', err);
      const classMeta = CLASS_METADATA[character.characterClass];
      const cartoonPool = classMeta.cartoonPortraits;
      const index = (nextVariation - 1) % cartoonPool.length;
      const nextPortraitUrl = cartoonPool[index] || classMeta.defaultPortrait;

      const updated: FantasyCharacter = {
        ...character,
        portraitUrl: nextPortraitUrl,
        hasCustomPortrait: true,
        portraitVariation: nextVariation,
        portraitStyle: 'cartoon',
      };
      commitCharacterUpdate(updated);
    } finally {
      setIsGeneratingPortrait(false);
    }
  };

  // Generate a unique 1-2 sentence origin story for the currently displayed character (stats remain strictly unchanged)
  const handleGenerateBackstory = async () => {
    setIsGeneratingBackstory(true);

    try {
      const response = await fetch('/api/generate-backstory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: character.name,
          characterClass: character.characterClass,
          race: character.race,
        }),
      });

      let newBackstory = '';
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.backstory) {
          newBackstory = data.backstory;
        }
      }

      if (!newBackstory) {
        newBackstory = generateCustomBackstory(
          character.name,
          character.characterClass,
          character.race
        );
      }

      // Stats (Health, Mana, Strength) remain completely unchanged!
      const updated: FantasyCharacter = {
        ...character,
        backstory: newBackstory,
      };

      commitCharacterUpdate(updated);
    } catch (err) {
      console.warn('Falling back to procedural backstory generator:', err);
      const newBackstory = generateCustomBackstory(
        character.name,
        character.characterClass,
        character.race
      );
      const updated: FantasyCharacter = {
        ...character,
        backstory: newBackstory,
      };
      commitCharacterUpdate(updated);
    } finally {
      setIsGeneratingBackstory(false);
    }
  };

  // Save to Deck: Saves character (name, class, portrait, backstory, and stats) to "My Deck"
  // Prevents accidental duplicate saves of the same character
  const handleSaveToDeck = (hero: FantasyCharacter) => {
    setDeck((prev) => {
      const alreadyInDeck = prev.some((c) => c.id === hero.id);
      if (alreadyInDeck) {
        return prev; // Prevent duplicate addition
      }
      return [...prev, hero];
    });
  };

  const handleRemoveFromDeck = (id: string) => {
    setDeck((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearDeck = () => {
    setDeck([]);
  };

  // Reroll attributes on demand
  const handleRerollStats = () => {
    if (soundEnabled) playRollSound();
    setIsRolling(true);
    setTimeout(() => {
      const refreshed = generateFantasyCharacter({
        forcedClass: character.characterClass,
        level: character.level,
      });
      const updated: FantasyCharacter = {
        ...character,
        attributes: refreshed.attributes,
        health: refreshed.health,
        hitPoints: refreshed.hitPoints,
        mana: refreshed.mana,
        strength: refreshed.strength,
        armorClass: refreshed.armorClass,
        initiative: refreshed.initiative,
        equipment: refreshed.equipment,
      };
      commitCharacterUpdate(updated);
      setIsRolling(false);
    }, 150);
  };

  // Keyboard shortcut listener: 'G' to generate character
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'KeyG' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (soundEnabled) playRollSound();
        handleGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, soundEnabled]);

  const isCurrentHeroSaved = deck.some((c) => c.id === character.id);

  return (
    <div className="relative min-h-screen bg-[#0a0705] text-[#e7e0d3] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#fce89d]">
      {/* Dark Textured Fantasy Background (Ancient Alchemist's Workbench) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-35 bg-cover bg-center bg-no-repeat bg-fixed mix-blend-screen"
        style={{ backgroundImage: `url(${workbenchBg})` }}
      />

      {/* Atmospheric vignette & parchment warmth scrims */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#0a0705]/85 via-[#120c08]/80 to-[#0a0705]/95" />

      {/* Top Bar with 3-zone contract */}
      <TopBar
        onGenerate={() => handleGenerate()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deckCount={deck.length}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        isRolling={isRolling}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'creator' && (
          <div>
            {/* Generator Controls Bar */}
            <GeneratorControls
              onGenerate={handleGenerate}
              selectedClassFilter={selectedClassFilter}
              setSelectedClassFilter={setSelectedClassFilter}
              isRolling={isRolling}
              soundEnabled={soundEnabled}
              onGeneratePortrait={handleGeneratePortrait}
              onRegeneratePortrait={handleRegeneratePortrait}
              isGeneratingPortrait={isGeneratingPortrait}
              onGenerateBackstory={handleGenerateBackstory}
              isGeneratingBackstory={isGeneratingBackstory}
            />

            {/* 1. Bordered Fantasy Player Card */}
            <CharacterCard
              character={character}
              onSaveToDeck={handleSaveToDeck}
              isSavedInDeck={isCurrentHeroSaved}
              onRerollStats={handleRerollStats}
              onGeneratePortrait={handleGeneratePortrait}
              onRegeneratePortrait={handleRegeneratePortrait}
              isGeneratingPortrait={isGeneratingPortrait}
              onGenerateBackstory={handleGenerateBackstory}
              isGeneratingBackstory={isGeneratingBackstory}
              soundEnabled={soundEnabled}
            />

            {/* 3. My Deck Section - Displayed within the application */}
            <MyDeck
              deck={deck}
              activeCharacterId={character.id}
              onSelectCharacter={(char) => {
                setCharacter(char);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onRemoveCharacter={handleRemoveFromDeck}
              onClearDeck={handleClearDeck}
              onGenerateNew={() => handleGenerate()}
              soundEnabled={soundEnabled}
            />

            {/* Recent History Roll Strip */}
            {history.length > 1 && (
              <div className="relative mt-8 p-4 rounded-2xl bg-[#18110b]/90 border-2 border-[#8c6d1d]/60 shadow-xl overflow-hidden">
                <div className="alchemy-corner-tl" />
                <div className="alchemy-corner-tr" />
                <div className="alchemy-corner-bl" />
                <div className="alchemy-corner-br" />

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-3 font-fantasy">
                  <History className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>Recently Transmuted Champions</span>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {history.map((h, idx) => {
                    const isSelected = h.id === character.id;
                    return (
                      <button
                        key={`${h.id}-${idx}`}
                        type="button"
                        onClick={() => {
                          if (soundEnabled) playClickSound();
                          setCharacter(h);
                        }}
                        className={`px-3 py-2 rounded-xl text-left border shrink-0 transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#291b11] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                            : 'bg-[#120c08] border-[#3a2618] hover:border-[#8c6d1d]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#8c6d1d] shrink-0 bg-[#160f0a]">
                          <img
                            src={h.portraitUrl}
                            alt={h.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold font-fantasy text-[#f5ebd7] truncate max-w-[130px]">
                            {h.name}
                          </div>
                          <div className="text-[10px] text-[#a89985] truncate">
                            {h.characterClass} · LVL {h.level}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tabletop Dice Tray */}
            <DiceRoller soundEnabled={soundEnabled} />
          </div>
        )}

        {activeTab === 'classes' && (
          <ClassGuide
            onSelectClassAndGenerate={(cls) => {
              handleGenerate(cls);
              setActiveTab('creator');
            }}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'deck' && (
          <MyDeck
            deck={deck}
            activeCharacterId={character.id}
            onSelectCharacter={(char) => {
              setCharacter(char);
              setActiveTab('creator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRemoveCharacter={handleRemoveFromDeck}
            onClearDeck={handleClearDeck}
            onGenerateNew={() => {
              handleGenerate();
              setActiveTab('creator');
            }}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Quiet Alchemical Workbench Footer */}
      <footer className="relative z-10 border-t border-[#3a2618] bg-[#0d0906]/95 py-6 text-center text-xs text-[#a89985]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-fantasy-name font-bold text-[#f5ebd7]">
              Fantasy Character Creator
            </span>
            <span className="text-[#69553f]">·</span>
            <span>Interactive Fantasy Player-Card Deck</span>
          </div>
          <div className="text-[#a89985] text-[11px] font-fantasy">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[#20150d] text-[#e5c158] border border-[#4a341e] font-mono">G</kbd> to transmute a hero
          </div>
        </div>
      </footer>
    </div>
  );
}
