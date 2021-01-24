export const TARGET_DB_SERVER = process.env.TARGET_DB_SERVER || '';

export const TARGET_DB_PORT = +(process.env.TARGET_DB_PORT || 1433) || 1433;

export const TARGET_DB_DATABASE = process.env.TARGET_DB_DATABASE || '';

export const TARGET_DB_USER = process.env.TARGET_DB_USER || '';

export const TARGET_DB_PASSWORD = process.env.TARGET_DB_PASSWORD || '';

export const TARGET_DB_ENCRYPT = !!(process.env.TARGET_DB_ENCRYPT || 0);

export const CSV_FOLDER = process.env.CSV_FOLDER || '';
