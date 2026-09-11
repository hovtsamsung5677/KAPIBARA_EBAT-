function formatNumber(value) {
    if (value < 1000) {
        return String(Math.floor(value));
    }
    const abs = Math.abs(value);
    let suffix = '';
    let divisor = 1;
    if (abs >= 1e12) {
        suffix = 'T';
        divisor = 1e12;
    } else if (abs >= 1e9) {
        suffix = 'B';
        divisor = 1e9;
    } else if (abs >= 1e6) {
        suffix = 'M';
        divisor = 1e6;
    } else if (abs >= 1e3) {
        suffix = 'K';
        divisor = 1e3;
    }
    let formatted = (value / divisor).toFixed(1);
    if (formatted.endsWith('.0')) formatted = formatted.slice(0, -2);
    return formatted + suffix;
}
