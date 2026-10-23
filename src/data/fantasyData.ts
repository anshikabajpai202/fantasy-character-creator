import { CharacterClass, ClassMetadata } from '../types/character';

// Original painterly concept portraits
import mageImg from '../assets/images/fantasy_mage_portrait_1792614977157.jpg';
import rogueImg from '../assets/images/fantasy_rogue_portrait_1792614979073.jpg';
import warriorImg from '../assets/images/fantasy_warrior_portrait_1792614978975.jpg';
import archerImg from '../assets/images/fantasy_archer_portrait_1792614979452.jpg';
import paladinImg from '../assets/images/fantasy_paladin_portrait_1792614980469.jpg';
import necromancerImg from '../assets/images/fantasy_necromancer_portrait_1792614980735.jpg';

// Cartoon video-game style portraits (Set 1)
import mageCartoon1 from '../assets/images/game_mage_cartoon_1792615418515.jpg';
import rogueCartoon1 from '../assets/images/game_rogue_cartoon_1792615419111.jpg';
import warriorCartoon1 from '../assets/images/game_warrior_cartoon_1792615419688.jpg';
import archerCartoon1 from '../assets/images/game_archer_cartoon_1792615420614.jpg';
import paladinCartoon1 from '../assets/images/game_paladin_cartoon_1792615421363.jpg';
import necromancerCartoon1 from '../assets/images/game_necromancer_cartoon_1792615420896.jpg';

// Cartoon video-game style portraits (Set 2 - Alternate variations)
import mageCartoon2 from '../assets/images/game_mage_cartoon_alt_1792615452983.jpg';
import rogueCartoon2 from '../assets/images/game_rogue_cartoon_alt_1792615453490.jpg';
import warriorCartoon2 from '../assets/images/game_warrior_cartoon_alt_1792615454506.jpg';
import archerCartoon2 from '../assets/images/game_archer_cartoon_alt_1792615455446.jpg';
import paladinCartoon2 from '../assets/images/game_paladin_cartoon_alt_1792615455782.jpg';
import necromancerCartoon2 from '../assets/images/game_necromancer_cartoon_alt_1792615456464.jpg';

export const CLASS_METADATA: Record<CharacterClass, ClassMetadata> = {
  Mage: {
    name: 'Mage',
    tagline: 'Master of Arcane Mysteries and Elemental Primordials',
    primaryStat: 'arcana',
    accentColor: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    description: 'Scholars of the primordial weave who bend reality, summon catastrophic storms, and pierce the veil of time with crystal focuses.',
    defaultPortrait: mageImg,
    cartoonPortraits: [mageCartoon1, mageCartoon2],
  },
  Rogue: {
    name: 'Rogue',
    tagline: 'Silent Assassin and Master of Infiltration',
    primaryStat: 'agility',
    accentColor: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    description: 'Lethal operatives who strike from gloom with twin blades, decipher ancient locks, and vanish into shadow before the alarm sounds.',
    defaultPortrait: rogueImg,
    cartoonPortraits: [rogueCartoon1, rogueCartoon2],
  },
  Warrior: {
    name: 'Warrior',
    tagline: 'Indomitable Vanguard and Iron Juggernaut',
    primaryStat: 'strength',
    accentColor: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.35)',
    glowColor: 'rgba(249, 115, 22, 0.25)',
    description: 'Hardened gladiators and veteran champions who command the frontline with heavy armor, bone-crushing steel, and unyielding grit.',
    defaultPortrait: warriorImg,
    cartoonPortraits: [warriorCartoon1, warriorWarrior2Fallback(warriorCartoon2)],
  },
  Archer: {
    name: 'Archer',
    tagline: 'Eagle-Eyed Warden of Sylvan Frontiers',
    primaryStat: 'agility',
    accentColor: '#84cc16',
    badgeBg: 'rgba(132, 204, 22, 0.12)',
    borderColor: 'rgba(132, 204, 22, 0.35)',
    glowColor: 'rgba(132, 204, 22, 0.25)',
    description: 'Pathfinders with unmatched precision who loose lethal volleys from impossible distances and commune with untamed wilderness.',
    defaultPortrait: archerImg,
    cartoonPortraits: [archerCartoon1, archerCartoon2],
  },
  Paladin: {
    name: 'Paladin',
    tagline: 'Holy Champion of Dawn and Protector of the Weak',
    primaryStat: 'vitality',
    accentColor: '#eab308',
    badgeBg: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    description: 'Sworn templars channeling solar radiance into blessed aegises, purifying corrupted lands, and shattering evil with luminous blades.',
    defaultPortrait: paladinImg,
    cartoonPortraits: [paladinCartoon1, paladinCartoon2],
  },
  Necromancer: {
    name: 'Necromancer',
    tagline: 'Lord of Tomb-Bones and Harrower of Souls',
    primaryStat: 'arcana',
    accentColor: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    description: 'Occultists wielding bone-lanterns and necromantic scripture to command spectral legions, drain lifeforce, and defy final death.',
    defaultPortrait: necromancerImg,
    cartoonPortraits: [necromancerCartoon1, necromancerCartoon2],
  },
};

function warriorWarrior2Fallback(img: string) {
  return img;
}

export const CHARACTER_CLASSES: CharacterClass[] = [
  'Mage',
  'Rogue',
  'Warrior',
  'Archer',
  'Paladin',
  'Necromancer',
];

export const FIRST_NAMES = [
  'Aeloria', 'Thorgar', 'Valen', 'Lyra', 'Malkor', 'Seraphina', 'Baelor',
  'Elysia', 'Gideon', 'Morrigan', 'Zephyr', 'Kaelen', 'Vespera', 'Draven',
  'Astrid', 'Corvus', 'Sylas', 'Rowan', 'Cassian', 'Isolde', 'Gareth',
  'Theron', 'Nyx', 'Oren', 'Finnian', 'Althea', 'Bran', 'Ignis', 'Evander',
  'Halia', 'Kallum', 'Mireille', 'Torvald', 'Yvaine', 'Ragnor', 'Rhiannon',
  'Cassandra', 'Darius', 'Elowen', 'Faelan', 'Gwyneira', 'Henrik', 'Iona',
];

export const SURNAME_PREFIXES = [
  'Storm', 'Iron', 'Shadow', 'Sun', 'Night', 'Frost', 'Silver', 'Blood',
  'Rune', 'Black', 'Oak', 'Dusk', 'Dawn', 'Ember', 'Stone', 'Mist',
  'Raven', 'Wolf', 'Deep', 'Ash', 'Star', 'Gold', 'Wild',
];

export const SURNAME_SUFFIXES = [
  'weaver', 'breaker', 'bane', 'blade', 'caller', 'whisper', 'ward', 'strider',
  'helm', 'born', 'fall', 'shield', 'gale', 'heart', 'forge', 'seeker',
  'guard', 'wood', 'flame', 'singer', 'claw', 'fang', 'watch',
];

export const TITLES = [
  'the Undaunted', 'the Spellbound', 'the Silent Blade', 'of the High Pass',
  'the Sunforged', 'the Gravewarden', 'the Moon-Eyed', 'of the Ashen Marches',
  'the Oathkeeper', 'the Phantom Hunter', 'the Stormbringer', 'the Unbroken',
  'of the Iron Spire', 'the Void-Seer', 'the Lionheart', 'the Whispering Wind',
  'the Pyrebinder', 'of the Emerald Deep', 'the Relic-Bearer', 'the Sovereign',
];

export const RACES = [
  'High Elf',
  'Mountain Dwarf',
  'Imperial Human',
  'Moon Elf',
  'Dragonborn',
  'Half-Orc',
  'Tiefling',
  'Wood Elf',
  'Deep Dwarf',
  'Aasimar',
];

export const ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
];

export const CLASS_ABILITIES: Record<CharacterClass, Array<{ name: string; type: string; cost: string; description: string }>> = {
  Mage: [
    { name: 'Arcane Nova', type: 'Evocation Spell', cost: '35 Mana', description: 'Unleashes a shockwave of azure cosmic flame, dealing severe area damage and shattering magical shields.' },
    { name: 'Chronoshift Stasis', type: 'Transmutation', cost: '40 Mana', description: 'Traps a targeted foe in a frozen second of time while accelerating nearby ally incantations.' },
    { name: 'Astral Meteor Swarm', type: 'Cataclysm Spell', cost: '60 Mana', description: 'Calls down three celestial shards that burn with astral light, stunning targets upon impact.' },
  ],
  Rogue: [
    { name: 'Shadow Dance', type: 'Active Technique', cost: '25 Energy', description: 'Steps through the umbral plane behind the adversary, delivering an unblockable critical strike.' },
    { name: 'Viper Strike', type: 'Venom Art', cost: '20 Energy', description: 'Coats daggers in spectral nightshade that progressively saps target armor and movement.' },
    { name: 'Smoke & Mirage', type: 'Tactical Deception', cost: '30 Energy', description: 'Discharges an alchemical smoke canister, producing decoys that redirect hostile spells.' },
  ],
  Warrior: [
    { name: 'Titan Whirlwind', type: 'Martial Stance', cost: '30 Stamina', description: 'Spins a massive two-handed weapon in a lethal circle, knocking back and dazing all surrounding foes.' },
    { name: 'Unbreakable Bastion', type: 'Iron Will', cost: '40 Stamina', description: 'Locks down in a heavy defensive stance, ignoring 65% of incoming damage for three combat rounds.' },
    { name: 'Sundering Cleave', type: 'Brutal Strike', cost: '25 Stamina', description: 'A devastating downwards chop that ruptures ground plates and permanently reduces enemy defense.' },
  ],
  Archer: [
    { name: 'Rain of Silver Needles', type: 'Volley Technique', cost: '30 Focus', description: 'Fires an arc of twenty enchanted bodkin arrows that blanket a 15-meter zone in piercing steel.' },
    { name: 'Piercing Heartshot', type: 'Precision Shot', cost: '35 Focus', description: 'Charges a hyper-focused shot through cover, bypassing all armor and causing severe bleeding.' },
    { name: 'Gale-Wing Retreat', type: 'Acrobatic Evade', cost: '20 Focus', description: 'Leaps twenty paces backwards on a summoned gust of wind while loosing two covering arrows.' },
  ],
  Paladin: [
    { name: 'Solar Smite', type: 'Divine Blessing', cost: '35 Faith', description: 'Channels blinding solar retribution into the warhammer, burning fiends and restoring ally vigor.' },
    { name: 'Aegis of the Dawn', type: 'Sacred Aura', cost: '45 Faith', description: 'Erects an impenetrable dome of golden light that deflects hostile projectiles and curses.' },
    { name: 'Judgment of the Just', type: 'Holy Decree', cost: '50 Faith', description: 'Summons a pillar of holy fire from above, purging debuffs from allies and incinerating undead.' },
  ],
  Necromancer: [
    { name: 'Grave Sovereign Pact', type: 'Soul Harvest', cost: '40 Soulflame', description: 'Extracts the lingering spirits of fallen warriors to construct skeletal sentinels bound to your command.' },
    { name: 'Withering Touch', type: 'Dark Malediction', cost: '30 Mana', description: 'Afflicts the target with tomb rot, leeching health directly back to the caster every second.' },
    { name: 'Banshee Wail', type: 'Terror Curse', cost: '45 Soulflame', description: 'Echoes the screech of ancient specters, inducing terror and reducing enemy magic resistance.' },
  ],
};

export const CLASS_EQUIPMENT: Record<CharacterClass, {
  weapons: string[];
  offhands: string[];
  armors: string[];
  trinkets: string[];
}> = {
  Mage: {
    weapons: ['Starlight Sapphire Staff', 'Aetherium Wand of Cinders', 'Runed Arcane Focus', 'Spire-Glass Scepter'],
    offhands: ['Grimoire of Endless Skies', 'Chrono-Astrolabe', 'Orb of Weave-Sight'],
    armors: ['Silken Astral Robes', 'Elderweave Mantle', 'Spell-Embroidered Vestments'],
    trinkets: ['Pendant of the Silver Moon', 'Ring of Unstable Leylines', 'Chronometer of Aethel'],
  },
  Rogue: {
    weapons: ['Twin Shadowsteel Stilettos', 'Ghost-Forged Dirk', 'Venomous Damascus Blades', 'Kopis of the Night'],
    offhands: ['Alchemical Smoke Flasks', 'Parrying Main-Gauche', 'Weighted Throwing Stars'],
    armors: ['Midnight Leather Cuirass', 'Gloomveil Shadow-Cloak', 'Supple Chimera Vest'],
    trinkets: ['Lockpick of the Guildmaster', 'Scorpion Eye Brooch', 'Ring of Featherfall'],
  },
  Warrior: {
    weapons: ['Titan Iron Greatsword', 'Runed Battleaxe of the Deep', 'Valyrian Bastard Sword', 'Dwarven War Flail'],
    offhands: ['Tower Shield of the Wall', 'Spiked Iron Buckler', 'Reinforced Crest Shield'],
    armors: ['Adamantine Plate Mail', 'Battlescarred Lion Armor', 'Dragon-Scale Harness'],
    trinkets: ['Whetstone of the Mountain King', 'Insignia of the First Legion', 'Horn of Valor'],
  },
  Archer: {
    weapons: ['Sylvan Heartwood Longbow', 'Windrunner Composite Bow', 'Phoenix-Feather Recurve', 'Elder Yew Crossbow'],
    offhands: ['Quiver of Endless Thorns', 'Moon-Blessed Broadheads', 'Hunting Hawk Gauntlet'],
    armors: ['Forest Camouflage Hauberk', 'Supple Hunter Brigandine', 'Feathered Ranger Cloak'],
    trinkets: ['Compass of the Lost Trail', 'Hawk Eye Talisman', 'Carved Wooden Wolf Totem'],
  },
  Paladin: {
    weapons: ['Sunblade of the Morning', 'Gilded Dawn Great-Hammer', 'Radiant Silver Longsword', 'Holy Justiciar Mace'],
    offhands: ['Aegis of the Suncrest', 'Reliquary of the Blessed Saint', 'Shield of Righteous Light'],
    armors: ['Mirrored Dawn Plate Armor', 'Consecrated Gold-Trim Mail', 'Silver Cloak of the Order'],
    trinkets: ['Holy Water of the First Well', 'Rosary of Golden Dawn', 'Seal of the Templar Grandmaster'],
  },
  Necromancer: {
    weapons: ['Soul-Iron Scythe', 'Staff of the Weeping Crypt', 'Bone-Carved Wand', 'Grimoire of the Harrowed'],
    offhands: ['Spectral Soul-Lantern', 'Ossuary Skull Focus', 'Blackened Ash Phylactery'],
    armors: ['Bone-Inlaid Grave Robes', 'Shroud of the Silent Tomb', 'Vestments of the Pale King'],
    trinkets: ['Onyx Soul Gem', 'Tomb-Soil Amulet', 'Ring of the Bleeding Crypt'],
  },
};

export const BACKSTORY_TEMPLATES: Record<CharacterClass, string[]> = {
  Mage: [
    'Expelled from the Citadel for deciphering forbidden celestial texts, they now wander the frontier seeking lost remnants of the First Cataclysm.',
    'Born under an eclipse of twin comets, their veins pulse with raw primal weave that crackles whenever danger draws near.',
    'Former high archivist of the Sunken Spire, they journey to seal tears between mortal planes before ancient entities breach the threshold.',
  ],
  Rogue: [
    'Orphaned in the under-tunnels of the Merchant Haven, they mastered the art of vanishing and now sell their silent daggers to the highest bidder.',
    'Betrayed by their criminal syndicate after uncovering an imperial conspiracy, they operate exclusively in shadows to extract cold retribution.',
    'A legendary cat burglar turned wandering contract seeker, whispered to have once slipped into the High King’s bedchamber to leave a mocking coin.',
  ],
  Warrior: [
    'The sole survivor of the Ironwatch Vanguard that held the bridge against a horde, bearing honor and scarred iron into every clash.',
    'A veteran gladiator who purchased freedom in blood, now wielding their great blade to safeguard refugees who cannot defend themselves.',
    'Banished heir of a fallen northern clan, fighting through every kingdom to gather strength and reclaim their ancestral stronghold.',
  ],
  Archer: [
    'Guardian of the Whispering Boughs, trained from childhood to loose arrows through tempest winds without disturbing a single leaf.',
    'A frontier scout who mapped the forbidden Wyrmwood mountains, hunting beasts that threaten peaceful frontier settlements.',
    'Exiled from the royal archery corps after refusing to loose arrows upon starving peasants, now championing common folk.',
  ],
  Paladin: [
    'Took the solemn Vow of the Sunbreak upon the ruined altars of Sol, swearing never to rest while shadow terrorizes innocent souls.',
    'Anointed as a living shield by the high priestesses, carrying celestial radiance through the darkest blightlands.',
    'A former inquisitor who rejected fanatic dogma to champion true compassion, healing the broken while smiting unrepentant evil.',
  ],
  Necromancer: [
    'Delved into forbidden ossuaries seeking a way to cure terminal soul-blight, embracing the chill of death to protect the living.',
    'Keeper of the ancestral catacombs whose lantern speaks in forgotten whispers of ancient heroes eager for one more glorious battle.',
    'A solitary occultist who understands that death is not an ending, but a second soldier waiting for the call to march.',
  ],
};

export const CHARACTER_QUOTES: Record<CharacterClass, string[]> = {
  Mage: [
    '"Reality is merely a tapestry waiting for an educated hand to unravel its threads."',
    '"Knowledge without audacity is dust; I prefer my discoveries ignited in starlight."',
    '"Stand back. The weave has a temper today."',
  ],
  Rogue: [
    '"The loudest noise in this hall will be the sound of your coin purse hitting my floor."',
    '"You cannot guard against a shadow that has already slipped behind your spine."',
    '"A locked door is merely an invitation written in iron."',
  ],
  Warrior: [
    '"Steel does not lie. When the roar of battle begins, truth is forged in iron."',
    '"I have survived mountains collapsing and armies advancing; you will not move me."',
    '"Hold the line! Behind us is everything we fight for!"',
  ],
  Archer: [
    '"Before your blade leaves its scabbard, my shaft will already have found its home."',
    '"Listen to the pines—they know where the quarry hides."',
    '"One arrow. One breath. No regrets."',
  ],
  Paladin: [
    '"While a single spark of morning remains, the darkness will find no quarter here."',
    '"My shield is for the defenseless; my blade is for the tyrant."',
    '"Face the dawn, fiend, and answer for your trespasses."',
  ],
  Necromancer: [
    '"Death is not the enemy—it is merely the most loyal army you will ever command."',
    '"Listen closely to the soil; your ancestors are screaming for vengeance."',
    '"The grave offers quiet, but duty demands resurrection."',
  ],
};
