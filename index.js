// Load environment variables from .env file
require('dotenv').config();

// Example of accessing environment variables
console.log('Environment variables loaded!');

// Access variables using process.env.VARIABLE_NAME
// For example: const apiKey = process.env.API_KEY;

// Log available environment variables (for development only, remove in production)
console.log('Available environment variables:', Object.keys(process.env));

// Your smart contract code will go here
// ...
