export type WebSocketConfiguration = {
    key: string;
    host: string;
    port: string;
    auth: string;
    tls: string;
}

export type GoogleAuthConfiguration = {
    key: string;
    scopes: string;
    redirect_uri: string;
    auth_url: string;
}

export type Configuration = {
    web_socket: WebSocketConfiguration;
    google_auth: GoogleAuthConfiguration;
}

export enum SocialProviders {
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    APPLE = 'apple'
}