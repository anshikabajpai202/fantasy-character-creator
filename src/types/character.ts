export type CharacterClass = 'Mage' | 'Rogue' | 'Warrior' | 'Archer' | 'Paladin' | 'Necromancer';

export interface CharacterAttributes {
  strength: number;
  agility: number;
  arcana: number;
  vitality: number;
  wisdom: number;
  charisma: number;
}

export interface SignatureAbility {
  name: string;
  type: string;
  cost: string;
  description: string;
}

export interface Equipment {
  primaryWeapon: string;
  offhandOrFocus: string;
  armor: string;
  trinket: string;
}

export interface FantasyCharacter {
  id: string;
  name: string;
  title: string;
  characterClass: CharacterClass;
  race: string;
  alignment: string;
  level: number;
  attributes: CharacterAttributes;
  health: number; // Health stat
  hitPoints: number; // Compatibility
  mana: number; // Mana stat
  strength: number; // Strength stat
  armorClass: number;
  initiative: number;
  signatureAbility: SignatureAbility;
  equipment: Equipment;
  backstory: string;
  quote: string;
  portraitUrl: string;
  hasCustomPortrait?: boolean;
  portraitVariation?: number;
  portraitStyle?: 'painterly' | 'cartoon';
  createdAt: number;
}

export interface ClassMetadata {
  name: CharacterClass;
  tagline: string;
  primaryStat: keyof CharacterAttributes;
  accentColor: string;
  badgeBg: string;
  borderColor: string;
  glowColor: string;
  description: string;
  defaultPortrait: string;
  cartoonPortraits: string[];
}
