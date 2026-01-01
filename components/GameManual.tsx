
import React, { useState } from 'react';
import { Character, ElementType, Skill } from '../types';
import { ELEMENT_ICONS, REACTION_VISUALS, ELEMENT_COLORS } from '../constants';

interface GameManualProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacter?: Character;
  initialTab?: 'skills' | 'reactions';
}

export const GameManual: React.FC<GameManualProps> = ({ isOpen, onClose, activeCharacter, initialTab = 'skills' }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'reactions'>(initialTab);

  // Sync tab if prop changes when opening
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const REACTIONS = [
    { name: '蒸发', combo: '水 + 火', icon: REACTION_VISUALS['蒸发'].icon, effect: '本次伤害提升 (x1.5)。火打水或水打火皆可触发。' },
    { name: '融化', combo: '冰 + 火', icon: REACTION_VISUALS['融化'].icon, effect: '本次伤害大幅提升 (x1.7)。' },
    { name: '超载', combo: '雷 + 火', icon: REACTION_VISUALS['超载'].icon, effect: '伤害+1，并强制对手切换到下一个角色。' },
    { name: '冻结', combo: '冰 + 水', icon: REACTION_VISUALS['冻结'].icon, effect: '伤害+1，目标被「冻结」，本回合无法行动。' },
    { name: '感电', combo: '雷 + 水', icon: REACTION_VISUALS['感电'].icon, effect: '伤害+1，并对对手所有后台角色造成 1 点穿透伤害。' },
    { name: '超导', combo: '冰 + 雷', icon: REACTION_VISUALS['超导'].icon, effect: '赋予目标「物理抗性降低」状态，受到的物理伤害增加。' },
    { name: '扩散', combo: '风 + 水/火/冰/雷', icon: REACTION_VISUALS['扩散'].icon, effect: '对对手所有后台角色造成 1 点对应元素伤害。' },
    { name: '结晶', combo: '岩 + 水/火/冰/雷', icon: REACTION_VISUALS['结晶'].icon, effect: '伤害+1，并为我方出战角色生成 1 点护盾。' },
    { name: '燃烧', combo: '草 + 火', icon: REACTION_VISUALS['燃烧'].icon, effect: '生成「燃烧」状态，回合结束时扣除 1 点生命，持续 2 回合。' },
    { name: '激化', combo: '草 + 雷', icon: REACTION_VISUALS['激化'].icon, effect: '本次伤害提升 (x1.5)。' },
    { name: '绽放', combo: '草 + 水', icon: REACTION_VISUALS['绽放'].icon, effect: '生成「草原核」状态，下一次火或雷攻击时伤害+1。' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-slideUpFade">
      <div className="bg-slate-800 w-full max-w-2xl max-h-[85vh] rounded-2xl border-2 border-slate-600 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📖</span> 幼儿园战斗手册
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            className={`flex-1 py-3 font-bold text-sm transition-colors ${activeTab === 'skills' ? 'bg-slate-700 text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:bg-slate-700/50'}`}
            onClick={() => setActiveTab('skills')}
          >
            当前角色技能
          </button>
          <button
            className={`flex-1 py-3 font-bold text-sm transition-colors ${activeTab === 'reactions' ? 'bg-slate-700 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-slate-700/50'}`}
            onClick={() => setActiveTab('reactions')}
          >
            元素反应机制
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar bg-slate-800/50">
          
          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {activeCharacter ? (
                <>
                  <div className="flex items-center gap-4 mb-6 bg-slate-700/30 p-3 rounded-xl border border-white/5">
                    <img src={activeCharacter.avatarUrl} alt={activeCharacter.name} className="w-16 h-16 rounded-full border-2 border-white/20" />
                    <div>
                      <h3 className="text-xl font-black text-white">{activeCharacter.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${ELEMENT_COLORS[activeCharacter.element]}`}>
                          {ELEMENT_ICONS[activeCharacter.element]} {activeCharacter.element}
                        </span>
                        <span>HP: {activeCharacter.currentHp}/{activeCharacter.maxHp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeCharacter.skills.map((skill: Skill) => (
                      <div key={skill.id} className="bg-slate-700 rounded-xl p-4 border border-slate-600 relative overflow-hidden group hover:border-slate-500 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                           <div className="font-bold text-lg text-yellow-100">{skill.name}</div>
                           <div className="flex gap-1">
                              {/* Cost Badges */}
                              <span className="bg-black/40 px-2 py-0.5 rounded text-xs font-mono flex items-center gap-1 text-gray-300">
                                {ELEMENT_ICONS[skill.cost.element]} x{skill.cost.count}
                              </span>
                              {skill.cost.energy && (
                                <span className="bg-black/40 px-2 py-0.5 rounded text-xs font-mono flex items-center gap-1 text-yellow-400">
                                  ⚡ x{skill.cost.energy}
                                </span>
                              )}
                           </div>
                        </div>
                        
                        <div className="text-xs font-bold text-blue-300 mb-2 uppercase tracking-wide opacity-80">
                          [{skill.type === 'Normal Attack' ? '普通攻击' : skill.type === 'Elemental Skill' ? '元素战技' : '元素爆发'}]
                        </div>

                        <p className="text-sm text-gray-200 leading-relaxed">
                          {skill.description}
                        </p>

                        {/* Quick Stats */}
                        <div className="mt-3 flex gap-3 text-xs font-medium">
                           {skill.damage > 0 && <span className="text-red-300 bg-red-900/30 px-2 py-1 rounded">造成 {skill.damage} 点伤害</span>}
                           {skill.heal && <span className="text-green-300 bg-green-900/30 px-2 py-1 rounded">治疗 {skill.heal} 点</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-10">请先选择出战角色</div>
              )}
            </div>
          )}

          {/* Reactions Tab */}
          {activeTab === 'reactions' && (
            <div className="grid gap-3">
              {REACTIONS.map((reaction, idx) => (
                <div key={idx} className="bg-slate-700/50 rounded-xl p-3 border border-slate-600 flex items-start gap-3">
                  <div className="text-2xl mt-1">{reaction.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-lg">{reaction.name}</span>
                      <span className="text-xs text-gray-400 bg-black/30 px-2 py-0.5 rounded-full">{reaction.combo}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-snug">{reaction.effect}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-700 text-center">
           <button 
             onClick={onClose}
             className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors"
           >
             返回战斗
           </button>
        </div>
      </div>
    </div>
  );
};
