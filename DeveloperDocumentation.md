# Developer Documentation


The following describes guidelines for developer access and options for compiling, obtaining, and testing the source code of Meal Match, and describing its architecture.

#### **How to obtain the source code.**

The source code of Meal Match is obtainable via the GitHub link:

https://github.com/shiningn-osu/software-dev-ii-project/tree/main

Several branches exist aside from main, including the testing branch, along with various other beta branches for testing API connection, user construction, etc. 
All are visible through the above link.


#### **The layout of your directory structure.** 

Within the top-level GitHub directory, there are several pieces of documentation. This includes the user and developer manuals, as well as the Living document which categorizes the plan of the project.
Within the subdirectories, REPORTS contain weekly reports on status updates of the project.

For the builds of Meal Match, CODE contains the CLIENT and SERVER structures. CLIENT contains all the viewable pages and functionality currently within the main repository, and runs on the port 3000. Within CLIENT, PUBLIC contains the index.html which is the home page. SRC contains all css and js files which control the navigation, api calls, and all other functionality within the service. SERVER currently contains the node.js server functionality of API and DB calls, which is exposed on port 6000. 

#### - **How to build the software.** 
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

##### Build from a Branch
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


#### - **How to test the software.**

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
