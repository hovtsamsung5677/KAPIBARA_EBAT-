const GAME_CONFIG = {
    currencyName: 'Апельсины',
    clickValue: 1,
    passiveIncomePerSecond: 0,
    offlineEarningsMaxHours: 2,
    rewardedMultiplier: 2,
    rewardedDurationSeconds: 60,
    fullscreenAdCooldownMs: 120000,
    helpers: [
        { id: 'capy_baby',    name: 'Малыш-капибара',      baseCost: 10,     baseIncome: 0.1, icon: 'capy_baby' },
        { id: 'capy_worker',  name: 'Капибара-работяга',   baseCost: 100,    baseIncome: 1,   icon: 'capy_worker' },
        { id: 'capy_farmer',  name: 'Капибара-фермер',     baseCost: 1000,   baseIncome: 8,   icon: 'capy_farmer' },
        { id: 'capy_manager', name: 'Капибара-менеджер',   baseCost: 10000,  baseIncome: 50,  icon: 'capy_manager' },
        { id: 'capy_boss',    name: 'Капибара-босс',       baseCost: 100000, baseIncome: 300, icon: 'capy_boss' }
    ]
};

const ASSET_PATHS = {
    capybaraNorm: 'assets/characters/capybara-norm.png',
    capybaraFine: 'assets/characters/capybara-fine.png',
    capybaraSleep: 'assets/characters/capybara-sleep.png',
    helperIcons: {
        capy_baby: 'assets/characters/helper-baby.png',
        capy_worker: 'assets/characters/helper-worker.png',
        capy_farmer: 'assets/characters/helper-farmer.png',
        capy_manager: 'assets/characters/helper-manager.png',
        capy_boss: 'assets/characters/helper-boss.png'
    },
    goldenEvent: 'assets/characters/golden-event.png',
    background: 'assets/background/farm-bg.png',
    currencyIcon: 'assets/ui/currency-icon.png',
    loadingImage: 'assets/ui/loading.png'
};
