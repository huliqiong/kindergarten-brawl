import React from 'react';
import { ElementType } from '../types';
import { ELEMENT_ICONS, ELEMENT_COLORS } from '../constants';

interface DiceTrayProps {
  dice: ElementType[];
  selectedIndices?: number[];
  onToggleSelect?: (index: number) => void;
  canInteract: boolean;
  size?: 'sm' | 'lg';
  isRolling?: boolean;
}

export const DiceTray: React.FC<DiceTrayProps> = ({ 
  dice, 
  selectedIndices = [],
  onToggleSelect,
  canInteract,
  size = 'sm',
  isRolling = false
}) => {
  const isLarge = size === 'lg';
  const sizeClasses = isLarge ? 'w-16 h-16 text-4xl rounded-xl border-4' : 'w-10 h-10 text-2xl rounded-lg border-2';
  const containerClasses = isLarge 
    ? 'grid grid-cols-4 gap-6 p-4 justify-items-center' 
    : 'flex flex-wrap gap-2 justify-center p-2 bg-slate-800/50 rounded-lg min-h-[60px]';

  return (
    <div className={containerClasses}>
      {dice.length === 0 && <span className="text-gray-500 text-sm italic py-2">无剩余骰子</span>}
      {dice.map((die, index) => {
        const colorClass = ELEMENT_COLORS[die].split(' ')[1]; // Extract bg color
        const borderClass = ELEMENT_COLORS[die].split(' ')[2];
        const isSelected = selectedIndices.includes(index);
        
        return (
          <div
            key={index}
            onClick={() => canInteract && onToggleSelect && onToggleSelect(index)}
            className={`
              ${sizeClasses} flex items-center justify-center shadow-md
              select-none transition-all duration-200
              ${colorClass} ${borderClass}
              ${canInteract ? 'cursor-pointer hover:scale-105 hover:brightness-110' : 'cursor-default'}
              ${isSelected ? '-translate-y-4 ring-4 ring-white shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10' : ''}
              ${isRolling ? 'shake' : ''}
            `}
            title={die}
          >
            {ELEMENT_ICONS[die]}
          </div>
        );
      })}
    </div>
  );
};