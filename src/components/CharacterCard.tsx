import React, { useState } from 'react';
import { FantasyCharacter } from '../types/character';
import { CLASS_METADATA } from '../data/fantasyData';
import {
  Heart,
  Zap,
  Sword,
  Shield,
  Clock,
  Sparkles,
  BookmarkCheck,
  PlusSquare,
  Copy,
  Check,
  RefreshCw,
  Quote,
  Palette,
  Wand2,
  BookOpen,
  Scroll,
} from 'lucide-react';
import { formatCharacterSheetText } from '../utils/characterGenerator';
import { playClickSound, playRollSound } from '../utils/audio';

interface CharacterCardProps {
  character: FantasyCharacter;
  onSaveToDeck: (character: FantasyCharacter) => void;
  isSavedInDeck: boolean;
  onRerollStats: () => void;
  onGeneratePortrait: () => void;
  onRegeneratePortrait: () => void;
  isGeneratingPortrait: boolean;
  onGenerateBackstory: () => void;
  isGeneratingBackstory?: boolean;
  soundEnabled: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSaveToDeck,
  isSavedInDeck,
  onRerollStats,
  onGeneratePortrait,
  onRegeneratePortrait,
  isGeneratingPortrait,
  onGenerateBackstory,
  isGeneratingBackstory = false,
  soundEnabled,
}) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const meta = CLASS_METADATA[character.characterClass];

  const handleCopy = async () => {
    if (soundEnabled) playClickSound();
    const text = formatCharacterSheetText(character);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleSave = () => {
    if (isSavedInDeck) return; // Prevent accidental duplicate saves
    if (soundEnabled) playClickSound();
    onSaveToDeck(character);
  };

  const statItems = [
    { label: 'STR', full: 'Strength', val: character.strength ?? character.attributes.strength },
    { label: 'AGI', full: 'Agility', val: character.attributes.agility },
    { label: 'ARC', full: 'Arcana', val: character.attributes.arcana },
    { label: 'VIT', full: 'Vitality', val: character.attributes.vitality },
    { label: 'WIS', full: 'Wisdom', val: character.attributes.wisdom },
    { label: 'CHA', full: 'Charisma', val: character.attributes.charisma },
  ];

  const getModifier = (val: number) => {
    const mod = Math.floor((val - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const displayHealth = character.health ?? character.hitPoints;
  const displayMana = character.mana;
  const displayStrength = character.strength ?? character.attributes.strength;

  return (
    <article
      className="relative rounded-2xl overflow-hidden border-2 border-[#8c6d1d]/80 bg-[#160f0a]/95 shadow-2xl transition-all duration-300"
      style={{
        boxShadow: `0 20px 60px -15px rgba(0, 0, 0, 0.95), 0 0 25px rgba(212, 175, 55, 0.18)`,
      }}
      aria-label="Fantasy Player Card"
    >
      {/* Decorative Alchemical Corner Filigree */}
      <div className="alchemy-corner-tl" />
      <div className="alchemy-corner-tr" />
      <div className="alchemy-corner-bl" />
      <div className="alchemy-corner-br" />

      {/* Top antique gold and muted verdigris inlay line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#2d4034] via-[#d4af37] to-[#3d5a45]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* Left Column: Portrait & Identity Art (lg: 5 cols) */}
        <div className="lg:col-span-5 relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#3a2618] bg-[#110b07]/80 p-6 sm:p-8">
          <div>
            {/* Portrait Container with Antique Beveled Frame */}
            <div className="relative w-full aspect-square max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-[#c59b27] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_8px_20px_rgba(0,0,0,0.9)] group">
              {/* Corner brass studs */}
              <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#d4af37] shadow-sm z-10 border border-[#4a341e]" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d4af37] shadow-sm z-10 border border-[#4a341e]" />
              <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-[#d4af37] shadow-sm z-10 border border-[#4a341e]" />
              <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d4af37] shadow-sm z-10 border border-[#4a341e]" />

              {!imageError ? (
                <img
                  key={character.portraitUrl}
                  src={character.portraitUrl}
                  alt={`${character.name} the ${character.characterClass}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isGeneratingPortrait ? 'scale-105 filter blur-xs opacity-60' : 'group-hover:scale-105'
                  }`}
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                  style={{
                    background: `radial-gradient(circle, rgba(61,90,69,0.3) 0%, rgba(18, 13, 9, 0.98) 100%)`,
                  }}
                >
                  <Sparkles className="w-16 h-16 mb-3 text-[#d4af37]" />
                  <span className="font-fantasy-name text-xl font-bold text-[#f5ebd7]">
                    {character.characterClass}
                  </span>
                  <span className="text-xs text-[#a89985] mt-1">{meta.tagline}</span>
                </div>
              )}

              {/* Loading Shimmer during image generation */}
              {isGeneratingPortrait && (
                <div className="absolute inset-0 bg-[#0e0a07]/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
                  <Wand2 className="w-10 h-10 text-[#d4af37] animate-spin mb-3" />
                  <span className="font-fantasy text-sm font-bold text-[#fce89d]">
                    Transmuting Character Portrait...
                  </span>
                  <span className="text-[11px] text-[#b5a591] mt-1">
                    Channeling alchemical essences & video-game aesthetics
                  </span>
                </div>
              )}

              {/* Class Tag Overlay inside portrait */}
              <div className="absolute top-3 left-3 bg-[#160f0a]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#c59b27]/80 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                <span className="text-[#fce89d] font-fantasy">{character.characterClass}</span>
              </div>

              {/* Level badge / Style Tag */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {character.hasCustomPortrait && (
                  <span className="bg-[#2d4034] text-[#d1e7d8] border border-[#4e6e58] font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shadow">
                    Cartoon Art
                  </span>
                )}
                <div className="bg-[#160f0a]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#c59b27]/80 text-xs font-mono font-medium text-[#fce89d] shadow-md">
                  LVL {character.level}
                </div>
              </div>

              {/* Dark vignette bottom scrim */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0e0a07]/95 to-transparent pointer-events-none" />
            </div>

            {/* Artifact Buttons: "Generate Portrait" & "Regenerate Portrait" */}
            <div className="mt-5 max-w-sm mx-auto flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playRollSound();
                  onGeneratePortrait();
                }}
                disabled={isGeneratingPortrait}
                className="artifact-btn-gold w-full sm:flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                title="Generate a cartoon video game portrait for this character"
              >
                <Palette className="w-3.5 h-3.5 text-[#e5c158]" />
                <span className="font-fantasy tracking-wider">Generate Portrait</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playRollSound();
                  onRegeneratePortrait();
                }}
                disabled={isGeneratingPortrait}
                className="artifact-btn-brown w-full sm:flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                title="Create a different cartoon portrait for this same character"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#e5c158] ${isGeneratingPortrait ? 'animate-spin' : ''}`} />
                <span className="font-fantasy tracking-wider">Regenerate Portrait</span>
              </button>
            </div>
          </div>

          {/* Quote & Alignment under portrait */}
          <div className="mt-6 flex flex-col gap-3">
            <div className="relative pl-6 pr-3 py-2.5 italic text-xs text-[#cfbeaa] border-l-2 border-[#d4af37]/60 bg-[#1e140d]/60 rounded-r-lg">
              <Quote className="w-3.5 h-3.5 absolute top-2.5 left-1.5 text-[#d4af37]/70" />
              <span>{character.quote}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#a89985] pt-2 border-t border-[#3a2618]">
              <span>Ethical Alignment</span>
              <span className="font-medium text-[#f5ebd7]">{character.alignment}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#a89985]">
              <span>Ancestral Bloodline</span>
              <span className="font-medium text-[#f5ebd7]">{character.race}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Specs, Class, Stats, Abilities, Gear, Backstory (lg: 7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#18110b]/90">
          <div>
            {/* Header: Class & Stylized Fantasy Name */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#3a2618]">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-1.5">
                  <span className="font-fantasy tracking-widest text-sm text-[#d4af37]">
                    {character.characterClass}
                  </span>
                  <span className="text-[#69553f]">·</span>
                  <span className="text-[#a89985] font-normal">Level {character.level} Champion</span>
                </div>

                {/* Character Name in Stylized Fantasy Font */}
                <h1 className="font-fantasy-name text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#fff8ec] tracking-wide text-balance drop-shadow-md">
                  {character.name}
                </h1>

                {/* Title / Epithet */}
                {character.title && (
                  <p className="text-sm font-fantasy text-[#e5c158] mt-1">
                    {character.title}
                  </p>
                )}

                {/* Unboxed metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#a89985] mt-2">
                  <span className="text-[#cfbeaa] font-medium">{character.race}</span>
                  <span aria-hidden="true" className="text-[#69553f]">·</span>
                  <span className="text-[#cfbeaa] font-medium">{character.characterClass}</span>
                  <span aria-hidden="true" className="text-[#69553f]">·</span>
                  <span>{character.alignment}</span>
                </div>
              </div>

              {/* Action Buttons: "Save to Deck" & "Copy" */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Button labeled "Save to Deck" */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSavedInDeck}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSavedInDeck
                      ? 'artifact-btn-green opacity-95 cursor-default'
                      : 'artifact-btn-gold cursor-pointer hover:scale-102'
                  }`}
                  title={isSavedInDeck ? 'Already stored in My Deck' : 'Save current character to My Deck'}
                >
                  {isSavedInDeck ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#86efac]" />
                      <span className="font-fantasy tracking-wide">Saved in Deck</span>
                    </>
                  ) : (
                    <>
                      <PlusSquare className="w-3.5 h-3.5 text-[#e5c158]" />
                      <span className="font-fantasy tracking-wide">Save to Deck</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="artifact-btn-brown px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  title="Copy full character sheet"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#86efac]" />
                      <span className="text-[#86efac] font-fantasy">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-fantasy">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Core Stats Row: Explicitly Displays Health, Mana, and Strength */}
            <div className="my-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] mb-2 font-fantasy flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
                <span>Primary Combat Stats</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Health Stat */}
                <div className="p-3.5 rounded-xl bg-[#20150d] border border-[#4a341e] flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#fca5a5] flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      <span>Health</span>
                    </span>
                    <span className="text-[10px] text-[#a89985] font-mono">HP</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-[#fff1f2] mt-1 tabular-nums">
                    {displayHealth}
                  </div>
                </div>

                {/* Mana Stat */}
                <div className="p-3.5 rounded-xl bg-[#20150d] border border-[#4a341e] flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#93c5fd] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-sky-400" />
                      <span>Mana</span>
                    </span>
                    <span className="text-[10px] text-[#a89985] font-mono">MP</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-[#eff6ff] mt-1 tabular-nums">
                    {displayMana}
                  </div>
                </div>

                {/* Strength Stat */}
                <div className="p-3.5 rounded-xl bg-[#20150d] border border-[#4a341e] flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#fde047] flex items-center gap-1">
                      <Sword className="w-3.5 h-3.5 text-amber-400" />
                      <span>Strength</span>
                    </span>
                    <span className="text-[10px] text-[#a89985] font-mono">STR</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-[#fefce8] mt-1 tabular-nums">
                    {displayStrength}
                  </div>
                </div>
              </div>

              {/* Secondary Vitals (Armor Class & Initiative) */}
              <div className="grid grid-cols-2 gap-3 mt-2 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-lg bg-[#18100a] border border-[#3a2618] flex items-center justify-between text-[#cfbeaa]">
                  <span className="flex items-center gap-1.5 text-[#a89985]">
                    <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Armor Class:</span>
                  </span>
                  <span className="font-bold text-[#f5ebd7]">{character.armorClass}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#18100a] border border-[#3a2618] flex items-center justify-between text-[#cfbeaa]">
                  <span className="flex items-center gap-1.5 text-[#a89985]">
                    <Clock className="w-3.5 h-3.5 text-[#86efac]" />
                    <span>Initiative:</span>
                  </span>
                  <span className="font-bold text-[#f5ebd7]">
                    {character.initiative >= 0 ? `+${character.initiative}` : character.initiative}
                  </span>
                </div>
              </div>
            </div>

            {/* Core Attributes Grid */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 font-fantasy">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Attribute Breakdown</span>
                </h3>
                <button
                  type="button"
                  onClick={onRerollStats}
                  className="text-xs text-[#d4af37] hover:text-[#fce89d] transition-colors flex items-center gap-1 cursor-pointer font-fantasy"
                  title="Reroll attribute dice"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reroll Stats</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {statItems.map((stat) => {
                  const mod = getModifier(stat.val);
                  const isPrimary = stat.full.toLowerCase() === meta.primaryStat;
                  return (
                    <div
                      key={stat.label}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        isPrimary
                          ? 'bg-[#291b11] border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                          : 'bg-[#1a120b] border-[#4a341e]'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-semibold tracking-wider text-[#a89985]">
                        {stat.label}
                      </div>
                      <div className="text-base font-bold font-mono text-[#fff4df] my-0.5 tabular-nums">
                        {stat.val}
                      </div>
                      <div
                        className={`text-[11px] font-mono font-medium ${
                          mod.startsWith('+') ? 'text-[#86efac]' : 'text-[#a89985]'
                        }`}
                      >
                        {mod}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Signature Ability */}
            <div className="mb-5 p-4 rounded-xl bg-[#20150d] border border-[#4a341e] relative overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#f5ebd7] flex items-center gap-1.5 font-fantasy">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Signature Ability: {character.signatureAbility.name}</span>
                </span>
                <span className="font-mono text-[#d4af37] text-[11px] bg-[#120d09] px-2 py-0.5 rounded border border-[#4a341e]">
                  {character.signatureAbility.cost}
                </span>
              </div>
              <p className="text-xs text-[#cfbeaa] leading-relaxed">
                {character.signatureAbility.description}
              </p>
            </div>

            {/* Equipment Grid */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-2 font-fantasy">
                Alchemical Armaments & Relics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="px-3 py-2 rounded-lg bg-[#20150d] border border-[#4a341e] flex items-center justify-between">
                  <span className="text-[#a89985]">Weapon</span>
                  <span className="font-medium text-[#f5ebd7] truncate ml-2">
                    {character.equipment.primaryWeapon}
                  </span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-[#20150d] border border-[#4a341e] flex items-center justify-between">
                  <span className="text-[#a89985]">Off-hand</span>
                  <span className="font-medium text-[#f5ebd7] truncate ml-2">
                    {character.equipment.offhandOrFocus}
                  </span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-[#20150d] border border-[#4a341e] flex items-center justify-between">
                  <span className="text-[#a89985]">Armor</span>
                  <span className="font-medium text-[#f5ebd7] truncate ml-2">
                    {character.equipment.armor}
                  </span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-[#20150d] border border-[#4a341e] flex items-center justify-between">
                  <span className="text-[#a89985]">Trinket</span>
                  <span className="font-medium text-[#f5ebd7] truncate ml-2">
                    {character.equipment.trinket}
                  </span>
                </div>
              </div>
            </div>

            {/* Backstory Chronicle Section - Clearly Below Character Details with "Generate Backstory" Button */}
            <div className="mt-5 pt-4 border-t border-[#3a2618]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 font-fantasy">
                  <Scroll className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>Origin Chronicle & Backstory</span>
                </h3>

                {/* Working "Generate Backstory" Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playClickSound();
                    onGenerateBackstory();
                  }}
                  disabled={isGeneratingBackstory}
                  className="artifact-btn-brown px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  title="Generate a unique origin backstory for this character"
                >
                  <BookOpen className={`w-3.5 h-3.5 text-[#e5c158] ${isGeneratingBackstory ? 'animate-spin' : ''}`} />
                  <span className="font-fantasy tracking-wider">Generate Backstory</span>
                </button>
              </div>

              {/* Displayed Backstory */}
              <div className="relative bg-[#160f0a] p-4 rounded-xl border border-[#4a341e] shadow-inner">
                {isGeneratingBackstory ? (
                  <div className="flex items-center gap-2.5 py-2 text-xs text-[#fce89d] font-fantasy">
                    <Sparkles className="w-4 h-4 animate-spin text-[#d4af37]" />
                    <span>Inscribing {character.name}&apos;s {character.characterClass} origin into the grimoire...</span>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-[#cfbeaa] leading-relaxed font-sans">
                    {character.backstory}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
