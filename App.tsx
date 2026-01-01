
import React, { useState, useEffect, useCallback } from 'react';
import { 
  GameState, 
  GamePhase, 
  Skill, 
  ElementType,
  Character,
  SkillType,
  StatusType
} from './types';
import { 
  getInitialCharacters, 
  MAX_DICE,
  SKILL_VISUALS,
  REACTION_VISUALS,
  VisualEffectConfig,
  CHARACTERS_DB
} from './constants';
import { rollDice, checkCost, getActiveCharacter } from './utils/gameEngine';
import { soundManager } from './utils/soundManager'; // Audio
import { processReaction } from './utils/reactionManager';
import { DiceTray } from './components/DiceTray';
import { CharacterCard } from './components/CharacterCard';
import { ActionPanel } from './components/ActionPanel';
import { DiceRollOverlay } from './components/DiceRollOverlay';
import { BurstAnimation } from './components/BurstAnimation';
import { IntroScreen } from './components/IntroScreen';
import { CharacterSelectionScreen } from './components/CharacterSelectionScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { GameManual } from './components/GameManual';

const INITIAL_STATE: GameState = {
  phase: GamePhase.Init,
  turnPlayerId: 'player',
  roundNumber: 1,
  winner: null,
  logs: ['欢迎来到向日葵幼儿园!'],
  player: {
    id: 'player',
    name: 'You',
    characters: [],
    activeCharacterId: '',
    dice: [],
    hasEndedRound: false,
  },
  enemy: {
    id: 'enemy',
    name: 'Rival',
    characters: [],
    activeCharacterId: '',
    dice: [],
    hasEndedRound: false,
  },
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [toast, setToast] = useState<{message: string, type: 'info' | 'damage' | 'reaction'} | null>(null);
  const [burstAnim, setBurstAnim] = useState<{character: Character, skillName: string} | null>(null);
  const [cardAnim, setCardAnim] = useState<{charId: string, type: 'attack' | 'skill' | 'switch'} | null>(null);
  const [skillEffect, setSkillEffect] = useState<{cardId: string, config: VisualEffectConfig} | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  
  // Manual State
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualTab, setManualTab] = useState<'skills' | 'reactions'>('skills');

  // --- Handlers ---
  const handleGameStart = () => {
    soundManager.resume();
    soundManager.play('click');
    setGameState(prev => ({
      ...prev,
      phase: GamePhase.SelectionPhase,
      logs: ['请选择你的出战角色...'],
    }));
  };

  const handleSelectionComplete = (selectedIndices: number[]) => {
    soundManager.play('win');
    const playerChars = getInitialCharacters('p', selectedIndices);
    
    const allIndices = CHARACTERS_DB.map((_, i) => i);
    const availableForEnemy = allIndices.filter(i => !selectedIndices.includes(i));
    const enemyIndices = availableForEnemy.sort(() => 0.5 - Math.random()).slice(0, 3);
    const enemyChars = getInitialCharacters('e', enemyIndices);

    setGameState(prev => ({
      ...prev,
      phase: GamePhase.RollPhase,
      logs: ['战队集结完毕! 战斗开始! 第 1 回合 - 投掷阶段', ...prev.logs],
      player: { ...prev.player, characters: playerChars, activeCharacterId: playerChars[0].id },
      enemy: { ...prev.enemy, characters: enemyChars, activeCharacterId: enemyChars[0].id }
    }));
  };

  const log = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      logs: [msg, ...prev.logs].slice(0, 5)
    }));
  };

  const showToast = (msg: string, type: 'info' | 'damage' | 'reaction' = 'info') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleRollComplete = useCallback((playerDice: ElementType[]) => {
    const enemyDice = rollDice(MAX_DICE);
    soundManager.play('dice');

    setGameState(prev => ({
      ...prev,
      phase: GamePhase.ActionPhase,
      player: { ...prev.player, dice: playerDice, hasEndedRound: false },
      enemy: { ...prev.enemy, dice: enemyDice, hasEndedRound: false },
      logs: [`第 ${prev.roundNumber} 回合 - 投掷阶段结束`, ...prev.logs]
    }));
  }, []);

  // --- End Phase Logic (Burning, Status Duration) ---
  useEffect(() => {
    if (gameState.phase === GamePhase.ActionPhase) {
      if (gameState.player.hasEndedRound && gameState.enemy.hasEndedRound) {
        
        // Process End of Round Effects
        setTimeout(() => {
          setGameState(prev => {
             // Helper to process a player's characters (Burning dmg, Duration tick)
             const processEndRoundChars = (chars: Character[]) => {
                return chars.map(c => {
                  let newHp = c.currentHp;
                  // 1. Apply Burning Damage
                  const burning = c.statuses.find(s => s.type === 'Burning');
                  if (burning && !c.isDefeated) {
                     newHp = Math.max(0, newHp - (burning.value || 1));
                  }

                  // 2. Decrement Durations
                  const newStatuses = c.statuses
                    .map(s => ({ ...s, duration: s.duration - 1 }))
                    .filter(s => s.duration > 0);

                  const isDefeated = newHp === 0;
                  return { ...c, currentHp: newHp, isDefeated, statuses: newStatuses };
                });
             };

             const newPlayerChars = processEndRoundChars(prev.player.characters);
             const newEnemyChars = processEndRoundChars(prev.enemy.characters);
             
             // Logs for burning
             const burnedLog = [];
             if (prev.player.characters.some(c => c.statuses.some(s => s.type === 'Burning'))) burnedLog.push("你的角色受到燃烧伤害");
             if (prev.enemy.characters.some(c => c.statuses.some(s => s.type === 'Burning'))) burnedLog.push("对手受到燃烧伤害");
             
             // Check deaths from burning
             let winner = prev.winner;
             if (newPlayerChars.every(c => c.isDefeated)) winner = 'enemy';
             if (newEnemyChars.every(c => c.isDefeated)) winner = 'player'; // Player wins ties

             return {
                ...prev,
                phase: winner ? GamePhase.GameOver : GamePhase.RollPhase,
                roundNumber: prev.roundNumber + 1,
                turnPlayerId: 'player',
                winner,
                player: { ...prev.player, characters: newPlayerChars },
                enemy: { ...prev.enemy, characters: newEnemyChars },
                logs: [...burnedLog, ...prev.logs]
             };
          });
        }, 1000);
      } else {
        // Switch Turns immediately if one side ended
        if (gameState.turnPlayerId === 'player' && gameState.player.hasEndedRound) {
           setGameState(prev => ({ ...prev, turnPlayerId: 'enemy' }));
        } else if (gameState.turnPlayerId === 'enemy' && gameState.enemy.hasEndedRound) {
           setGameState(prev => ({ ...prev, turnPlayerId: 'player' }));
        }
      }
    }
  }, [gameState.phase, gameState.turnPlayerId, gameState.player.hasEndedRound, gameState.enemy.hasEndedRound]);

  // --- AI Logic ---
  useEffect(() => {
    if (gameState.phase === GamePhase.ActionPhase && gameState.turnPlayerId === 'enemy' && !gameState.winner) {
      const timer = setTimeout(() => performEnemyAction(), 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.phase, gameState.turnPlayerId, gameState.winner]);

  const performEnemyAction = () => {
    const { enemy } = gameState;
    if (enemy.hasEndedRound) return;

    const activeChar = getActiveCharacter(enemy.characters, enemy.activeCharacterId);
    if (!activeChar) return;

    // Check Frozen Status
    if (activeChar.statuses.some(s => s.type === 'Frozen')) {
      log('对手角色被冻结，跳过回合');
      // Remove Frozen status (consumes turn)
      const unfrozenChars = enemy.characters.map(c => 
         c.id === activeChar.id 
         ? { ...c, statuses: c.statuses.filter(s => s.type !== 'Frozen') } 
         : c
      );
      
      setGameState(prev => ({
         ...prev,
         enemy: { ...prev.enemy, characters: unfrozenChars },
         turnPlayerId: 'player' // Pass turn
      }));
      return;
    }

    const trySkill = (skillIndex: number): boolean => {
      const skill = activeChar.skills[skillIndex];
      if (skill.type === SkillType.ElementalBurst && activeChar.currentEnergy < (skill.cost.energy || 0)) return false;
      const { canPay, paidIndices } = checkCost(skill.cost, enemy.dice);
      if (canPay) {
        executeSkill('enemy', skill, paidIndices);
        return true;
      }
      return false;
    };

    if (trySkill(2)) return;
    if (trySkill(1)) return;
    if (trySkill(0)) return;

    log('对手结束了回合');
    setGameState(prev => ({
      ...prev,
      enemy: { ...prev.enemy, hasEndedRound: true },
      turnPlayerId: prev.player.hasEndedRound ? 'enemy' : 'player'
    }));
  };

  // --- Combat Logic (Updated with Reactions) ---

  const executeSkill = (attackerId: 'player' | 'enemy', skill: Skill, paidDiceIndices: number[]) => {
    const isPlayer = attackerId === 'player';
    const attackerKey = isPlayer ? 'player' : 'enemy';
    const defenderKey = isPlayer ? 'enemy' : 'player';
    
    const attackerState = isPlayer ? gameState.player : gameState.enemy;
    const defenderState = isPlayer ? gameState.enemy : gameState.player;
    
    const attackerChar = getActiveCharacter(attackerState.characters, attackerState.activeCharacterId);
    const targetChar = getActiveCharacter(defenderState.characters, defenderState.activeCharacterId);

    if (!attackerChar) return;

    // 0. Play Sounds & Anim
    if (skill.type === SkillType.ElementalBurst) {
      soundManager.play('burst');
      setBurstAnim({ character: attackerChar, skillName: skill.name });
      setTimeout(() => setBurstAnim(null), 2500);
    } else {
      soundManager.play(skill.type === SkillType.ElementalSkill ? 'skill' : 'normal');
      setCardAnim({ charId: attackerChar.id, type: skill.type === SkillType.NormalAttack ? 'attack' : 'skill' });
      setTimeout(() => setCardAnim(null), 600);
    }

    // 1. Determine Incoming Element
    // Normal Attack = Physical (unless we implement infusion later).
    // Skill/Burst = Character's Element.
    let incomingElement = skill.type === SkillType.NormalAttack ? ElementType.Physical : attackerChar.element;

    // Check Bloom Buff (DendroCore) on Attacker
    const dendroCore = attackerChar.statuses.find(s => s.type === 'DendroCore');
    let damageBonus = 0;
    let consumeDendroCore = false;
    if (dendroCore && (incomingElement === ElementType.Pyro || incomingElement === ElementType.Electro)) {
        damageBonus += (dendroCore.value || 1);
        consumeDendroCore = true;
    }

    // 2. Process Reaction
    let finalDamage = skill.damage + damageBonus;
    let reactionName: string | null = null;
    let newAppliedElement = targetChar?.appliedElement || null;
    let reactionResult: any = {};

    // Allow reaction processing even if damage is 0, provided it's an Elemental Skill/Burst (which applies aura)
    // This fixes issues where non-damaging skills (like Qiqi's heal) didn't apply element.
    if (targetChar && (skill.damage > 0 || skill.type !== SkillType.NormalAttack)) {
      // Calculate Reaction
       reactionResult = processReaction(
        finalDamage,
        incomingElement,
        targetChar.appliedElement,
        targetChar.statuses
      );
      
      finalDamage = reactionResult.finalDamage;
      reactionName = reactionResult.reactionName;
      // Only update applied element if reaction logic ran. 
      // Note: processReaction handles "no change" logic internally if needed.
      newAppliedElement = reactionResult.newAppliedElement;
    }

    // 3. Apply Damage to Active Target
    let updatedDefenderChars = [...defenderState.characters];
    let shieldAbsorbed = 0;

    if (targetChar) {
       updatedDefenderChars = updatedDefenderChars.map(c => {
         if (c.id === targetChar.id) {
            // Check Shield Status on Target
            const shield = c.statuses.find(s => s.type === 'Shield');
            let hpDamage = finalDamage;
            let newStatuses = [...c.statuses];
            
            if (shield && hpDamage > 0) {
               const shieldVal = shield.value || 0;
               if (shieldVal >= hpDamage) {
                  shieldAbsorbed = hpDamage;
                  hpDamage = 0;
                  // Update Shield
                  newStatuses = newStatuses.map(s => s.type === 'Shield' ? {...s, value: shieldVal - finalDamage} : s).filter(s => (s.value || 0) > 0);
               } else {
                  shieldAbsorbed = shieldVal;
                  hpDamage -= shieldVal;
                  newStatuses = newStatuses.filter(s => s.type !== 'Shield');
               }
            }

            // Apply Reaction Status (Frozen, Burning, etc)
            if (reactionResult.statusToAdd) {
              const existingIdx = newStatuses.findIndex(s => s.type === reactionResult.statusToAdd!.type);
              if (existingIdx >= 0) {
                newStatuses[existingIdx] = reactionResult.statusToAdd!; // Refresh
              } else {
                newStatuses.push(reactionResult.statusToAdd!);
              }
            }

            return { 
              ...c, 
              currentHp: Math.max(0, c.currentHp - hpDamage), 
              isDefeated: Math.max(0, c.currentHp - hpDamage) === 0,
              appliedElement: newAppliedElement as ElementType | undefined, // Cast needed for strict TS
              statuses: newStatuses
            };
         }
         return c;
       });
    }

    // 4. Apply Bench Damage (Swirl/Electro-Charged)
    if (reactionResult.benchDamage && reactionResult.benchDamage > 0) {
       updatedDefenderChars = updatedDefenderChars.map(c => {
          if (c.id !== targetChar?.id && !c.isDefeated) {
             return { ...c, currentHp: Math.max(0, c.currentHp - reactionResult.benchDamage) };
          }
          return c;
       });
    }

    // 5. Update Attacker (Energy, Cost, Self Buffs)
    let updatedAttackerChars = attackerState.characters.map(c => {
      if (c.id === attackerState.activeCharacterId) {
         let newEnergy = c.currentEnergy;
         if (skill.type === SkillType.ElementalBurst) newEnergy = 0;
         else newEnergy = Math.min(c.maxEnergy, c.currentEnergy + 1);

         let newHp = c.currentHp;
         if (skill.heal) newHp = Math.min(c.maxHp, c.currentHp + skill.heal);

         // Add Shield (Crystallize) or Bloom Buff
         let newStatuses = [...c.statuses];
         
         if (reactionResult.shieldValue) {
            newStatuses.push({ type: 'Shield', duration: 2, value: reactionResult.shieldValue });
         }
         if (reactionResult.attackerBuff) {
            newStatuses.push(reactionResult.attackerBuff);
         }
         if (consumeDendroCore) {
            newStatuses = newStatuses.filter(s => s.type !== 'DendroCore');
         }

         return { ...c, currentHp: newHp, currentEnergy: newEnergy, statuses: newStatuses };
      }
      return c;
    });

    // 6. UI Feedback
    const effectDelay = skill.type === SkillType.ElementalBurst ? 1500 : 300;
    setTimeout(() => {
        if (targetChar) {
           if (finalDamage > 0 || shieldAbsorbed > 0) {
             soundManager.play('damage');
             const text = shieldAbsorbed > 0 ? `伤害 ${finalDamage} (盾挡${shieldAbsorbed})` : `伤害 ${finalDamage}`;
             showToast(`${skill.name}: ${text}`, 'damage');
           }
           if (reactionName) {
             // Trigger Visual Effect on Card
             const reactionConfig = REACTION_VISUALS[reactionName];
             if (reactionConfig) {
               setSkillEffect({ cardId: targetChar.id, config: reactionConfig });
               setTimeout(() => setSkillEffect(null), 1200);
             }

             setTimeout(() => showToast(`${reactionName}反应!`, 'reaction'), 100);
           }
        }
        log(`${isPlayer ? '你' : '对手'}使用了 ${skill.name}${reactionName ? ` -> ${reactionName}` : ''}`);
    }, effectDelay);

    // 7. Force Switch (Overload)
    let nextDefenderActiveId = defenderState.activeCharacterId;
    if (reactionResult.forceSwitch) {
       // Find next available character
       const available = updatedDefenderChars.filter(c => !c.isDefeated && c.id !== nextDefenderActiveId);
       if (available.length > 0) {
          nextDefenderActiveId = available[0].id; // Simple swap to next
          log("触发超载，强制切换角色！");
       }
    }

    // 8. Handle Defeated Active Char
    // If active char defeated, must swap
    const currentActiveDefender = updatedDefenderChars.find(c => c.id === nextDefenderActiveId);
    if (currentActiveDefender?.isDefeated) {
        const nextAlive = updatedDefenderChars.find(c => !c.isDefeated);
        if (nextAlive) nextDefenderActiveId = nextAlive.id;
    }

    // Check Win
    let winner = null;
    if (updatedDefenderChars.every(c => c.isDefeated)) {
       winner = isPlayer ? 'player' : 'enemy';
       soundManager.play(isPlayer ? 'win' : 'lose');
       setGameState(prev => ({...prev, phase: GamePhase.GameOver, winner}));
    }

    // Update State
    const newDice = attackerState.dice.filter((_, idx) => !paidDiceIndices.includes(idx));
    
    setGameState(prev => ({
      ...prev,
      [attackerKey]: { ...prev[attackerKey as 'player' | 'enemy'], characters: updatedAttackerChars, dice: newDice },
      [defenderKey]: { ...prev[defenderKey as 'player' | 'enemy'], characters: updatedDefenderChars, activeCharacterId: nextDefenderActiveId },
      turnPlayerId: defenderKey,
      winner,
      phase: winner ? GamePhase.GameOver : prev.phase
    }));
  };

  // --- Player Handlers ---

  const handlePlayerUseSkill = (skill: Skill) => {
    if (gameState.phase !== GamePhase.ActionPhase || gameState.turnPlayerId !== 'player') return;
    if (gameState.player.hasEndedRound) return;
    if (isSwitching) return;

    const activeChar = getActiveCharacter(gameState.player.characters, gameState.player.activeCharacterId);
    if (!activeChar) return;

    if (activeChar.statuses.some(s => s.type === 'Frozen')) {
      showToast("角色被冻结，无法行动!", 'info');
      // Option: allow ending round or switching, but not skills
      return;
    }

    if (skill.type === SkillType.ElementalBurst && activeChar.currentEnergy < (skill.cost.energy || 0)) {
      showToast("充能不足!", 'info');
      soundManager.play('click'); 
      return;
    }

    const { canPay, paidIndices } = checkCost(skill.cost, gameState.player.dice);
    if (!canPay) {
      showToast("骰子不足!", 'info');
      soundManager.play('click'); 
      return;
    }

    executeSkill('player', skill, paidIndices);
  };

  const handlePlayerEndRound = () => {
    if (gameState.phase !== GamePhase.ActionPhase || gameState.turnPlayerId !== 'player') return;
    soundManager.play('click');
    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, hasEndedRound: true },
      turnPlayerId: 'enemy'
    }));
    log("你结束了回合");
  };

  const handleSwitchCharacter = (charId: string) => {
    if (gameState.phase !== GamePhase.ActionPhase || gameState.turnPlayerId !== 'player') return;
    if (gameState.player.activeCharacterId === charId) return;
    if (isSwitching) return;

    const targetChar = gameState.player.characters.find(c => c.id === charId);
    if (targetChar?.isDefeated) {
      showToast("该角色已退场!", 'info');
      return;
    }

    const currentActive = getActiveCharacter(gameState.player.characters, gameState.player.activeCharacterId);
    // Frozen Logic: Can you switch if frozen? In TCG yes, costs 1 die. 
    // Logic remains standard cost.

    if (gameState.player.dice.length < 1) {
      showToast("需要 1 个骰子来切换角色!", 'info');
      return;
    }

    setIsSwitching(true);
    setCardAnim({ charId, type: 'switch' });
    soundManager.play('switch');

    setTimeout(() => {
      const dice = [...gameState.player.dice];
      let payIndex = dice.findIndex(d => d !== ElementType.Omni);
      if (payIndex === -1) payIndex = 0;
      const paidDie = dice.splice(payIndex, 1)[0]; 

      setGameState(prev => ({
        ...prev,
        player: { ...prev.player, activeCharacterId: charId, dice: dice },
        turnPlayerId: 'enemy'
      }));
      log(`你切换了角色 (消耗 ${paidDie})`);

      setTimeout(() => {
        setIsSwitching(false);
        setCardAnim(null);
      }, 300);
    }, 200);
  };

  const handleOpenManual = (tab: 'skills' | 'reactions' = 'reactions') => {
    soundManager.play('click');
    setManualTab(tab);
    setIsManualOpen(true);
  };

  if (gameState.phase === GamePhase.Init) return <IntroScreen onStart={handleGameStart} />;
  if (gameState.phase === GamePhase.SelectionPhase) return <CharacterSelectionScreen onConfirm={handleSelectionComplete} />;

  const activePlayerChar = getActiveCharacter(gameState.player.characters, gameState.player.activeCharacterId);
  if (!activePlayerChar) return <div className="text-white flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="h-screen w-full flex flex-col bg-slate-900 overflow-hidden relative">
      <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 p-4 flex flex-col items-center justify-center relative border-b border-slate-700">
         <div className="flex gap-4 justify-center items-end">
            {gameState.enemy.characters.map(char => (
              <CharacterCard 
                key={char.id} character={char} isActive={char.id === gameState.enemy.activeCharacterId} isEnemy={true}
                animationType={cardAnim?.charId === char.id ? cardAnim.type : undefined}
                effect={skillEffect?.cardId === char.id ? skillEffect.config : undefined}
              />
            ))}
         </div>
         <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-xs font-mono border border-slate-600">对手骰子: {gameState.enemy.dice.length}</div>
      </div>

      <div className="h-12 bg-slate-950 flex items-center justify-between px-4 text-xs font-mono border-y border-slate-700 z-10">
         <span className={gameState.turnPlayerId === 'player' ? 'text-green-400 animate-pulse' : 'text-gray-500'}>
           {gameState.turnPlayerId === 'player' ? '>> 你的回合' : '对手回合'}
         </span>
         
         <div className="flex items-center gap-4">
            <span className="text-slate-400">第 {gameState.roundNumber} 回合</span>
            <button 
              onClick={() => handleOpenManual('reactions')}
              className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center border border-slate-500 hover:bg-slate-600 transition-colors"
              title="游戏手册"
            >
              ?
            </button>
         </div>

         <div className="flex flex-col text-right"><span className="text-gray-500">{gameState.logs[0]}</span></div>
      </div>

      <div className="flex-[1.5] bg-slate-900 p-4 flex flex-col gap-4 relative">
        <div className="flex gap-4 justify-center items-start mb-2">
            {gameState.player.characters.map(char => (
              <CharacterCard 
                key={char.id} character={char} isActive={char.id === gameState.player.activeCharacterId}
                onClick={!isSwitching ? () => handleSwitchCharacter(char.id) : undefined}
                animationType={cardAnim?.charId === char.id ? cardAnim.type : undefined}
                effect={skillEffect?.cardId === char.id ? skillEffect.config : undefined}
              />
            ))}
        </div>
        <div className="flex-1 flex flex-col gap-2">
           <DiceTray dice={gameState.player.dice} canInteract={gameState.phase === GamePhase.RollPhase} />
           <div className={`flex-1 min-h-[120px] transition-opacity duration-200 ${isSwitching ? 'opacity-0' : 'opacity-100'}`}>
             <ActionPanel 
                activeCharacter={activePlayerChar} 
                dice={gameState.player.dice} 
                onUseSkill={handlePlayerUseSkill}
                onEndRound={handlePlayerEndRound}
                onViewSkillDetails={() => handleOpenManual('skills')}
                disabled={gameState.turnPlayerId !== 'player' || gameState.phase !== GamePhase.ActionPhase || gameState.player.hasEndedRound || isSwitching}
             />
           </div>
        </div>
      </div>

      {burstAnim && <BurstAnimation character={burstAnim.character} skillName={burstAnim.skillName} />}
      {toast && (
        <div className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-lg font-bold shadow-xl z-50 animate-bounce whitespace-nowrap
          ${toast.type === 'damage' ? 'bg-red-600 text-white text-2xl border-4 border-red-800' : 
            toast.type === 'reaction' ? 'bg-yellow-500 text-black text-2xl border-4 border-white' : 
            'bg-slate-700 text-white border border-slate-500'}
        `}>
          {toast.message}
        </div>
      )}
      {gameState.phase === GamePhase.GameOver && (
        <GameOverScreen winner={gameState.winner} onRestart={() => window.location.reload()} />
      )}
      {gameState.phase === GamePhase.RollPhase && <DiceRollOverlay roundNumber={gameState.roundNumber} onConfirm={handleRollComplete} />}
      
      {/* Game Manual Modal */}
      <GameManual 
        isOpen={isManualOpen} 
        onClose={() => setIsManualOpen(false)} 
        activeCharacter={activePlayerChar}
        initialTab={manualTab}
      />
    </div>
  );
}
