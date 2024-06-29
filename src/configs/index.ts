import dotenv from 'dotenv';
import path from 'path';

class ConfigManager {
  private config: any;

  constructor() {
    try {
      this.loadConfig();
    } catch (error) {
      console.error('Error loading configuration:', error);
      process.exit(1); // Exit process on critical error
    }
  }

  private loadConfig(): void {
    // Determine environment (default to 'development')
    const nodeEnv = process.env.NODE_ENV || 'development';

    // Load environment-specific .env file
    const envFile = `.env.${nodeEnv}`;
    const envFilePath = path.resolve(process.cwd(), envFile); // Adjusted path resolution

    try {
      const result = dotenv.config({ path: envFilePath });

      if (result.error) {
        throw result.error;
      }

      // Load appropriate configuration module based on environment
      let configModule;

      switch (nodeEnv) {
        case 'production':
          configModule = require('./production').default;
          break;
        case 'staging':
          configModule = require('./staging').default;
          break;
        case 'development':
        default:
          configModule = require('./development').default;
          break;
      }

      // Assign loaded configuration
      this.config = configModule;
    } catch (error) {
      console.error(`Error loading ${envFile}:`, error);
      throw error; // Re-throw the error for handling in higher layers
    }
  }

  get(key: string): any {
    return this.config[key];
  }
}

const config = new ConfigManager();

export default config;
