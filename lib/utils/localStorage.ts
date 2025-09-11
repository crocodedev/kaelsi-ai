export class LocalStorage {
    public static readonly LANGUAGE_KEY = 'i18nextLng';
    public static readonly USER_ID = 'userId';

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

    // USER 

    static getUserId(): string | null {
        return this.getItem(this.USER_ID)
    }

    static setUserId(value: string) {
        this.setItem(this.USER_ID, value)
    }
}