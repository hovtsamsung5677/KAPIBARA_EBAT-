let ysdk = null;
let player = null;
let isAuthorized = false;

async function initSDK() {
    try {
        ysdk = await YaGames.init();
        await initPlayer();
        window.dispatchEvent(new Event('sdk-ready'));
    } catch (e) {
        console.error('SDK init failed:', e);
    }
}

async function initPlayer() {
    if (!ysdk) return null;
    try {
        player = await ysdk.getPlayer();
        isAuthorized = player.isAuthorized();
        console.log('Player authorized:', isAuthorized);
        return player;
    } catch (e) {
        console.warn('Player init error:', e);
        return null;
    }
}

function callGameReady() {
    if (ysdk && ysdk.features && ysdk.features.LoadingAPI) {
        ysdk.features.LoadingAPI.ready();
    }
}

async function savePlayerData(data) {
    if (!player) return;
    try {
        await player.setData(data, true);
    } catch (e) {
        console.error('Save failed:', e);
    }
}

async function loadPlayerData() {
    if (!player) return null;
    try {
        return await player.getData();
    } catch (e) {
        console.error('Load failed:', e);
        return null;
    }
}

function showFullscreenAd() {
    if (!ysdk || !ysdk.adv) return;
    ysdk.adv.showFullscreenAdv({
        callbacks: {
            onOpen: () => muteGameAudio(),
            onClose: (wasShown) => unmuteGameAudio(),
            onError: (error) => console.warn('Fullscreen ad error:', error)
        }
    });
}

function showRewardedVideo(onReward) {
    if (!ysdk || !ysdk.adv) return;
    ysdk.adv.showRewardedVideo({
        callbacks: {
            onOpen: () => muteGameAudio(),
            onClose: () => unmuteGameAudio(),
            onRewarded: () => {
                if (onReward) onReward();
            },
            onError: (error) => {
                console.warn('Rewarded video error:', error);
                unmuteGameAudio();
            }
        }
    });
}

let isMuted = false;

function muteGameAudio() { isMuted = true; }
function unmuteGameAudio() { isMuted = false; }

document.addEventListener('visibilitychange', () => {
    if (document.hidden) muteGameAudio();
    else unmuteGameAudio();
});
window.addEventListener('blur', () => muteGameAudio());
window.addEventListener('focus', () => unmuteGameAudio());

let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            return null;
        }
    }
    return audioCtx;
}

function playClickSound() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
        // ignore audio errors
    }
}

function playUpgradeSound() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
        const now = ctx.currentTime;
        [0, 0.08].forEach((offset, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600 + i * 200, now + offset);
            gain.gain.setValueAtTime(0.2, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.1);
        });
    } catch (e) {
        // ignore audio errors
    }
}

async function submitScore(score) {
    if (!ysdk) return;
    try {
        const lb = await ysdk.getLeaderboards();
        await lb.setLeaderboardScore('capybara_farm_score', Math.floor(score));
    } catch (e) {
        console.warn('Leaderboard submit failed:', e);
    }
}

async function getLeaderboardEntries() {
    if (!ysdk) return [];
    try {
        const lb = await ysdk.getLeaderboards();
        const result = await lb.getLeaderboardEntries('capybara_farm_score', { quantityTop: 10, includeUser: true });
        return result.entries || [];
    } catch (e) {
        console.warn('Leaderboard fetch failed:', e);
        return [];
    }
}
