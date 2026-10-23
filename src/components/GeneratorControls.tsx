import React from 'react';
import { CharacterClass } from '../types/character';
import { CHARACTER_CLASSES, CLASS_METADATA } from '../data/fantasyData';
import { Dices, Filter, Palette, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { playRollSound, playClickSound } from '../utils/audio';

interface GeneratorControlsProps {
  onGenerate: (forcedClass?: CharacterClass) => void;
  selectedClassFilter: CharacterClass | 'Random';
  setSelectedClassFilter: (val: CharacterClass | 'Random') => void;
  isRolling: boolean;
  soundEnabled: boolean;
  onGeneratePortrait?: () => void;
  onRegeneratePortrait?: () => void;
  isGeneratingPortrait?: boolean;
  onGenerateBackstory?: () => void;
  isGeneratingBackstory?: boolean;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  onGenerate,
  selectedClassFilter,
  setSelectedClassFilter,
  isRolling,
  soundEnabled,
  onGeneratePortrait,
  onRegeneratePortrait,
  isGeneratingPortrait,
  onGenerateBackstory,
  isGeneratingBackstory,
}) => {
  const handleGenerate = () => {
    if (soundEnabled) playRollSound();
    onGenerate(selectedClassFilter === 'Random' ? undefined : selectedClassFilter);
  };

  return (
    <div className="relative bg-[#19110b]/90 border-2 border-[#8c6d1d]/80 rounded-2xl p-4 sm:p-6 shadow-2xl mb-8 overflow-hidden">
      {/* Corner Filigree */}
      <div className="alchemy-corner-tl" />
      <div className="alchemy-corner-tr" />
      <div className="alchemy-corner-bl" />
      <div className="alchemy-corner-br" />

      {/* Decorative top antique gold line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent absolute top-0 left-0" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative">
        {/* Left Side: Class Filter Segmented Control */}
        <div className="w-full lg:w-auto">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-xs font-fantasy font-semibold tracking-wider uppercase text-[#e5c158]">
              Alchemical Class Affinity
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#100a06] rounded-xl border border-[#4a341e] shadow-inner">
            <button
              type="button"
              onClick={() => setSelectedClassFilter('Random')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap font-fantasy ${
                selectedClassFilter === 'Random'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#120d08] font-bold shadow-md'
                  : 'text-[#a89985] hover:text-[#fce89d] hover:bg-[#22170f]'
              }`}
            >
              Any / Random
            </button>

            {CHARACTER_CLASSES.map((cls) => {
              const meta = CLASS_METADATA[cls];
              const isSelected = selectedClassFilter === cls;
              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-fantasy ${
                    isSelected
                      ? 'bg-[#2e1f14] text-[#fce89d] shadow-sm border border-[#d4af37]'
                      : 'text-[#a89985] hover:text-[#fce89d] hover:bg-[#22170f]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isSelected ? '#d4af37' : meta.accentColor }}
                  />
                  <span>{cls}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Ancient Artifact Buttons */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Preserved "Generate Character" Artifact Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isRolling}
            className="artifact-btn-gold px-6 py-3.5 text-sm sm:text-base font-bold rounded-xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
          >
            <Dices
              className={`w-5 h-5 text-[#fce89d] transition-transform ${
                isRolling ? 'animate-spin' : ''
              }`}
            />
            <span className="font-fantasy tracking-wider uppercase">
              {isRolling ? 'Transmuting Champion...' : 'Generate Character'}
            </span>
          </button>

          {/* Portrait Buttons */}
          {onGeneratePortrait && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playRollSound();
                  onGeneratePortrait();
                }}
                disabled={isGeneratingPortrait}
                className="artifact-btn-green flex-1 sm:flex-none px-4 py-3.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                title="Generate cartoon portrait for current hero"
              >
                <Palette className="w-4 h-4 text-[#86efac]" />
                <span className="font-fantasy whitespace-nowrap">Generate Portrait</span>
              </button>

              {onRegeneratePortrait && (
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playRollSound();
                    onRegeneratePortrait();
                  }}
                  disabled={isGeneratingPortrait}
                  className="artifact-btn-brown px-3.5 py-3.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  title="Regenerate portrait variation"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#e5c158] ${isGeneratingPortrait ? 'animate-spin' : ''}`} />
                  <span className="font-fantasy hidden sm:inline whitespace-nowrap">Regenerate</span>
                </button>
              )}
            </div>
          )}

          {/* Quick Backstory Button */}
          {onGenerateBackstory && (
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playClickSound();
                onGenerateBackstory();
              }}
              disabled={isGeneratingBackstory}
              className="artifact-btn-brown px-3.5 py-3.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              title="Generate a unique origin story for current hero"
            >
              <BookOpen className={`w-3.5 h-3.5 text-[#e5c158] ${isGeneratingBackstory ? 'animate-spin' : ''}`} />
              <span className="font-fantasy whitespace-nowrap">Generate Backstory</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
