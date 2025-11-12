// ARC Raiders Item Database - Main Application

// State
let allItems = [];
let filteredItems = [];
let selectedItem = null;

// DOM Elements
const itemsGrid = document.getElementById('itemsGrid');
const itemDetail = document.getElementById('itemDetail');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const tierFilter = document.getElementById('tierFilter');
const rarityFilter = document.getElementById('rarityFilter');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');
const totalItemsEl = document.getElementById('totalItems');
const filteredItemsEl = document.getElementById('filteredItems');
const closeDetailBtn = document.getElementById('closeDetail');

// Initialize
async function init() {
    try {
        // Load items data
        const response = await fetch('../data/items-full.json');
        const data = await response.json();
        allItems = data.items;

        // Initial render
        filteredItems = [...allItems];
        renderItems();
        updateStats();

        // Hide loading
        loading.style.display = 'none';

        // Setup event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Failed to load items:', error);
        loading.innerHTML = '<p>❌ Failed to load items. Please refresh.</p>';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterItems);
    categoryFilter.addEventListener('change', filterItems);
    tierFilter.addEventListener('change', filterItems);
    rarityFilter.addEventListener('change', filterItems);
    closeDetailBtn.addEventListener('click', closeDetail);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && selectedItem) {
            closeDetail();
        }
    });
}

// Filter Items
function filterItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const tier = tierFilter.value;
    const rarity = rarityFilter.value;

    filteredItems = allItems.filter(item => {
        // Search filter
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                            item.description.toLowerCase().includes(searchTerm) ||
                            item.category.toLowerCase().includes(searchTerm);

        // Category filter
        const matchesCategory = category === 'all' || item.category === category;

        // Tier filter
        const matchesTier = tier === 'all' || item.tier === tier;

        // Rarity filter
        const matchesRarity = rarity === 'all' || item.rarity === rarity;

        return matchesSearch && matchesCategory && matchesTier && matchesRarity;
    });

    renderItems();
    updateStats();
}

// Render Items
function renderItems() {
    if (filteredItems.length === 0) {
        itemsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    itemsGrid.style.display = 'grid';
    noResults.style.display = 'none';

    itemsGrid.innerHTML = filteredItems.map(item => createItemCard(item)).join('');

    // Add click listeners
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', () => {
            const itemId = card.dataset.itemId;
            showItemDetail(itemId);
        });
    });
}

// Create Item Card
function createItemCard(item) {
    const buyPrice = item.buyPrice ? `${item.buyPrice.toLocaleString()}¢` : 'N/A';
    const sellPrice = item.sellPrice ? `${item.sellPrice.toLocaleString()}¢` : 'N/A';

    return `
        <div class="item-card" data-item-id="${item.id}">
            <div class="item-card-header">
                <h3 class="item-card-title">${item.name}</h3>
                <div class="item-card-badges">
                    <span class="badge tier-badge tier-${item.tier}">${item.tier}-Tier</span>
                    <span class="badge rarity-badge rarity-${item.rarity}">${item.rarity}</span>
                </div>
                <div class="item-category">${item.category} • ${item.subcategory}</div>
            </div>
            <p class="item-description">${item.description}</p>
            <div class="item-price">
                <div class="price-item">
                    <span class="price-label">Sell Price</span>
                    <span class="price-value">${sellPrice}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Buy Price</span>
                    <span class="price-value buy">${buyPrice}</span>
                </div>
            </div>
        </div>
    `;
}

// Show Item Detail
function showItemDetail(itemId) {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;

    selectedItem = item;

    // Update detail panel
    document.getElementById('detailName').textContent = item.name;
    document.getElementById('detailTier').textContent = `${item.tier}-Tier`;
    document.getElementById('detailTier').className = `badge tier-badge tier-${item.tier}`;
    document.getElementById('detailRarity').textContent = item.rarity;
    document.getElementById('detailRarity').className = `badge rarity-badge rarity-${item.rarity}`;

    // Build detail content
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = createDetailContent(item);

    // Show detail panel
    itemDetail.style.display = 'block';

    // Scroll to top of detail
    itemDetail.scrollTop = 0;
}

// Create Detail Content
function createDetailContent(item) {
    let html = `
        <div class="detail-section">
            <h3>📋 Overview</h3>
            <p style="color: var(--text-secondary); margin-bottom: 16px;">${item.description}</p>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-item-label">Category</div>
                    <div class="detail-item-value">${item.category}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Type</div>
                    <div class="detail-item-value">${item.subcategory}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Weight</div>
                    <div class="detail-item-value">${item.weight} kg</div>
                </div>
                ${item.stackSize ? `
                <div class="detail-item">
                    <div class="detail-item-label">Stack Size</div>
                    <div class="detail-item-value">${item.stackSize}</div>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    // Prices
    html += `
        <div class="detail-section">
            <h3>💰 Economy</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-item-label">Sell Price</div>
                    <div class="detail-item-value" style="color: var(--success);">${item.sellPrice.toLocaleString()}¢</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Buy Price</div>
                    <div class="detail-item-value" style="color: var(--danger);">${item.buyPrice.toLocaleString()}¢</div>
                </div>
            </div>
        </div>
    `;

    // Stats
    if (item.stats) {
        html += `
            <div class="detail-section">
                <h3>📊 Stats</h3>
                <div class="detail-grid">
                    ${Object.entries(item.stats).map(([key, value]) => `
                        <div class="detail-item">
                            <div class="detail-item-label">${formatStatName(key)}</div>
                            <div class="detail-item-value">${value}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Crafting
    if (item.crafting && item.crafting.canCraft) {
        html += `
            <div class="detail-section">
                <h3>🔨 Crafting</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-item-label">Workbench</div>
                        <div class="detail-item-value">${item.crafting.workbench}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-item-label">Craft Time</div>
                        <div class="detail-item-value">${item.crafting.craftTime}s</div>
                    </div>
                </div>
                <h4 style="color: var(--text-secondary); margin: 16px 0 8px; font-size: 0.95rem;">Required Materials:</h4>
                <ul class="materials-list">
                    ${item.crafting.materials.map(mat => `
                        <li>
                            <span class="material-name">${mat.item}</span>
                            <span class="material-qty">×${mat.quantity}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    } else {
        html += `
            <div class="detail-section">
                <h3>🔨 Crafting</h3>
                <p style="color: var(--text-secondary);">This item cannot be crafted.</p>
            </div>
        `;
    }

    // Salvage
    if (item.salvage && item.salvage.canSalvage) {
        html += `
            <div class="detail-section">
                <h3>♻️ Salvage</h3>
                <p style="color: var(--text-secondary); margin-bottom: 12px;">Salvaging this item yields:</p>
                <ul class="materials-list">
                    ${item.salvage.yields.map(mat => `
                        <li>
                            <div>
                                <span class="material-name">${mat.item}</span>
                                <span style="color: var(--text-secondary); font-size: 0.85rem; margin-left: 8px;">(${mat.chance}% chance)</span>
                            </div>
                            <span class="material-qty">×${mat.quantity}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    } else {
        html += `
            <div class="detail-section">
                <h3>♻️ Salvage</h3>
                <p style="color: var(--text-secondary);">This item cannot be salvaged.</p>
            </div>
        `;
    }

    // Locations
    if (item.locations && item.locations.length > 0) {
        html += `
            <div class="detail-section">
                <h3>📍 Locations</h3>
                <p style="color: var(--text-secondary); margin-bottom: 12px;">Where to find this item:</p>
                <ul class="locations-list">
                    ${item.locations.map(loc => `
                        <li>
                            <div>
                                <div class="location-name">${loc.area}</div>
                                <div style="color: var(--text-secondary); font-size: 0.85rem;">${loc.type}</div>
                            </div>
                            <span class="location-rarity rarity-${loc.rarity.replace(' ', '')}">${loc.rarity}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    // Vendors
    if (item.vendors && item.vendors.length > 0) {
        html += `
            <div class="detail-section">
                <h3>🏪 Vendors</h3>
                <p style="color: var(--text-secondary); margin-bottom: 12px;">Available from:</p>
                <ul class="vendors-list">
                    ${item.vendors.map(vendor => `
                        <li>
                            <div>
                                <div class="vendor-name">${vendor.name}</div>
                                <div style="color: var(--text-secondary); font-size: 0.85rem;">Stock: ${vendor.stock}</div>
                            </div>
                            <span class="vendor-price">${vendor.price.toLocaleString()}¢</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    // Used In
    if (item.usedIn && item.usedIn.length > 0) {
        html += `
            <div class="detail-section">
                <h3>🔧 Used In</h3>
                <p style="color: var(--text-secondary); margin-bottom: 12px;">This material is used to craft:</p>
                <ul style="list-style: none;">
                    ${item.usedIn.map(recipe => `
                        <li style="background: var(--bg-tertiary); padding: 8px 12px; border-radius: 6px; margin-bottom: 6px;">
                            ${recipe}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    // Unlocks
    if (item.unlocks) {
        html += `
            <div class="detail-section">
                <h3>🔓 Unlocks</h3>
                <p style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; color: var(--success);">
                    ${item.unlocks}
                </p>
            </div>
        `;
    }

    return html;
}

// Close Detail
function closeDetail() {
    itemDetail.style.display = 'none';
    selectedItem = null;
}

// Update Stats
function updateStats() {
    totalItemsEl.textContent = allItems.length;
    filteredItemsEl.textContent = filteredItems.length;
}

// Reset Filters
function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    tierFilter.value = 'all';
    rarityFilter.value = 'all';
    filterItems();
}

// Utility: Format Stat Name
function formatStatName(name) {
    return name.replace(/([A-Z])/g, ' $1')
               .replace(/^./, str => str.toUpperCase())
               .trim();
}

// Start the app
init();
