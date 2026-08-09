import serverless from 'serverless-http';
import { createApp } from '../../backend/app.js';

const app = createApp();

export const handler = serverless(app);
