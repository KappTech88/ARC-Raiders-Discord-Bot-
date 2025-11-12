# ARC Raiders Discord Activity 🎮

An **embedded Discord Activity** that runs inside Discord, providing an interactive item database for ARC Raiders with comprehensive information including crafting recipes, salvage yields, locations, and pricing.

## Features

### 🔍 Interactive Item Browser
- Browse all ARC Raiders items in a beautiful grid layout
- Real-time search across item names and descriptions
- Filter by category, tier, and rarity
- Responsive design for all screen sizes

### 📊 Comprehensive Item Information
Every item includes:
- **Stats**: Damage, magazine size, heal amount, etc.
- **Economy**: Buy and sell prices
- **Crafting**: Required materials, workbench, craft time
- **Salvage**: What you get when breaking down items
- **Locations**: Where to find the item in-game
- **Vendors**: Who sells the item and for how much
- **Usage**: What the item can be used to craft

### 🎯 Categories
- **Weapons**: Hand cannons, rifles, energy weapons
- **Consumables**: Healing items, grenades, tactical gear
- **Equipment**: Armor, shields, backpacks
- **Crafting Materials**: Metals, components, electronics
- **Ammo**: Standard, energy, heavy caliber
- **Gadgets**: Utilities, traps, mobility items
- **Blueprints**: Unlock crafting recipes

## Setup & Installation

### Prerequisites
- Node.js 18+ installed
- Discord Application with Activity enabled
- Cloudflared for tunneling (optional for development)

### 1. Install Dependencies

```bash
cd activity
npm install
```

### 2. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or use existing one
3. Go to **"Activities"** tab (in left sidebar)
4. Click **"Enable Activity"**
5. Note your **Application ID** and **Client Secret**

### 3. Development Setup

**Option A: Local Development (requires tunneling)**

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Create tunnel (if using cloudflared)
npm run tunnel
```

**Option B: Using Vite Preview**

```bash
npm run build
npm run preview
```

### 4. Configure Discord Activity

1. In Discord Developer Portal → Your App → Activities
2. Set **URL Mappings**:
   - Root Mapping: Your tunnel URL or hosted URL
   - Example: `https://your-tunnel-url.trycloudflare.com`
3. Save changes

### 5. Test in Discord

1. Open Discord
2. Join any voice channel or DM
3. Click the **🎮 Activities** button
4. Find your activity in the list
5. Launch it!

## Project Structure

```
activity/
├── public/
│   ├── index.html          # Main HTML
│   ├── styles.css          # Styling
│   └── app.js              # Application logic
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## Item Data Structure

Items in `data/items-full.json` include:

```json
{
  "id": "unique-id",
  "name": "Item Name",
  "category": "Weapon|Consumable|Equipment|etc",
  "subcategory": "Specific type",
  "tier": "S|A|B|C",
  "rarity": "Common|Uncommon|Rare|Epic|Legendary",
  "description": "Item description",
  "sellPrice": 100,
  "buyPrice": 300,
  "weight": 1.5,
  "stackSize": 10,
  "stats": { /* item-specific stats */ },
  "crafting": {
    "canCraft": true,
    "workbench": "Gunsmith Level 2",
    "craftTime": 300,
    "materials": [
      {"item": "Material Name", "quantity": 5}
    ]
  },
  "salvage": {
    "canSalvage": true,
    "yields": [
      {"item": "Scrap", "quantity": 2, "chance": 100}
    ]
  },
  "locations": [
    {"area": "Zone Name", "type": "Container Type", "rarity": "Common"}
  ],
  "vendors": [
    {"name": "Vendor Name", "stock": "Limited", "price": 300}
  ]
}
```

## Adding New Items

1. Edit `../data/items-full.json`
2. Add new item following the structure above
3. Restart dev server
4. Item appears automatically in the activity

## Customization

### Changing Colors

Edit CSS variables in `public/styles.css`:

```css
:root {
    --accent: #FF6B35;        /* Primary accent color */
    --bg-primary: #1a1b1e;    /* Main background */
    --bg-secondary: #25262b;  /* Card background */
    /* ... more variables */
}
```

### Adding New Filters

1. Add filter select in `index.html`
2. Update `filterItems()` function in `app.js`
3. Add filter logic

### Modifying Layout

- Grid columns: Edit `.items-grid` in `styles.css`
- Card design: Edit `.item-card` styles
- Detail panel: Edit `.item-detail` styles

## Deployment

### Option 1: Cloudflare Pages

```bash
npm run build
# Upload 'dist' folder to Cloudflare Pages
```

### Option 2: Vercel

```bash
npm run build
# Deploy 'dist' folder to Vercel
```

### Option 3: GitHub Pages

```bash
npm run build
# Push 'dist' folder to gh-pages branch
```

### Important: Update Discord Activity URL

After deploying, update the URL Mapping in Discord Developer Portal to your production URL.

## Troubleshooting

### Activity doesn't load
- Check Discord Activity is enabled in Developer Portal
- Verify URL mapping is correct
- Ensure HTTPS is used (required for Discord Activities)
- Check browser console for errors

### Items not showing
- Verify `items-full.json` is accessible
- Check network tab for failed requests
- Ensure JSON is valid (use JSON validator)

### Filters not working
- Clear browser cache
- Check console for JavaScript errors
- Verify filter event listeners are attached

## Performance

- **First Load**: < 2 seconds
- **Search/Filter**: Instant (< 50ms)
- **Item Detail**: Instant
- **Bundle Size**: ~100KB (minified)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

To add new items or features:

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test locally
5. Submit pull request

## License

MIT License

---

**Happy Raiding! 🎮⚔️**

*Use filters to find what you need, click items for full details!*
