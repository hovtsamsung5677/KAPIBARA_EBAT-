class Game {
    static HELPER_RENDER_INFO = {
        capy_baby: { baseScale: 0.10 },
        capy_worker: { baseScale: 0.13 },
        capy_farmer: { baseScale: 0.16 },
        capy_manager: { baseScale: 0.20 },
        capy_boss: { baseScale: 0.26 }
    };

    static SLOTS_DESKTOP = {
        capy_baby: [
            { nx: 0.38, ny: 0.70 }, { nx: 0.35, ny: 0.74 }, { nx: 0.42, ny: 0.73 },
            { nx: 0.65, ny: 0.70 }, { nx: 0.68, ny: 0.74 }, { nx: 0.62, ny: 0.73 }
        ],
        capy_worker: [
            { nx: 0.36, ny: 0.68 }, { nx: 0.33, ny: 0.72 }, { nx: 0.40, ny: 0.71 },
            { nx: 0.67, ny: 0.68 }, { nx: 0.70, ny: 0.72 }, { nx: 0.64, ny: 0.71 }
        ],
        capy_farmer: [
            { nx: 0.30, ny: 0.66 }, { nx: 0.27, ny: 0.70 }, { nx: 0.34, ny: 0.69 },
            { nx: 0.73, ny: 0.66 }, { nx: 0.76, ny: 0.70 }, { nx: 0.70, ny: 0.69 }
        ],
        capy_manager: [
            { nx: 0.25, ny: 0.64 }, { nx: 0.22, ny: 0.68 }, { nx: 0.29, ny: 0.67 },
            { nx: 0.78, ny: 0.64 }, { nx: 0.81, ny: 0.68 }, { nx: 0.74, ny: 0.67 }
        ],
        capy_boss: [
            { nx: 0.20, ny: 0.62 }, { nx: 0.17, ny: 0.66 }, { nx: 0.24, ny: 0.65 },
            { nx: 0.83, ny: 0.62 }, { nx: 0.86, ny: 0.66 }, { nx: 0.79, ny: 0.65 }
        ]
    };

    static SLOTS_MOBILE = {
        capy_baby: [
            { nx: 0.70, ny: 0.68 }, { nx: 0.67, ny: 0.72 }, { nx: 0.74, ny: 0.71 },
            { nx: 0.77, ny: 0.66 }, { nx: 0.66, ny: 0.74 }, { nx: 0.80, ny: 0.70 }
        ],
        capy_worker: [
            { nx: 0.72, ny: 0.66 }, { nx: 0.69, ny: 0.70 }, { nx: 0.76, ny: 0.69 },
            { nx: 0.79, ny: 0.64 }, { nx: 0.68, ny: 0.72 }, { nx: 0.82, ny: 0.68 }
        ],
        capy_farmer: [
            { nx: 0.65, ny: 0.64 }, { nx: 0.62, ny: 0.68 }, { nx: 0.69, ny: 0.67 },
            { nx: 0.85, ny: 0.64 }, { nx: 0.87, ny: 0.68 }, { nx: 0.81, ny: 0.67 }
        ],
        capy_manager: [
            { nx: 0.61, ny: 0.62 }, { nx: 0.58, ny: 0.66 }, { nx: 0.65, ny: 0.65 },
            { nx: 0.89, ny: 0.62 }, { nx: 0.91, ny: 0.66 }, { nx: 0.85, ny: 0.65 }
        ],
        capy_boss: [
            { nx: 0.57, ny: 0.60 }, { nx: 0.54, ny: 0.64 }, { nx: 0.61, ny: 0.63 },
            { nx: 0.93, ny: 0.60 }, { nx: 0.95, ny: 0.64 }, { nx: 0.89, ny: 0.63 }
        ]
    };

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.currency = 0;
        this.totalCurrency = 0;
        this.helpers = [];
        this.lastSaveTime = Date.now();
        this.lastFullscreenAdTime = 0;
        this.rewardedMultiplierActive = false;
        this.rewardedMultiplierEndTime = 0;
        this.clickParticles = [];
        this.capybaraScale = 1;
        this.clickLevel = 0;
        this.totalClicks = 0;
        this.unlockedAchievements = [];
        this.goldenTaps = 0;
        this.clickUpgradeCount = 0;
        this.prestigePoints = 0;
        this.prestigeCount = 0;
        this.lastLoginDate = null;
        this.loginStreak = 0;
        this.dailyClaimed = false;
        this.dailyQuests = [];
        this.dailyQuestProgress = {};
        this.dailyQuestClaimed = {};
        this.lastQuestDate = null;
        this.farmSprites = [];
        this.goldenEvent = null;
        this.nextGoldenTime = Date.now() + 60000 + Math.random() * 60000;
        this.lastAchievementCheck = 0;
        this.lastClickTime = 0;
        this.comboCount = 0;
        this.comboMultiplierEnd = 0;
        this.onboardingStep = 0;
        this.onboardingDone = false;
        this.grid = {};
        this.diamonds = 0;
        this.lastDiamondAdTime = 0;
        this.diamondUpgrades = {};
        this.diamondGrid = {};
        this.diamondCapybaraEvent = null;
        this.lastDiamondCapybaraSpawnTime = 0;
        this.diamondCapybaraSpawnCooldown = 90000 + Math.random() * 60000;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.cx = this.canvas.width / 2;
        this.cy = this.canvas.height / 2;
        this.groundY = this.canvas.width < 600 ? this.canvas.height * 0.62 : this.canvas.height * 0.75;
        for (const sprite of this.farmSprites) {
            sprite.x = sprite.nx * this.canvas.width;
            sprite.y = sprite.ny * this.canvas.height;
        }
    }

    getNextSlot(helperId, index) {
        const isMobile = this.canvas.width < 600;
        const slots = isMobile ? Game.SLOTS_MOBILE : Game.SLOTS_DESKTOP;
        const slot = (slots[helperId] || slots['capy_baby'])[index % 6];
        const info = Game.HELPER_RENDER_INFO[helperId] || Game.HELPER_RENDER_INFO['capy_baby'];
        return { nx: slot.nx, ny: slot.ny, scale: info.baseScale };
    }

    syncFarmSprites(helper) {
        const currentSprites = this.farmSprites.filter(s => s.helperId === helper.id);
        const targetCount = Math.min(6, Math.ceil(Math.sqrt(helper.level)));
        while (currentSprites.length > targetCount) {
            const s = currentSprites.pop();
            const idx = this.farmSprites.indexOf(s);
            if (idx >= 0) this.farmSprites.splice(idx, 1);
        }
        for (let i = currentSprites.length; i < targetCount; i++) {
            const slot = this.getNextSlot(helper.id, i);
            this.farmSprites.push({
                helperId: helper.id,
                icon: helper.icon,
                nx: slot.nx,
                ny: slot.ny,
                x: slot.nx * this.canvas.width,
                y: slot.ny * this.canvas.height,
                baseScale: slot.scale,
                appearProgress: 0,
                bobOffset: Math.random() * Math.PI * 2,
                bobSpeed: 1.5 + Math.random() * 1.5
            });
        }
    }

    drawCentered(ctx, img, cx, cy, targetSize) {
        const aspect = img.naturalWidth / img.naturalHeight;
        let dw = targetSize, dh = targetSize / aspect;
        if (dh > targetSize) { dh = targetSize; dw = targetSize * aspect; }
        ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
    }

    getHelperImage(helperId) {
        const key = 'helperIcons.' + helperId;
        return this.assets[key] || null;
    }

    init() {
        this.helpers = GAME_CONFIG.helpers.map(h => ({
            id: h.id,
            name: h.name,
            baseCost: h.baseCost,
            baseIncome: h.baseIncome,
            icon: h.icon,
            level: 0
        }));
    }

    click(x, y) {
        const now = Date.now();
        if (now - this.lastClickTime < 500) {
            this.comboCount++;
        } else {
            this.comboCount = 1;
        }
        this.lastClickTime = now;
        if (this.comboCount >= 10 && now > this.comboMultiplierEnd) {
            this.comboMultiplierEnd = now + 3000;
        }
        let crit = false;
        let critMultiplier = 1;
        if (Math.random() < 0.05) {
            crit = true;
            critMultiplier = 3 + Math.floor(Math.random() * 3);
        }
        const comboMult = now < this.comboMultiplierEnd ? 1.5 : 1;
        const totalMult = comboMult * critMultiplier;
        const value = this.getClickValue() * totalMult;
        this.currency += value;
        this.totalCurrency += value;
        this.totalClicks++;
        this.capybaraScale = 1.15;
        const text = '+' + formatNumber(value) + (crit ? ' КРИТ!' : '');
        this.clickParticles.push({
            x: x || this.cx,
            y: y || this.cy,
            life: 1,
            text: text,
            crit: crit
        });
        this.updateDailyQuestProgress('clicks', 1);
    }

    buyHelper(helperId) {
        const helper = this.helpers.find(h => h.id === helperId);
        if (!helper) return false;
        const cost = window.isAdminMode ? 0 : this.getHelperCost(helper);
        if (this.currency < cost) return false;
        this.currency -= cost;
        helper.level++;
        this.syncFarmSprites(helper);
        this.updateDailyQuestProgress('buy', 1);
        return true;
    }

    buyClickUpgrade() {
        const cost = window.isAdminMode ? 0 : this.getClickUpgradeCost();
        if (this.currency < cost) return false;
        this.currency -= cost;
        this.clickLevel++;
        this.clickUpgradeCount++;
        return true;
    }

    getHelperCost(helper) {
        return Math.floor(helper.baseCost * Math.pow(1.15, helper.level));
    }

    getClickValue() {
        let value = GAME_CONFIG.clickValue * (1 + this.clickLevel * 0.5) * this.getPrestigeMultiplier();
        const du = this.diamondUpgrades || {};
        if (du.click_boost > 0) {
            const upgrade = DIAMOND_UPGRADES.find(u => u.id === 'click_boost');
            value *= (1 + du.click_boost * upgrade.effect.value);
        }
        return value;
    }

    getClickUpgradeCost() {
        const helperIncome = this.helpers.reduce((sum, h) => sum + h.baseIncome * h.level, 0);
        const base = Math.max(50, helperIncome * 50);
        return Math.floor(base * Math.pow(1.18, this.clickLevel));
    }

    getPrestigeMultiplier() {
        const points = this.getPrestigePoints();
        return 1 + points * 0.02;
    }

    getPrestigePoints() {
        return Math.floor(Math.sqrt(this.totalCurrency / 1000));
    }

    isPrestigeAvailable() {
        const bossCost = this.getHelperCost(this.helpers[this.helpers.length - 1]);
        return this.totalCurrency >= Math.max(100000, bossCost * 5);
    }

    getTodayDate() {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    updateDailyLogin() {
        const today = this.getTodayDate();
        if (!this.lastLoginDate) {
            this.lastLoginDate = today;
            this.loginStreak = 1;
            this.dailyClaimed = false;
            return;
        }
        if (this.lastLoginDate === today) {
            this.dailyClaimed = this.dailyClaimed;
            return;
        }
        const last = new Date(this.lastLoginDate);
        const curr = new Date(today);
        const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            this.loginStreak++;
        } else if (diffDays > 1) {
            this.loginStreak = 1;
        }
        this.lastLoginDate = today;
        this.dailyClaimed = false;
    }

    claimDailyReward() {
        if (this.dailyClaimed) return 0;
        const streak = Math.min(this.loginStreak, 7);
        const base = 50;
        const reward = base * streak;
        this.currency += reward;
        this.dailyClaimed = true;
        return reward;
    }

    generateDailyQuests() {
        const today = this.getTodayDate();
        if (this.lastQuestDate === today) return;
        this.lastQuestDate = today;
        this.dailyQuests = [];
        this.dailyQuestProgress = {};
        this.dailyQuestClaimed = {};
        const types = [
            { type: 'clicks', desc: 'Сделай {target} кликов', target: () => 50 + Math.floor(Math.random() * 50) },
            { type: 'earn', desc: 'Заработай {target} апельсинов', target: () => 500 + Math.floor(Math.random() * 500) },
            { type: 'buy', desc: 'Купи/улучши {target} помощников', target: () => 5 + Math.floor(Math.random() * 5) }
        ];
        const shuffled = types.sort(() => Math.random() - 0.5).slice(0, 2);
        for (const q of shuffled) {
            const target = q.target();
            const id = q.type + '_' + target;
            this.dailyQuests.push({ id, type: q.type, desc: q.desc.replace('{target}', target), target, reward: target * 10 });
            this.dailyQuestProgress[id] = 0;
            this.dailyQuestClaimed[id] = false;
        }
    }

    startOnboarding() {
        if (this.onboardingDone) return;
        this.onboardingStep = 1;
    }

    nextOnboardingStep() {
        this.onboardingStep++;
        if (this.onboardingStep > 3) {
            this.onboardingDone = true;
            this.onboardingStep = 0;
        }
    }

    updateDailyQuestProgress(type, amount) {
        this.generateDailyQuests();
        for (const q of this.dailyQuests) {
            if (q.type === type && !this.dailyQuestClaimed[q.id]) {
                this.dailyQuestProgress[q.id] = Math.min(q.target, (this.dailyQuestProgress[q.id] || 0) + amount);
            }
        }
    }

    claimDailyQuest(questId) {
        const q = this.dailyQuests.find(q => q.id === questId);
        if (!q || this.dailyQuestClaimed[questId]) return 0;
        if ((this.dailyQuestProgress[questId] || 0) < q.target) return 0;
        this.dailyQuestClaimed[questId] = true;
        this.currency += q.reward;
        return q.reward;
    }

    doPrestige() {
        if (!this.isPrestigeAvailable()) return;
        const points = this.getPrestigePoints();
        this.currency = 0;
        this.helpers.forEach(h => h.level = 0);
        this.clickLevel = 0;
        this.farmSprites = [];
        this.grid = {};
        this.prestigePoints = (this.prestigePoints || 0) + points;
        this.prestigeCount = (this.prestigeCount || 0) + 1;
        this.lastSaveTime = Date.now();
        return true;
    }

    getBuildingCost(buildingId, currentLevel) {
        const type = BUILDING_TYPES.find(b => b.id === buildingId);
        if (!type) return Infinity;
        return Math.floor(type.baseCost * Math.pow(BUILDING_COST_GROWTH, currentLevel));
    }

    buildOrUpgrade(cellKey, buildingId) {
        const current = this.grid[cellKey];
        const nextLevel = current && current.buildingId === buildingId ? current.level + 1 : 1;
        const cost = window.isAdminMode ? 0 : this.getBuildingCost(buildingId, current ? current.level : 0);
        if (this.currency < cost) return false;
        this.currency -= cost;
        this.grid[cellKey] = { buildingId, level: nextLevel };
        this.updateDailyQuestProgress('buy', 1);
        return true;
    }

    demolish(cellKey) {
        if (this.grid[cellKey]) {
            delete this.grid[cellKey];
        }
    }

    getDiamondUpgradeCost(upgradeId) {
        const upgrade = DIAMOND_UPGRADES.find(u => u.id === upgradeId);
        if (!upgrade) return Infinity;
        const currentLevel = (this.diamondUpgrades && this.diamondUpgrades[upgradeId]) || 0;
        if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return Infinity;
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costGrowth, currentLevel));
    }

    buyDiamondUpgrade(upgradeId) {
        const upgrade = DIAMOND_UPGRADES.find(u => u.id === upgradeId);
        if (!upgrade) return false;
        const currentLevel = (this.diamondUpgrades && this.diamondUpgrades[upgradeId]) || 0;
        if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return false;
        const cost = this.getDiamondUpgradeCost(upgradeId);
        if (this.diamonds < cost) return false;
        this.diamonds -= cost;
        this.diamondUpgrades = this.diamondUpgrades || {};
        this.diamondUpgrades[upgradeId] = currentLevel + 1;
        return true;
    }

    getDiamondBuildingCost(buildingId, currentLevel) {
        const type = DIAMOND_BUILDINGS.find(b => b.id === buildingId);
        if (!type) return Infinity;
        return Math.floor(type.diamondCost * Math.pow(type.costGrowth, currentLevel));
    }

    buildOrUpgradeDiamond(cellKey, buildingId) {
        const current = this.diamondGrid && this.diamondGrid[cellKey];
        const nextLevel = current && current.buildingId === buildingId ? current.level + 1 : 1;
        const cost = window.isAdminMode ? 0 : this.getDiamondBuildingCost(buildingId, current ? current.level : 0);
        if (this.diamonds < cost) return false;
        this.diamonds -= cost;
        this.diamondGrid = this.diamondGrid || {};
        this.diamondGrid[cellKey] = { buildingId, level: nextLevel };
        return true;
    }

    demolishDiamond(cellKey) {
        if (this.diamondGrid && this.diamondGrid[cellKey]) {
            delete this.diamondGrid[cellKey];
        }
    }

    getDiamondAdCooldownMs() {
        const du = this.diamondUpgrades || {};
        const base = GAME_CONFIG.fullscreenAdCooldownMs;
        if (du.ad_cooldown_cut > 0) {
            const upgrade = DIAMOND_UPGRADES.find(u => u.id === 'ad_cooldown_cut');
            return Math.floor(base * (1 - upgrade.effect.value));
        }
        return base;
    }

    getBuildingIncomeMultiplier() {
        let bonus = 0;
        for (const cell of Object.values(this.grid)) {
            const type = BUILDING_TYPES.find(b => b.id === cell.buildingId);
            if (type && type.effectPerLevel && type.effectPerLevel.type === 'incomeMultiplier') {
                bonus += type.effectPerLevel.value * cell.level;
            }
        }
        return bonus;
    }

    getBuildingOfflineHoursBonus() {
        let bonus = 0;
        for (const cell of Object.values(this.grid)) {
            const type = BUILDING_TYPES.find(b => b.id === cell.buildingId);
            if (type && type.effectPerLevel && type.effectPerLevel.type === 'offlineHoursBonus') {
                bonus += type.effectPerLevel.value * cell.level;
            }
        }
        return bonus;
    }

    isInSafeZone(x, y) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const helpersWidth = w < 600 ? 140 : 320;
        const helpersHeight = Math.min(h * 0.55, h * (w < 600 ? 0.35 : 0.55));
        const rewardW = 120;
        const rewardH = 100;
        if (x < 16 + helpersWidth && y > h - 16 - helpersHeight) return false;
        if (x > w - 16 - rewardW && y < 120 + rewardH) return false;
        const currencyPanelWidth = 220;
        const currencyPanelHeight = 70;
        const currencyPanelX = w / 2 - currencyPanelWidth / 2;
        if (x > currencyPanelX && x < currencyPanelX + currencyPanelWidth && y < 16 + currencyPanelHeight) return false;
        return true;
    }

    trySpawnGoldenEvent() {
        if (this.goldenEvent && this.goldenEvent.active) return;
        if (Date.now() < this.nextGoldenTime) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const margin = 60;
        for (let i = 0; i < 20; i++) {
            const x = margin + Math.random() * (w - margin * 2);
            const y = margin + Math.random() * (h - margin * 2);
            if (this.isInSafeZone(x, y)) {
                this.goldenEvent = {
                    x,
                    y,
                    expiresAt: Date.now() + 10000,
                    active: true
                };
                this.nextGoldenTime = Date.now() + 60000 + Math.random() * 60000;
                break;
            }
        }
    }

    claimGoldenEvent() {
        if (!this.goldenEvent || !this.goldenEvent.active) return;
        const bonus = this.getPassiveIncome() * 30;
        this.currency += bonus;
        this.totalCurrency += bonus;
        this.goldenTaps++;
        this.goldenEvent.active = false;
        this.clickParticles.push({
            x: this.goldenEvent.x,
            y: this.goldenEvent.y,
            life: 1,
            text: '+' + formatNumber(bonus)
        });
    }

    spawnDiamondCapybara() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        if (edge === 0) { x = Math.random() * w; y = -30; }
        else if (edge === 1) { x = w + 30; y = Math.random() * h; }
        else if (edge === 2) { x = Math.random() * w; y = h + 30; }
        else { x = -30; y = Math.random() * h; }

        const angle = Math.random() * Math.PI * 2;
        const speed = 25;
        this.diamondCapybaraEvent = {
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            spawnTime: Date.now(),
            wobblePhase: Math.random() * Math.PI * 2,
            active: true
        };
        this.lastDiamondCapybaraSpawnTime = Date.now();
        this.diamondCapybaraSpawnCooldown = 90000 + Math.random() * 60000;
    }

    claimDiamondCapybara() {
        if (!this.diamondCapybaraEvent || !this.diamondCapybaraEvent.active) return false;
        this.diamondCapybaraEvent = null;
        return true;
    }

    getPassiveIncome() {
        let income = 0;
        for (const helper of this.helpers) {
            income += helper.baseIncome * helper.level;
        }
        if (this.rewardedMultiplierActive) {
            income *= GAME_CONFIG.rewardedMultiplier;
        }
        const buildingMult = 1 + this.getBuildingIncomeMultiplier();
        const diamondMult = 1 + this.getDiamondBuildingIncomeMultiplier() + this.getDiamondUpgradeIncomeMultiplier();
        return income * buildingMult * diamondMult * this.getPrestigeMultiplier();
    }

    getDiamondBuildingIncomeMultiplier() {
        let bonus = 0;
        for (const cell of Object.values(this.diamondGrid || {})) {
            const type = DIAMOND_BUILDINGS.find(b => b.id === cell.buildingId);
            if (type && type.effectPerLevel && type.effectPerLevel.type === 'incomeMultiplier') {
                bonus += type.effectPerLevel.value * cell.level;
            }
        }
        return bonus;
    }

    getDiamondUpgradeIncomeMultiplier() {
        const du = this.diamondUpgrades || {};
        let bonus = 0;
        if (du.income_boost > 0) {
            const upgrade = DIAMOND_UPGRADES.find(u => u.id === 'income_boost');
            bonus += du.income_boost * upgrade.effect.value;
        }
        return bonus;
    }

    update(deltaTime) {
        if (this.rewardedMultiplierActive && Date.now() > this.rewardedMultiplierEndTime) {
            this.rewardedMultiplierActive = false;
        }
        if (this.goldenEvent && this.goldenEvent.active && Date.now() > this.goldenEvent.expiresAt) {
            this.goldenEvent.active = false;
        }
        const income = this.getPassiveIncome();
        if (income > 0) {
            this.currency += income * deltaTime;
            this.totalCurrency += income * deltaTime;
            this.updateDailyQuestProgress('earn', income * deltaTime);
        }
        this.capybaraScale += (1 - this.capybaraScale) * 0.15;
        if (Math.abs(this.capybaraScale - 1) < 0.01) this.capybaraScale = 1;
        for (let i = this.clickParticles.length - 1; i >= 0; i--) {
            const p = this.clickParticles[i];
            p.life -= deltaTime * 2;
            p.y -= deltaTime * 30;
            if (p.life <= 0) this.clickParticles.splice(i, 1);
        }
        for (const sprite of this.farmSprites) {
            if (sprite.appearProgress < 1) {
                sprite.appearProgress = Math.min(1, sprite.appearProgress + deltaTime * 2.5);
            }
        }
        this.trySpawnGoldenEvent();
        if (!this.diamondCapybaraEvent && Date.now() - this.lastDiamondCapybaraSpawnTime > this.diamondCapybaraSpawnCooldown) {
            this.spawnDiamondCapybara();
        }
        if (this.diamondCapybaraEvent && this.diamondCapybaraEvent.active) {
            const ev = this.diamondCapybaraEvent;
            const elapsed = Date.now() - ev.spawnTime;
            if (elapsed > 30000) {
                this.diamondCapybaraEvent = null;
            } else {
                ev.wobblePhase += deltaTime * 2;
                ev.x += ev.vx * deltaTime + Math.sin(ev.wobblePhase) * 8 * deltaTime;
                ev.y += ev.vy * deltaTime + Math.cos(ev.wobblePhase * 0.7) * 8 * deltaTime;
                const margin = 40;
                if (ev.x < margin || ev.x > this.canvas.width - margin) ev.vx *= -1;
                if (ev.y < margin || ev.y > this.canvas.height - margin) ev.vy *= -1;
            }
        }
        this.generateDailyQuests();
        const now = Date.now();
        if (now - this.lastClickTime > 500) {
            this.comboCount = 0;
        }
        if (now - this.lastAchievementCheck > 500) {
            this.lastAchievementCheck = now;
            this.checkAchievements();
        }
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const w = this.canvas.width;
        const h = this.canvas.height;

        if (this.assets.background) {
            const bg = this.assets.background;
            const canvasRatio = w / h;
            const imgRatio = bg.naturalWidth / bg.naturalHeight;
            let sx, sy, sw, sh;
            if (imgRatio > canvasRatio) {
                sh = bg.naturalHeight;
                sw = sh * canvasRatio;
                sx = (bg.naturalWidth - sw) / 2;
                sy = 0;
            } else {
                sw = bg.naturalWidth;
                sh = sw / canvasRatio;
                sx = 0;
                sy = (bg.naturalHeight - sh) / 2;
            }
            ctx.drawImage(bg, sx, sy, sw, sh, 0, 0, w, h);
        } else {
            ctx.fillStyle = '#FFF8E1';
            ctx.fillRect(0, 0, w, h);
        }

        const groundY = this.groundY;
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.beginPath();
        ctx.ellipse(this.cx, groundY + 18, Math.min(w, h) * 0.22, Math.min(w, h) * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();

        const pondX = w * 0.6;
        const pondY = groundY + Math.min(40, h * 0.06);
        const pondW = Math.min(180, w * 0.28);
        const pondH = Math.min(40, h * 0.06);
        const t = Date.now() / 1000;
        ctx.globalAlpha = 0.7;
        for (let k = 0; k < 3; k++) {
            const sparkX = pondX - pondW / 2 + 20 + ((t * 18 + k * 55) % Math.max(1, pondW - 40));
            const sparkY = pondY - 4 + Math.sin(t * 2 + k) * 2;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.ellipse(sparkX, sparkY, 3, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        for (let i = 0; i < this.farmSprites.length; i++) {
            const sprite = this.farmSprites[i];
            const scale = sprite.baseScale * Math.min(1, sprite.appearProgress);
            if (scale <= 0) continue;
            const size = Math.min(this.canvas.width, this.canvas.height) * scale;
            const bob = Math.sin(Date.now() / 1000 * sprite.bobSpeed + sprite.bobOffset) * size * 0.05;
            const img = this.getHelperImage(sprite.helperId);
            if (img) {
                this.drawCentered(ctx, img, sprite.x, sprite.y + bob, size);
            }
        }
        const helperGroups = {};
        for (const sprite of this.farmSprites) {
            if (!helperGroups[sprite.helperId]) helperGroups[sprite.helperId] = [];
            helperGroups[sprite.helperId].push(sprite);
        }
        for (const helper of this.helpers) {
            const group = helperGroups[helper.id];
            const displayCount = Math.min(6, Math.ceil(Math.sqrt(helper.level)));
            if (group && group.length > 0 && helper.level > displayCount) {
                const last = group[group.length - 1];
                const scale = last.baseScale * Math.min(1, last.appearProgress);
                const size = Math.min(this.canvas.width, this.canvas.height) * scale;
                const badgeX = last.x + size * 0.5;
                const badgeY = last.y - size * 0.5;
                const badgeR = size * 0.3;
                ctx.fillStyle = '#D32F2F';
                ctx.beginPath();
                ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFF';
                ctx.font = `bold ${Math.max(10, size * 0.35)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('×' + helper.level, badgeX, badgeY);
            }
        }
        if (this.goldenEvent && this.goldenEvent.active) {
            const t = Date.now() / 1000;
            const pulse = 1 + Math.sin(t * 4) * 0.1;
            const size = Math.min(this.canvas.width, this.canvas.height) * 0.18 * pulse;
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#FFD700';
            if (this.assets.goldenEvent) {
                this.drawCentered(ctx, this.assets.goldenEvent, this.goldenEvent.x, this.goldenEvent.y, size);
            }
            ctx.shadowBlur = 0;
        }
        const size = Math.min(w, h) * 0.35 * this.capybaraScale;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (this.assets.capybaraFine && this.capybaraScale > 1.02) {
            this.drawCentered(ctx, this.assets.capybaraFine, this.cx, this.cy, size);
        } else if (this.assets.capybaraSleep && Date.now() - this.lastClickTime > 15000) {
            this.drawCentered(ctx, this.assets.capybaraSleep, this.cx, this.cy, size);
        } else if (this.assets.capybaraNorm) {
            this.drawCentered(ctx, this.assets.capybaraNorm, this.cx, this.cy, size);
        } else {
            ctx.font = size + 'px serif';
            ctx.fillText('🐹', this.cx, this.cy);
        }
        if (this.diamondCapybaraEvent && this.diamondCapybaraEvent.active) {
            const ev = this.diamondCapybaraEvent;
            const pulse = 1 + Math.sin(Date.now() / 200) * 0.08;
            const dcSize = 70 * pulse;
            ctx.save();
            ctx.shadowColor = '#29B6F6';
            ctx.shadowBlur = 20;
            const dcImg = this.assets.diamondCapybara;
            if (dcImg) {
                this.drawCentered(ctx, dcImg, ev.x, ev.y, dcSize);
            } else {
                ctx.fillStyle = '#29B6F6';
                ctx.beginPath();
                ctx.arc(ev.x, ev.y, dcSize / 2, 0, Math.PI * 2);
                ctx.fill();
                const fallbackImg = this.assets.diamondIcon;
                if (fallbackImg) {
                    this.drawCentered(ctx, fallbackImg, ev.x, ev.y, dcSize * 0.6);
                } else {
                    ctx.fillStyle = '#FFF';
                    ctx.font = 'bold ' + Math.max(10, dcSize * 0.3) + 'px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💎', ev.x, ev.y);
                }
            }
            ctx.restore();
            const remaining = 1 - (Date.now() - ev.spawnTime) / 30000;
            ctx.strokeStyle = 'rgba(41, 182, 246, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(ev.x, ev.y, dcSize / 2 + 8, -Math.PI / 2, -Math.PI / 2 + remaining * Math.PI * 2);
            ctx.stroke();
        }
        for (const p of this.clickParticles) {
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.font = p.crit ? 'bold 30px sans-serif' : '24px sans-serif';
            ctx.fillStyle = p.crit ? '#D32F2F' : '#3E2723';
            ctx.fillText(p.text, p.x, p.y);
        }
        ctx.globalAlpha = 1;
        if (this.comboCount >= 10 && Date.now() < this.comboMultiplierEnd) {
            const remaining = Math.max(0, Math.ceil((this.comboMultiplierEnd - Date.now()) / 1000));
            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = '#E91E63';
            ctx.textAlign = 'center';
            ctx.fillText(`COMBO x1.5 ${remaining}с`, this.cx, this.cy + Math.min(w, h) * 0.35 * this.capybaraScale + 50);
        }
        if (this.rewardedMultiplierActive) {
            const remaining = Math.max(0, Math.ceil((this.rewardedMultiplierEndTime - Date.now()) / 1000));
            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = '#3E2723';
            ctx.textAlign = 'center';
            ctx.fillText('x2 доход: ' + remaining + 'с', this.cx, this.cy + size / 2 + 30);
        }
    }

    async save() {
        const data = {
            currency: this.currency,
            totalCurrency: this.totalCurrency,
            helpers: this.helpers.map(h => ({ id: h.id, level: h.level })),
            clickLevel: this.clickLevel,
            totalClicks: this.totalClicks,
            unlockedAchievements: this.unlockedAchievements,
            goldenTaps: this.goldenTaps,
            clickUpgradeCount: this.clickUpgradeCount,
            prestigePoints: this.prestigePoints,
            prestigeCount: this.prestigeCount,
            lastLoginDate: this.lastLoginDate,
            loginStreak: this.loginStreak,
            dailyClaimed: this.dailyClaimed,
            dailyQuests: this.dailyQuests,
            dailyQuestProgress: this.dailyQuestProgress,
            dailyQuestClaimed: this.dailyQuestClaimed,
            lastQuestDate: this.lastQuestDate,
            onboardingDone: this.onboardingDone,
            grid: this.grid,
            diamonds: this.diamonds,
            lastDiamondAdTime: this.lastDiamondAdTime,
            diamondUpgrades: this.diamondUpgrades,
            diamondGrid: this.diamondGrid,
            lastSaveTime: Date.now()
        };
        await savePlayerData(data);
        if (!window.isAdminMode) {
            submitScore(this.totalCurrency + this.prestigePoints * 1000);
        }
    }

    loadFromData(data) {
        if (!data) return;
        this.currency = data.currency || 0;
        this.totalCurrency = data.totalCurrency || 0;
        this.lastSaveTime = data.lastSaveTime || Date.now();
        this.clickLevel = data.clickLevel || 0;
        this.totalClicks = data.totalClicks || 0;
        this.unlockedAchievements = data.unlockedAchievements || [];
        this.goldenTaps = data.goldenTaps || 0;
        this.clickUpgradeCount = data.clickUpgradeCount || 0;
        this.prestigePoints = data.prestigePoints || 0;
        this.prestigeCount = data.prestigeCount || 0;
        this.lastLoginDate = data.lastLoginDate || null;
        this.loginStreak = data.loginStreak || 0;
        this.dailyClaimed = data.dailyClaimed || false;
        this.dailyQuests = data.dailyQuests || [];
        this.dailyQuestProgress = data.dailyQuestProgress || {};
        this.dailyQuestClaimed = data.dailyQuestClaimed || {};
        this.lastQuestDate = data.lastQuestDate || null;
        this.onboardingDone = data.onboardingDone || false;
        this.grid = {};
        const savedGrid = data.grid || {};
        const slotKeys = Object.keys(savedGrid);
        if (slotKeys.length > 0 && slotKeys[0].startsWith('r') && slotKeys[0].includes('c')) {
            BUILDING_SLOTS.forEach((slot, index) => {
                if (savedGrid['r' + Math.floor(index / 5) + 'c' + (index % 5)]) {
                    this.grid[slot.id] = savedGrid['r' + Math.floor(index / 5) + 'c' + (index % 5)];
                }
            });
        } else {
            this.grid = savedGrid;
        }
        this.diamonds = data.diamonds || 0;
        this.lastDiamondAdTime = data.lastDiamondAdTime || 0;
        this.diamondUpgrades = data.diamondUpgrades || {};
        this.diamondGrid = data.diamondGrid || {};
        this.updateDailyLogin();
        if (data.helpers && Array.isArray(data.helpers)) {
            for (const saved of data.helpers) {
                const helper = this.helpers.find(h => h.id === saved.id);
                if (helper) {
                    helper.level = saved.level || 0;
                    this.syncFarmSprites(helper);
                }
            }
        }
    }

    getOfflineEarningsAmount() {
        const now = Date.now();
        const offlineMs = now - this.lastSaveTime;
        const maxMs = Math.max(0, (GAME_CONFIG.offlineEarningsMaxHours + this.getBuildingOfflineHoursBonus()) * 60 * 60 * 1000);
        const cappedMs = Math.min(offlineMs, maxMs);
        if (cappedMs <= 0) return 0;
        const income = this.getPassiveIncome();
        return Math.floor(income * (cappedMs / 1000) * 0.5);
    }

    calculateOfflineEarnings() {
        const amount = this.getOfflineEarningsAmount();
        this.currency += amount;
        this.lastSaveTime = Date.now();
        return amount;
    }

    isAutoOfflineCollect() {
        const du = this.diamondUpgrades || {};
        return du.auto_offline >= 1;
    }

    checkAchievements() {
        if (!window.ACHIEVEMENTS) return;
        const values = {
            clicks: this.totalClicks,
            totalHelperCount: this.helpers.reduce((sum, h) => sum + h.level, 0),
            anyHelperLevel: Math.max(0, ...this.helpers.map(h => h.level)),
            totalCurrency: this.totalCurrency,
            goldenTaps: this.goldenTaps,
            prestigeCount: this.prestigeCount || 0,
            clickUpgrades: this.clickUpgradeCount
        };
        for (const ach of window.ACHIEVEMENTS || []) {
            if (this.unlockedAchievements.includes(ach.id)) continue;
            const val = values[ach.type];
            if (val !== undefined && val >= ach.target) {
                this.unlockedAchievements.push(ach.id);
                this.currency += ach.reward.currency;
                this.diamonds += (ach.reward.diamonds || 0);
                ui.showAchievementToast(ach.name);
            }
        }
    }

    activateRewardedMultiplier() {
        this.rewardedMultiplierActive = true;
        this.rewardedMultiplierEndTime = Date.now() + GAME_CONFIG.rewardedDurationSeconds * 1000;
    }
}
