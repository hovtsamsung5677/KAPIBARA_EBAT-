const ACHIEVEMENTS = [
    { id: 'clicks_100', name: 'Первые шаги', desc: 'Сделай 100 кликов', type: 'clicks', target: 100, reward: { currency: 50 } },
    { id: 'clicks_1000', name: 'Кликер-мастер', desc: 'Сделай 1000 кликов', type: 'clicks', target: 1000, reward: { currency: 500 } },
    { id: 'clicks_5000', name: 'Неутомимый', desc: 'Сделай 5000 кликов', type: 'clicks', target: 5000, reward: { currency: 2000 } },
    { id: 'helper_first', name: 'Первый друг', desc: 'Найми первого помощника', type: 'anyHelperLevel', target: 1, reward: { currency: 20 } },
    { id: 'helpers_10', name: 'Небольшая бригада', desc: 'Найми 10 помощников', type: 'totalHelperCount', target: 10, reward: { currency: 200 } },
    { id: 'helpers_25', name: 'Большая семья', desc: 'Найми 25 помощников', type: 'totalHelperCount', target: 25, reward: { currency: 1000 } },
    { id: 'total_1000', name: 'Первая тысяча', desc: 'Заработай 1000 апельсинов за игру', type: 'totalCurrency', target: 1000, reward: { currency: 100 } },
    { id: 'total_100000', name: 'Богач', desc: 'Заработай 100 000 апельсинов за игру', type: 'totalCurrency', target: 100000, reward: { currency: 5000 } },
    { id: 'total_10000000', name: 'Оранжевый миллионер', desc: 'Заработай 10 000 000 апельсинов за игру', type: 'totalCurrency', target: 10000000, reward: { currency: 50000 } },
    { id: 'click_upgrade_5', name: 'Улучшение руки', desc: 'Прокачай клик 5 раз', type: 'clickUpgrades', target: 5, reward: { currency: 300 } },
    { id: 'golden_1', name: 'Золотой охотник', desc: 'Тапни по золотой капибаре', type: 'goldenTaps', target: 1, reward: { currency: 100 } },
    { id: 'golden_5', name: 'Золотой коллекционер', desc: 'Тапни по золотой капибаре 5 раз', type: 'goldenTaps', target: 5, reward: { currency: 500 } },
    { id: 'prestige_1', name: 'Новое начало', desc: 'Соверши престиж', type: 'prestigeCount', target: 1, reward: { currency: 1000 } }
];
