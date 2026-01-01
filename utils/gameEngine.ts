import { ElementType, Character, Cost } from '../types';
import { MAX_DICE } from '../constants';

export const rollDice = (count: number): ElementType[] => {
  const elements = Object.values(ElementType).filter((e) => e !== ElementType.Omni); // Usually Omni isn't rolled directly in some versions, but let's include it for fun or exclude.
  // In TCG, Omni is a result of specific cards or Omni die face. The die has 8 faces: 7 elements + 1 Omni.
  const faces = Object.values(ElementType); 
  const result: ElementType[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * faces.length);
    result.push(faces[randomIndex]);
  }
  return result;
};

export const checkCost = (
  cost: Cost,
  dice: ElementType[]
): { canPay: boolean; paidIndices: number[] } => {
  if (cost.count === 0) return { canPay: true, paidIndices: [] };

  const paidIndices: number[] = [];
  const diceCopy = [...dice];

  // Strategy: 
  // 1. If cost element is specific, try to find matches or Omni.
  // 2. If cost element is 'Any' (unaligned), pick the largest group of same dice or just any dice? Usually unaligned requires *same* element in TCG for some cards, but for skills it's usually *any* black/white dice.
  // In Genshin TCG:
  // - Matching Element Cost: Needs Specific Element OR Omni.
  // - Unaligned Element Cost (Black): Needs Any Element (Omni works too).
  
  // NOTE: For this simplified version, skills usually define specific element cost.
  // Let's assume cost.element is NOT 'Any' for skills in this MVP (as per Constants).
  // Normal attacks usually cost 1 Specific + 2 Unaligned. 
  // My constants simplified Normal Attack to just 1 Specific for easier play in MVP.
  
  // Let's implement exact matching first.
  let needed = cost.count;
  
  // 1. Use Specific Dice first
  for (let i = 0; i < diceCopy.length; i++) {
    if (needed === 0) break;
    if (diceCopy[i] === cost.element && !paidIndices.includes(i)) {
      paidIndices.push(i);
      needed--;
    }
  }

  // 2. Use Omni Dice
  if (needed > 0) {
    for (let i = 0; i < diceCopy.length; i++) {
      if (needed === 0) break;
      if (diceCopy[i] === ElementType.Omni && !paidIndices.includes(i)) {
        paidIndices.push(i);
        needed--;
      }
    }
  }

  return { canPay: needed === 0, paidIndices };
};

export const getActiveCharacter = (characters: Character[], activeId: string): Character | undefined => {
  return characters.find(c => c.id === activeId);
};

export const isCharacterDefeated = (char: Character): boolean => {
  return char.currentHp <= 0;
};
