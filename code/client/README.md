# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Directory Guide
Here you will find a guide to understanding the contents of the directories of the client directory

### public Entails: 
The public directory houses static assets that should be served as-is, without being processed by Webpack or other build tools. This directory also contains the index.html file, which react injects the app from the src directory into.

[public](./public)

### src Entails: 
The src directory houses the source code for the application. This is where the core logic and UI components of the app are defined. The contents of the src/ directory are processed by Webpack, meaning files in src/ are compiled and bundled before being served to the browser via index.html in the public directory.

[src](./src)

## File Information 
Here you will find a guide to understanding the files of the client directory

### .npmrc Entails:
- Allows installing packages with peer dependency conflicts by ignoring them.
- Disables strict enforcement of peer dependencies.

[.npmrc](./.npmrc)

### package-lock.json Entails:
- locks all of the versions of the node package manager dependencies that the client directory utilizes. The command 'npm install' will always install the versions of the dependencies listed in package-lock.json

[package-lock.json](./package-lock.json)

### package.json Entails:
- Proxy: Redirects API requests to http://localhost:6000 during development.
- Dependencies: Includes libraries for React, routing, charts, and API calls (e.g., react, axios, react-router-dom, recharts).
- DevDependencies: Contains tools for testing (e.g., Jest, React Testing Library) and Babel plugins.
- Scripts: Defines commands for starting, building, testing, and ejecting the app using CRA scripts.
- Overrides: Forces specific versions of dependencies like postcss and serialize-javascript.
- ESLint: Uses React and Jest linting configurations for code quality.
- Browserslist: Specifies supported browsers for production and development environments

[package.json](./package.json)

### vercel.json Entails: 
- code to match all routes and send them to server.js

[vercel.json](./vercel.json)


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
