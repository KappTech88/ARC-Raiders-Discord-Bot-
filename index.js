const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
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

// Bot ready event
client.once('ready', () => {
  console.log(`✅ ${client.user.tag} is online!`);
  console.log(`📊 Serving ${client.guilds.cache.size} servers`);
  console.log('💡 Use /arc to access all commands');

  // Set bot status
  client.user.setActivity('/arc help | ARC Raiders Guide', { type: ActivityType.Playing });
});

// Interaction handler
client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction);
    } else if (interaction.isAutocomplete()) {
      await handleAutocomplete(interaction);
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction);
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    const errorMessage = '❌ An error occurred while processing your request.';

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Slash command handler
async function handleSlashCommand(interaction) {
  if (interaction.commandName !== 'arc') return;

  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case 'help':
      await handleHelp(interaction);
      break;
    case 'weapon':
      await handleWeapon(interaction);
      break;
    case 'weapons':
      await handleWeaponsList(interaction);
      break;
    case 'enemy':
      await handleEnemy(interaction);
      break;
    case 'enemies':
      await handleEnemiesList(interaction);
      break;
    case 'build':
      await handleBuild(interaction);
      break;
    case 'builds':
      await handleBuildsList(interaction);
      break;
    case 'gadget':
      await handleGadget(interaction);
      break;
    case 'gadgets':
      await handleGadgetsList(interaction);
      break;
    case 'guide':
      await handleGuide(interaction);
      break;
    case 'guides':
      await handleGuidesList(interaction);
      break;
    case 'tips':
      await handleTips(interaction);
      break;
    case 'search':
      await handleSearch(interaction);
      break;
    default:
      await interaction.reply({ content: '❌ Unknown command.', ephemeral: true });
  }
}

// Autocomplete handler
async function handleAutocomplete(interaction) {
  const focusedOption = interaction.options.getFocused(true);
  const subcommand = interaction.options.getSubcommand();

  let choices = [];

  if (subcommand === 'weapon') {
    choices = gameData.weapons.weapons.map(w => ({ name: w.name, value: w.id }));
  } else if (subcommand === 'enemy') {
    choices = gameData.enemies.enemies.map(e => ({ name: e.name, value: e.id }));
  } else if (subcommand === 'build') {
    choices = gameData.builds.builds.map(b => ({ name: b.name, value: b.id }));
  } else if (subcommand === 'gadget') {
    choices = gameData.gadgets.gadgets.map(g => ({ name: g.name, value: g.id }));
  }

  const filtered = choices.filter(choice =>
    choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())
  ).slice(0, 25);

  await interaction.respond(filtered);
}

// Button handler
async function handleButton(interaction) {
  const [action, ...params] = interaction.customId.split(':');

  switch (action) {
    case 'weapon_prev':
    case 'weapon_next':
      await handleWeaponNavigation(interaction, action, params);
      break;
    case 'build_prev':
    case 'build_next':
      await handleBuildNavigation(interaction, action, params);
      break;
    case 'refresh_tip':
      await handleTips(interaction, true);
      break;
    default:
      await interaction.reply({ content: '❌ Unknown button action.', ephemeral: true });
  }
}

// Select menu handler
async function handleSelectMenu(interaction) {
  const [action] = interaction.customId.split(':');

  if (action === 'weapon_select') {
    const weaponId = interaction.values[0];
    const weapon = gameData.weapons.weapons.find(w => w.id === weaponId);

    if (weapon) {
      const embed = createWeaponEmbed(weapon);
      const row = createWeaponButtons(weaponId);
      await interaction.update({ embeds: [embed], components: [row] });
    }
  } else if (action === 'build_select') {
    const buildId = interaction.values[0];
    const build = gameData.builds.builds.find(b => b.id === buildId);

    if (build) {
      const embed = createBuildEmbed(build);
      await interaction.update({ embeds: [embed], components: [] });
    }
  }
}

// Command handlers
async function handleHelp(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle('🎮 ARC Raiders Bot - Command List')
    .setDescription('Your comprehensive guide companion for ARC Raiders! Use slash commands for easy access.')
    .addFields(
      {
        name: '🔫 Weapon Commands',
        value: '`/arc weapon <name>` - Get detailed weapon info\n`/arc weapons [tier/type]` - List all weapons with filtering',
        inline: false
      },
      {
        name: '🤖 Enemy Commands',
        value: '`/arc enemy <name>` - Get enemy info and tactics\n`/arc enemies` - List all ARC machines',
        inline: false
      },
      {
        name: '⚔️ Build Commands',
        value: '`/arc build <name>` - Get detailed build guide\n`/arc builds` - Browse all recommended builds',
        inline: false
      },
      {
        name: '🎒 Gadget Commands',
        value: '`/arc gadget <name>` - Get gadget/item info\n`/arc gadgets [category]` - List gadgets by category',
        inline: false
      },
      {
        name: '📖 Guide Commands',
        value: '`/arc guide <topic>` - Read strategy guides\n`/arc guides` - List all available guides\n`/arc tips` - Random quick tips',
        inline: false
      },
      {
        name: '🔍 Utility',
        value: '`/arc search <query>` - Search across all data',
        inline: false
      },
      {
        name: '✨ New Features',
        value: '• **Autocomplete**: Start typing to see suggestions\n• **Interactive**: Use buttons to navigate\n• **Select Menus**: Choose from dropdowns',
        inline: false
      }
    )
    .setFooter({ text: 'ARC Raiders Bot | Made for Raiders, by Raiders' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleWeapon(interaction) {
  const weaponId = interaction.options.getString('name');
  const weapon = gameData.weapons.weapons.find(w => w.id === weaponId);

  if (!weapon) {
    return interaction.reply({ content: '❌ Weapon not found.', ephemeral: true });
  }

  const embed = createWeaponEmbed(weapon);
  const row = createWeaponButtons(weaponId);

  await interaction.reply({ embeds: [embed], components: [row] });
}

async function handleWeaponsList(interaction) {
  const filter = interaction.options.getString('filter')?.toLowerCase();
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

  // Create select menu for weapons
  const options = weapons.slice(0, 25).map(w => ({
    label: w.name,
    description: `${w.tier}-Tier ${w.type} | ${w.damage} DMG`,
    value: w.id,
    emoji: w.tier === 'S' ? '🏆' : w.tier === 'A' ? '⭐' : '🔫'
  }));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('weapon_select')
    .setPlaceholder('Select a weapon to view details')
    .addOptions(options);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(title)
    .setDescription(weapons.map(w =>
      `**${w.name}** (${w.tier}-Tier) - ${w.type}\n└ ${w.damage} DMG | ${w.magazine} MAG | ${w.rarity}`
    ).join('\n\n'))
    .setFooter({ text: `${weapons.length} weapons shown | Select from menu below for details` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], components: weapons.length > 0 ? [row] : [] });
}

async function handleEnemy(interaction) {
  const enemyId = interaction.options.getString('name');
  const enemy = gameData.enemies.enemies.find(e => e.id === enemyId);

  if (!enemy) {
    return interaction.reply({ content: '❌ Enemy not found.', ephemeral: true });
  }

  const embed = createEnemyEmbed(enemy);
  await interaction.reply({ embeds: [embed] });
}

async function handleEnemiesList(interaction) {
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
    .setFooter({ text: 'Use /arc enemy <name> for detailed tactics' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleBuild(interaction) {
  const buildId = interaction.options.getString('name');
  const build = gameData.builds.builds.find(b => b.id === buildId);

  if (!build) {
    return interaction.reply({ content: '❌ Build not found.', ephemeral: true });
  }

  const embed = createBuildEmbed(build);
  await interaction.reply({ embeds: [embed] });
}

async function handleBuildsList(interaction) {
  // Create select menu for builds
  const options = gameData.builds.builds.map(b => ({
    label: b.name,
    description: `${b.difficulty} | ${b.estimatedCost} credits`,
    value: b.id,
    emoji: b.difficulty === 'Beginner' ? '🌱' : b.difficulty === 'Intermediate' ? '⚔️' : '👑'
  }));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('build_select')
    .setPlaceholder('Select a build to view details')
    .addOptions(options);

  const row = new ActionRowBuilder().addComponents(selectMenu);

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
    .setFooter({ text: 'Select a build from the menu below for full details' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], components: [row] });
}

async function handleGadget(interaction) {
  const gadgetId = interaction.options.getString('name');
  const gadget = gameData.gadgets.gadgets.find(g => g.id === gadgetId);

  if (!gadget) {
    return interaction.reply({ content: '❌ Gadget not found.', ephemeral: true });
  }

  const embed = createGadgetEmbed(gadget);
  await interaction.reply({ embeds: [embed] });
}

async function handleGadgetsList(interaction) {
  const category = interaction.options.getString('category');
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
    .setFooter({ text: `Use /arc gadget <name> for details | ${gadgets.length} items shown` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleGuide(interaction) {
  const topic = interaction.options.getString('topic');
  const guide = gameData.guides.guides[topic];

  if (!guide) {
    return interaction.reply({ content: '❌ Guide not found.', ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(`📖 ${guide.title}`)
    .setDescription(guide.sections.map(section =>
      `**${section.heading}**\n${section.content}`
    ).join('\n\n'))
    .setFooter({ text: 'ARC Raiders Strategy Guide' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleGuidesList(interaction) {
  const guides = Object.keys(gameData.guides.guides);

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle('📖 Available Guides')
    .setDescription(guides.map(g => {
      const guide = gameData.guides.guides[g];
      return `**${g}** - ${guide.title}`;
    }).join('\n'))
    .setFooter({ text: 'Use /arc guide <topic> to read a guide' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleTips(interaction, isRefresh = false) {
  const tips = gameData.guides.quickTips;
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('💡 Quick Tip')
    .setDescription(randomTip)
    .setFooter({ text: 'Click the button for another tip!' })
    .setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('refresh_tip')
        .setLabel('Another Tip')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🔄')
    );

  if (isRefresh) {
    await interaction.update({ embeds: [embed], components: [row] });
  } else {
    await interaction.reply({ embeds: [embed], components: [row] });
  }
}

async function handleSearch(interaction) {
  const query = interaction.options.getString('query').toLowerCase();
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
    return interaction.reply({ content: `❌ No results found for "${query}". Try different keywords.`, ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(`🔍 Search Results for "${query}"`)
    .setDescription(results.slice(0, 20).join('\n'))
    .setFooter({ text: `${results.length} results found | Showing first 20` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

// Helper functions to create embeds
function createWeaponEmbed(weapon) {
  const tierColors = {
    'S': '#FFD700',
    'A': '#C0C0C0',
    'B': '#CD7F32',
    'C': '#808080'
  };

  return new EmbedBuilder()
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
      { name: '\u200B', value: '\u200B', inline: true },
      { name: '✅ Strengths', value: weapon.strengths.map(s => `• ${s}`).join('\n'), inline: false },
      { name: '❌ Weaknesses', value: weapon.weaknesses.map(w => `• ${w}`).join('\n'), inline: false },
      { name: '🎯 Best For', value: weapon.bestFor, inline: false }
    )
    .setFooter({ text: 'ARC Raiders Weapon Database' })
    .setTimestamp();
}

function createEnemyEmbed(enemy) {
  const threatColors = {
    'Low': '#00FF00',
    'Low-Medium': '#7FFF00',
    'Medium': '#FFFF00',
    'Medium-High': '#FFA500',
    'High': '#FF4500',
    'Extreme': '#FF0000'
  };

  return new EmbedBuilder()
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
}

function createBuildEmbed(build) {
  return new EmbedBuilder()
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
}

function createGadgetEmbed(gadget) {
  return new EmbedBuilder()
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
}

function createWeaponButtons(currentWeaponId) {
  const weapons = gameData.weapons.weapons;
  const currentIndex = weapons.findIndex(w => w.id === currentWeaponId);
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : weapons.length - 1;
  const nextIndex = currentIndex < weapons.length - 1 ? currentIndex + 1 : 0;

  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`weapon_prev:${weapons[prevIndex].id}`)
        .setLabel('◀ Previous')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`weapon_next:${weapons[nextIndex].id}`)
        .setLabel('Next ▶')
        .setStyle(ButtonStyle.Secondary)
    );
}

async function handleWeaponNavigation(interaction, action, params) {
  const weaponId = params[0];
  const weapon = gameData.weapons.weapons.find(w => w.id === weaponId);

  if (!weapon) {
    return interaction.reply({ content: '❌ Weapon not found.', ephemeral: true });
  }

  const embed = createWeaponEmbed(weapon);
  const row = createWeaponButtons(weaponId);

  await interaction.update({ embeds: [embed], components: [row] });
}

// Login
client.login(process.env.DISCORD_BOT_TOKEN);
