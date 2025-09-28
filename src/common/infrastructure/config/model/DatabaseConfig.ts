export const DatabaseConfigSymbol: symbol = Symbol('DatabaseConfig');

export interface DatabaseConfig {
  database: string;
  host: string;
  password: string;
  port: number;
  user: string;
}
