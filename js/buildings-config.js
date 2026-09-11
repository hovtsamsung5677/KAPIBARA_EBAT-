const BUILDING_SLOTS = [
  {
    "id": "slot_1",
    "xRatio": 0.284,
    "yRatio": 0.509,
    "wRatio": 0.08,
    "hRatio": 0.064
  },
  {
    "id": "slot_2",
    "xRatio": 0.337,
    "yRatio": 0.424,
    "wRatio": 0.08,
    "hRatio": 0.064
  },
  {
    "id": "slot_3",
    "xRatio": 0.455,
    "yRatio": 0.445,
    "wRatio": 0.095,
    "hRatio": 0.076
  },
  {
    "id": "slot_4",
    "xRatio": 0.457,
    "yRatio": 0.128,
    "wRatio": 0.092,
    "hRatio": 0.074
  },
  {
    "id": "slot_5",
    "xRatio": 0.448,
    "yRatio": 0.273,
    "wRatio": 0.095,
    "hRatio": 0.076
  },
  {
    "id": "slot_6",
    "xRatio": 0.382,
    "yRatio": 0.573,
    "wRatio": 0.095,
    "hRatio": 0.076
  },
  {
    "id": "slot_7",
    "xRatio": 0.51,
    "yRatio": 0.61,
    "wRatio": 0.104,
    "hRatio": 0.083
  },
  {
    "id": "slot_8",
    "xRatio": 0.341,
    "yRatio": 0.245,
    "wRatio": 0.098,
    "hRatio": 0.078
  },
  {
    "id": "slot_9",
    "xRatio": 0.565,
    "yRatio": 0.213,
    "wRatio": 0.103,
    "hRatio": 0.083
  },
  {
    "id": "slot_10",
    "xRatio": 0.575,
    "yRatio": 0.35,
    "wRatio": 0.102,
    "hRatio": 0.081
  },
  {
    "id": "slot_11",
    "xRatio": 0.562,
    "yRatio": 0.469,
    "wRatio": 0.1,
    "hRatio": 0.08
  },
  {
    "id": "slot_12",
    "xRatio": 0.264,
    "yRatio": 0.321,
    "wRatio": 0.093,
    "hRatio": 0.074
  },
  {
    "id": "slot_13",
    "xRatio": 0.189,
    "yRatio": 0.414,
    "wRatio": 0.101,
    "hRatio": 0.081
  },
  {
    "id": "slot_14",
    "xRatio": 0.688,
    "yRatio": 0.321,
    "wRatio": 0.11,
    "hRatio": 0.088
  }
];

const BUILDING_TYPES = [
    {
        id: 'barn',
        name: 'Амбар',
        icon: 'assets/houses/ambar.png',
        baseCost: 5000,
        description: 'Увеличивает лимит оффлайн-дохода',
        effectPerLevel: { type: 'offlineHoursBonus', value: 0.5 }
    },
    {
        id: 'windmill',
        name: 'Мельница',
        icon: 'assets/houses/melnica.png',
        baseCost: 15000,
        description: 'Увеличивает пассивный доход',
        effectPerLevel: { type: 'incomeMultiplier', value: 0.05 }
    },
    {
        id: 'greenhouse',
        name: 'Теплица',
        icon: 'assets/houses/teplica.png',
        baseCost: 8000,
        description: 'Увеличивает пассивный доход',
        effectPerLevel: { type: 'incomeMultiplier', value: 0.04 }
    },
    {
        id: 'apiary',
        name: 'Пасека',
        icon: 'assets/houses/paseka.png',
        baseCost: 4000,
        description: 'Увеличивает пассивный доход',
        effectPerLevel: { type: 'incomeMultiplier', value: 0.03 }
    },
    {
        id: 'silo',
        name: 'Силосная башня',
        icon: 'assets/houses/silos_tower.png',
        baseCost: 30000,
        description: 'Значительно увеличивает лимит оффлайн-дохода',
        effectPerLevel: { type: 'offlineHoursBonus', value: 1 }
    },
    {
        id: 'water_tower',
        name: 'Водонапорная башня',
        icon: 'assets/houses/water_tower.png',
        baseCost: 25000,
        description: 'Увеличивает пассивный доход',
        effectPerLevel: { type: 'incomeMultiplier', value: 0.06 }
    },
    {
        id: 'flower_bed',
        name: 'Клумба',
        icon: 'assets/houses/clumba.png',
        baseCost: 1000,
        description: 'Просто красиво',
        effectPerLevel: null
    },
    {
        id: 'haystack',
        name: 'Стог сена',
        icon: 'assets/houses/seno.png',
        baseCost: 800,
        description: 'Просто красиво',
        effectPerLevel: null
    },
    {
        id: 'lantern',
        name: 'Фонарь',
        icon: 'assets/houses/svet.png',
        baseCost: 1500,
        description: 'Просто красиво',
        effectPerLevel: null
    },
    {
        id: 'bench',
        name: 'Скамейка',
        icon: 'assets/houses/chair.png',
        baseCost: 1200,
        description: 'Просто красиво',
        effectPerLevel: null
    },
    {
        id: 'pond',
        name: 'Декоративный пруд',
        icon: 'assets/houses/water_prud.png',
        baseCost: 3000,
        description: 'Просто красиво',
        effectPerLevel: null
    },
    {
        id: 'capybara_house',
        name: 'Домик для капибары',
        icon: 'assets/houses/home.png',
        baseCost: 6000,
        description: 'Просто красиво',
        effectPerLevel: null
    }
];

const BUILDING_COST_GROWTH = 1.15;
