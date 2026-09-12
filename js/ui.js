function getContainedImageRect(containerRect, naturalWidth, naturalHeight) {
    const containerRatio = containerRect.width / containerRect.height;
    const imageRatio = naturalWidth / naturalHeight;
    let width, height;
    if (imageRatio > containerRatio) {
        width = containerRect.width;
        height = width / imageRatio;
    } else {
        height = containerRect.height;
        width = height * imageRatio;
    }
    return {
        width,
        height,
        offsetX: (containerRect.width - width) / 2,
        offsetY: (containerRect.height - height) / 2
    };
}

const ui = {
    overlay: null,
    currencyPanel: null,
    currencyCount: null,
    diamondCount: null,
    incomeDisplay: null,
    helpersPanel: null,
    rewardPanel: null,
    soundBtn: null,
    achievementsBtn: null,
    leaderboardBtn: null,
    builderBtn: null,
    diamondBtn: null,
    modalOverlay: null,
    toastTimer: null,

    init() {
        this.overlay = document.getElementById('ui-overlay');
        this.currencyPanel = document.createElement('div');
        this.currencyPanel.id = 'currency-panel';
        this.currencyPanel.className = 'ui-panel';
        this.currencyPanel.innerHTML = '<div id="currency-count">0</div><div id="income-display">0 в секунду</div>';
        this.overlay.appendChild(this.currencyPanel);

        this.currencyCount = document.getElementById('currency-count');
        this.incomeDisplay = document.getElementById('income-display');

        this.diamondPanel = document.createElement('div');
        this.diamondPanel.id = 'diamond-panel';
        this.diamondPanel.className = 'ui-panel';
        this.diamondPanel.innerHTML = '<div id="diamond-count">0 <img class="currency-icon-diamond" src="' + ASSET_PATHS.diamondIcon + '" alt=""></div>';
        this.overlay.appendChild(this.diamondPanel);
        this.diamondCount = document.getElementById('diamond-count');

        this.rewardPanel = document.createElement('div');
        this.rewardPanel.id = 'reward-panel';
        this.overlay.appendChild(this.rewardPanel);

        this.soundBtn = document.createElement('button');
        this.soundBtn.id = 'sound-btn';
        this.soundBtn.textContent = '🔊';
        this.soundBtn.addEventListener('click', () => this.toggleSound());
        this.overlay.appendChild(this.soundBtn);

        this.achievementsBtn = document.createElement('button');
        this.achievementsBtn.id = 'achievements-btn';
        this.achievementsBtn.textContent = '🏆';
        this.achievementsBtn.addEventListener('click', () => this.openAchievements());
        this.overlay.appendChild(this.achievementsBtn);

        this.leaderboardBtn = document.createElement('button');
        this.leaderboardBtn.id = 'leaderboard-btn';
        this.leaderboardBtn.textContent = '🏅';
        this.leaderboardBtn.addEventListener('click', () => this.openLeaderboard());
        this.overlay.appendChild(this.leaderboardBtn);

        this.builderBtn = document.createElement('button');
        this.builderBtn.id = 'builder-btn';
        this.builderBtn.textContent = '🏗️';
        this.builderBtn.addEventListener('click', () => this.openBuilder());
        this.overlay.appendChild(this.builderBtn);

        this.diamondBtn = document.createElement('button');
        this.diamondBtn.id = 'diamond-btn';
        this.diamondBtn.innerHTML = '<img class="diamond-btn-icon" src="' + ASSET_PATHS.diamondIcon + '" alt="Алмазы">';
        this.diamondBtn.addEventListener('click', () => this.openDiamondShop());
        this.overlay.appendChild(this.diamondBtn);

        this.helpersPanel = document.createElement('div');
        this.helpersPanel.id = 'helpers-panel';
        this.overlay.appendChild(this.helpersPanel);

        this.modalOverlay = document.createElement('div');
        this.modalOverlay.id = 'modal-overlay';
        document.body.appendChild(this.modalOverlay);

        this.onboardingOverlay = document.createElement('div');
        this.onboardingOverlay.id = 'onboarding-overlay';
        this.overlay.appendChild(this.onboardingOverlay);

        this.onboardingText = document.createElement('div');
        this.onboardingText.id = 'onboarding-text';
        this.onboardingOverlay.appendChild(this.onboardingText);

        this.onboardingNext = document.createElement('button');
        this.onboardingNext.id = 'onboarding-next';
        this.onboardingNext.className = 'btn btn-buy';
        this.onboardingNext.textContent = 'Понятно';
        this.onboardingNext.addEventListener('click', () => this.nextOnboardingStep());
        this.onboardingOverlay.appendChild(this.onboardingNext);

        this.renderHelpers();
        this.renderRewardButtons();

        if (typeof ResizeObserver !== 'undefined') {
            this.builderResizeObserver = new ResizeObserver(() => {
                const builderScreen = document.getElementById('builder-screen');
                if (builderScreen && !builderScreen.classList.contains('hidden')) {
                    this.renderBuilderGrid();
                    this.updateBuilderCurrency();
                    this.updateBuilderStats();
                }
            });
            const builderGrid = document.getElementById('builder-grid');
            if (builderGrid) {
                this.builderResizeObserver.observe(builderGrid);
            }
        }
    },

    toggleSound() {
        if (isMuted) {
            unmuteGameAudio();
            this.soundBtn.textContent = '🔊';
        } else {
            muteGameAudio();
            this.soundBtn.textContent = '🔇';
        }
    },

    update(currency, income) {
        this.currencyCount.textContent = formatNumber(Math.floor(currency)) + ' ' + GAME_CONFIG.currencyName;
        if (this.diamondCount) {
            this.diamondCount.innerHTML = formatNumber(Math.floor(game.diamonds)) + ' <img class="currency-icon-diamond" src="' + ASSET_PATHS.diamondIcon + '" alt="">';
        }
        if (income < 100) {
            this.incomeDisplay.textContent = income.toFixed(1) + ' ' + GAME_CONFIG.currencyName + ' в секунду';
        } else {
            this.incomeDisplay.textContent = formatNumber(income) + ' ' + GAME_CONFIG.currencyName + ' в секунду';
        }
        const builderScreen = document.getElementById('builder-screen');
        if (builderScreen && !builderScreen.classList.contains('hidden')) {
            this.updateBuilderCurrency();
        }
    },

    renderHelpers() {
        this.helpersPanel.innerHTML = '';
        const clickCard = document.createElement('div');
        clickCard.className = 'helper-card click-upgrade-card';
        const clickCost = game.getClickUpgradeCost();
        const clickValue = game.getClickValue();
        clickCard.innerHTML = `
            <div class="helper-card-header">
                <img class="helper-icon" src="${ASSET_PATHS.helperIcons.capy_baby}" alt="Капибара-кликер">
                <div class="helper-info">
                    <div class="helper-name">Капибара-кликер</div>
                    <div class="helper-level">Уровень: ${game.clickLevel}</div>
                    <div class="helper-income">+${formatNumber(clickValue)} за клик</div>
                </div>
            </div>
            <div class="helper-actions">
                <button class="btn btn-buy btn-click-upgrade" data-action="click-upgrade">Улучшить клик<br><small>${formatNumber(clickCost)} <img class="currency-icon-inline" src="${ASSET_PATHS.currencyIcon}" alt=""></small></button>
            </div>
        `;
        this.helpersPanel.appendChild(clickCard);
        for (const helper of game.helpers) {
            const card = document.createElement('div');
            card.className = 'helper-card';
            const cost = game.getHelperCost(helper);
            const income = helper.baseIncome * helper.level;
            card.innerHTML = `
                <div class="helper-card-header">
                    <img class="helper-icon" src="${ASSET_PATHS.helperIcons[helper.id]}" alt="${helper.name}">
                    <div class="helper-info">
                        <div class="helper-name">${helper.name}</div>
                        <div class="helper-level">Уровень: ${helper.level}</div>
                        <div class="helper-income">+${formatNumber(income)} в секунду</div>
                    </div>
                </div>
                <div class="helper-actions">
                    <button class="btn btn-buy" data-helper="${helper.id}" data-action="buy">Купить<br><small>${formatNumber(cost)} <img class="currency-icon-inline" src="${ASSET_PATHS.currencyIcon}" alt=""></small></button>
                </div>
            `;
            this.helpersPanel.appendChild(card);
        }
        this.helpersPanel.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                if (action === 'click-upgrade') {
                    this.handleClickUpgrade();
                } else {
                    const helperId = e.currentTarget.dataset.helper;
                    if (helperId) this.executeBuyHelper(helperId);
                }
            });
        });
    },

    renderRewardButtons() {
        this.rewardPanel.innerHTML = '';
        const btnOffline = document.createElement('button');
        btnOffline.className = 'btn btn-offline';
        btnOffline.textContent = 'Оффлайн-доход';
        btnOffline.addEventListener('click', () => this.handleOfflineEarnings());
        this.rewardPanel.appendChild(btnOffline);

        if (game.isPrestigeAvailable()) {
            const btnPrestige = document.createElement('button');
            btnPrestige.className = 'btn btn-prestige';
            btnPrestige.textContent = 'Перерождение';
            btnPrestige.addEventListener('click', () => this.handlePrestige());
            this.rewardPanel.appendChild(btnPrestige);
        }

        if (!game.dailyClaimed && game.loginStreak > 0) {
            const btnDaily = document.createElement('button');
            btnDaily.className = 'btn btn-daily';
            btnDaily.textContent = 'Награда дня';
            btnDaily.addEventListener('click', () => this.handleDailyReward());
            this.rewardPanel.appendChild(btnDaily);
        }

        if (game.dailyQuests.length > 0) {
            const btnQuests = document.createElement('button');
            btnQuests.className = 'btn btn-quests';
            btnQuests.textContent = 'Задания';
            btnQuests.addEventListener('click', () => this.openQuests());
            this.rewardPanel.appendChild(btnQuests);
        }
    },

    handleBuyHelper(helperId) {
        this.executeBuyHelper(helperId);
    },

    executeBuyHelper(helperId) {
        const now = Date.now();
        if (now - game.lastFullscreenAdTime < GAME_CONFIG.fullscreenAdCooldownMs) {
            this.buyHelperDirect(helperId);
            return;
        }
        game.lastFullscreenAdTime = now;
        showFullscreenAd();
        setTimeout(() => this.buyHelperDirect(helperId), 500);
    },

    buyHelperDirect(helperId) {
        if (game.buyHelper(helperId)) {
            this.renderHelpers();
        }
    },

    handleClickUpgrade() {
        if (game.buyClickUpgrade()) {
            this.renderHelpers();
            playUpgradeSound();
        }
    },

    handleRewardedVideo() {
        showRewardedVideo(() => {
            game.activateRewardedMultiplier();
        });
    },

    handleDiamondAd() {
        const now = Date.now();
        const cooldownMs = game.getDiamondAdCooldownMs();
        if (now - game.lastDiamondAdTime < cooldownMs) {
            const remainingSec = Math.ceil((cooldownMs - (now - game.lastDiamondAdTime)) / 1000);
            this.showModal('Подождите', `Следующая реклама будет доступна через ${remainingSec} сек.`);
            return;
        }
        showRewardedVideo(() => {
            game.diamonds += 5;
            game.lastDiamondAdTime = Date.now();
            this.update(game.currency, game.getPassiveIncome());
        });
    },

    handleOfflineEarnings() {
        const amount = game.getOfflineEarningsAmount();
        if (amount <= 0) {
            this.showModal('Оффлайн-доход', 'Нет накопленного дохода.');
            return;
        }
        if (game.isAutoOfflineCollect()) {
            game.calculateOfflineEarnings();
            this.showModal('Оффлайн-доход', `Вы заработали ${formatNumber(amount)} ${GAME_CONFIG.currencyName}!`);
            return;
        }
        showRewardedVideo(() => {
            game.calculateOfflineEarnings();
            this.showModal('Оффлайн-доход', `Вы заработали ${formatNumber(amount)} ${GAME_CONFIG.currencyName}!`);
        });
    },

    handlePrestige() {
        if (!game.isPrestigeAvailable()) return;
        const points = game.getPrestigePoints();
        const newMultiplier = game.getPrestigeMultiplier().toFixed(2);
        const body = `Вы получите <b>${points} очков престижа</b>.<br>Новый глобальный множитель: x${newMultiplier}<br><br>Прогресс помощников и уровень клика будут сброшены.`;
        this.showModal('Перерождение', body, () => {
            if (game.doPrestige()) {
                this.renderHelpers();
                this.renderRewardButtons();
                playUpgradeSound();
            }
        });
    },

    handleDailyReward() {
        if (!game || game.dailyClaimed) return;
        const reward = game.claimDailyReward();
        if (reward <= 0) return;
        const streak = game.loginStreak;
        this.showModal('Ежедневная награда', `Вы заработали <b>${formatNumber(reward)} ${GAME_CONFIG.currencyName}</b>!<br>Серия дней: ${streak}`);
        this.renderRewardButtons();
        playUpgradeSound();
    },

    openQuests() {
        const list = game.dailyQuests.map(q => {
            const progress = Math.min(q.target, game.dailyQuestProgress[q.id] || 0);
            const claimed = game.dailyQuestClaimed[q.id];
            const pct = Math.min(100, (progress / q.target) * 100);
            const status = claimed ? '✅ Забрано' : `${formatNumber(progress)} / ${formatNumber(q.target)}`;
            const disabled = claimed || progress < q.target ? 'disabled' : '';
            const btn = claimed ? '' : `<button class="btn btn-buy btn-quest-claim" data-quest="${q.id}" ${disabled}>Забрать</button>`;
            return `<div class="quest-item ${claimed ? 'completed' : ''}">
                <div class="quest-desc">${q.desc}</div>
                <div class="quest-progress">${status}</div>
                <div class="quest-reward">+${formatNumber(q.reward)} <img class="currency-icon-inline" src="${ASSET_PATHS.currencyIcon}" alt=""> ${btn}</div>
            </div>`;
        }).join('');
        this.showModal('Ежедневные задания', `<div class="quests-list">${list}</div>`);
        this.attachQuestHandlers();
    },

    attachQuestHandlers() {
        this.modalOverlay.querySelectorAll('.btn-quest-claim').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questId = e.currentTarget.dataset.quest;
                const reward = game.claimDailyQuest(questId);
                if (reward > 0) {
                    this.openQuests();
                    playUpgradeSound();
                }
            });
        });
    },

    showModal(title, body, onConfirm) {
        this.modalOverlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-title">${title}</div>
                <div class="modal-body">${body}</div>
                <div class="modal-actions">
                    ${onConfirm ? '<button class="btn btn-buy" id="modal-confirm">Купить</button>' : ''}
                    <button class="btn btn-upgrade" id="modal-close">OK</button>
                </div>
            </div>
        `;
        this.modalOverlay.classList.add('active');
        const closeBtn = document.getElementById('modal-close');
        closeBtn.addEventListener('click', () => {
            this.modalOverlay.classList.remove('active');
            this.modalOverlay.innerHTML = '';
        });
        if (onConfirm) {
            const confirmBtn = document.getElementById('modal-confirm');
            confirmBtn.addEventListener('click', () => {
                this.modalOverlay.classList.remove('active');
                this.modalOverlay.innerHTML = '';
                onConfirm();
            });
        }
    },

    showOnboardingStep(step) {
        const steps = {
            1: {
                text: 'Тапай капибару, чтобы получать апельсины 🍊',
                highlight: '#gameCanvas',
                arrowTo: 'center'
            },
            2: {
                text: 'Покупай помощников, чтобы зарабатывать даже когда не играешь',
                highlight: '#helpers-panel',
                arrowTo: 'left'
            }
        };
        const data = steps[step];
        if (!data) {
            this.onboardingOverlay.style.display = 'none';
            return;
        }
        this.onboardingOverlay.style.display = 'flex';
        this.onboardingText.textContent = data.text;
    },

    nextOnboardingStep() {
        game.nextOnboardingStep();
        if (game.onboardingStep === 0) {
            this.onboardingOverlay.style.display = 'none';
        } else {
            this.showOnboardingStep(game.onboardingStep);
        }
    },

    openBuilder() {
        document.getElementById('builder-screen').classList.remove('hidden');
        document.getElementById('gameCanvas').classList.add('hidden');
        document.getElementById('ui-overlay').classList.add('hidden');
        const backBtn = document.getElementById('builder-back-btn');
        if (backBtn) {
            backBtn.onclick = () => this.closeBuilder();
        }
    },

    closeBuilder() {
        document.getElementById('builder-screen').classList.add('hidden');
        document.getElementById('gameCanvas').classList.remove('hidden');
        document.getElementById('ui-overlay').classList.remove('hidden');
    },

    updateBuilderCurrency() {
        const el = document.getElementById('builder-currency');
        if (el) el.innerHTML = formatNumber(Math.floor(game.currency)) + ' <img class="currency-icon-inline" src="' + ASSET_PATHS.currencyIcon + '" alt=""> ' +
            '<span class="builder-diamonds"><img class="currency-icon-diamond" src="' + ASSET_PATHS.diamondIcon + '" alt=""> ' + formatNumber(Math.floor(game.diamonds)) + '</span>';
    },

    updateBuilderStats() {
        const countEl = document.getElementById('builder-count');
        const bonusEl = document.getElementById('builder-income-bonus');
        const cells = game.grid ? Object.keys(game.grid).length : 0;
        if (countEl) countEl.textContent = cells;
        if (bonusEl) {
            const bonus = game.getBuildingIncomeMultiplier();
            bonusEl.textContent = '+' + Math.round(bonus * 100) + '%';
        }
    },

    renderBuilderGrid() {
        const grid = document.getElementById('builder-grid');
        const bgImg = document.getElementById('builder-bg-img');
        if (!grid || !bgImg) return;
        grid.innerHTML = '';

        const containerRect = grid.getBoundingClientRect();
        if (containerRect.width < 10 || containerRect.height < 10) {
            setTimeout(() => this.renderBuilderGrid(), 100);
            return;
        }

        const naturalWidth = (game.assets && game.assets.background && game.assets.background.naturalWidth > 0) ? game.assets.background.naturalWidth : (bgImg.naturalWidth || 1);
        const naturalHeight = (game.assets && game.assets.background && game.assets.background.naturalHeight > 0) ? game.assets.background.naturalHeight : (bgImg.naturalHeight || 1);
        if ((!naturalWidth || !naturalHeight || naturalWidth === 1 || naturalHeight === 1) && !bgImg.complete) {
            bgImg.onload = () => this.renderBuilderGrid();
            return;
        }
        const imgRect = getContainedImageRect(containerRect, naturalWidth, naturalHeight);
        const renderSlots = (slots, gridState, types, isDiamond) => {
            slots.forEach(slot => {
                const cell = document.createElement('div');
                cell.className = 'builder-cell' + (gridState[slot.id] ? ' occupied' : '') + (isDiamond ? ' diamond-cell' : '');
                cell.style.position = 'absolute';
                cell.style.left = (imgRect.offsetX + slot.xRatio * imgRect.width) + 'px';
                cell.style.top = (imgRect.offsetY + slot.yRatio * imgRect.height) + 'px';
                cell.style.width = (slot.wRatio * imgRect.width) + 'px';
                cell.style.height = (slot.hRatio * imgRect.height) + 'px';
                cell.dataset.slotId = slot.id;
                const data = gridState[slot.id];
                if (data) {
                    const type = types.find(b => b.id === data.buildingId);
                    if (type) {
                        cell.innerHTML = `<img src="${type.icon}" alt="${type.name}">
                            <span class="building-level-badge">Ур. ${data.level}</span>`;
                    } else {
                        const fallback = document.createElement('img');
                        fallback.src = ASSET_PATHS.currencyIcon;
                        fallback.alt = 'Unknown';
                        cell.appendChild(fallback);
                    }
                } else {
                    cell.innerHTML = '<span class="builder-cell-plus">+</span>';
                }
                cell.addEventListener('click', () => this.handleBuilderCellClick(slot.id, isDiamond));
                grid.appendChild(cell);
            });
        };
        renderSlots(BUILDING_SLOTS, game.grid, BUILDING_TYPES, false);
        renderSlots(DIAMOND_BUILDING_SLOTS, game.diamondGrid || {}, DIAMOND_BUILDINGS, true);
        const wrapper = document.getElementById('builder-grid-wrapper');
        if (wrapper) {
            let hint = wrapper.querySelector('.builder-empty-hint');
            if (!hint && (!game.grid || Object.keys(game.grid).length === 0)) {
                hint = document.createElement('div');
                hint.className = 'builder-empty-hint';
                hint.textContent = 'Тапни по клетке, чтобы построить первое здание';
                wrapper.appendChild(hint);
            } else if (hint && game.grid && Object.keys(game.grid).length > 0) {
                hint.remove();
            }
        }
    },

    handleBuilderCellClick(key, isDiamond) {
        const gridState = isDiamond ? (game.diamondGrid || {}) : game.grid;
        const data = gridState[key];
        if (data) {
            this.showBuildingInfo(key, data, isDiamond);
        } else {
            this.showBuildingMenu(key, isDiamond);
        }
    },

    showBuildingMenu(cellKey, isDiamond) {
        const types = isDiamond ? DIAMOND_BUILDINGS : BUILDING_TYPES;
        const costFn = isDiamond ? (id) => game.getDiamondBuildingCost(id, 0) : (id) => game.getBuildingCost(id, 0);
        const currency = isDiamond ? game.diamonds : game.currency;
        const currencyIcon = isDiamond ? ASSET_PATHS.diamondIcon : ASSET_PATHS.currencyIcon;
        const currencyLabel = isDiamond ? '' : '';
        const items = types.map(type => {
            const cost = costFn(type.id);
            const affordable = currency >= cost;
            return `
                <div class="building-option diamond-option">
                    <img class="building-option-icon" src="${type.icon}" alt="${type.name}">
                    <div class="building-option-info">
                        <div class="building-name">${type.name}</div>
                        <div class="building-desc">${type.description}</div>
                        <button class="btn btn-diamond-buy" data-building="${type.id}" ${affordable ? '' : 'disabled'}>
                            Построить<br><small>${formatNumber(cost)} <img class="currency-icon-inline" src="${currencyIcon}" alt=""></small>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        this.showModal('Выбери здание', '<div class="buildings-menu">' + items + '</div>');
        this.attachBuildingMenuHandlers(cellKey, isDiamond);
    },

    attachBuildingMenuHandlers(cellKey, isDiamond) {
        this.modalOverlay.querySelectorAll('.btn-diamond-buy[data-building]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const buildingId = e.currentTarget.dataset.building;
                const success = isDiamond ? game.buildOrUpgradeDiamond(cellKey, buildingId) : game.buildOrUpgrade(cellKey, buildingId);
                if (success) {
                    this.closeModal();
                    setTimeout(() => {
                        this.renderBuilderGrid();
                        this.updateBuilderCurrency();
                        this.updateBuilderStats();
                    }, 200);
                    playUpgradeSound();
                }
            });
        });
    },

    showBuildingInfo(cellKey, data, isDiamond) {
        const types = isDiamond ? DIAMOND_BUILDINGS : BUILDING_TYPES;
        const type = types.find(b => b.id === data.buildingId);
        if (!type) return;
        const nextCost = isDiamond ? game.getDiamondBuildingCost(type.id, data.level) : game.getBuildingCost(type.id, data.level);
        const canUpgrade = isDiamond ? game.diamonds >= nextCost : game.currency >= nextCost;
        const body = '<div class="building-info">' +
            '<img class="building-option-icon" src="' + type.icon + '" alt="' + type.name + '">' +
            '<div class="building-name">' + type.name + '</div>' +
            '<div class="building-desc">' + type.description + '</div>' +
            '<div class="building-level">Уровень: ' + data.level + '</div>' +
            '<button class="btn btn-upgrade" data-cell="' + cellKey + '" data-diamond="' + (isDiamond ? '1' : '0') + '" ' + (canUpgrade ? '' : 'disabled') + '>Улучшить за ' + formatNumber(nextCost) + ' <img class="currency-icon-inline" src="' + (isDiamond ? ASSET_PATHS.diamondIcon : ASSET_PATHS.currencyIcon) + '" alt=""></button>' +
            '<button class="btn btn-reward" data-cell="' + cellKey + '" data-diamond="' + (isDiamond ? '1' : '0') + '">Снести</button>' +
            '</div>';
        this.showModal(type.name, body);
        this.attachBuildingInfoHandlers(cellKey, isDiamond);
    },

    attachBuildingInfoHandlers(cellKey, isDiamond) {
        const upgradeBtn = this.modalOverlay.querySelector('.btn-upgrade[data-cell="' + cellKey + '"][data-diamond="' + (isDiamond ? '1' : '0') + '"]');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                const gridState = isDiamond ? (game.diamondGrid || {}) : game.grid;
                const data = gridState[cellKey];
                if (data) {
                    const success = isDiamond ? game.buildOrUpgradeDiamond(cellKey, data.buildingId) : game.buildOrUpgrade(cellKey, data.buildingId);
                    if (success) {
                        this.closeModal();
                        setTimeout(() => {
                            this.renderBuilderGrid();
                            this.updateBuilderCurrency();
                            this.updateBuilderStats();
                        }, 200);
                        playUpgradeSound();
                    }
                }
            });
        }
        const demolishBtn = this.modalOverlay.querySelector('.btn-reward[data-cell="' + cellKey + '"][data-diamond="' + (isDiamond ? '1' : '0') + '"]');
        if (demolishBtn) {
            demolishBtn.addEventListener('click', () => {
                if (isDiamond) {
                    game.demolishDiamond(cellKey);
                } else {
                    game.demolish(cellKey);
                }
                this.closeModal();
                setTimeout(() => {
                    this.renderBuilderGrid();
                    this.updateBuilderCurrency();
                    this.updateBuilderStats();
                }, 200);
            });
        }
    },

    closeModal() {
        this.modalOverlay.classList.remove('active');
        this.modalOverlay.innerHTML = '';
    },

    openAchievements() {
        if (!window.ACHIEVEMENTS) return;
        const list = window.ACHIEVEMENTS.map(a => {
            const unlocked = game.unlockedAchievements.includes(a.id);
            const status = unlocked ? '✅' : '🔒';
            const orangeReward = a.reward && a.reward.currency ? formatNumber(a.reward.currency) + ' 🍊' : '';
            const diamondReward = a.reward && a.reward.diamonds ? formatNumber(a.reward.diamonds) + ' <img class="currency-icon-diamond" src="' + ASSET_PATHS.diamondIcon + '" alt="">' : '';
            const reward = orangeReward + (orangeReward && diamondReward ? ' ' : '') + diamondReward;
            return '<div class="achievement-item ' + (unlocked ? 'unlocked' : '') + '">' +
                '<div class="achievement-icon">' + status + '</div>' +
                '<div class="achievement-info">' +
                    '<div class="achievement-name">' + a.name + '</div>' +
                    '<div class="achievement-desc">' + a.desc + '</div>' +
                '</div>' +
                '<div class="achievement-reward">' + reward + '</div>' +
            '</div>';
        }).join('');
        this.showModal('Достижения', '<div class="achievements-list">' + list + '</div>');
    },

    showAchievementToast(name) {
        if (!name) return;
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.textContent = '🏆 ' + name;
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    },

    openLeaderboard() {
        this.showModal('Лидерборд', 'Лидерборд скоро появится.');
    },

    openDiamondShop() {
        const upgradesList = DIAMOND_UPGRADES.map(u => {
            const level = (game.diamondUpgrades && game.diamondUpgrades[u.id]) || 0;
            const maxLevel = u.maxLevel || Infinity;
            const cost = game.getDiamondUpgradeCost(u.id);
            const affordable = game.diamonds >= cost && level < maxLevel;
            const maxed = level >= maxLevel;
            const btnLabel = maxed ? 'Куплено' : 'Купить';
            const btnClass = maxed ? 'btn btn-buy disabled' : 'btn btn-diamond-buy';
            return `
                <div class="diamond-option upgrade-option">
                    <div class="diamond-option-info">
                        <div class="diamond-option-name">${u.name}</div>
                        <div class="diamond-option-desc">${u.description} (ур. ${level}${maxLevel ? '/' + maxLevel : ''})</div>
                        <button class="${btnClass}" data-upgrade="${u.id}" ${maxed || !affordable ? 'disabled' : ''}>
                            ${btnLabel}<br><small>${formatNumber(cost)} <img class="currency-icon-diamond" src="${ASSET_PATHS.diamondIcon}" alt=""></small>
                        </button>
                    </div>
                </div>`;
        }).join('');

        const buildingsList = DIAMOND_BUILDINGS.map(b => {
            const cost = game.getDiamondBuildingCost(b.id, 0);
            const affordable = game.diamonds >= cost;
            return `
                <div class="diamond-option building-option">
                    <img class="diamond-option-icon" src="${b.icon}" alt="${b.name}">
                    <div class="diamond-option-info">
                        <div class="diamond-option-name">${b.name}</div>
                        <div class="diamond-option-desc">${b.description}</div>
                        <button class="btn btn-diamond-buy" data-diamond-building="${b.id}" ${affordable ? '' : 'disabled'}>
                            Построить<br><small>${formatNumber(cost)} <img class="currency-icon-diamond" src="${ASSET_PATHS.diamondIcon}" alt=""></small>
                        </button>
                    </div>
                </div>`;
        }).join('');

        const body = `
            <div class="diamond-tabs">
                <button class="diamond-tab-btn active" data-tab="upgrades">Улучшения</button>
                <button class="diamond-tab-btn" data-tab="buildings">Премиум-здания</button>
            </div>
            <div class="diamond-tab-content">
                <div class="diamond-tab-pane active" id="diamond-tab-upgrades">
                    <div class="diamond-options-list">${upgradesList}</div>
                </div>
                <div class="diamond-tab-pane" id="diamond-tab-buildings">
                    <div class="diamond-options-list">${buildingsList}</div>
                </div>
            </div>`;

        this.showModal('Алмазный магазин', body);
        this.attachDiamondShopHandlers();
    },

    attachDiamondShopHandlers() {
        this.modalOverlay.querySelectorAll('.diamond-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.modalOverlay.querySelectorAll('.diamond-tab-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.modalOverlay.querySelectorAll('.diamond-tab-pane').forEach(p => p.classList.remove('active'));
                const pane = document.getElementById('diamond-tab-' + tab);
                if (pane) pane.classList.add('active');
            });
        });
        this.modalOverlay.querySelectorAll('.btn-diamond-buy[data-upgrade]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const upgradeId = e.currentTarget.dataset.upgrade;
                if (game.buyDiamondUpgrade(upgradeId)) {
                    this.closeModal();
                    this.openDiamondShop();
                    playUpgradeSound();
                }
            });
        });
        this.modalOverlay.querySelectorAll('.btn-diamond-buy[data-diamond-building]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const buildingId = e.currentTarget.dataset.diamondBuilding;
                this.showDiamondBuildingMenu(buildingId);
            });
        });
    },

    showDiamondBuildingMenu(buildingId) {
        const type = DIAMOND_BUILDINGS.find(b => b.id === buildingId);
        if (!type) return;
        const cost = game.getDiamondBuildingCost(type.id, 0);
        const affordable = game.diamonds >= cost;
        const body = `
            <div class="building-info">
                <img class="building-option-icon" src="${type.icon}" alt="${type.name}">
                <div class="building-name">${type.name}</div>
                <div class="building-desc">${type.description}</div>
                <button class="btn btn-diamond-buy" data-diamond-build="${type.id}" ${affordable ? '' : 'disabled'}>
                    Построить за ${formatNumber(cost)} <img class="currency-icon-diamond" src="${ASSET_PATHS.diamondIcon}" alt="">
                </button>
            </div>`;
        this.showModal(type.name, body);
        const buildBtn = this.modalOverlay.querySelector('.btn-diamond-build');
        if (buildBtn) {
            buildBtn.addEventListener('click', () => {
                const cellKey = this.getDiamondBuildingCellKey();
                if (cellKey && game.buildOrUpgradeDiamond(cellKey, type.id)) {
                    this.closeModal();
                    this.updateBuilderCurrency();
                    this.updateBuilderStats();
                    playUpgradeSound();
                }
            });
        }
    },

    getDiamondBuildingCellKey() {
        const occupied = new Set(Object.keys(game.grid || {}));
        const diamondOccupied = new Set(Object.keys(game.diamondGrid || {}));
        const used = new Set([...occupied, ...diamondOccupied]);
        const allSlots = DIAMOND_BUILDING_SLOTS || [];
        for (let i = 0; i < allSlots.length; i++) {
            const key = 'd' + (i + 1);
            if (!used.has(key)) return key;
        }
        return 'd1';
    },

};
