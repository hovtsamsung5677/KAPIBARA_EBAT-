let game = null;
let lastTime = 0;

async function preloadImages(paths) {
    const entries = Object.entries(paths).flatMap(([key, val]) =>
        typeof val === 'string' ? [[key, val]] : Object.entries(val).map(([k2, v2]) => [`${key}.${k2}`, v2])
    );
    const images = {};
    await Promise.all(entries.map(([key, src]) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => { images[key] = img; resolve(); };
        img.onerror = () => resolve();
        img.src = src;
    })));
    return images;
}

function tryShowGame() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        console.warn('Принудительно скрываю загрузку по таймауту');
        loadingScreen.classList.add('hidden');
    }
}

function initGame() {
    console.log('initGame start');
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('gameCanvas не найден');
        return;
    }
    game = new Game(canvas);
    game.assets = {};
    preloadImages(ASSET_PATHS).then(images => {
        console.log('preloadImages resolved', Object.keys(images).length);
        game.assets = images;
        try {
            game.init();
            console.log('game.init ok');
        } catch (e) {
            console.error('game.init error', e);
        }
        try {
            ui.init();
            console.log('ui.init ok');
        } catch (e) {
            console.error('ui.init error', e);
        }
        try {
            if (typeof initAdminTrigger === 'function') {
                initAdminTrigger();
            }
        } catch (e) {
            console.error('initAdminTrigger error', e);
        }
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        canvas.addEventListener('pointerdown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            game.click(x, y);
            playClickSound();
            if (game.goldenEvent && game.goldenEvent.active) {
                const dx = x - game.goldenEvent.x;
                const dy = y - game.goldenEvent.y;
                if (dx * dx + dy * dy < 40 * 40) {
                    game.claimGoldenEvent();
                    playUpgradeSound();
                }
            }
        });
        requestAnimationFrame(gameLoop);
        setInterval(() => game.save(), 30000);
        window.addEventListener('beforeunload', () => game.save());
        const loadingScreen = document.getElementById('loading-screen');
        console.log('hiding loading screen', !!loadingScreen);
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.style.display = 'none';
                }
            }, 600);
        }
    }).catch(err => {
        console.error('Ошибка инициализации:', err);
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('hidden');
    });
}

function gameLoop(timestamp) {
    if (!game) return;
    const deltaTime = Math.min((timestamp - lastTime) / 1000, 1);
    lastTime = timestamp;
    try {
        game.update(deltaTime);
        game.render();
        ui.update(game.currency, game.getPassiveIncome());
    } catch (e) {
        console.error('gameLoop error', e);
    }
    requestAnimationFrame(gameLoop);
}

window.addEventListener('sdk-ready', async () => {
    const data = await loadPlayerData();
    const isNewGame = !data;
    if (data) game.loadFromData(data);
    game.calculateOfflineEarnings();
    if (isNewGame) {
        game.startOnboarding();
        ui.showOnboardingStep(1);
    }
    callGameReady();
});

console.log('main.js loaded');
if (document.readyState === 'complete') {
    console.log('document already complete, calling initGame directly');
    initGame();
} else {
    console.log('adding load listener');
    window.addEventListener('load', initGame);
}
