import React from 'react';
import { Character, ElementType } from '../types';
import { ELEMENT_ICONS } from '../constants';

interface BurstAnimationProps {
  character: Character;
  skillName: string;
}

export const BurstAnimation: React.FC<BurstAnimationProps> = ({ character, skillName }) => {
  
  // Map element types to dramatic gradient colors
  const getGradient = (el: ElementType) => {
      switch (el) {
          case ElementType.Pyro: return 'from-red-600 to-orange-900';
          case ElementType.Hydro: return 'from-blue-600 to-cyan-900';
          case ElementType.Electro: return 'from-purple-600 to-indigo-900';
          case ElementType.Cryo: return 'from-cyan-400 to-blue-800';
          case ElementType.Dendro: return 'from-green-600 to-emerald-900';
          case ElementType.Geo: return 'from-yellow-600 to-amber-900';
          case ElementType.Anemo: return 'from-teal-400 to-emerald-700';
          default: return 'from-gray-700 to-gray-900';
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden pointer-events-none">
      {/* 1. Full screen colored flash background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${getGradient(character.element)} opacity-90`}
        style={{ animation: 'flash 2s ease-out forwards' }}
      />
      
      {/* 2. Concentric Circles / Particles Effect (Simplified as overlay) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50 animate-pulse" />

      {/* 3. Main Content Container */}
      <div className="relative flex flex-col items-center justify-center w-full h-full z-10">
          
          {/* Character Portrait with Glow */}
          <div 
            className="relative mb-8"
            style={{ animation: 'zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
          >
              <div className="absolute inset-0 bg-white blur-3xl opacity-30 rounded-full scale-110"></div>
              <img 
                src={character.avatarUrl} 
                alt={character.name}
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-8 border-white/80 shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-4 right-0 text-8xl drop-shadow-lg filter">
                {ELEMENT_ICONS[character.element]}
              </div>
          </div>

          {/* Text Overlay */}
          <div 
             className="text-center transform"
             style={{ animation: 'slideUpFade 0.6s ease-out 0.2s both' }}
          >
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200 italic uppercase tracking-tighter drop-shadow-sm skew-x-[-10deg]">
                  元素爆发
              </h1>
              <div className="h-1 w-full bg-white/50 my-2 rounded-full" />
              <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                  {skillName}
              </h2>
          </div>
      </div>
    </div>
  );
};