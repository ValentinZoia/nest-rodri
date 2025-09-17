//NodeJS.ProcessEnv

declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    SALT_ROUNDS: number;
    JWT_SECRET: string;
  }
}
