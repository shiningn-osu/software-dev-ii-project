# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Directory Guide
Here you will find a guide to understanding the contents of the directories of the client directory

### components Entails: 
The components directory houses reusable components of the react project, as well as the unit testing suites designed to test those reusable components.

[components](./components)

### DirApp Entails: 
The DirApp directory houses the code for the central application, which houses a react router that is used by the React building process to be able to dynamically serve different views all from the same index.html file. Also houses unit tests to test the router functionality.

[DirApp](./DirApp)

### pages Entails: 
The pages directory houses the full page components which the router provides navigation to to simulate navigating to different pages. This directory also contains the unit testing suites to test the pages' functionality.

[pages](./pages)

## File Information 
Here you will find a guide to understanding the files of the client directory

### index.css Entails:
- A css styling page that provides general styling rules that affect all the pages of the application.

[index.css](./index.css)

### index.js Entails:
- The intermediary index page which compiles all of the JavaScript XML (JSX) that all of the reusable and page components are made out of.

[index.js](./index.js)

### reportWebVitals.js Entails:
- Measures and reports web performance metrics using the web-vitals library. 
- Helps developers analyze and improve the performance of their React applications.

[reportWebVitals.js](./reportWebVitals.js)

### setupTests.js Entails:
- Configures the testing environment for a React project using Jest and Testing Library.
- Runs before any test files are executed and helps set up necessary tools for testing.

[setupTests.js](./setupTests.js)