import React from 'react';
import { CharacterClass } from '../types/character';
import { CHARACTER_CLASSES, CLASS_METADATA, CLASS_ABILITIES } from '../data/fantasyData';
import { Sparkles, Dices, ArrowRight } from 'lucide-react';
import { playRollSound } from '../utils/audio';

interface ClassGuideProps {
  onSelectClassAndGenerate: (cls: CharacterClass) => void;
  soundEnabled: boolean;
}

export const ClassGuide: React.FC<ClassGuideProps> = ({
  onSelectClassAndGenerate,
  soundEnabled,
}) => {
  return (
    <div className="py-4">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-fantasy-name text-2xl sm:text-3xl font-extrabold text-[#fff8ec] tracking-wide drop-shadow-md">
          The Six Legendary Archetypes
        </h2>
        <p className="text-[#b5a591] text-xs sm:text-sm mt-2">
          Codified within the Great Grimoire, each discipline channels primal elements, arcane catalysts, or sacred dawn oaths.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHARACTER_CLASSES.map((cls) => {
          const meta = CLASS_METADATA[cls];
          const abilities = CLASS_ABILITIES[cls];

          return (
            <div
              key={cls}
              className="relative rounded-2xl border-2 border-[#8c6d1d]/70 bg-[#160f0a]/95 overflow-hidden flex flex-col justify-between hover:border-[#d4af37] transition-all duration-300 shadow-xl group"
              style={{
                boxShadow: `0 10px 30px -15px rgba(0,0,0,0.9), 0 0 20px rgba(212,175,55,0.12)`,
              }}
            >
              <div className="alchemy-corner-tl" />
              <div className="alchemy-corner-tr" />
              <div className="alchemy-corner-bl" />
              <div className="alchemy-corner-br" />

              {/* Image & Header */}
              <div>
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#100a06]">
                  <img
                    src={meta.defaultPortrait}
                    alt={cls}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160f0a] via-[#160f0a]/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] font-semibold tracking-wider uppercase font-mono text-[#d4af37]">
                        Key Catalyst: {meta.primaryStat}
                      </span>
                      <h3 className="font-fantasy-name text-2xl font-bold text-[#fff8ec] tracking-wide drop-shadow-sm">
                        {cls}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-fantasy text-[#e5c158] mb-2">
                    {meta.tagline}
                  </p>
                  <p className="text-xs text-[#cfbeaa] leading-relaxed mb-4">
                    {meta.description}
                  </p>

                  <div className="border-t border-[#3a2618] pt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d4af37] block mb-2 font-fantasy">
                      Notable Disciplines & Spells
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#cfbeaa]">
                      {abilities.slice(0, 2).map((ab) => (
                        <li key={ab.name} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[#d4af37]" />
                          <span>
                            <strong className="text-[#f5ebd7] font-medium">{ab.name}</strong>:{' '}
                            <span className="text-[#9e8f7a]">{ab.description.slice(0, 75)}...</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action trigger */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playRollSound();
                    onSelectClassAndGenerate(cls);
                  }}
                  className="artifact-btn-brown w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Dices className="w-4 h-4 text-[#e5c158]" />
                  <span className="font-fantasy">Transmute {cls}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#e5c158] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
