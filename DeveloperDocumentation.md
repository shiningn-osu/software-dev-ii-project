# Developer Documentation


The following describes guidelines for developer access and options for compiling, obtaining, and testing the source code of Meal Match, and describing its architecture.

## **How to obtain the source code.**

The source code of Meal Match is obtainable via the GitHub link:

https://github.com/shiningn-osu/software-dev-ii-project/tree/main

Several branches exist aside from main, including the testing branch, along with various other beta branches for testing API connection, user construction, etc. 
All are visible through the above link.


## **The layout of your directory structure.** 

Within the top-level GitHub directory, there are several pieces of documentation. This includes the user and developer manuals, as well as the Living document which categorizes the plan of the project.
Within the subdirectories, REPORTS contain weekly reports on status updates of the project.

For the builds of Meal Match, CODE contains the CLIENT and SERVER structures. CLIENT contains all the viewable pages and functionality currently within the main repository, and runs on the port 3000. Within CLIENT, PUBLIC contains the index.html which is the home page. SRC contains all css and js files which control the navigation, api calls, and all other functionality within the service. SERVER currently contains the node.js server functionality of API and DB calls, which is exposed on port 6000. 

## **Coding Style Guides** 

The code for this project utilizes the following style guides:

### Google Style Guide for HTML and CSS
- https://google.github.io/styleguide/htmlcssguide.html
- General Guidelines:
  - Protocol: Always use HTTPS (https:) for images, media files, stylesheets, and scripts to ensure security and consistency.
  - Indentation: Use 2 spaces per indentation level. Avoid using tabs or mixing tabs and spaces.
  - Capitalization: Write all code in lowercase, including HTML element names, attributes, CSS selectors, properties, and property values (except for strings).
  - Trailing Whitespace: Remove unnecessary trailing whitespaces to simplify diffs and maintain clean code.
  - Encoding: Set your editor to use UTF-8 encoding without a byte order mark (BOM). Specify the encoding in HTML documents with <meta charset="utf-8">.
  - Comments: Provide comments to explain code functionality and purpose where necessary.
  - Action Items: Mark todos with the keyword TODO, followed by a contact in parentheses and a description, e.g., TODO(john.doe): update link.
- HTML-Specific Guidelines:
  - HTML-Specific Guidelines:
  - Document Type: Always start documents with <!doctype html> to ensure they are rendered in no-quirks mode.
  - HTML Validity: Write valid HTML code and use tools like the W3C HTML validator to check for validity.
  - Semantics: Use HTML elements according to their intended purpose, such as using heading elements for headings and p elements for paragraphs.

### JavaScript: AirBnB JavaScript Guideline
- https://github.com/airbnb/javascript
- Most Important Guidelines:
  - Variable Declarations: Use const for constants and let for reassigned variables; avoid var.
  - Objects & Arrays: Use literal syntax ({} for objects, [] for arrays) and shorthand when possible.
  - Functions & Arrow Functions: Prefer function declarations; use arrow functions for concise expressions.
  - Strings & Template Literals: Use single quotes ' for strings and backticks ` for multi-line or interpolated strings.
  - Code Style & Structure: Use === for comparisons, 2-space indentation, semicolons, and trailing commas in multi-line objects/arrays.
  - ES6+ Best Practices: Utilize ES6+ features like modules (import/export), classes, destructuring, and spread/rest operators.
  - Performance & Maintainability: Write tests, optimize performance, and use the built-in standard library methods.

## **How to build the software.** 
To build Meal Match, you will need to install:

git:
Download: [https://git-scm.com/downloads/](https://git-scm.com/downloads/)
Node.js:
Download: [https://nodejs.org/en](https://nodejs.org/en)

To allow for server functionality, you will need to utilize MongoDB from the web:
MongoDB Utilization steps:
  0. Go to the server repository and add a .env file.
    0.1 Make sure to create two variables named MONGODB_URI and JWT_SECRET
    0.2 For the JWT_SECRET, you can set that to any combination of 32 characters
  1. Go to the MongoDB Atlas website [https://www.mongodb.com] (https://www.mongodb.com)
  2. Either try for free or sign in with an account
  3. Once inside of the Atlas, within a project, go to the "Overview" tab on the left side-nav, and create a new cluster if one does not already show up for you. 
  4. Go to the "Network Access" tab and whitelist your current IP address, or just whitelist all IP addresses.
    4.1 To add a new IP address, click on the add IP address button.
      4.1.1 If you want to whitelist all IP addresses, under the "Access List Entry" field, add the text "0.0.0.0/0"
  5. Go to the "Database Access" side-nav tab, and select to add a new database user. 
    5.1 Create a new username and password, and grant them read/write access to the database for their built in role.
    5.2 Make sure to add click the button to add the user.
  6. Go the "Clusters" side-nav tab, and click on the connect button
    6.1 Select "Drivers", and then copy and paste that selection string into the .env file, setting MONGODB_URI to be equal to that connection string.
    6.2 Replace the username and password in the connection string with your created user's username and password.
Now the server should be ready to run and connect to the database.

## Build from a Branch
To build from a branch, either download the branch as a zip file, and navigate into the directory through your command line, or in git:
```Bash
git clone https://github.com/shiningn-osu/software-dev-ii-project/tree/NAME_OF_BRANCH
cd software-dev-ii-project
```

install all dependencies from inside of software-dev-ii-project:
```Bash
cd code/client
npm install 
cd ../server
npm install
```

run the server from inside the server directory:
```Bash
npm run start
```

run the client:
- create a new terminal and navigate to the software-dev-ii-project directory
```Bash
cd code/client
npm start
```


## **How to test the software.**

To test the software one can navigate to either the CLIENT or SERVER directories in the code directory, and execute the following command:
```Bash
npm test
```

Below is an example of navigating into the CLIENT of the directory from the software-dev-ii-project directory and testing:
```Bash
cd code/client
npm test
```

Below is an example of navigating into the SERVER of the directory from the software-dev-ii-project directory and testing:
```Bash
cd code/server
npm test
```

To target test a specific .test.js file, add the target file full name after test in the 'npm test' command


## **How to add new tests.** 
Are there any naming conventions/patterns to follow when naming test files? Is there a particular test harness to use?

Current standard is to use the JEST formatting, whos files are marked by the .test.js filetype. 

To add a test to the code base, one needs to create a file with the .test.js extension within either the client or the server directories. Then, the test adder needs to create a test function with a string description and an arrow function as parameters. This arrow function should incorporate an assertion which will be run by the Jest test command. Then to run the test in the project, navigate to either the client or server directories, and run the ‘npm test’ command to test every unit test in the project. Alternatively, testing the single file is possible with the ‘npm test <fileName>’ command that includes the actual full file name.

New tests, either within the App.test.js file, or within a new file, can be created by writing using the React testing library, along with Jest, using this documentation:

Jest:
https://jestjs.io/docs/getting-started
React:
https://testing-library.com/docs/react-testing-library/intro/


## **How to build a release of the software.** 

Since the system is server-based and does not currently rely on a formal versioning system, building a release primarily involves preparing the server and client code for deployment. The build process is largely automated via npm, but there are a few manual tasks and checks a developer should perform:

### Manual Tasks Before Building:

**Update Documentation:** Ensure that DeveloperDocumentation.md and UserDocumentation.md reflect any recent changes to functionality, API endpoints, or usage instructions. While no version number is tracked in the code, consider adding a date or informal release identifier (e.g., "Release - March 2025") to these files for clarity.

**Dependency Check:** Verify that all dependencies listed in code/server/package.json and code/client/package.json are up-to-date and compatible. Manually update any critical dependencies if needed (e.g., npm outdated to identify outdated packages, then npm update <package-name>).

**Environment Configuration:** Confirm that the .env file (if used) in the code/server directory contains the correct production settings, such as database connection strings or API keys, and remove any development-specific values.

**API Endpoints:** Ensure that all API endpoints and requests between the client and server utilize the correct URL addresses for the production environments that they are going to be released in.

Finally, run the following commands from the software-dev-ii-project directory to build the client for deployment
```Bash
cd code/client
npm run build
```

Now you have a server and build directory that can be used in deployment.