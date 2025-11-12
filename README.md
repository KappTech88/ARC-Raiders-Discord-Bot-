# ARC Raiders Discord Bot

A comprehensive and interactive Discord bot for ARC Raiders featuring game guides, item lookup, character builds, weapon stats, enemy tactics, and more!

## Features

### 🔫 Weapon Database
- Complete weapon statistics and details
- Damage, penetration, range, and effectiveness ratings
- Strengths, weaknesses, and best use cases
- Filterable by tier (S, A, B, C) or weapon type
- 10+ weapons with detailed stats

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

## Setup Instructions

### Prerequisites
- Node.js 18.0.0 or higher
- A Discord account and server
- Discord bot token

### 1. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - Message Content Intent
5. Click "Reset Token" and copy your bot token (save it for later)
6. Copy your Application ID from the "General Information" tab

### 2. Install Bot

1. **Clone or download this repository**
   ```bash
   cd arc-raiders-bot
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
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot
```

Permissions needed:
- Read Messages/View Channels
- Send Messages
- Embed Links

### 4. Run Bot

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
```

## Commands

All commands start with `!arc`

### Help & Info
- `!arc help` - Show all available commands

### Weapon Commands
- `!arc weapon <name>` - Get detailed weapon information
  - Example: `!arc weapon anvil`
- `!arc weapons` - List all weapons
- `!arc weapons [tier]` - Filter by tier (S, A, B, C)
  - Example: `!arc weapons s`
- `!arc weapons [type]` - Filter by type (smg, rifle, etc.)
  - Example: `!arc weapons energy`

### Enemy Commands
- `!arc enemy <name>` - Get enemy information and tactics
  - Example: `!arc enemy bastion`
- `!arc enemies` - List all ARC machines

### Build Commands
- `!arc build <name>` - Get detailed build guide
  - Example: `!arc build budget-starter`
- `!arc builds` - List all available builds

### Gadget/Item Commands
- `!arc gadget <name>` - Get gadget/item information
  - Example: `!arc gadget bandage`
- `!arc gadgets` - List all gadgets
- `!arc gadgets [category]` - Filter by category
  - Example: `!arc gadgets healing`

### Guide Commands
- `!arc guide <topic>` - Read a strategy guide
  - Topics: getting-started, combat-mechanics, progression, maps, advanced-tactics
  - Example: `!arc guide getting-started`
- `!arc guides` - List all available guides
- `!arc tips` - Get a random quick tip

### Search
- `!arc search <query>` - Search across all database
  - Example: `!arc search energy weapon`

### Shortcuts
- `!arc w <name>` = `!arc weapon <name>`
- `!arc e <name>` = `!arc enemy <name>`
- `!arc b <name>` = `!arc build <name>`
- `!arc g <name>` = `!arc gadget <name>`

## Example Usage

```
!arc help
!arc weapon anvil
!arc weapons s
!arc enemy queen
!arc build arc-destroyer
!arc gadget bandage
!arc guide getting-started
!arc tips
!arc search sniper
```

## File Structure

```
arc-raiders-bot/
├── data/
│   ├── weapons.json      # Weapon database (10+ weapons)
│   ├── enemies.json      # ARC machine database (6 enemy types)
│   ├── builds.json       # Build guides (6 loadouts)
│   ├── gadgets.json      # Gadget/item database (14+ items)
│   └── guides.json       # Strategy guides (5 topics)
├── index.js              # Main bot file
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

Edit `data/weapons.json` and add a new weapon object following the existing format:

```json
{
  "id": "new-weapon",
  "name": "New Weapon",
  "type": "Weapon Type",
  "tier": "A",
  "rarity": "Common",
  "damage": 50,
  "magazine": 10,
  "arcPenetration": "Strong",
  "pvpEffectiveness": "Good",
  "pveEffectiveness": "Excellent",
  "range": "Mid-Range",
  "description": "Weapon description",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "bestFor": "Best use case"
}
```

### Adding New Builds

Edit `data/builds.json` and add your custom loadout.

### Adding New Guides

Edit `data/guides.json` to add strategy guides or tips.

## Troubleshooting

### Bot doesn't respond
- Check bot is online (look for green status)
- Verify Message Content Intent is enabled
- Ensure bot has permissions in the channel
- Check prefix is `!arc` (lowercase)

### Missing data
- Ensure all JSON files are in `data/` folder
- Check JSON syntax is valid
- Restart bot after data changes

### Commands not working
- Make sure you're using the correct prefix: `!arc`
- Check command spelling
- Use `!arc help` to see all commands

## Support

For issues or feature requests, please open an issue on the repository.

## Updates

The bot database is based on ARC Raiders as of November 2025. Game balance changes may affect accuracy of information.

**Recent Updates:**
- November 2025: Added Stella Montis map info
- 2025 Roadmap integration
- Community build updates
- Weapon tier list updates

## Credits

- **Game**: ARC Raiders by Embark Studios
- **Data Sources**: PC Gamer, GameSpot, GAM3S.GG, Overgear, community guides
- **Bot Framework**: Discord.js

## License

MIT License - Free to use and modify

---

**Made for Raiders, by Raiders! Happy looting! 🎮⚔️**
