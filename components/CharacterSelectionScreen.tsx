import React, { useState } from 'react';
import { CHARACTERS_DB } from '../constants';
import { CharacterCard } from './CharacterCard';
import { soundManager } from '../utils/soundManager';

interface CharacterSelectionScreenProps {
  onConfirm: (selectedIndices: number[]) => void;
}

export const CharacterSelectionScreen: React.FC<CharacterSelectionScreenProps> = ({ onConfirm }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelection = (index: number) => {
    soundManager.play('click');
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index));
    } else {
      if (selected.length < 3) {
        setSelected([...selected, index]);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6 animate-slideUpFade">
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
          组建你的战队
        </h2>
        <p className="text-slate-300 font-medium text-lg">
          请选择 <span className="text-yellow-400 font-bold">3</span> 位小朋友加入战斗 
          <span className="ml-2 text-sm bg-slate-800 px-2 py-1 rounded-full border border-slate-600">
            {selected.length} / 3
          </span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 max-w-5xl overflow-y-auto p-2 no-scrollbar max-h-[60vh]">
        {CHARACTERS_DB.map((char, index) => {
          const isSelected = selected.includes(index);
          return (
            <div key={char.id} className="relative group flex justify-center transform transition-transform duration-200 hover:scale-105">
              <div className={`relative transition-all duration-300 ${isSelected ? 'scale-105' : 'opacity-80 hover:opacity-100'}`}>
                <CharacterCard
                  character={char}
                  isActive={isSelected}
                  onClick={() => toggleSelection(index)}
                />
                {/* Selection Overlay Indicator */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg z-30 border-2 border-white animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onConfirm(selected)}
        disabled={selected.length !== 3}
        className={`
          px-12 py-4 rounded-2xl font-black text-xl shadow-2xl transition-all transform duration-300 border-b-4
          ${selected.length === 3 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-700 hover:translate-y-1 hover:border-b-0 hover:shadow-none cursor-pointer' 
            : 'bg-slate-700 text-slate-500 border-slate-800 cursor-not-allowed grayscale'}
        `}
      >
        {selected.length === 3 ? '确认出战 🚀' : `还需选择 ${3 - selected.length} 人`}
      </button>
    </div>
  );
};