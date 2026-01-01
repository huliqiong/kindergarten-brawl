
export enum ElementType {
  Pyro = 'Pyro', // Fire
  Hydro = 'Hydro', // Water
  Electro = 'Electro', // Thunder
  Cryo = 'Cryo', // Ice
  Dendro = 'Dendro', // Grass
  Geo = 'Geo', // Rock
  Anemo = 'Anemo', // Wind
  Omni = 'Omni', // Universal
  Physical = 'Physical', // New: Physical for Normal Attacks
}

export enum SkillType {
  NormalAttack = 'Normal Attack',
  ElementalSkill = 'Elemental Skill',
  ElementalBurst = 'Elemental Burst',
}

export interface Cost {
  element: ElementType | 'Any'; 
  count: number;
  energy?: number;
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  description: string;
  damage: number;
  cost: Cost;
  heal?: number;
}

export type StatusType = 
  | 'Burning' 
  | 'Frozen' 
  | 'Shield' 
  | 'PhysResDown' // Superconduct
  | 'DendroCore'; // Bloom

export interface CharacterStatus {
  type: StatusType;
  duration: number; // Rounds remaining
  value?: number; // For Shield amount or Dmg bonus
}

export interface Character {
  id: string;
  name: string;
  element: ElementType;
  maxHp: number;
  currentHp: number;
  maxEnergy: number;
  currentEnergy: number;
  skills: Skill[];
  avatarUrl: string;
  isDefeated: boolean;
  // New State Fields
  appliedElement?: ElementType; // The element currently "hanging" on the character
  statuses: CharacterStatus[];
}

export interface PlayerState {
  id: string;
  name: string;
  characters: Character[];
  activeCharacterId: string; 
  dice: ElementType[];
  hasEndedRound: boolean;
}

export enum GamePhase {
  Init = 'Init',
  SelectionPhase = 'SelectionPhase',
  RollPhase = 'RollPhase',
  ActionPhase = 'ActionPhase',
  EndPhase = 'EndPhase',
  GameOver = 'GameOver',
}

export interface GameState {
  phase: GamePhase;
  turnPlayerId: string; 
  roundNumber: number;
  player: PlayerState;
  enemy: PlayerState;
  winner: string | null;
  logs: string[];
}
