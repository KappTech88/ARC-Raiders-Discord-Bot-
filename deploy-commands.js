const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  {
    name: 'arc',
    description: 'ARC Raiders game guide commands',
    options: [
      {
        name: 'weapon',
        description: 'Look up weapon information',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'name',
            description: 'Weapon name (e.g., anvil, ferro, rattler)',
            type: 3, // STRING
            required: true,
            autocomplete: true
          }
        ]
      },
      {
        name: 'weapons',
        description: 'List all weapons or filter by tier/type',
        type: 1,
        options: [
          {
            name: 'filter',
            description: 'Filter by tier (S, A, B, C) or type (smg, rifle, etc.)',
            type: 3,
            required: false
          }
        ]
      },
      {
        name: 'enemy',
        description: 'Look up ARC machine information',
        type: 1,
        options: [
          {
            name: 'name',
            description: 'Enemy name (e.g., bastion, queen, wasp)',
            type: 3,
            required: true,
            autocomplete: true
          }
        ]
      },
      {
        name: 'enemies',
        description: 'List all ARC machines',
        type: 1
      },
      {
        name: 'build',
        description: 'Look up character build guide',
        type: 1,
        options: [
          {
            name: 'name',
            description: 'Build name (e.g., budget-starter, arc-destroyer)',
            type: 3,
            required: true,
            autocomplete: true
          }
        ]
      },
      {
        name: 'builds',
        description: 'List all available builds',
        type: 1
      },
      {
        name: 'gadget',
        description: 'Look up gadget/item information',
        type: 1,
        options: [
          {
            name: 'name',
            description: 'Gadget name (e.g., bandage, emp-grenade)',
            type: 3,
            required: true,
            autocomplete: true
          }
        ]
      },
      {
        name: 'gadgets',
        description: 'List all gadgets or filter by category',
        type: 1,
        options: [
          {
            name: 'category',
            description: 'Filter by category (healing, tactical, utility)',
            type: 3,
            required: false,
            choices: [
              { name: 'Healing', value: 'healing' },
              { name: 'Shield', value: 'shield' },
              { name: 'Explosive', value: 'explosive' },
              { name: 'Tactical', value: 'tactical' },
              { name: 'Utility', value: 'utility' },
              { name: 'Trap', value: 'trap' }
            ]
          }
        ]
      },
      {
        name: 'guide',
        description: 'Read a strategy guide',
        type: 1,
        options: [
          {
            name: 'topic',
            description: 'Guide topic',
            type: 3,
            required: true,
            choices: [
              { name: 'Getting Started', value: 'getting-started' },
              { name: 'Combat Mechanics', value: 'combat-mechanics' },
              { name: 'Progression & Economy', value: 'progression' },
              { name: 'Maps', value: 'maps' },
              { name: 'Advanced Tactics', value: 'advanced-tactics' }
            ]
          }
        ]
      },
      {
        name: 'guides',
        description: 'List all available guides',
        type: 1
      },
      {
        name: 'tips',
        description: 'Get a random quick tip',
        type: 1
      },
      {
        name: 'search',
        description: 'Search across all game data',
        type: 1,
        options: [
          {
            name: 'query',
            description: 'Search query',
            type: 3,
            required: true
          }
        ]
      },
      {
        name: 'help',
        description: 'Show all available commands',
        type: 1
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands },
    );

    console.log('✅ Successfully registered application (/) commands globally.');
    console.log('Note: Global commands may take up to 1 hour to appear in all servers.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();
