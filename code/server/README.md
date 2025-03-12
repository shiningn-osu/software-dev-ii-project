# Getting Started with the server

This is a guide to understanding the content of the server directory.

## Directory Guide
Here you will find a guide to understanding the contents of the directories of the server directory

### config Entails: 
The config directory houses the MongoDB database connection code and the test for that connection process.

[config](./config)

### controllers Entails: 
The controllers directory contains the logic for handling incoming requests and interacting with the application’s models. Each controller is responsible for performing the business logic for a specific set of routes, such as creating, reading, updating, and deleting resources. Controllers process input data, interact with the database, and return appropriate responses to the client. Also contains unit testing code for testing this process.

[controllers](./controllers)

### middlewares Entails: 
The middlewares directory houses the code to verify the presence and validity of a JWT (JSON Web Token) in incoming requests to ensure that the user is authenticated. Also houses unit test code to test this verification process

[middlewares](./middlewares)

### models Entails: 
The models directory contains Mongoose models, which define the structure and schema for the data used in the application. These models are used to interact with the MongoDB database, providing a way to store, retrieve, and manipulate data. This directory also houses unit test code to test model functionality.

[models](./models)

### routes Entails: 
The routes directory contains Express.js route handlers, which define the endpoints for the application and manage the flow of HTTP requests. Each route corresponds to a specific functionality or resource in the app, and it interacts with controllers, middleware, and models to provide the necessary responses. This directory also contains unit tests to test route functionality.

[routes](./routes)

## File Information 
Here you will find a guide to understanding the files of the server directory

### .babelrc Entails:
- This preset is used to automatically determine the JavaScript features to transpile based on the environment (e.g., supported browsers or Node version). It compiles modern JavaScript (ES6/ES7+) into code that is compatible with older environments (like older browsers or Node.js versions).

[.babelrc](./.babelrc)

### .env.test Entails:
- sets the NODE_ENV environment variable to test.

[.env.test](./.env.test)

### jest.config.js Entails:
- testEnvironment: 'node': Sets Jest to run tests in a Node.js environment instead of the default browser environment.
- transform: {}: Disables any transformation for files (useful for pure JavaScript tests that don't require Babel or other transpilers).
- testTimeout: 15000: Sets the maximum time for a test to run before it's terminated (15 seconds).
- forceExit: true: Forces Jest to exit after the tests, even if there are unresolved async operations.
- detectOpenHandles: true: Identifies any open handles that might prevent Jest from exiting.
- verbose: true: Provides detailed test results in the console.
- coveragePathIgnorePatterns: ['/node_modules/']: Excludes node_modules from the code coverage report.
- moduleNameMapper: Resolves module names to ensure compatibility with file paths, especially related to extensions like .js.
- moduleFileExtensions: Specifies which file extensions Jest should consider when importing modules.

[jest.config.js](./jest.config.js)

### package-lock.json Entails:
- locks all of the versions of the node package manager dependencies that the client directory utilizes. The command 'npm install' will always install the versions of the dependencies listed in package-lock.json

[package-lock.json](./package-lock.json)

### package.json Entails:
- Backend for Meal Match application using Node.js, Express, and MongoDB.
- Dependencies: Includes libraries like express, jsonwebtoken, mongoose, and axios for API and database interactions.
- Testing: Uses Jest for testing, with supertest for HTTP request testing and mongodb-memory-server for in-memory MongoDB.
- Password Hashing: Utilizes bcryptjs and bcrypt for secure password management.
- Scripts: Provides start script to run the server and test script for running tests with custom configurations.

[package.json](./package.json)

### server.js Entails: 
- Purpose: Backend for the Meal Match app, serving API endpoints for meal planning, nutrition tracking, and product data.
- Key Routes:
  - /api/users: User authentication and profile management.
  - /api/nutrition: Manage nutrition goals, recent data, and custom food entries.
  - /api/meals: Add and view meals, calculate nutritional content.
  - /api/krogerLocations: Fetch Kroger store locations based on zip code.
  - /api/generate-meal-plan: Generate a personalized meal plan considering user dietary preferences and goals.
  - API Integrations: Kroger API (for product and location data) and Edamam API (for meal planning).
  - Security: JWT authentication for user-specific data and endpoints.

[server.js](./server.js)

### server.test.js Entails: 
The server.test.js file contains unit and integration tests for the Express server of the Meal Match application. It verifies the correctness and functionality of the API routes and server behavior, ensuring that all endpoints perform as expected under various conditions.

**Key functionalities tested include:**

- API Route Validation: Ensures the proper response for different HTTP requests to endpoints such as /api/krogerLocations, /api/krogerProducts, /api/nutrition/goals, /api/users, and others.
- Authentication and Authorization: Verifies that JWT-based authentication is functioning correctly and that users are able to access protected endpoints based on their token.
- External API Integration: Tests the integration with external APIs like Kroger and Edamam, ensuring that the API keys and access tokens are handled correctly, and external requests return expected data.
- Error Handling: Validates proper error handling, ensuring that the server responds with appropriate error codes and messages for invalid inputs, unauthorized access, or failed external API requests.
- Database Interaction: Verifies that server actions correctly interact with the database, including reading and writing to MongoDB collections like DailyNutrition, Meal, and NutritionGoals.

[server.test.js](./server.test.js)

## Available Scripts

In the server directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
