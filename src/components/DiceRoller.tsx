import React, { useState } from 'react';
import { Dices, RotateCcw, Sparkles } from 'lucide-react';
import { playClickSound, playRollSound } from '../utils/audio';

const DICE_TYPES = [
  { label: 'd20', sides: 20 },
  { label: 'd12', sides: 12 },
  { label: 'd10', sides: 10 },
  { label: 'd8', sides: 8 },
  { label: 'd6', sides: 6 },
  { label: 'd4', sides: 4 },
  { label: 'd100', sides: 100 },
];

interface DiceRollerProps {
  soundEnabled: boolean;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ soundEnabled }) => {
  const [lastRoll, setLastRoll] = useState<{
    die: string;
    result: number;
    timestamp: number;
  } | null>(null);
  const [history, setHistory] = useState<
    Array<{ die: string; result: number; timestamp: number }>
  >([]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDie = (sides: number, label: string) => {
    if (soundEnabled) playRollSound();
    setIsRolling(true);

    setTimeout(() => {
      const result = Math.floor(Math.random() * sides) + 1;
      const rollObj = { die: label, result, timestamp: Date.now() };
      setLastRoll(rollObj);
      setHistory((prev) => [rollObj, ...prev.slice(0, 9)]);
      setIsRolling(false);
    }, 200);
  };

  return (
    <div className="relative bg-[#19110b]/90 border-2 border-[#8c6d1d]/70 rounded-2xl p-4 sm:p-5 mt-8 shadow-2xl overflow-hidden">
      <div className="alchemy-corner-tl" />
      <div className="alchemy-corner-tr" />
      <div className="alchemy-corner-bl" />
      <div className="alchemy-corner-br" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#3a2618]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <h3 className="font-fantasy text-sm font-bold text-[#fce89d] uppercase tracking-wider">
            Alchemist&apos;s Runed Dice Tray
          </h3>
        </div>
        {lastRoll && (
          <div className="text-xs text-[#a89985] flex items-center gap-2">
            <span>Transmutation result:</span>
            <span className="font-mono font-bold text-[#fce89d] text-sm bg-[#100a06] px-2.5 py-0.5 rounded border border-[#8c6d1d]">
              {lastRoll.die} &rarr; {lastRoll.result}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {DICE_TYPES.map((die) => (
          <button
            key={die.label}
            type="button"
            onClick={() => rollDie(die.sides, die.label)}
            disabled={isRolling}
            className="artifact-btn-brown px-3.5 py-2 rounded-xl font-mono text-xs font-semibold cursor-pointer active:scale-95 disabled:opacity-50"
          >
            Roll {die.label}
          </button>
        ))}

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playClickSound();
              setHistory([]);
              setLastRoll(null);
            }}
            className="ml-auto p-2 text-[#a89985] hover:text-[#fce89d] transition-colors"
            title="Clear roll history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#3a2618] flex items-center gap-2 overflow-x-auto text-xs text-[#a89985] font-mono">
          <span className="text-[11px] text-[#8c7a68] uppercase shrink-0 font-fantasy">Recent:</span>
          {history.map((h, i) => (
            <span
              key={`${h.timestamp}-${i}`}
              className="px-2 py-0.5 rounded bg-[#100a06] border border-[#4a341e] shrink-0 text-[#f5ebd7]"
            >
              {h.die}: <strong className="text-[#d4af37]">{h.result}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
