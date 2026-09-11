const ui = {
    overlay: null,
    currencyPanel: null,
    currencyCount: null,
    incomeDisplay: null,
    helpersPanel: null,
    rewardPanel: null,
    soundBtn: null,
    achievementsBtn: null,
    leaderboardBtn: null,
    builderBtn: null,
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

        const btnAdminAddCurrency = document.getElementById('admin-add-currency');
        if (btnAdminAddCurrency) btnAdminAddCurrency.addEventListener('click', adminAddCurrency);
        const btnAdminUnlockBuildings = document.getElementById('admin-unlock-buildings');
        if (btnAdminUnlockBuildings) btnAdminUnlockBuildings.addEventListener('click', adminUnlockBuildings);
        const btnAdminMaxHelpers = document.getElementById('admin-max-helpers');
        if (btnAdminMaxHelpers) btnAdminMaxHelpers.addEventListener('click', adminMaxHelpers);
        const btnAdminUnlockAchievements = document.getElementById('admin-unlock-achievements');
        if (btnAdminUnlockAchievements) btnAdminUnlockAchievements.addEventListener('click', adminUnlockAchievements);
        const btnAdminResetSave = document.getElementById('admin-reset-save');
        if (btnAdminResetSave) btnAdminResetSave.addEventListener('click', adminResetSave);

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

        const btnReward = document.createElement('button');
        btnReward.className = 'btn btn-reward';
        btnReward.id = 'reward-btn';
        btnReward.textContent = 'x2 доход (60с)';
        btnReward.addEventListener('click', () => this.handleRewardedVideo());
        this.rewardPanel.appendChild(btnReward);

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

    handleOfflineEarnings() {
        const amount = game.getOfflineEarningsAmount();
        if (amount <= 0) {
            this.showModal('Оффлайн-доход', 'Нет накопленного дохода.');
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
        this.renderBuilderGrid();
        this.updateBuilderCurrency();
        this.updateBuilderStats();
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
        if (el) el.innerHTML = formatNumber(Math.floor(game.currency)) + ' <img class="currency-icon-inline" src="' + ASSET_PATHS.currencyIcon + '" alt="">';
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
        if (!grid) return;
        grid.innerHTML = '';
        const containerRect = grid.parentElement.getBoundingClientRect();
        const bg = new Image();
        bg.src = 'assets/background/town_fon.png';
        const containerW = containerRect.width;
        const containerH = containerRect.height;
        let renderedW = containerW;
        let renderedH = containerH;
        let offsetX = 0;
        let offsetY = 0;
        if (bg.naturalWidth && bg.naturalHeight) {
            const imageAspect = bg.naturalWidth / bg.naturalHeight;
            const containerAspect = containerW / containerH;
            if (imageAspect > containerAspect) {
                renderedW = containerW;
                renderedH = containerW / imageAspect;
                offsetX = 0;
                offsetY = (containerH - renderedH) / 2;
            } else {
                renderedH = containerH;
                renderedW = containerH * imageAspect;
                offsetX = (containerW - renderedW) / 2;
                offsetY = 0;
            }
        }
        BUILDING_SLOTS.forEach(slot => {
            const cell = document.createElement('div');
            cell.className = 'builder-cell' + (game.grid[slot.id] ? ' occupied' : '');
            cell.style.position = 'absolute';
            cell.style.left = (offsetX + slot.xRatio * renderedW) + 'px';
            cell.style.top = (offsetY + slot.yRatio * renderedH) + 'px';
            cell.style.width = (slot.wRatio * renderedW) + 'px';
            cell.style.height = (slot.hRatio * renderedH) + 'px';
            cell.dataset.slotId = slot.id;
            const data = game.grid[slot.id];
            if (data) {
                const type = BUILDING_TYPES.find(b => b.id === data.buildingId);
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
            cell.addEventListener('click', () => this.handleBuilderCellClick(slot.id));
            grid.appendChild(cell);
        });
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

    handleBuilderCellClick(key) {
        const data = game.grid[key];
        if (data) {
            this.showBuildingInfo(key, data);
        } else {
            this.showBuildingMenu(key);
        }
    },

    showBuildingMenu(cellKey) {
        const items = BUILDING_TYPES.map(type => {
            const cost = game.getBuildingCost(type.id, 0);
            const affordable = game.currency >= cost;
            return `
                <div class="building-option">
                    <img class="building-option-icon" src="${type.icon}" alt="${type.name}">
                    <div class="building-option-info">
                        <div class="building-name">${type.name}</div>
                        <div class="building-desc">${type.description}</div>
                        <button class="btn btn-buy" data-building="${type.id}" ${affordable ? '' : 'disabled'}>
                            Построить<br><small>${formatNumber(cost)} <img class="currency-icon-inline" src="${ASSET_PATHS.currencyIcon}" alt=""></small>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        this.showModal('Выбери здание', '<div class="buildings-menu">' + items + '</div>');
        this.attachBuildingHandlers(cellKey);
    },

    attachBuildingHandlers(cellKey) {
        this.modalOverlay.querySelectorAll('.btn-buy[data-building]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const buildingId = e.currentTarget.dataset.building;
                if (game.buildOrUpgrade(cellKey, buildingId)) {
                    this.closeModal();
                    this.renderBuilderGrid();
                    this.updateBuilderCurrency();
                    this.updateBuilderStats();
                    playUpgradeSound();
                }
            });
        });
    },

    showBuildingInfo(cellKey, data) {
        const type = BUILDING_TYPES.find(b => b.id === data.buildingId);
        if (!type) return;
        const nextCost = game.getBuildingCost(type.id, data.level);
        const canUpgrade = game.currency >= nextCost;
        const body = '<div class="building-info">' +
            '<img class="building-option-icon" src="' + type.icon + '" alt="' + type.name + '">' +
            '<div class="building-name">' + type.name + '</div>' +
            '<div class="building-desc">' + type.description + '</div>' +
            '<div class="building-level">Уровень: ' + data.level + '</div>' +
            '<button class="btn btn-upgrade" data-cell="' + cellKey + '" ' + (canUpgrade ? '' : 'disabled') + '>Улучшить за ' + formatNumber(nextCost) + ' <img class="currency-icon-inline" src="' + ASSET_PATHS.currencyIcon + '" alt=""></button>' +
            '<button class="btn btn-reward" data-cell="' + cellKey + '">Снести</button>' +
            '</div>';
        this.showModal(type.name, body);
        this.attachBuildingInfoHandlers(cellKey);
    },

    attachBuildingInfoHandlers(cellKey) {
        const upgradeBtn = this.modalOverlay.querySelector('.btn-upgrade[data-cell="' + cellKey + '"]');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                const data = game.grid[cellKey];
                if (data && game.buildOrUpgrade(cellKey, data.buildingId)) {
                    this.closeModal();
                    this.renderBuilderGrid();
                    this.updateBuilderCurrency();
                    this.updateBuilderStats();
                    playUpgradeSound();
                }
            });
        }
        const demolishBtn = this.modalOverlay.querySelector('.btn-reward[data-cell="' + cellKey + '"]');
        if (demolishBtn) {
            demolishBtn.addEventListener('click', () => {
                game.demolish(cellKey);
                this.closeModal();
                this.renderBuilderGrid();
                this.updateBuilderCurrency();
                this.updateBuilderStats();
            });
        }
    },

    closeModal() {
        this.modalOverlay.classList.remove('active');
        this.modalOverlay.innerHTML = '';
    }
};
