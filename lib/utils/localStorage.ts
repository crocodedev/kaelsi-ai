export class LocalStorage {
    public static readonly LANGUAGE_KEY = 'i18nextLng';

    static getItem(key: string): string | null {
        return localStorage.getItem(`${key}`);
    }

    static setItem(key: string, value: string): void {
        localStorage.setItem(`${key}`, value);
    }

    static removeItem(key: string): void {
        localStorage.removeItem(`${key}`);
    }

    static clear(): void {
        localStorage.clear();
    }

    static getLanguage(): string | null {
        return this.getItem(this.LANGUAGE_KEY);
    }
}