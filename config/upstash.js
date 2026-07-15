import { Client } from '@upstash/workflow';
import { QSTASH_TOKEN } from './env.js';

export const workflowClient = new Client({
    token: QSTASH_TOKEN,
});