# Developer Documentation


The following describes guidelines for developer access and options for compiling, obtaining, and testing the source code of Meal Match, and describing its architecture.

#### **How to obtain the source code.**

The source code of Meal Match is obtainable via the GitHub link:

https://github.com/shiningn-osu/software-dev-ii-project/tree/main

Several branches exist aside from main, including the testing branch, along with various other beta branches for testing API connection, user construction, etc. 
All are visible through the above link.


#### **The layout of your directory structure.** 

Within the GitHub repository directory, there are several pieces of documentation. This includes the user and developer manuals, as well as the Living document which categorizes the plan of the project.
Within the subdirectories, REPORTS contain weekly reports on status updates of the project.

For the builds of Meal Match, CODE contains the CLIENT and SERVER structures. SERVER currently contains the node.js server functionality, which opens on the port 6000.
CLIENT contains all other pages and functionality currently within the main repository.

within CLIENT, PUBLIC contains the index.html which is the home page. SRC contains all css and js files which control the navigation, api calls, and all other functionality within the service.


#### - **How to build the software.** 
To build Meal Match, you will need to install:

git:
Download: [https://git-scm.com/downloads/win](https://git-scm.com/downloads/win)
Node.js:
Download: [https://nodejs.org/en](https://nodejs.org/en)
MongoDB:
Download: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
npm:
https://www.npmjs.com

To build from a branch, either download the branch as a zip file, and navigate into the directory through your command line, or in git:

```
git clone https://github.com/shiningn-osu/software-dev-ii-project/tree/NAME_OF_BRANCH

```

navigate into the CLIENT of the directory:
```
cd code
cd client
```

install the client using npm:
```
npm install
```

and run the client using npm:
```
npm start
```


#### - **How to test the software.**
Provide clear instructions for how to run the system’s test cases. In some cases, the instructions may need to include information such as how to access data sources or how to interact with external systems. You may reference the user documentation (e.g., prerequisites) to avoid duplication.

Primary testing of the software is done through the App.test.js Jest file within 
```
code/client/src/DirApp
```

This is a Jest file which can be run via:


navigate into the CLIENT of the directory:
```
cd code
cd client
```

run the test via the command "test" within the package.json found within the client directory:

```
npm test --.\code\client\src\DirApp\App.test.js
```

This will run the test file through npm


#### - **How to add new tests.** 
Are there any naming conventions/patterns to follow when naming test files? Is there a particular test harness to use?

Current standard is to use the JEST formatting, whos files are marked by the .test.js filetype. 
Other options for testing include the React testing library, Supertest, and JUnit. However, primary testing operations will be using Jest.

New tests, either within the App.test.js file, or within a new file, can be created by writing using the React testing library, along with Jest, using this documentation:

Jest:
https://jestjs.io/docs/getting-started
React:
https://testing-library.com/docs/react-testing-library/intro/


#### - **How to build a release of the software.** 
Describe any tasks that are not automated. For example, should a developer update a version number (in code and documentation) prior to invoking the build system? Are there any sanity checks a developer should perform after building a release?

As the system is server based, building a release is not currently dependent on a version system. 
Starting the server via:

navigate into the SERVER of the directory:
```
cd code
cd server
```

install the client using npm:
```
npm install
```

and run the client using npm:
```
npm start
```

is all that is needed to start running the server for service, and operating on the client is all that is needed to see changes.