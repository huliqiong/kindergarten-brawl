
import { Character, ElementType, SkillType, StatusType } from './types';

export const MAX_DICE = 8;

export const ELEMENT_COLORS: Record<ElementType, string> = {
  [ElementType.Pyro]: 'text-red-500 bg-red-50 border-red-300',
  [ElementType.Hydro]: 'text-blue-500 bg-blue-50 border-blue-300',
  [ElementType.Electro]: 'text-purple-500 bg-purple-50 border-purple-300',
  [ElementType.Cryo]: 'text-cyan-500 bg-cyan-50 border-cyan-300',
  [ElementType.Dendro]: 'text-green-500 bg-green-50 border-green-300',
  [ElementType.Geo]: 'text-amber-600 bg-amber-50 border-amber-300',
  [ElementType.Anemo]: 'text-teal-500 bg-teal-50 border-teal-300',
  [ElementType.Omni]: 'text-slate-500 bg-slate-100 border-slate-300',
  [ElementType.Physical]: 'text-gray-500 bg-gray-100 border-gray-300',
};

// ... (Existing Backgrounds and Patterns remain unchanged, just re-exporting them) ...
export const ELEMENT_CARD_BGS: Record<ElementType, string> = {
  [ElementType.Pyro]: 'bg-gradient-to-b from-orange-100 to-rose-200',
  [ElementType.Hydro]: 'bg-gradient-to-b from-sky-100 to-blue-200',
  [ElementType.Electro]: 'bg-gradient-to-b from-fuchsia-100 to-violet-200',
  [ElementType.Cryo]: 'bg-gradient-to-b from-cyan-50 to-sky-100',
  [ElementType.Dendro]: 'bg-gradient-to-b from-lime-100 to-green-200',
  [ElementType.Geo]: 'bg-gradient-to-b from-yellow-100 to-amber-200',
  [ElementType.Anemo]: 'bg-gradient-to-b from-emerald-50 to-teal-100',
  [ElementType.Omni]: 'bg-gradient-to-b from-gray-50 to-slate-200',
  [ElementType.Physical]: 'bg-gray-200',
};

export const ELEMENT_BG_PATTERNS: Record<ElementType, React.CSSProperties> = {
  [ElementType.Pyro]: { backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 2px, transparent 2px)', backgroundSize: '16px 16px' },
  [ElementType.Hydro]: { backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 15%, transparent 16%), radial-gradient(rgba(255,255,255,0.5) 15%, transparent 16%)', backgroundSize: '24px 24px', backgroundPosition: '0 0, 12px 12px' },
  [ElementType.Electro]: { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.4) 10px, rgba(255, 255, 255, 0.4) 20px)' },
  [ElementType.Cryo]: { backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '16px 16px' },
  [ElementType.Dendro]: { backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 2px, transparent 2.5px)', backgroundSize: '12px 12px' },
  [ElementType.Geo]: { backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.4) 75%, transparent 75%, transparent)', backgroundSize: '24px 24px' },
  [ElementType.Anemo]: { backgroundImage: 'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.5), transparent 70%)' },
  [ElementType.Omni]: { backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '8px 8px' },
  [ElementType.Physical]: {},
};

export const ELEMENT_ICONS: Record<ElementType, string> = {
  [ElementType.Pyro]: '🔥',
  [ElementType.Hydro]: '💧',
  [ElementType.Electro]: '⚡',
  [ElementType.Cryo]: '❄️',
  [ElementType.Dendro]: '🌿',
  [ElementType.Geo]: '🪨',
  [ElementType.Anemo]: '🌪️',
  [ElementType.Omni]: '✨',
  [ElementType.Physical]: '⚔️',
};

export const STATUS_ICONS: Record<StatusType, string> = {
  'Burning': '🔥',
  'Frozen': '🧊',
  'Shield': '🛡️',
  'PhysResDown': '💔',
  'DendroCore': '🌱',
};

export interface VisualEffectConfig {
  icon: string;
  color: string;
  animation: string;
  label?: string; // New field for reaction name
}

export const REACTION_VISUALS: Record<string, VisualEffectConfig> = {
  '蒸发': { icon: '♨️', color: 'text-orange-500', animation: 'animate-effect-pop', label: '蒸发' },
  '融化': { icon: '💧', color: 'text-red-400', animation: 'animate-effect-pop', label: '融化' },
  '超载': { icon: '💥', color: 'text-red-600', animation: 'animate-effect-shake', label: '超载' },
  '燃烧': { icon: '🔥', color: 'text-orange-600', animation: 'animate-pulse', label: '燃烧' },
  '激化': { icon: '⚡', color: 'text-green-400', animation: 'animate-effect-pop', label: '激化' },
  '超导': { icon: '❄️', color: 'text-purple-300', animation: 'animate-effect-pop', label: '超导' },
  '感电': { icon: '⚡', color: 'text-purple-500', animation: 'animate-effect-shake', label: '感电' },
  '绽放': { icon: '🌱', color: 'text-green-500', animation: 'animate-effect-pop', label: '绽放' },
  '冻结': { icon: '🧊', color: 'text-cyan-300', animation: 'animate-effect-pop', label: '冻结' },
  '扩散': { icon: '🌀', color: 'text-teal-400', animation: 'animate-spin-fast', label: '扩散' },
  '结晶': { icon: '💎', color: 'text-yellow-500', animation: 'animate-effect-pop', label: '结晶' },
};

// Maps Skill ID suffix (e.g. mzq_1) to visual effect
export const SKILL_VISUALS: Record<string, VisualEffectConfig> = {
  // Moziqin
  mzq_1: { icon: '💥', color: 'text-gray-200', animation: 'animate-effect-pop' }, // Flip
  mzq_2: { icon: '💤', color: 'text-blue-200', animation: 'animate-effect-float' }, // Sleep
  // Tiantian
  tt_1: { icon: '🦶', color: 'text-yellow-200', animation: 'animate-effect-pop' }, // Knee
  tt_2: { icon: '🌪️', color: 'text-green-200', animation: 'animate-spin-fast' }, // Drill
  // Paimon
  pm_1: { icon: '💢', color: 'text-red-500', animation: 'animate-effect-pop' }, // Nickname
  pm_2: { icon: '🍬', color: 'text-pink-400', animation: 'animate-bounce' }, // Eat
  // Nefer
  nf_1: { icon: '🪙', color: 'text-yellow-400', animation: 'animate-spin-fast' }, // Coin
  nf_2: { icon: '✨', color: 'text-yellow-200', animation: 'animate-pulse' }, // Show off
  // Qianqian
  qq_1: { icon: '🦷', color: 'text-white', animation: 'animate-effect-pop' }, // Bite
  qq_2: { icon: '🐕', color: 'text-amber-600', animation: 'animate-effect-shake' }, // Mad dog
  // Diluc
  dlk_1: { icon: '⚔️', color: 'text-gray-400', animation: 'animate-effect-slash' }, // Claymore
  dlk_2: { icon: '🔥', color: 'text-red-600', animation: 'animate-effect-pop' }, // Fire
  // Bennett
  bnt_1: { icon: '👍', color: 'text-orange-500', animation: 'animate-bounce' }, // Lucky
  bnt_2: { icon: '🔥', color: 'text-red-500', animation: 'animate-effect-pop' }, // Overload
  // Citlali
  ctl_1: { icon: '🛌', color: 'text-blue-200', animation: 'animate-effect-float' }, // Pillow
  ctl_2: { icon: '❄️', color: 'text-cyan-400', animation: 'animate-pulse' }, // Chill
  // Raiden
  rdn_1: { icon: '⚡', color: 'text-purple-400', animation: 'animate-effect-slash' }, // Slash
  rdn_2: { icon: '👁️', color: 'text-purple-600', animation: 'animate-effect-pop' }, // Eye
};

export const CHARACTERS_DB: Character[] = [
  // 1. 七七 (原莫子琴) - 懒惰 (冰) -> Qiqi
  {
    id: 'moziqin',
    name: '七七',
    element: ElementType.Cryo,
    maxHp: 12,
    currentHp: 12,
    maxEnergy: 3,
    currentEnergy: 0,
    isDefeated: false,
    statuses: [],
    avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_Side_Qiqi.png',
    skills: [
      {
        id: 'mzq_1',
        name: '翻身',
        type: SkillType.NormalAttack,
        description: '不情愿地翻了个身，利用惯性撞击对手。造成 2 点物理伤害。',
        damage: 2,
        cost: { element: ElementType.Cryo, count: 1 }, 
      },
      {
        id: 'mzq_2',
        name: '呼呼大睡',
        type: SkillType.ElementalSkill,
        description: '进入深度睡眠模式，完全无视周围的战斗。通过休息恢复 3 点生命值。',
        damage: 0,
        heal: 3,
        cost: { element: ElementType.Cryo, count: 2 },
      },
      {
        id: 'mzq_3',
        name: '泰山压顶',
        type: SkillType.ElementalBurst,
        description: '像雪崩一样压向对手！造成 6 点冰元素伤害。',
        damage: 6,
        cost: { element: ElementType.Cryo, count: 4, energy: 3 },
      },
    ],
  },
  // 2. 早柚 - 矮小、灵活 (风) -> Sayu
  {
    id: 'tiantian',
    name: '早柚',
    element: ElementType.Anemo,
    maxHp: 8,
    currentHp: 8,
    maxEnergy: 2,
    currentEnergy: 0,
    isDefeated: false,
    statuses: [],
    avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_Side_Sayu.png',
    skills: [
      {
        id: 'tt_1',
        name: '跳起来打膝盖',
        type: SkillType.NormalAttack,
        description: '造成 2 点物理伤害。',
        damage: 2,
        cost: { element: ElementType.Anemo, count: 1 },
      },
      {
        id: 'tt_2',
        name: '钻裤裆',
        type: SkillType.ElementalSkill,
        description: '造成 3 点风元素伤害。',
        damage: 3,
        cost: { element: ElementType.Anemo, count: 2 },
      },
      {
        id: 'tt_3',
        name: '无敌风火轮',
        type: SkillType.ElementalBurst,
        description: '造成 5 点风元素伤害。',
        damage: 5,
        cost: { element: ElementType.Anemo, count: 3, energy: 2 },
      },
    ],
  },
  // 3. 派蒙 (水)
  {
    id: 'paimon',
    name: '派蒙',
    element: ElementType.Hydro,
    maxHp: 10,
    currentHp: 10,
    maxEnergy: 3,
    currentEnergy: 0,
    isDefeated: false,
    statuses: [],
    avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_Side_Sigewinne.png',
    skills: [
      {
        id: 'pm_1',
        name: '难听的绰号',
        type: SkillType.NormalAttack,
        description: '造成 2 点物理伤害。',
        damage: 2,
        cost: { element: ElementType.Hydro, count: 1 },
      },
      {
        id: 'pm_2',
        name: '进食时间',
        type: SkillType.ElementalSkill,
        description: '造成 1 点水元素伤害，治疗 2 点。',
        damage: 1,
        heal: 2,
        cost: { element: ElementType.Hydro, count: 2 },
      },
      {
        id: 'pm_3',
        name: '精神污染',
        type: SkillType.ElementalBurst,
        description: '造成 6 点水元素伤害。',
        damage: 6,
        cost: { element: ElementType.Hydro, count: 3, energy: 3 },
      },
    ],
  },
  // 4. 凝光 (原奈芙尔) (岩) -> Ningguang
  {
    id: 'nefer',
    name: '凝光',
    element: ElementType.Geo,
    maxHp: 10,
    currentHp: 10,
    maxEnergy: 3,
    currentEnergy: 0,
    isDefeated: false,
    statuses: [],
    avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_Side_Ningguang.png',
    skills: [
      {
        id: 'nf_1',
        name: '扔硬币',
        type: SkillType.NormalAttack,
        description: '造成 2 点物理伤害。',
        damage: 2,
        cost: { element: ElementType.Geo, count: 1 },
      },
      {
        id: 'nf_2',
        name: '我有钱',
        type: SkillType.ElementalSkill,
        description: '造成 3 点岩元素伤害。',
        damage: 3,
        cost: { element: ElementType.Geo, count: 2 },
      },
      {
        id: 'nf_3',
        name: '钞能力',
        type: SkillType.ElementalBurst,
        description: '造成 7 点岩元素伤害。',
        damage: 7,
        cost: { element: ElementType.Geo, count: 4, energy: 3 },
      },
    ],
  },
  // 5. 钱钱 (草) -> Gorou
  {
    id: 'qianqian',
    name: '钱钱',
    element: ElementType.Dendro,
    maxHp: 9,
    currentHp: 9,
    maxEnergy: 2,
    currentEnergy: 0,
    isDefeated: false,
    statuses: [],
    avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_Side_Gorou.png',
    skills: [
      {
        id: 'qq_1',
        name: '汪！',
        type: SkillType.NormalAttack,
        description: '造成 2 点物理伤害。',
        damage: 2,
        cost: { element: ElementType.Dendro, count: 1 },
      },
      {
        id: 'qq_2',
        name: '恶犬扑食',
        type: SkillType.ElementalSkill,
        description: '造成 4 点草元素伤害。',
        damage: 4,
        cost: { element: ElementType.Dendro, count: 2 },
      },
      {
        id: 'qq_3',
        name: '狂犬病发作',
        type: SkillType.ElementalBurst,
        description: '造成 6 点草元素伤害。',
        damage: 6,
        cost: { element: ElementType.Dendro, count: 3, energy: 2 },
      },
    ],
  },
  // 6. 迪卢克 (火)
  {
    id: 'diluc',
    name: '迪卢克',
    element: ElementType.Pyro,
    maxHp: 10,
    currentHp: 10,
    maxEnergy: 3,
    currentEnergy: 0,
    isDefeated: false,
    statuses: [],
    avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_Side_Diluc.png',
    skills: [
      {
        id: 'dlk_1',
        name: '大剑普攻',
        type: SkillType.NormalAttack,
        description: '造成 2 点物理伤害。',
        damage: 2,
        cost: { element: ElementType.Pyro, count: 1 },
      },
      {
        id: 'dlk_2',
        name: '逆焰之刃',
        type: SkillType.ElementalSkill,
        description: '造成 2 点火元素伤害。',
        damage: 2,
        cost: { element: ElementType.Pyro, count: 2 },
      },
      {
        id: 'dlk_3',
        name: '黎明',
        type: SkillType.ElementalBurst,
        description: '造成 4 点火元素伤害。',
        damage: 4,
        cost: { element: ElementType.Pyro, count: 3, energy: 3 },
      },
    ],
  },
  // 7. 班尼特 (火)
  {
    id: 'bennett',
    name: '班尼特',
    element: ElementType.Pyro,
    maxHp: 10,
    currentHp: 10,
    maxEnergy: 2,
    currentEnergy: 0,
    isDefeated: false,
    statuses: [],
    avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_Side_Bennett.png',
    skills: [
      {
        id: 'bnt_1',
        name: '好运一击?',
        type: SkillType.NormalAttack,
        description: '造成 2 点物理伤害。',
        damage: 2,
        cost: { element: ElementType.Pyro, count: 1 },
      },
      {
        id: 'bnt_2',
        name: '热情过载',
        type: SkillType.ElementalSkill,
        description: '造成 3 点火元素伤害。',
        damage: 3,
        cost: { element: ElementType.Pyro, count: 2 },
      },
      {
        id: 'bnt_3',
        name: '美妙旅程',
        type: SkillType.ElementalBurst,
        description: '造成 3 点火元素伤害，治疗 2 点。',
        damage: 3,
        heal: 2,
        cost: { element: ElementType.Pyro, count: 3, energy: 2 },
      },
    ],
  },
  // 8. 洗特辣里 (冰)
  {
    id: 'citlali',
    name: '洗特辣里',
    element: ElementType.Cryo,
    maxHp: 10,
    currentHp: 10,
    maxEnergy: 3,
    currentEnergy: 0,
    isDefeated: false,
    statuses: [],
    avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_Side_Layla.png',
    skills: [
      {
        id: 'ctl_1',
        name: '枕头拍打',
        type: SkillType.NormalAttack,
        description: '造成 2 点物理伤害。',
        damage: 2,
        cost: { element: ElementType.Cryo, count: 1 },
      },
      {
        id: 'ctl_2',
        name: '急冻甚至',
        type: SkillType.ElementalSkill,
        description: '造成 3 点冰元素伤害。',
        damage: 3,
        cost: { element: ElementType.Cryo, count: 2 },
      },
      {
        id: 'ctl_3',
        name: '起床气',
        type: SkillType.ElementalBurst,
        description: '造成 6 点冰元素伤害。',
        damage: 6,
        cost: { element: ElementType.Cryo, count: 3, energy: 3 },
      },
    ],
  },
  // 9. 雷神 (雷)
  {
    id: 'raiden',
    name: '雷神',
    element: ElementType.Electro,
    maxHp: 10,
    currentHp: 10,
    maxEnergy: 3,
    currentEnergy: 0,
    isDefeated: false,
    statuses: [],
    avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_Side_Shougun.png',
    skills: [
      {
        id: 'rdn_1',
        name: '源流',
        type: SkillType.NormalAttack,
        description: '造成 2 点物理伤害。',
        damage: 2,
        cost: { element: ElementType.Electro, count: 1 },
      },
      {
        id: 'rdn_2',
        name: '恶曜开眼',
        type: SkillType.ElementalSkill,
        description: '造成 3 点雷元素伤害。',
        damage: 3,
        cost: { element: ElementType.Electro, count: 2 },
      },
      {
        id: 'rdn_3',
        name: '无想的一刀',
        type: SkillType.ElementalBurst,
        description: '造成 8 点雷元素伤害。',
        damage: 8,
        cost: { element: ElementType.Electro, count: 4, energy: 3 },
      },
    ],
  },
];

export const getInitialCharacters = (prefix: string, indices: number[]): Character[] => {
  return indices.map(index => {
    const c = CHARACTERS_DB[index];
    return {
      ...c,
      id: `${prefix}_${c.id}`,
      skills: c.skills.map(s => ({...s, id: `${prefix}_${s.id}`})),
      statuses: [], // Ensure status array is initialized
      appliedElement: undefined,
    };
  });
};
