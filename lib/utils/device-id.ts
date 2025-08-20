// Генерация уникального ID устройства
export function generateDeviceId(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = canvas.toDataURL();
    const hash = btoa(fingerprint).slice(0, 16);
    
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    
    return `${hash}-${timestamp}-${random}`;
}

export function getOrCreateDeviceId(): string {
    const storageKey = 'kaelsi_device_id';
    let deviceId = localStorage.getItem(storageKey);
    
    if (!deviceId) {
        deviceId = generateDeviceId();
        localStorage.setItem(storageKey, deviceId);
    }
    
    return deviceId;
}

export function generateMockUser(deviceId: string) {
    const adjectives = ['Mystical', 'Cosmic', 'Ethereal', 'Celestial', 'Lunar', 'Solar', 'Stellar', 'Astral', 'Divine', 'Sacred'];
    const nouns = ['Traveler', 'Seeker', 'Dreamer', 'Wanderer', 'Explorer', 'Voyager', 'Pilgrim', 'Sage', 'Mystic', 'Oracle'];
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    
    return {
        id: deviceId,
        username: `${adjective}${noun}${number}`,
        email: `${adjective.toLowerCase()}${noun.toLowerCase()}${number}@kaelsi.ai`,
        deviceId: deviceId,
        createdAt: new Date().toISOString()
    };
} 