# ARC Raiders Discord Bot v2.0 ✨

A comprehensive and **interactive** Discord bot for ARC Raiders featuring slash commands, autocomplete, game guides, item lookup, character builds, weapon stats, enemy tactics, and more!

**🎮 NEW: Discord Activity** - An embedded web app that runs inside Discord with a full interactive item database! See `activity/README.md` for setup.

## ✨ NEW in Version 2.0

- **🎯 Slash Commands**: Modern `/arc` commands instead of `!arc` prefix
- **📝 Autocomplete**: Start typing and get instant suggestions
- **🔘 Interactive Buttons**: Navigate weapons with Previous/Next buttons
- **📋 Select Menus**: Choose weapons, builds from dropdown menus
- **🔄 Dynamic Updates**: Click buttons to refresh tips and browse data
- **⚡ Faster & Cleaner**: No message content permission needed

## Features

### 🔫 Weapon Database
- Complete weapon statistics and details
- Damage, penetration, range, and effectiveness ratings
- Strengths, weaknesses, and best use cases
- Filterable by tier (S, A, B, C) or weapon type
- 10+ weapons with detailed stats
- **Interactive navigation** with Previous/Next buttons
- **Dropdown select menu** to quickly jump to any weapon

### 🤖 Enemy Guide
- Detailed ARC machine information
- Threat levels, health, and armor stats
- Combat tactics and weaknesses
- Loot tables and rewards
- General combat tips

### ⚔️ Build System
- 6+ pre-made loadout guides
- Budget to end-game builds
- PvP and PvE specialized loadouts
- Complete gear recommendations
- Cost estimates and difficulty ratings
- **Select menu** to browse all builds

### 🎒 Gadget & Item Database
- Healing items, grenades, and utilities
- Effects, costs, and stack sizes
- Usage tips and recommendations
- Categorized by type (healing, tactical, utility, etc.)

### 📖 Strategy Guides
- Getting started guide
- Combat mechanics
- Progression & economy
- Map guides
- Advanced tactics

### 🔍 Search Functionality
- Global search across all data
- Find weapons, enemies, builds, and items quickly

### 💡 Quick Tips
- Random helpful tips
- **Click button** to get another tip instantly

## 🎮 Discord Activity (NEW!)

In addition to the slash command bot, we now have a **Discord Activity** - an embedded web app that runs directly inside Discord!

### Features:
- 🖥️ **Runs Inside Discord**: Opens in a panel within voice channels or DMs
- 📊 **Full Item Database**: Browse ALL items with complete information
- 🔨 **Crafting Recipes**: See what materials you need to craft items
- ♻️ **Salvage Info**: Learn what you get from breaking down items
- 📍 **Location Guide**: Find out where items spawn
- 💰 **Economy Data**: Buy/sell prices and vendor information
- 🎨 **Beautiful UI**: Modern, responsive design with real-time filtering

**[See Discord Activity Setup Guide →](activity/README.md)**

## Setup Instructions

### Prerequisites
- Node.js 18.0.0 or higher
- A Discord account and server
- Discord bot token

### 1. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. **Important**: Under "Privileged Gateway Intents", you **DO NOT** need Message Content Intent (slash commands don't require it!)
5. Click "Reset Token" and copy your bot token (save it for later)
6. Copy your Application ID from the "General Information" tab

### 2. Install Bot

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/KappTech88/ARC-Raiders-Discord-Bot-.git
   cd ARC-Raiders-Discord-Bot-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** with your credentials:
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_application_id_here
   ```

### 3. Invite Bot to Server

Use this URL (replace `YOUR_CLIENT_ID` with your actual Application ID):

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot%20applications.commands
```

**Permissions needed:**
- Read Messages/View Channels
- Send Messages
- Embed Links
- Use Slash Commands (applications.commands scope)

### 4. Deploy Slash Commands

**IMPORTANT**: Before running the bot, you must register the slash commands:

```bash
npm run deploy
```

You should see:
```
✅ Successfully registered application (/) commands globally.
Note: Global commands may take up to 1 hour to appear in all servers.
```

**Note**: Slash commands are registered globally and may take up to 1 hour to appear. For instant testing, you can modify `deploy-commands.js` to use guild commands instead (see Discord.js docs).

### 5. Run Bot

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ ARC-Raiders-Bot#1234 is online!
📊 Serving 1 servers
💡 Use /arc to access all commands
```

## Commands

All commands use Discord's **slash command** system. Just type `/arc` and Discord will show you all available options!

### 📋 Command List

#### Help & Info
- `/arc help` - Show all available commands with descriptions

#### Weapon Commands
- `/arc weapon <name>` - Get detailed weapon information
  - **Autocomplete**: Start typing to see weapon suggestions
  - **Buttons**: Use Previous/Next to browse weapons
- `/arc weapons [filter]` - List all weapons or filter by tier/type
  - **Select Menu**: Choose a weapon from dropdown
  - Filter examples: `s`, `a`, `sniper`, `energy`

#### Enemy Commands
- `/arc enemy <name>` - Get enemy information and tactics
  - **Autocomplete**: Start typing to see enemy suggestions
- `/arc enemies` - List all ARC machines

#### Build Commands
- `/arc build <name>` - Get detailed build guide
  - **Autocomplete**: Start typing to see build suggestions
- `/arc builds` - Browse all recommended builds
  - **Select Menu**: Choose a build from dropdown

#### Gadget/Item Commands
- `/arc gadget <name>` - Get gadget/item information
  - **Autocomplete**: Start typing to see item suggestions
- `/arc gadgets [category]` - List gadgets by category
  - Categories: healing, tactical, utility, explosive, shield, trap

#### Guide Commands
- `/arc guide <topic>` - Read a strategy guide
  - Topics: getting-started, combat-mechanics, progression, maps, advanced-tactics
- `/arc guides` - List all available guides

#### Utility
- `/arc tips` - Get a random quick tip
  - **Button**: Click "Another Tip" for more tips
- `/arc search <query>` - Search across all database

## Interactive Features

### 🎯 Autocomplete
When you start typing in weapon, enemy, build, or gadget commands, Discord will show you matching suggestions. Just select from the list!

### 🔘 Buttons
- **Weapon Navigation**: Browse weapons with Previous/Next buttons
- **Refresh Tips**: Click to get another random tip

### 📋 Select Menus
- **Weapon List**: Choose from dropdown to see details
- **Build List**: Select a build from the menu

## Example Usage

```
/arc help
/arc weapon anvil
/arc weapons s
/arc enemy queen
/arc build arc-destroyer
/arc gadget bandage
/arc guide getting-started
/arc tips
/arc search sniper
```

## File Structure

```
ARC-Raiders-Discord-Bot/
├── data/
│   ├── weapons.json      # Weapon database (10+ weapons)
│   ├── enemies.json      # ARC machine database (6 enemy types)
│   ├── builds.json       # Build guides (6 loadouts)
│   ├── gadgets.json      # Gadget/item database (14+ items)
│   └── guides.json       # Strategy guides (5 topics)
├── index.js              # Main bot file (slash commands)
├── deploy-commands.js    # Command registration script
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .env                  # Your credentials (create this)
└── README.md             # This file
```

## Data Sources

All data compiled from:
- Official ARC Raiders documentation
- PC Gamer guides
- GameSpot weapon tier lists
- Community build guides
- GAM3S.GG loadout recommendations
- 2025 roadmap information

## Customization

### Adding New Weapons

1. Edit `data/weapons.json` and add a new weapon object
2. No need to update commands - autocomplete updates automatically!

### Adding New Builds

1. Edit `data/builds.json` and add your custom loadout
2. Autocomplete will show it immediately

### Adding New Guides

Edit `data/guides.json` to add strategy guides or tips.

## Upgrading from v1.0

If you were using the old `!arc` text commands:

1. Pull the latest code
2. Run `npm install` (no new dependencies, but good practice)
3. Run `npm run deploy` to register slash commands
4. Restart your bot
5. All your data is compatible - no changes needed!

**Old vs New:**
- ❌ Old: `!arc weapon anvil`
- ✅ New: `/arc weapon anvil`

## Troubleshooting

### Bot doesn't show slash commands
- Make sure you ran `npm run deploy`
- Ensure bot was invited with `applications.commands` scope
- Global commands take up to 1 hour to appear
- Try kicking and re-inviting the bot

### "Unknown interaction" errors
- Make sure bot is running when you use commands
- Check bot has "Use Application Commands" permission

### Autocomplete not working
- Verify bot is online
- Check you're typing in the right field
- Make sure bot has latest code with autocomplete support

### Commands not working
- Ensure bot is online (green status)
- Verify bot has permissions in the channel
- Check Discord server status

## Support

For issues or feature requests, please open an issue on the repository.

## Updates

The bot database is based on ARC Raiders as of November 2025. Game balance changes may affect accuracy of information.

**Recent Updates:**
- **v2.0.0** (Latest): Slash commands, autocomplete, interactive buttons/menus
- v1.0.0: Initial release with text commands

## Performance

- ⚡ Slash commands respond instantly
- 🎯 Autocomplete is near-instant
- 🔘 Button interactions update in real-time
- 📋 Select menus support up to 25 options

## Privacy

- Bot only requires Guild intent (no message reading)
- No user data is stored or tracked
- All game data is read-only
- Interactions are ephemeral where appropriate

## Credits

- **Game**: ARC Raiders by Embark Studios
- **Data Sources**: PC Gamer, GameSpot, GAM3S.GG, Overgear, community guides
- **Bot Framework**: Discord.js v14

## License

MIT License - Free to use and modify

---

**Made for Raiders, by Raiders! Happy looting! 🎮⚔️**

*Use `/arc help` in Discord to get started!*
