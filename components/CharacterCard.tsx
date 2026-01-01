
import React from 'react';
import { Character, ElementType } from '../types';
import { ELEMENT_COLORS, ELEMENT_ICONS, ELEMENT_CARD_BGS, ELEMENT_BG_PATTERNS, VisualEffectConfig, STATUS_ICONS } from '../constants';

interface CharacterCardProps {
  character: Character;
  isActive: boolean;
  onClick?: () => void;
  isEnemy?: boolean;
  animationType?: 'attack' | 'skill' | 'switch';
  effect?: VisualEffectConfig;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  isActive, 
  onClick, 
  isEnemy, 
  animationType,
  effect 
}) => {
  const elementColor = ELEMENT_COLORS[character.element];
  const cardBgClass = ELEMENT_CARD_BGS[character.element];
  const cardPatternStyle = ELEMENT_BG_PATTERNS[character.element];
  const hpPercent = (character.currentHp / character.maxHp) * 100;
  
  const borderStyle = isActive 
    ? 'ring-4 ring-yellow-400 scale-105 z-10 shadow-[0_0_20px_rgba(250,204,21,0.5)]' 
    : 'hover:ring-4 hover:ring-white/40 opacity-95 transform hover:-translate-y-1';

  const defeatedStyle = character.isDefeated ? 'grayscale opacity-60' : '';

  let animClass = '';
  if (animationType === 'skill') animClass = 'animate-skill-pulse';
  else if (animationType === 'attack') animClass = isEnemy ? 'animate-attack-down' : 'animate-attack-up';
  else if (animationType === 'switch') animClass = 'animate-switch-in z-20';

  return (
    <div 
      onClick={!character.isDefeated ? onClick : undefined}
      className={`
        relative w-24 h-36 md:w-32 md:h-48 rounded-2xl overflow-visible cursor-pointer transition-all duration-300
        border-[3px] border-white/40 shadow-xl
        ${cardBgClass} ${borderStyle} ${defeatedStyle} ${animClass}
      `}
    >
      <div className="absolute inset-0 opacity-40 mix-blend-overlay rounded-2xl" style={cardPatternStyle}></div>

      {/* Character Image - Hidden overflow on image container only, so badges can pop out */}
      <div className="absolute inset-0 flex items-center justify-center z-0 rounded-2xl overflow-hidden">
        <img 
          src={character.avatarUrl} 
          alt={character.name} 
          className="w-full h-full object-cover transform scale-100 filter drop-shadow-md"
        />
      </div>
      
      {/* Top Info: Element Badge */}
      <div className="absolute top-2 left-2 bg-white/30 backdrop-blur-sm rounded-full p-1 w-7 h-7 flex items-center justify-center text-sm border border-white/50 shadow-sm z-10">
        {ELEMENT_ICONS[character.element]}
      </div>

      {/* APPLIED ELEMENT AURA (Top Right) */}
      {character.appliedElement && (
         <div className="absolute -top-2 -right-2 bg-white text-lg rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-slate-200 z-20 animate-bounce">
            {ELEMENT_ICONS[character.appliedElement]}
         </div>
      )}

      {/* STATUS EFFECTS ROW (Bottom above HP) */}
      {character.statuses.length > 0 && (
         <div className="absolute bottom-10 left-0 w-full flex justify-center gap-1 z-20 pointer-events-none">
            {character.statuses.map((s, i) => (
               <div key={i} className="bg-slate-800/80 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20 shadow-sm">
                  <span>{STATUS_ICONS[s.type]}</span>
                  {(s.value || s.duration > 1) && <span className="font-mono font-bold text-yellow-300">{s.value || s.duration}</span>}
               </div>
            ))}
         </div>
      )}

      {/* Status Bars */}
      <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent flex flex-col gap-1 z-10 rounded-b-2xl">
        <div className="text-white text-xs font-black truncate text-center drop-shadow-md tracking-wide">
          {character.name}
        </div>
        
        {/* HP Bar */}
        <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden border border-slate-500/50 relative shadow-inner">
           <div 
             className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
             style={{ width: `${hpPercent}%` }}
           />
           <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
             {character.currentHp}/{character.maxHp}
           </span>
        </div>

        {/* Energy Orbs */}
        {!isEnemy && (
          <div className="flex justify-center gap-1 mt-0.5 h-2.5">
             {Array.from({ length: character.maxEnergy }).map((_, i) => (
               <div 
                 key={i}
                 className={`
                   w-2.5 h-2.5 rounded-full border border-black/20 shadow-sm transition-all duration-300
                   ${i < character.currentEnergy 
                     ? 'bg-gradient-to-br from-yellow-300 to-orange-400 shadow-[0_0_5px_rgba(250,204,21,0.8)] scale-110' 
                     : 'bg-white/20'}
                 `}
               />
             ))}
          </div>
        )}
      </div>

      {effect && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <div className={`text-6xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${effect.animation} ${effect.color}`}>
            {effect.icon}
          </div>
          {effect.label && (
            <div className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-200 stroke-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${effect.animation} mt-1 whitespace-nowrap`}>
               {effect.label}
            </div>
          )}
        </div>
      )}

      {character.isDefeated && (
        <div className="absolute inset-0 bg-slate-900/70 backdrop-grayscale flex items-center justify-center z-20 rounded-2xl">
          <span className="text-white font-black text-lg -rotate-12 border-4 border-white/80 px-3 py-1 rounded-xl bg-red-500 shadow-xl">
            OUT
          </span>
        </div>
      )}
    </div>
  );
};
