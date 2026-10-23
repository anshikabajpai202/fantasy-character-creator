import React from 'react';
import { Dices, Volume2, VolumeX, Sparkles, Layers } from 'lucide-react';
import { playRollSound, playClickSound } from '../utils/audio';

interface TopBarProps {
  onGenerate: () => void;
  activeTab: 'creator' | 'classes' | 'deck';
  setActiveTab: (tab: 'creator' | 'classes' | 'deck') => void;
  deckCount: number;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isRolling: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onGenerate,
  activeTab,
  setActiveTab,
  deckCount,
  soundEnabled,
  setSoundEnabled,
  isRolling,
}) => {
  const handleNavClick = (tab: 'creator' | 'classes' | 'deck') => {
    if (soundEnabled) playClickSound();
    setActiveTab(tab);
  };

  const handleGenerateClick = () => {
    if (soundEnabled) playRollSound();
    onGenerate();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#120e0b]/90 border-b border-[#3d2a1b] shadow-2xl transition-colors">
      {/* Decorative top brass rim line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#1c120c] via-[#d4af37]/60 to-[#1c120c]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark with alchemical sigil */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-[#3a2719] to-[#1a110a] border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] shadow-inner">
            <Sparkles className="w-4 h-4 text-[#e5c158]" />
          </div>
          <button
            onClick={() => handleNavClick('creator')}
            className="text-left font-fantasy text-lg sm:text-xl font-bold tracking-wider text-[#f5ebd7] hover:text-[#e5c158] transition-colors whitespace-nowrap shrink-0"
          >
            Fantasy Character Creator
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#c4b59f]">
          <button
            onClick={() => handleNavClick('creator')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 font-fantasy ${
              activeTab === 'creator'
                ? 'border-[#d4af37] text-[#fce89d] font-semibold'
                : 'border-transparent text-[#9e8f7a] hover:text-[#e7e0d3]'
            }`}
          >
            Player Card
          </button>
          <button
            onClick={() => handleNavClick('classes')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 font-fantasy ${
              activeTab === 'classes'
                ? 'border-[#d4af37] text-[#fce89d] font-semibold'
                : 'border-transparent text-[#9e8f7a] hover:text-[#e7e0d3]'
            }`}
          >
            The Six Classes
          </button>
          <button
            onClick={() => handleNavClick('deck')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 flex items-center gap-1.5 font-fantasy ${
              activeTab === 'deck'
                ? 'border-[#d4af37] text-[#fce89d] font-semibold'
                : 'border-transparent text-[#9e8f7a] hover:text-[#e7e0d3]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>My Deck</span>
            <span className="text-xs px-1.5 py-0.2 text-[#d4af37] font-mono">
              ({deckCount})
            </span>
          </button>
        </nav>

        {/* Zone 3: Actions - Audio Toggle & Artifact "Generate Character" CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? 'Mute alchemical chime' : 'Enable alchemical chime'}
            className="p-2 text-[#9e8f7a] hover:text-[#fce89d] hover:bg-[#22170f] rounded-lg transition-colors border border-[#3d2a1b]"
            aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#d4af37]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#5e5346]" />
            )}
          </button>

          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={isRolling}
            className="artifact-btn-gold px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
          >
            <Dices className={`w-4 h-4 text-[#e5c158] ${isRolling ? 'animate-spin' : ''}`} />
            <span className="font-fantasy tracking-wider">Generate Character</span>
          </button>
        </div>
      </div>

      {/* Mobile nav sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#291b11] bg-[#120e0b] px-3 py-2 text-xs">
        <button
          onClick={() => handleNavClick('creator')}
          className={`px-2 py-1 rounded font-fantasy ${
            activeTab === 'creator' ? 'text-[#fce89d] font-semibold' : 'text-[#9e8f7a]'
          }`}
        >
          Player Card
        </button>
        <button
          onClick={() => handleNavClick('classes')}
          className={`px-2 py-1 rounded font-fantasy ${
            activeTab === 'classes' ? 'text-[#fce89d] font-semibold' : 'text-[#9e8f7a]'
          }`}
        >
          Classes
        </button>
        <button
          onClick={() => handleNavClick('deck')}
          className={`px-2 py-1 rounded flex items-center gap-1 font-fantasy ${
            activeTab === 'deck' ? 'text-[#fce89d] font-semibold' : 'text-[#9e8f7a]'
          }`}
        >
          <span>My Deck</span>
          <span className="font-mono text-[#d4af37]">({deckCount})</span>
        </button>
      </div>
    </header>
  );
};
