import { CharacterClass, FantasyCharacter, CharacterAttributes } from '../types/character';
import {
  CHARACTER_CLASSES,
  CLASS_METADATA,
  FIRST_NAMES,
  SURNAME_PREFIXES,
  SURNAME_SUFFIXES,
  TITLES,
  RACES,
  ALIGNMENTS,
  CLASS_ABILITIES,
  CLASS_EQUIPMENT,
  BACKSTORY_TEMPLATES,
  CHARACTER_QUOTES,
} from '../data/fantasyData';

function getRandomElement<T>(array: readonly T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

// Roll 4d6 and drop lowest (classic RPG ability score method)
function rollAttribute(bonus = 0): number {
  const rolls = [rollD6(), rollD6(), rollD6(), rollD6()].sort((a, b) => b - a);
  const total = rolls[0] + rolls[1] + rolls[2] + bonus;
  return Math.min(20, Math.max(8, total));
}

export function generateRandomName(): { fullName: string; title: string } {
  const firstName = getRandomElement(FIRST_NAMES);
  const surname = `${getRandomElement(SURNAME_PREFIXES)}${getRandomElement(SURNAME_SUFFIXES)}`;
  const title = Math.random() > 0.35 ? getRandomElement(TITLES) : '';
  const fullName = `${firstName} ${surname}`;
  return { fullName, title };
}

export function generateFantasyCharacter(options?: {
  forcedClass?: CharacterClass;
  level?: number;
}): FantasyCharacter {
  // Class randomly selected from Mage, Rogue, Warrior, Archer, Paladin, and Necromancer
  const characterClass: CharacterClass = options?.forcedClass || getRandomElement(CHARACTER_CLASSES);
  const { fullName, title } = generateRandomName();
  const race = getRandomElement(RACES);
  const alignment = getRandomElement(ALIGNMENTS);
  const level = options?.level || Math.floor(Math.random() * 5) + 1;

  // Class-weighted attributes
  const attributes: CharacterAttributes = {
    strength: rollAttribute(characterClass === 'Warrior' ? 4 : characterClass === 'Paladin' ? 3 : 0),
    agility: rollAttribute(characterClass === 'Rogue' ? 4 : characterClass === 'Archer' ? 4 : 0),
    arcana: rollAttribute(characterClass === 'Mage' ? 4 : characterClass === 'Necromancer' ? 4 : 0),
    vitality: rollAttribute(characterClass === 'Warrior' ? 3 : characterClass === 'Paladin' ? 4 : 1),
    wisdom: rollAttribute(characterClass === 'Paladin' ? 2 : characterClass === 'Mage' ? 3 : 0),
    charisma: rollAttribute(characterClass === 'Paladin' ? 3 : characterClass === 'Rogue' ? 2 : 0),
  };

  // Combat calculations
  const conMod = Math.floor((attributes.vitality - 10) / 2);
  const dexMod = Math.floor((attributes.agility - 10) / 2);
  const intMod = Math.floor((attributes.arcana - 10) / 2);

  const hitDiceMap: Record<CharacterClass, number> = {
    Warrior: 12,
    Paladin: 10,
    Archer: 10,
    Rogue: 8,
    Necromancer: 8,
    Mage: 6,
  };

  const baseHitDie = hitDiceMap[characterClass];
  const hitPoints = baseHitDie + conMod + (level - 1) * (Math.floor(baseHitDie / 2) + 1 + conMod);
  const mana = Math.max(20, (attributes.arcana + attributes.wisdom) * 2 + level * 5);

  const baseArmorClass: Record<CharacterClass, number> = {
    Warrior: 18,
    Paladin: 18,
    Archer: 15,
    Rogue: 14,
    Necromancer: 12,
    Mage: 11,
  };

  const armorClass = baseArmorClass[characterClass] + Math.max(0, dexMod);
  const initiative = dexMod;

  // Select ability, equipment, backstory, and quote
  const abilities = CLASS_ABILITIES[characterClass];
  const signatureAbility = getRandomElement(abilities);

  const equipmentPool = CLASS_EQUIPMENT[characterClass];
  const equipment = {
    primaryWeapon: getRandomElement(equipmentPool.weapons),
    offhandOrFocus: getRandomElement(equipmentPool.offhands),
    armor: getRandomElement(equipmentPool.armors),
    trinket: getRandomElement(equipmentPool.trinkets),
  };

  const backstory = getRandomElement(BACKSTORY_TEMPLATES[characterClass]);
  const quote = getRandomElement(CHARACTER_QUOTES[characterClass]);
  const portraitUrl = CLASS_METADATA[characterClass].defaultPortrait;

  const finalHealth = Math.max(12, hitPoints);

  return {
    id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: fullName,
    title,
    characterClass,
    race,
    alignment,
    level,
    attributes,
    health: finalHealth,
    hitPoints: finalHealth,
    mana,
    strength: attributes.strength,
    armorClass,
    initiative,
    signatureAbility,
    equipment,
    backstory,
    quote,
    portraitUrl,
    createdAt: Date.now(),
  };
}

const CLASS_STORY_TEMPLATES: Record<CharacterClass, Array<(name: string, cls: CharacterClass, race: string) => string>> = {
  Mage: [
    (name, cls, race) =>
      `${name} discovered their innate bond with the arcane weave as a young ${race}, when a shattered celestial crystal manifested spiraling cosmic flames around them. Now an accomplished ${cls}, they travel the realms unraveling primordial leylines and sealing dimensional fissures.`,
    (name, cls, race) =>
      `Expelled from the High Citadel for deciphering forbidden astral scriptures, ${name} embraced the solitary path of a wandering ${cls}. They now wield starlight and chronomancy to safeguard innocent folk from planar entities.`,
    (name, cls, race) =>
      `Born during the conjunction of twin azure stars, ${name} could hear the whispers of ancient spellcraft long before mastering the staff. As a brilliant ${cls}, their quest for lost arcane relics drives them into the deepest, most perilous ruins.`,
    (name, cls, race) =>
      `After an alchemical surge obliterated their master's workshop, ${name} salvaged a runic grimoire and vowed to master the weave alone. Today, this formidable ${cls} channels volatile raw sorcery to dismantle tyrant spells.`,
  ],
  Rogue: [
    (name, cls, race) =>
      `Orphaned in the subterranean labyrinth beneath the merchant port, ${name} survived by mastering silent footsteps and deadly precision. Now a legendary ${cls}, they strike with twin venomed blades before slipping back into the evening shadows.`,
    (name, cls, race) =>
      `Betrayed by an imperial guildmaster after discovering a crown conspiracy, ${name} dedicated their life to the shadow-arts of the ${cls}. They now sell their silence to worthy causes, exacting cold retribution from corrupt nobles.`,
    (name, cls, race) =>
      `Whispered across the taverns as a ghost of the cobblestones, ${name} has infiltrated impenetrable vaults that kings deemed safe. As an elusive ${cls}, they navigate the criminal underworld with razor wit and unmatched sleight of hand.`,
    (name, cls, race) =>
      `Raised by a renegade band of scouts, ${name} turned survival instincts into lethal artistry as a stealthy ${cls}. Their daggers never miss, and their name is spoken only in hushed, fearful tones by those with a guilty conscience.`,
  ],
  Warrior: [
    (name, cls, race) =>
      `${name} held the broken gateway of the Ironwatch Vanguard alone against a raging horde, earning honor etched in blood and scarred plate. As an indomitable ${cls}, their towering greatsword now safeguards refugees who cannot defend themselves.`,
    (name, cls, race) =>
      `A veteran gladiator who carved their way out of the merciless northern pits, ${name} knows the bitter taste of battle like no other. Today, this unyielding ${cls} stands as the unbreakable bulwark between civilized kingdoms and encroaching chaos.`,
    (name, cls, race) =>
      `Banished from their ancestral highland clan following a coup, ${name} took up their family's runed waraxe and swore a solemn oath of restitution. Operating as an elite frontline ${cls}, their battle roar sends terror into opposing ranks.`,
    (name, cls, race) =>
      `Trained from childhood in the relentless martial discipline of the legion, ${name} mastered every instrument of siege and melee combat. As a decorated ${cls}, they lead from the front with unbreakable resolve and tactical brilliance.`,
  ],
  Archer: [
    (name, cls, race) =>
      `Raised deep within the enchanted Whispering Boughs, ${name} learned to loose arrows through tempest gales without disturbing a single leaf. Now recognized as an extraordinary ${cls}, their hawk-eyed vigilance defends the frontier from monstrous incursions.`,
    (name, cls, race) =>
      `Exiled from the royal marksmen after refusing to loose arrows upon starving villagers, ${name} took to the untamed wilderness as an independent ${cls}. With their sylvan recurve bow, their piercing heartshots find their mark long before foes draw near.`,
    (name, cls, race) =>
      `Guided by an ancient bond with hunting falcons, ${name} maps the treacherous northern passes as the realm's foremost ${cls}. Their quiver never runs empty, and their keen instinct alerts allies to danger before twigs even snap.`,
    (name, cls, race) =>
      `${name} survived the scouring of the Great Woodland by climbing the elder pines and raining relentless steel upon the invaders. Revered as an untamed ${cls}, they now hunt dangerous bounties to fund the restoration of their homeland.`,
  ],
  Paladin: [
    (name, cls, race) =>
      `Upon the ruined altar of the First Dawn, ${name} took the sacred vow of the Sunbreak and was blessed with luminous solar grace. As a consecrated ${cls}, they hold their radiant aegis high against fiends, offering mercy to the penitent and righteous wrath to evil.`,
    (name, cls, race) =>
      `Once an inquisitor who rejected dogmatic cruelty, ${name} chose the pure path of the protective ${cls} to shield the innocent from both monsters and corrupted courts. Their golden blade burns with holy fire that cleanses cursed soil.`,
    (name, cls, race) =>
      `Anointed by the high priestesses after surviving a demonic siege, ${name} became a champion of the fallen and a sworn ${cls} of the Order. They march fearlessly through blighted wastelands, rekindling hope in hearts weighed down by despair.`,
    (name, cls, race) =>
      `Carrying a centuries-old sun-crested warhammer passed down through templar generations, ${name} embodies the divine oath of the ${cls}. Their presence on the battlefield inspires weary allies and shatters unholy curses.`,
  ],
  Necromancer: [
    (name, cls, race) =>
      `Delving into forbidden catacombs to cure a terminal soul-rot that claimed their village, ${name} unlocked the secrets of ancient bone-scripture. As a misunderstood ${cls}, they summon departed guardians to protect the living from extinction.`,
    (name, cls, race) =>
      `${name} was born with the uncanny ability to perceive departed souls trapped between planes, guiding them with a spectral lantern as a solemn ${cls}. They defy mortality not for tyranny, but to give restless spirits a final chance at redemption.`,
    (name, cls, race) =>
      `Keeper of the ancestral crypts beneath the High Spire, ${name} mastered the dark art of the ${cls} when tomb-raiders desecrated sacred resting grounds. With a wave of their ossuary staff, spectral sentinels rise to execute swift vengeance.`,
    (name, cls, race) =>
      `Having looked into the veil of the Great Void and returned with eerie soulflame in their veins, ${name} accepted their grim destiny as a master ${cls}. They harvest dark maledictions to wage war against corrupt warlords who fear death.`,
  ],
};

let lastStoryIndex = -1;

export function generateCustomBackstory(
  name: string,
  characterClass: CharacterClass,
  race: string = 'mortal'
): string {
  const templates = CLASS_STORY_TEMPLATES[characterClass] || CLASS_STORY_TEMPLATES.Warrior;
  let nextIndex = Math.floor(Math.random() * templates.length);
  if (templates.length > 1 && nextIndex === lastStoryIndex) {
    nextIndex = (nextIndex + 1) % templates.length;
  }
  lastStoryIndex = nextIndex;
  return templates[nextIndex](name, characterClass, race);
}

export function formatCharacterSheetText(character: FantasyCharacter): string {
  const { name, title, characterClass, race, alignment, level, attributes, hitPoints, mana, armorClass, signatureAbility, equipment, backstory, quote } = character;
  const fullTitleStr = title ? ` "${title}"` : '';

  return `=== FANTASY CHARACTER SHEET ===
Name: ${name}${fullTitleStr}
Class: ${characterClass} (Level ${level})
Race: ${race} · Alignment: ${alignment}

-- COMBAT STATISTICS --
HP: ${hitPoints} | Mana/Resource: ${mana} | Armor Class: ${armorClass} | Initiative: ${character.initiative >= 0 ? '+' : ''}${character.initiative}

-- CORE ATTRIBUTES --
Strength:     ${attributes.strength.toString().padStart(2, ' ')} [${Math.floor((attributes.strength - 10) / 2) >= 0 ? '+' : ''}${Math.floor((attributes.strength - 10) / 2)}]
Agility:      ${attributes.agility.toString().padStart(2, ' ')} [${Math.floor((attributes.agility - 10) / 2) >= 0 ? '+' : ''}${Math.floor((attributes.agility - 10) / 2)}]
Arcana:       ${attributes.arcana.toString().padStart(2, ' ')} [${Math.floor((attributes.arcana - 10) / 2) >= 0 ? '+' : ''}${Math.floor((attributes.arcana - 10) / 2)}]
Vitality:     ${attributes.vitality.toString().padStart(2, ' ')} [${Math.floor((attributes.vitality - 10) / 2) >= 0 ? '+' : ''}${Math.floor((attributes.vitality - 10) / 2)}]
Wisdom:       ${attributes.wisdom.toString().padStart(2, ' ')} [${Math.floor((attributes.wisdom - 10) / 2) >= 0 ? '+' : ''}${Math.floor((attributes.wisdom - 10) / 2)}]
Charisma:     ${attributes.charisma.toString().padStart(2, ' ')} [${Math.floor((attributes.charisma - 10) / 2) >= 0 ? '+' : ''}${Math.floor((attributes.charisma - 10) / 2)}]

-- SIGNATURE ABILITY --
${signatureAbility.name} (${signatureAbility.type} · ${signatureAbility.cost})
${signatureAbility.description}

-- EQUIPMENT --
Main Weapon: ${equipment.primaryWeapon}
Off-hand:    ${equipment.offhandOrFocus}
Armor:       ${equipment.armor}
Trinket:     ${equipment.trinket}

-- BACKSTORY --
${backstory}

-- QUOTE --
${quote}
===============================`;
}
