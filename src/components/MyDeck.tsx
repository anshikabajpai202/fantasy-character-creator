import React, { useState } from 'react';
import { FantasyCharacter } from '../types/character';
import { CLASS_METADATA } from '../data/fantasyData';
import {
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Layers,
  Dices,
  Heart,
  Zap,
  Sword,
  Sparkles,
} from 'lucide-react';
import { formatCharacterSheetText } from '../utils/characterGenerator';
import { playClickSound, playRollSound } from '../utils/audio';

interface MyDeckProps {
  deck: FantasyCharacter[];
  activeCharacterId?: string;
  onSelectCharacter: (char: FantasyCharacter) => void;
  onRemoveCharacter: (id: string) => void;
  onClearDeck: () => void;
  onGenerateNew: () => void;
  soundEnabled: boolean;
}

export const MyDeck: React.FC<MyDeckProps> = ({
  deck,
  activeCharacterId,
  onSelectCharacter,
  onRemoveCharacter,
  onClearDeck,
  onGenerateNew,
  soundEnabled,
}) => {
  const [copiedDeck, setCopiedDeck] = useState(false);
  const [copiedCharId, setCopiedCharId] = useState<string | null>(null);

  const handleCopyOne = async (char: FantasyCharacter) => {
    if (soundEnabled) playClickSound();
    const sheet = formatCharacterSheetText(char);
    await navigator.clipboard.writeText(sheet);
    setCopiedCharId(char.id);
    setTimeout(() => setCopiedCharId(null), 2000);
  };

  const handleCopyAll = async () => {
    if (soundEnabled) playClickSound();
    const allSheets = deck.map((c) => formatCharacterSheetText(c)).join('\n\n\n');
    await navigator.clipboard.writeText(allSheets);
    setCopiedDeck(true);
    setTimeout(() => setCopiedDeck(false), 2200);
  };

  const handleExportJSON = () => {
    if (soundEnabled) playClickSound();
    const blob = new Blob([JSON.stringify(deck, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fantasy_my_deck_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (deck.length === 0) {
    return (
      <section className="relative my-8 p-6 sm:p-10 rounded-2xl border-2 border-[#8c6d1d]/70 bg-[#160f0a]/90 text-center shadow-2xl overflow-hidden">
        <div className="alchemy-corner-tl" />
        <div className="alchemy-corner-tr" />
        <div className="alchemy-corner-bl" />
        <div className="alchemy-corner-br" />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1c120c] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner">
          <Layers className="w-8 h-8 text-[#e5c158]" />
        </div>
        <h3 className="font-fantasy-name text-2xl font-bold text-[#f5ebd7]">
          My Deck Is Empty
        </h3>
        <p className="text-xs sm:text-sm text-[#a89985] mt-2 mb-6 max-w-md mx-auto">
          Click the <strong className="text-[#fce89d]">&ldquo;Save to Deck&rdquo;</strong> button on any generated hero to store their card, stats, portrait, and backstory in your personal deck.
        </p>
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) playRollSound();
            onGenerateNew();
          }}
          className="artifact-btn-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Dices className="w-4 h-4 text-[#e5c158]" />
          <span className="font-fantasy">Generate Character</span>
        </button>
      </section>
    );
  }

  return (
    <section className="relative my-8 p-6 sm:p-8 rounded-2xl border-2 border-[#8c6d1d]/80 bg-[#160f0a]/95 shadow-2xl overflow-hidden" aria-label="My Deck Section">
      {/* Decorative corner brackets */}
      <div className="alchemy-corner-tl" />
      <div className="alchemy-corner-tr" />
      <div className="alchemy-corner-bl" />
      <div className="alchemy-corner-br" />

      {/* Deck Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#3a2618]">
        <div>
          <h2 className="font-fantasy-name text-2xl sm:text-3xl font-bold text-[#fff8ec] flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#d4af37]" />
            <span>My Deck</span>
            <span className="text-sm font-mono text-[#d4af37] font-normal bg-[#20150d] px-2.5 py-0.5 rounded-lg border border-[#4a341e]">
              {deck.length} {deck.length === 1 ? 'Card' : 'Cards'}
            </span>
          </h2>
          <p className="text-xs text-[#a89985] mt-1 font-sans">
            Your personal collection of saved fantasy player cards. Click any card to inspect or play it on the main stage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAll}
            className="artifact-btn-brown px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            title="Copy all character sheets in deck"
          >
            {copiedDeck ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#86efac]" />
                <span className="text-[#86efac] font-fantasy">All Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="font-fantasy">Copy Deck</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="artifact-btn-brown px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            title="Export deck as JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-fantasy">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to dismiss all cards from My Deck?')) {
                onClearDeck();
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-900/60 bg-rose-950/20 text-rose-300 hover:bg-rose-950/50 transition-colors flex items-center gap-1.5 cursor-pointer font-fantasy"
            title="Clear all cards from My Deck"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Deck</span>
          </button>
        </div>
      </div>

      {/* Deck Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {deck.map((char) => {
          const meta = CLASS_METADATA[char.characterClass];
          const isActive = char.id === activeCharacterId;
          const displayHealth = char.health ?? char.hitPoints;
          const displayMana = char.mana;
          const displayStrength = char.strength ?? char.attributes.strength;

          return (
            <div
              key={char.id}
              className={`relative rounded-xl border-2 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl ${
                isActive
                  ? 'border-[#d4af37] bg-[#22170f] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#d4af37]'
                  : 'border-[#4a341e] bg-[#17100a] hover:border-[#8c6d1d]'
              }`}
            >
              <div>
                {/* Card Top: Portrait Thumbnail & Header */}
                <div className="flex items-center gap-3.5 p-3.5 border-b border-[#3a2618] bg-[#100a06]/90">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#8c6d1d] shrink-0 bg-[#1a120b] shadow-inner relative group">
                    <img
                      src={char.portraitUrl}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {char.hasCustomPortrait && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#2d4034]/90 text-[8px] text-[#86efac] font-bold text-center py-0.2 uppercase">
                        Cartoon
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
                      <span className="text-[#d4af37] font-fantasy">{char.characterClass}</span>
                      <span className="text-[#69553f]">·</span>
                      <span className="text-[#a89985]">LVL {char.level}</span>
                      {isActive && (
                        <span className="text-[9px] bg-[#d4af37] text-slate-950 font-bold px-1.5 py-0.2 rounded ml-auto">
                          Active Card
                        </span>
                      )}
                    </div>

                    <h4 className="font-fantasy-name text-base sm:text-lg font-bold text-[#fff8ec] truncate">
                      {char.name}
                    </h4>

                    <div className="text-[11px] text-[#a89985] truncate">
                      {char.race} · {char.alignment}
                    </div>
                  </div>
                </div>

                {/* Card Body: Health, Mana, Strength Stats */}
                <div className="p-3.5">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3 font-mono">
                    <div className="p-1.5 rounded-lg bg-[#20150d] border border-[#4a341e]">
                      <div className="text-[9px] text-[#fca5a5] uppercase font-bold flex items-center justify-center gap-0.5">
                        <Heart className="w-2.5 h-2.5 text-rose-400" />
                        <span>Health</span>
                      </div>
                      <div className="font-black text-[#fff1f2] text-sm tabular-nums">
                        {displayHealth}
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#20150d] border border-[#4a341e]">
                      <div className="text-[9px] text-[#93c5fd] uppercase font-bold flex items-center justify-center gap-0.5">
                        <Zap className="w-2.5 h-2.5 text-sky-400" />
                        <span>Mana</span>
                      </div>
                      <div className="font-black text-[#eff6ff] text-sm tabular-nums">
                        {displayMana}
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#20150d] border border-[#4a341e]">
                      <div className="text-[9px] text-[#fde047] uppercase font-bold flex items-center justify-center gap-0.5">
                        <Sword className="w-2.5 h-2.5 text-amber-400" />
                        <span>Strength</span>
                      </div>
                      <div className="font-black text-[#fefce8] text-sm tabular-nums">
                        {displayStrength}
                      </div>
                    </div>
                  </div>

                  {/* Backstory Snippet */}
                  <div className="text-[11px] text-[#b5a591] line-clamp-2 leading-relaxed bg-[#100a06]/60 p-2 rounded border border-[#3a2618]">
                    {char.backstory}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 border-t border-[#3a2618] mt-1 flex items-center justify-between gap-2 bg-[#120c08]">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playClickSound();
                    onSelectCharacter(char);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isActive
                      ? 'artifact-btn-green'
                      : 'artifact-btn-gold'
                  }`}
                  title="View this character on the Player Card"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="font-fantasy">{isActive ? 'Current Hero' : 'View Card'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyOne(char)}
                    className="p-1.5 rounded-lg text-[#a89985] hover:text-[#fce89d] hover:bg-[#20150d] border border-[#4a341e] transition-colors cursor-pointer"
                    title="Copy character sheet"
                  >
                    {copiedCharId === char.id ? (
                      <Check className="w-3.5 h-3.5 text-[#86efac]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playClickSound();
                      onRemoveCharacter(char.id);
                    }}
                    className="p-1.5 rounded-lg text-[#a89985] hover:text-rose-400 hover:bg-rose-950/40 border border-[#4a341e] transition-colors cursor-pointer"
                    title="Remove card from My Deck"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
