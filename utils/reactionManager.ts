
import { ElementType, StatusType } from '../types';

export interface ReactionResult {
  reactionName: string | null;
  finalDamage: number;
  removedElement: boolean; // Should the existing aura be removed?
  newAppliedElement: ElementType | null; // What element remains applied?
  
  // Side Effects
  forceSwitch?: boolean; // Overload
  benchDamage?: number; // Swirl, Electro-Charged
  shieldValue?: number; // Crystallize
  statusToAdd?: { type: StatusType; duration: number; value?: number }; // Burning, Frozen, etc.
  attackerBuff?: { type: StatusType; duration: number; value?: number }; // Bloom (DendroCore)
}

export const processReaction = (
  damage: number,
  incomingElement: ElementType, // From Skill/Burst. Normal Attacks are Physical.
  existingElement: ElementType | undefined, // The element on the target
  targetStatuses: any[] = [] // To check for existing debuffs like PhysResDown
): ReactionResult => {

  let result: ReactionResult = {
    reactionName: null,
    finalDamage: damage,
    removedElement: false,
    newAppliedElement: null,
  };

  // 1. Physical Attacks (Normal Attacks usually)
  // They generally don't apply elements and don't react with auras,
  // EXCEPT if Superconduct (PhysResDown) is active.
  if (incomingElement === ElementType.Physical) {
    const isPhysResDown = targetStatuses.some(s => s.type === 'PhysResDown');
    if (isPhysResDown) {
      result.finalDamage += 1; // "Increase damage" (interpreted as +1 or small boost)
      // result.reactionName = 'Superconduct (Effect)'; // Optional to show
    }
    // Physical does not apply element, does not remove element.
    result.newAppliedElement = existingElement || null;
    return result;
  }

  // 2. If no existing element, apply the new one (unless it's Anemo/Geo which usually don't stick)
  // Logic: Pyro, Hydro, Electro, Cryo, Dendro can stay. Anemo/Geo trigger reactions or fade.
  if (!existingElement) {
    if ([ElementType.Pyro, ElementType.Hydro, ElementType.Electro, ElementType.Cryo, ElementType.Dendro].includes(incomingElement)) {
      result.newAppliedElement = incomingElement;
    }
    return result;
  }

  // 3. REACTION LOGIC
  // We have Incoming Element + Existing Element
  const pair = [existingElement, incomingElement].sort().join('+');

  switch (pair) {
    // --- Amplifying Reactions ---
    
    // Vaporize (Hydro + Pyro)
    case 'Hydro+Pyro': 
      result.reactionName = '蒸发';
      result.finalDamage = Math.ceil(damage * 1.5); // +50%
      result.removedElement = true;
      break;

    // Melt (Cryo + Pyro)
    case 'Cryo+Pyro':
      result.reactionName = '融化';
      result.finalDamage = Math.ceil(damage * 1.7); // +70%
      result.removedElement = true;
      break;

    // --- Transformative / Special Reactions ---

    // Overloaded (Electro + Pyro)
    case 'Electro+Pyro':
      result.reactionName = '超载';
      result.finalDamage = Math.ceil(damage * 1.3); // +30%
      result.forceSwitch = true;
      result.removedElement = true;
      break;

    // Burning (Dendro + Pyro)
    case 'Dendro+Pyro':
      result.reactionName = '燃烧';
      result.statusToAdd = { type: 'Burning', duration: 2, value: 1 };
      result.removedElement = true; // Consumes initial aura to start burning state
      break;

    // Quicken (Dendro + Electro)
    case 'Dendro+Electro':
      result.reactionName = '激化';
      result.finalDamage = Math.ceil(damage * 1.5); // +50%
      result.removedElement = true;
      break;

    // Superconduct (Cryo + Electro)
    case 'Cryo+Electro':
      result.reactionName = '超导';
      result.statusToAdd = { type: 'PhysResDown', duration: 2 }; // Debuff target
      result.removedElement = true;
      break;

    // Electro-Charged (Electro + Hydro)
    case 'Electro+Hydro':
      result.reactionName = '感电';
      result.benchDamage = 1;
      result.removedElement = true;
      break;

    // Bloom (Dendro + Hydro)
    case 'Dendro+Hydro':
      result.reactionName = '绽放';
      // "Produce grass seed, increase next Pyro/Electro damage"
      // We apply a buff to the ATTACKER or a special status.
      result.attackerBuff = { type: 'DendroCore', duration: 2, value: 1 };
      result.removedElement = true;
      break;

    // Frozen (Cryo + Hydro)
    case 'Cryo+Hydro':
      result.reactionName = '冻结';
      result.statusToAdd = { type: 'Frozen', duration: 1 }; // 1 Round
      result.removedElement = true;
      break;

    default:
      // No specific reaction defined for this pair?
      // Check for Swirl and Crystallize which are "Element + Anemo/Geo"
      
      // Swirl (Anemo + Pyro/Hydro/Electro/Cryo)
      if (incomingElement === ElementType.Anemo && [ElementType.Pyro, ElementType.Hydro, ElementType.Electro, ElementType.Cryo].includes(existingElement)) {
        result.reactionName = '扩散';
        result.benchDamage = 1;
        result.removedElement = true;
      }
      // Crystallize (Geo + Pyro/Hydro/Electro/Cryo)
      else if (incomingElement === ElementType.Geo && [ElementType.Pyro, ElementType.Hydro, ElementType.Electro, ElementType.Cryo].includes(existingElement)) {
        result.reactionName = '结晶';
        result.shieldValue = 1;
        result.removedElement = true;
      }
      // If truly no interaction (e.g. Geo + Anemo), just apply damage, no new element (Geo/Anemo don't stick)
      else {
        // Overwrite? Or keep existing? 
        // Usually conflicting elements might coexist or overwrite. 
        // Simplifying: Keep existing if no reaction.
        result.newAppliedElement = existingElement;
      }
      break;
  }

  // Final check: If element was removed by reaction, newApplied is null.
  if (result.removedElement) {
    result.newAppliedElement = null;
  }

  return result;
};
