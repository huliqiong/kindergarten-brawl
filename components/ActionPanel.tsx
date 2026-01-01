
import React from 'react';
import { Character, Skill, ElementType } from '../types';
import { ELEMENT_ICONS } from '../constants';

interface ActionPanelProps {
  activeCharacter: Character;
  dice: ElementType[];
  onUseSkill: (skill: Skill) => void;
  onEndRound: () => void;
  onViewSkillDetails: () => void;
  disabled: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ 
  activeCharacter, 
  dice, 
  onUseSkill, 
  onEndRound,
  onViewSkillDetails,
  disabled 
}) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Skills Row */}
      <div className="flex gap-2 justify-center items-stretch flex-1">
        {activeCharacter.skills.map((skill) => {
          const isBurst = skill.type === 'Elemental Burst';
          const energyReady = !isBurst || (activeCharacter.currentEnergy >= (skill.cost.energy || 0));

          // Label Mapping
          let typeLabel = '技能';
          if (skill.type === 'Normal Attack') typeLabel = '普攻';
          if (skill.type === 'Elemental Burst') typeLabel = '爆发';

          return (
            <div key={skill.id} className="relative flex-1 group">
               <button
                  onClick={() => onUseSkill(skill)}
                  disabled={disabled}
                  className={`
                    w-full h-full bg-slate-800 border-2 border-slate-600 rounded-lg p-2
                    flex flex-col items-center justify-between
                    transition-all active:scale-95 hover:border-blue-400
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isBurst ? 'bg-slate-900 border-yellow-600/50' : ''}
                  `}
                >
                  <div className="text-xs font-bold text-center mb-1 text-blue-200 mt-2">{skill.name}</div>
                  
                  <div className="text-xs text-gray-400 mb-2">{typeLabel}</div>

                  {/* Cost Badge */}
                  <div className="flex items-center gap-1 bg-black/40 rounded px-2 py-1">
                    <span className="text-sm">{ELEMENT_ICONS[skill.cost.element]}</span>
                    <span className="text-sm font-mono font-bold">x{skill.cost.count}</span>
                    {skill.cost.energy && (
                      <span className={`text-xs ml-1 ${energyReady ? 'text-yellow-400' : 'text-gray-500'}`}>
                        ⚡{skill.cost.energy}
                      </span>
                    )}
                  </div>
               </button>
               
               {/* Info Icon - Triggers Manual */}
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   onViewSkillDetails();
                 }}
                 className="absolute top-1 right-1 w-5 h-5 bg-slate-700 text-gray-300 rounded-full flex items-center justify-center text-[10px] font-serif border border-slate-500 hover:bg-blue-500 hover:text-white hover:border-blue-300 transition-colors shadow-sm z-10"
                 title="查看详情"
               >
                 i
               </button>
            </div>
          );
        })}
      </div>

      {/* End Round Button */}
      <button
        onClick={onEndRound}
        disabled={disabled}
        className="w-full bg-red-600/80 hover:bg-red-500 text-white font-bold py-3 rounded-lg uppercase tracking-widest text-sm shadow-lg border-2 border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        结束回合
      </button>
    </div>
  );
};
