const DIAMOND_UPGRADES = [
    {
        id: 'click_boost',
        name: 'Бустер клика',
        description: '+20% к силе клика навсегда',
        baseCost: 15,
        costGrowth: 2,
        effect: { type: 'clickMultiplier', value: 0.20 }
    },
    {
        id: 'income_boost',
        name: 'Бустер дохода',
        description: '+15% к пассивному доходу навсегда',
        baseCost: 25,
        costGrowth: 2,
        effect: { type: 'incomeMultiplier', value: 0.15 }
    },
    {
        id: 'ad_cooldown_cut',
        name: 'Ускоренная реклама',
        description: '-25% к времени ожидания между просмотрами рекламы',
        baseCost: 40,
        costGrowth: 1,
        maxLevel: 1,
        effect: { type: 'adCooldownReduction', value: 0.25 }
    },
    {
        id: 'auto_offline',
        name: 'Автосбор оффлайн-дохода',
        description: 'Забирай оффлайн-доход сразу, без просмотра рекламы',
        baseCost: 100,
        costGrowth: 1,
        maxLevel: 1,
        effect: { type: 'autoOfflineCollect', value: true }
    }
];

const DIAMOND_BUILDINGS = [
    {
        id: 'diamond_greenhouse',
        name: 'Алмазная теплица',
        icon: 'assets/houses/dimond_teplica.png',
        diamondCost: 20,
        costGrowth: 1.3,
        description: 'Сильно увеличивает пассивный доход',
        effectPerLevel: { type: 'incomeMultiplier', value: 0.15 }
    },
    {
        id: 'sky_tower',
        name: 'Небесная башня',
        icon: 'assets/houses/dimond_tower.png',
        diamondCost: 50,
        costGrowth: 1.3,
        description: 'Значительно увеличивает пассивный доход',
        effectPerLevel: { type: 'incomeMultiplier', value: 0.20 }
    },
    {
        id: 'capybara_palace',
        name: 'Дворец капибары',
        icon: 'assets/houses/custle.png',
        diamondCost: 120,
        costGrowth: 1.3,
        description: 'Огромный прирост дохода — вершина фермы',
        effectPerLevel: { type: 'incomeMultiplier', value: 0.35 }
    }
];

const DIAMOND_BUILDING_SLOTS = [
    { id: 'd1', xRatio: 0.78, yRatio: 0.30, wRatio: 0.10, hRatio: 0.08 },
    { id: 'd2', xRatio: 0.78, yRatio: 0.42, wRatio: 0.10, hRatio: 0.08 },
    { id: 'd3', xRatio: 0.78, yRatio: 0.54, wRatio: 0.10, hRatio: 0.08 }
];