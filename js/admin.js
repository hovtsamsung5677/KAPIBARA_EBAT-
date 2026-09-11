window.isAdminMode = false;

function initAdminTrigger() {
    if (new URLSearchParams(location.search).get('admin') === '1') {
        setAdminMode(true);
    }
    let tapCount = 0;
    let lastTapTime = 0;
    const panel = document.getElementById('currency-panel');
    if (!panel) return;
    panel.addEventListener('click', () => {
        const now = Date.now();
        tapCount = (now - lastTapTime < 3000) ? tapCount + 1 : 1;
        lastTapTime = now;
        if (tapCount >= 7) {
            tapCount = 0;
            setAdminMode(!window.isAdminMode);
        }
    });
}

function setAdminMode(enabled) {
    window.isAdminMode = enabled;
    const banner = document.getElementById('admin-banner');
    const adminPanel = document.getElementById('admin-panel');
    if (banner) banner.classList.toggle('active', enabled);
    if (adminPanel) adminPanel.classList.toggle('active', enabled);
}

function adminAddCurrency() {
    if (!game) return;
    game.currency += 1000000;
    game.totalCurrency += 1000000;
    ui.renderHelpers();
    ui.updateBuilderCurrency();
    ui.updateBuilderStats();
}

function adminUnlockBuildings() {
    if (!game) return;
    const types = BUILDING_TYPES.slice();
    const slots = Object.keys(game.grid);
    let slotIndex = 0;
    const maxSlots = 25;
    for (const type of types) {
        if (slotIndex >= maxSlots) break;
        const key = 'r' + Math.floor(slotIndex / 5) + 'c' + (slotIndex % 5);
        game.grid[key] = { buildingId: type.id, level: 1 };
        slotIndex++;
    }
    ui.renderBuilderGrid();
    ui.updateBuilderStats();
}

function adminMaxHelpers() {
    if (!game) return;
    game.helpers.forEach(h => { h.level = 20; });
    game.helpers.forEach(h => game.syncFarmSprites(h));
    ui.renderHelpers();
}

function adminUnlockAchievements() {
    if (!game || !window.ACHIEVEMENTS) return;
    game.unlockedAchievements = window.ACHIEVEMENTS.map(a => a.id);
}

function adminResetSave() {
    if (!game) return;
    game.currency = 0;
    game.totalCurrency = 0;
    game.helpers.forEach(h => { h.level = 0; });
    game.clickLevel = 0;
    game.farmSprites = [];
    game.grid = {};
    game.unlockedAchievements = [];
    game.prestigePoints = 0;
    game.prestigeCount = 0;
    game.lastSaveTime = Date.now();
    game.helpers.forEach(h => game.syncFarmSprites(h));
    ui.renderHelpers();
    ui.renderBuilderGrid();
    ui.updateBuilderCurrency();
    ui.updateBuilderStats();
    game.save();
}
