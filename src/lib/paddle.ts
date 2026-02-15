import { Paddle, Environment } from '@paddle/paddle-node-sdk';

// Initialize Paddle client
// Use 'sandbox' for testing, 'production' for live
const environment = process.env.NODE_ENV === 'production' 
  ? Environment.production 
  : Environment.sandbox;

export const paddle = new Paddle(process.env.PADDLE_API_KEY || 'dummy_key', {
  environment,
});
