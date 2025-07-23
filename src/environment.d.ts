declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: number;
            JWT_SECRET: string;
            DATABASE_URL: string;
            ADMIN_API_KEY: string;
        }
    }
}

export {}
