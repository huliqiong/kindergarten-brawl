import React, { useState, useEffect } from 'react';
import { ElementType } from '../types';
import { rollDice } from '../utils/gameEngine';
import { MAX_DICE } from '../constants';
import { soundManager } from '../utils/soundManager';
import { DiceTray } from './DiceTray';

interface DiceRollOverlayProps {
  onConfirm: (dice: ElementType[]) => void;
  roundNumber: number;
}

export const DiceRollOverlay: React.FC<DiceRollOverlayProps> = ({ onConfirm, roundNumber }) => {
  const [dice, setDice] = useState<ElementType[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  
  // Reroll logic states
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [canReroll, setCanReroll] = useState(true);

  // Initial random dice for display
  useEffect(() => {
    setDice(rollDice(MAX_DICE));
  }, []);

  const handleInitialRoll = () => {
    setIsRolling(true);
    soundManager.play('click');
    
    let rattleCount = 0;
    // Animation interval (visual only)
    const interval = setInterval(() => {
      setDice(rollDice(MAX_DICE));
      // Play rattle sound occasionally
      if (rattleCount % 2 === 0) soundManager.play('dice');
      rattleCount++;
    }, 100);

    // Stop animation and set final dice
    setTimeout(() => {
      clearInterval(interval);
      setIsRolling(false);
      setDice(rollDice(MAX_DICE)); // Final roll
      setHasRolled(true);
      soundManager.play('click'); // Finish sound
    }, 1000);
  };

  const handleToggleSelect = (index: number) => {
    if (!canReroll) return;
    soundManager.play('click');
    setSelectedIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleReroll = () => {
    if (!canReroll || selectedIndices.length === 0) return;

    setIsRolling(true);
    soundManager.play('click');
    
    // Quick animation for reroll
    let count = 0;
    const interval = setInterval(() => {
       const tempDice = [...dice];
       selectedIndices.forEach(idx => {
          tempDice[idx] = rollDice(1)[0];
       });
       setDice(tempDice);
       if (count % 2 === 0) soundManager.play('dice');
       count++;
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      const newDice = [...dice];
      // Generate actual new values
      const replacements = rollDice(selectedIndices.length);
      selectedIndices.forEach((dieIndex, i) => {
        newDice[dieIndex] = replacements[i];
      });
      
      setDice(newDice);
      setCanReroll(false);
      setSelectedIndices([]);
      setIsRolling(false);
      soundManager.play('click');
    }, 800);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold text-white mb-2">第 {roundNumber} 回合</h2>
      <p className="text-slate-400 mb-8 min-h-[24px]">
        {hasRolled 
          ? (canReroll ? "点击骰子选择重投 (可选)" : "准备就绪")
          : "投掷你的元素骰子"}
      </p>

      {/* Dice Display */}
      <div className="mb-10 min-h-[180px] flex items-center justify-center">
         <DiceTray 
            dice={dice} 
            size="lg"
            canInteract={hasRolled && canReroll}
            selectedIndices={selectedIndices}
            onToggleSelect={handleToggleSelect}
            isRolling={isRolling}
         />
      </div>

      {/* Actions */}
      <div className="h-16 flex gap-4">
        {!hasRolled ? (
          <button
            onClick={handleInitialRoll}
            disabled={isRolling}
            className={`
              px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold rounded-full shadow-xl transition-all
              ${isRolling ? 'opacity-50 cursor-wait' : 'hover:scale-105 active:scale-95'}
            `}
          >
            {isRolling ? '投掷中...' : '投掷骰子'}
          </button>
        ) : (
          <>
            {/* Reroll Button */}
            {canReroll && (
              <button
                onClick={handleReroll}
                disabled={selectedIndices.length === 0 || isRolling}
                className={`
                  px-6 py-3 bg-slate-700 text-white text-lg font-bold rounded-full shadow-lg border-2 border-slate-500
                  transition-all
                  ${selectedIndices.length === 0 || isRolling 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-slate-600 hover:scale-105 hover:border-white'}
                `}
              >
                重投选中 ({selectedIndices.length})
              </button>
            )}

            {/* Confirm Button */}
            <button
              onClick={() => onConfirm(dice)}
              disabled={isRolling}
              className={`
                px-8 py-3 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-full shadow-xl 
                transition-all flex items-center gap-2
                ${isRolling ? 'opacity-50' : 'hover:scale-105 active:scale-95 animate-bounce'}
              `}
            >
              开始战斗 ⚔️
            </button>
          </>
        )}
      </div>
    </div>
  );
};