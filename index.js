const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Load game data
const loadGameData = () => {
  try {
    const weapons = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'weapons.json'), 'utf8'));
    const enemies = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'enemies.json'), 'utf8'));
    const builds = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'builds.json'), 'utf8'));
    const gadgets = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'gadgets.json'), 'utf8'));
    const guides = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'guides.json'), 'utf8'));

    return { weapons, enemies, builds, gadgets, guides };
  } catch (error) {
    console.error('Error loading game data:', error);
    process.exit(1);
  }
};

const gameData = loadGameData();

// Command prefix
const PREFIX = '!arc';

// Bot ready event
client.once('ready', () => {
  console.log(`✅ ${client.user.tag} is online!`);
  console.log(`📊 Serving ${client.guilds.cache.size} servers`);

  // Set bot status
  client.user.setActivity('!arc help | ARC Raiders Guide', { type: ActivityType.Playing });
});

// Message handler
client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check for prefix
  if (!message.content.toLowerCase().startsWith(PREFIX)) return;

  // Parse command and arguments
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  try {
    // Handle commands
    switch (command) {
      case 'help':
        await handleHelp(message);
        break;

      case 'weapon':
      case 'w':
        await handleWeapon(message, args);
        break;

      case 'weapons':
        await handleWeaponsList(message, args);
        break;

      case 'enemy':
      case 'arc':
      case 'e':
        await handleEnemy(message, args);
        break;

      case 'enemies':
        await handleEnemiesList(message);
        break;

      case 'build':
      case 'loadout':
      case 'b':
        await handleBuild(message, args);
        break;

      case 'builds':
      case 'loadouts':
        await handleBuildsList(message);
        break;

      case 'gadget':
      case 'item':
      case 'g':
        await handleGadget(message, args);
        break;

      case 'gadgets':
      case 'items':
        await handleGadgetsList(message, args);
        break;

      case 'guide':
        await handleGuide(message, args);
        break;

      case 'guides':
        await handleGuidesList(message);
        break;

      case 'tips':
      case 'tip':
        await handleTips(message);
        break;

      case 'search':
        await handleSearch(message, args);
        break;

      default:
        message.reply('❌ Unknown command. Use `!arc help` to see available commands.');
    }
  } catch (error) {
    console.error('Error handling command:', error);
    message.reply('❌ An error occurred while processing your command.');
  }
});

// Command handlers
async function handleHelp(message) {
  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle('🎮 ARC Raiders Bot - Command List')
    .setDescription('Your comprehensive guide companion for ARC Raiders!')
    .addFields(
      {
        name: '🔫 Weapon Commands',
        value: '`!arc weapon <name>` - Get detailed weapon info\n`!arc weapons [tier/type]` - List all weapons or filter by tier/type',
        inline: false
      },
      {
        name: '🤖 Enemy Commands',
        value: '`!arc enemy <name>` - Get enemy info and tactics\n`!arc enemies` - List all ARC machines',
        inline: false
      },
      {
        name: '⚔️ Build Commands',
        value: '`!arc build <name>` - Get detailed build guide\n`!arc builds` - List all recommended builds',
        inline: false
      },
      {
        name: '🎒 Gadget Commands',
        value: '`!arc gadget <name>` - Get gadget/item info\n`!arc gadgets [category]` - List gadgets by category',
        inline: false
      },
      {
        name: '📖 Guide Commands',
        value: '`!arc guide <topic>` - Get detailed guides\n`!arc guides` - List all available guides\n`!arc tips` - Random quick tips',
        inline: false
      },
      {
        name: '🔍 Utility',
        value: '`!arc search <query>` - Search across all data',
        inline: false
      },
      {
        name: '💡 Shortcuts',
        value: '`!arc w` = weapon | `!arc e` = enemy | `!arc b` = build | `!arc g` = gadget',
        inline: false
      }
    )
    .setFooter({ text: 'ARC Raiders Bot | Made for Raiders, by Raiders' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleWeapon(message, args) {
  if (args.length === 0) {
    return message.reply('❌ Please specify a weapon name. Example: `!arc weapon anvil`');
  }

  const weaponName = args.join(' ').toLowerCase();
  const weapon = gameData.weapons.weapons.find(w =>
    w.name.toLowerCase() === weaponName || w.id === weaponName
  );

  if (!weapon) {
    return message.reply(`❌ Weapon "${args.join(' ')}" not found. Use \`!arc weapons\` to see all weapons.`);
  }

  const tierColors = {
    'S': '#FFD700',
    'A': '#C0C0C0',
    'B': '#CD7F32',
    'C': '#808080'
  };

  const embed = new EmbedBuilder()
    .setColor(tierColors[weapon.tier] || '#FF6B35')
    .setTitle(`${weapon.name} - ${weapon.type}`)
    .setDescription(weapon.description)
    .addFields(
      { name: '📊 Tier', value: weapon.tier, inline: true },
      { name: '⭐ Rarity', value: weapon.rarity, inline: true },
      { name: '💥 Damage', value: weapon.damage.toString(), inline: true },
      { name: '🔫 Magazine', value: weapon.magazine.toString(), inline: true },
      { name: '🛡️ ARC Penetration', value: weapon.arcPenetration, inline: true },
      { name: '📏 Range', value: weapon.range, inline: true },
      { name: '⚔️ PvP Effectiveness', value: weapon.pvpEffectiveness, inline: true },
      { name: '🤖 PvE Effectiveness', value: weapon.pveEffectiveness, inline: true },
      { name: '✅ Strengths', value: weapon.strengths.map(s => `• ${s}`).join('\n'), inline: false },
      { name: '❌ Weaknesses', value: weapon.weaknesses.map(w => `• ${w}`).join('\n'), inline: false },
      { name: '🎯 Best For', value: weapon.bestFor, inline: false }
    )
    .setFooter({ text: 'ARC Raiders Weapon Database' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleWeaponsList(message, args) {
  const filter = args[0]?.toLowerCase();
  let weapons = gameData.weapons.weapons;
  let title = '🔫 All Weapons';

  if (filter) {
    if (['s', 'a', 'b', 'c'].includes(filter)) {
      weapons = weapons.filter(w => w.tier.toLowerCase() === filter);
      title = `🔫 Tier ${filter.toUpperCase()} Weapons`;
    } else {
      const type = Object.keys(gameData.weapons.weaponCategories).find(k =>
        k.toLowerCase().includes(filter) || filter.includes(k.toLowerCase())
      );
      if (type) {
        weapons = weapons.filter(w =>
          gameData.weapons.weaponCategories[type].includes(w.id)
        );
        title = `🔫 ${type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`;
      }
    }
  }

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(title)
    .setDescription(weapons.map(w =>
      `**${w.name}** (${w.tier}-Tier) - ${w.type}\n└ ${w.damage} DMG | ${w.magazine} MAG | ${w.rarity}`
    ).join('\n\n'))
    .setFooter({ text: `Use !arc weapon <name> for details | ${weapons.length} weapons shown` })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleEnemy(message, args) {
  if (args.length === 0) {
    return message.reply('❌ Please specify an enemy name. Example: `!arc enemy bastion`');
  }

  const enemyName = args.join(' ').toLowerCase();
  const enemy = gameData.enemies.enemies.find(e =>
    e.name.toLowerCase() === enemyName || e.id === enemyName
  );

  if (!enemy) {
    return message.reply(`❌ Enemy "${args.join(' ')}" not found. Use \`!arc enemies\` to see all ARCs.`);
  }

  const threatColors = {
    'Low': '#00FF00',
    'Low-Medium': '#7FFF00',
    'Medium': '#FFFF00',
    'Medium-High': '#FFA500',
    'High': '#FF4500',
    'Extreme': '#FF0000'
  };

  const embed = new EmbedBuilder()
    .setColor(threatColors[enemy.threat] || '#FF6B35')
    .setTitle(`${enemy.name} - ${enemy.type}`)
    .setDescription(enemy.description)
    .addFields(
      { name: '⚠️ Threat Level', value: enemy.threat, inline: true },
      { name: '❤️ Health', value: enemy.health, inline: true },
      { name: '🛡️ Armor', value: enemy.armor, inline: true },
      { name: '⚡ Abilities', value: enemy.abilities.map(a => `• ${a}`).join('\n'), inline: false },
      { name: '❌ Weaknesses', value: enemy.weaknesses.map(w => `• ${w}`).join('\n'), inline: false },
      { name: '🎯 Tactics', value: enemy.tactics.map(t => `• ${t}`).join('\n'), inline: false },
      { name: '💰 Loot', value: enemy.loot, inline: false }
    )
    .setFooter({ text: 'ARC Raiders Enemy Database' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleEnemiesList(message) {
  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle('🤖 ARC Machines')
    .setDescription(gameData.enemies.enemies.map(e =>
      `**${e.name}** (${e.threat} Threat) - ${e.type}\n└ ${e.description.substring(0, 100)}...`
    ).join('\n\n'))
    .addFields({
      name: '💡 General Tips',
      value: gameData.enemies.generalTips.slice(0, 5).map(t => `• ${t}`).join('\n'),
      inline: false
    })
    .setFooter({ text: 'Use !arc enemy <name> for detailed tactics' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleBuild(message, args) {
  if (args.length === 0) {
    return message.reply('❌ Please specify a build name. Example: `!arc build budget-starter`');
  }

  const buildName = args.join(' ').toLowerCase().replace(/\s+/g, '-');
  const build = gameData.builds.builds.find(b =>
    b.name.toLowerCase() === buildName || b.id === buildName || b.name.toLowerCase().replace(/\s+/g, '-') === buildName
  );

  if (!build) {
    return message.reply(`❌ Build "${args.join(' ')}" not found. Use \`!arc builds\` to see all builds.`);
  }

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(`⚔️ ${build.name}`)
    .setDescription(build.description)
    .addFields(
      { name: '📊 Difficulty', value: build.difficulty, inline: true },
      { name: '💰 Cost', value: build.cost, inline: true },
      { name: '🎮 Playstyle', value: build.playstyle, inline: true },
      { name: '🔫 Primary Weapon', value: build.primaryWeapon, inline: true },
      { name: '🔫 Secondary Weapon', value: build.secondaryWeapon, inline: true },
      { name: '💵 Estimated Cost', value: `${build.estimatedCost} credits`, inline: true },
      { name: '🛡️ Armor', value: build.armor, inline: true },
      { name: '⚡ Shield', value: build.shield, inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: '🎒 Gadgets', value: build.gadgets.map(g => `• ${g}`).join('\n'), inline: false },
      { name: '⚙️ Augments', value: build.augments.map(a => `• ${a}`).join('\n'), inline: false },
      { name: '✅ Strengths', value: build.strengths.map(s => `• ${s}`).join('\n'), inline: false },
      { name: '❌ Weaknesses', value: build.weaknesses.map(w => `• ${w}`).join('\n'), inline: false },
      { name: '🎯 Tactics', value: build.tactics.map(t => `• ${t}`).join('\n'), inline: false }
    )
    .setFooter({ text: 'ARC Raiders Build Guide' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleBuildsList(message) {
  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle('⚔️ Recommended Builds')
    .setDescription(gameData.builds.builds.map(b =>
      `**${b.name}** (${b.difficulty})\n└ ${b.primaryWeapon} + ${b.secondaryWeapon} | ${b.estimatedCost} credits\n└ ${b.description.substring(0, 100)}...`
    ).join('\n\n'))
    .addFields({
      name: '💡 Build Tips',
      value: gameData.builds.buildTips.slice(0, 4).map(t => `• ${t}`).join('\n'),
      inline: false
    })
    .setFooter({ text: 'Use !arc build <name> for full build details' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleGadget(message, args) {
  if (args.length === 0) {
    return message.reply('❌ Please specify a gadget name. Example: `!arc gadget bandage`');
  }

  const gadgetName = args.join(' ').toLowerCase();
  const gadget = gameData.gadgets.gadgets.find(g =>
    g.name.toLowerCase() === gadgetName || g.id === gadgetName
  );

  if (!gadget) {
    return message.reply(`❌ Gadget "${args.join(' ')}" not found. Use \`!arc gadgets\` to see all items.`);
  }

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(`${gadget.name} - ${gadget.category}`)
    .setDescription(gadget.description)
    .addFields(
      { name: '⭐ Rarity', value: gadget.rarity, inline: true },
      { name: '💰 Cost', value: `${gadget.cost} credits`, inline: true },
      { name: '📦 Stack Size', value: gadget.stackSize.toString(), inline: true },
      { name: '⚡ Effect', value: gadget.effect, inline: false },
      { name: '💡 Tips', value: gadget.tips.map(t => `• ${t}`).join('\n'), inline: false }
    )
    .setFooter({ text: 'ARC Raiders Item Database' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleGadgetsList(message, args) {
  const category = args[0]?.toLowerCase();
  let gadgets = gameData.gadgets.gadgets;
  let title = '🎒 All Gadgets & Items';

  if (category && gameData.gadgets.gadgetCategories[category]) {
    gadgets = gadgets.filter(g =>
      gameData.gadgets.gadgetCategories[category].includes(g.id)
    );
    title = `🎒 ${category.charAt(0).toUpperCase() + category.slice(1)} Items`;
  }

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(title)
    .setDescription(gadgets.map(g =>
      `**${g.name}** (${g.category})\n└ ${g.effect} | ${g.cost} credits`
    ).join('\n\n'))
    .addFields({
      name: '📂 Categories',
      value: Object.keys(gameData.gadgets.gadgetCategories).join(', '),
      inline: false
    })
    .setFooter({ text: `Use !arc gadget <name> for details | ${gadgets.length} items shown` })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleGuide(message, args) {
  if (args.length === 0) {
    return message.reply('❌ Please specify a guide topic. Use `!arc guides` to see available guides.');
  }

  const topic = args.join('-').toLowerCase();
  const guide = gameData.guides.guides[topic];

  if (!guide) {
    return message.reply(`❌ Guide "${args.join(' ')}" not found. Use \`!arc guides\` to see available topics.`);
  }

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(`📖 ${guide.title}`)
    .setDescription(guide.sections.map(section =>
      `**${section.heading}**\n${section.content}`
    ).join('\n\n'))
    .setFooter({ text: 'ARC Raiders Strategy Guide' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleGuidesList(message) {
  const guides = Object.keys(gameData.guides.guides);

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle('📖 Available Guides')
    .setDescription(guides.map(g => {
      const guide = gameData.guides.guides[g];
      return `**${g}** - ${guide.title}`;
    }).join('\n'))
    .setFooter({ text: 'Use !arc guide <topic> to read a guide' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleTips(message) {
  const tips = gameData.guides.quickTips;
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('💡 Quick Tip')
    .setDescription(randomTip)
    .setFooter({ text: 'Use !arc tips for another random tip' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

async function handleSearch(message, args) {
  if (args.length === 0) {
    return message.reply('❌ Please provide a search query. Example: `!arc search energy weapon`');
  }

  const query = args.join(' ').toLowerCase();
  const results = [];

  // Search weapons
  gameData.weapons.weapons.forEach(w => {
    if (w.name.toLowerCase().includes(query) ||
        w.type.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query)) {
      results.push(`🔫 **${w.name}** - ${w.type} (Weapon)`);
    }
  });

  // Search enemies
  gameData.enemies.enemies.forEach(e => {
    if (e.name.toLowerCase().includes(query) ||
        e.type.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)) {
      results.push(`🤖 **${e.name}** - ${e.type} (Enemy)`);
    }
  });

  // Search builds
  gameData.builds.builds.forEach(b => {
    if (b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query)) {
      results.push(`⚔️ **${b.name}** - ${b.playstyle} (Build)`);
    }
  });

  // Search gadgets
  gameData.gadgets.gadgets.forEach(g => {
    if (g.name.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query)) {
      results.push(`🎒 **${g.name}** - ${g.category} (Gadget)`);
    }
  });

  if (results.length === 0) {
    return message.reply(`❌ No results found for "${args.join(' ')}". Try different keywords.`);
  }

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(`🔍 Search Results for "${args.join(' ')}"`)
    .setDescription(results.slice(0, 20).join('\n'))
    .setFooter({ text: `${results.length} results found | Showing first 20` })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

// Login
client.login(process.env.DISCORD_BOT_TOKEN);
