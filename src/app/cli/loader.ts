import { config } from 'dotenv';

export const loadEnvironmentVariables = async () => {
  config();
};
