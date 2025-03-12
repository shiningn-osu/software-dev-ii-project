# Meal Match Setup Guide

This document provides the instructions for setting up and deploying the web application on a remote server. The app is a React client-server application that requires a backend API (Express.js) and a database (MongoDB or PostgreSQL, depending on your app’s design). This guide will walk through installing the dependencies, configuring the server, and starting the application, both locally and remotely.

## Local Project Setup to Run

The following is a guide for setting up the Meal Match project locally.

### Prerequisites:
To install and run Meal Match, ensure you have the following installed:
- **Git** - For version control and cloning the repository.  
  Download: [https://git-scm.com/downloads/](https://git-scm.com/downloads/)
- **Node.js (version 18.x or later)** - Needed to build a React app and backend services.  
  Download: [https://nodejs.org/en](https://nodejs.org/en)

### Project Structure:
The code for Meal Match is within the top-level directory named "code". Within that directory, there are two directories called "client" and "server". These directories house the code for both the client portion of the web application, and the server portion of the web application respectively.

### Running the Software:
1. **Clone the repository:**
    ```bash
    git clone https://github.com/shiningn-osu/software-dev-ii-project.git
    cd software-dev-ii-project
    ```
2. **Install dependencies:**
    ```bash
    cd code/server
    npm install
    cd ../client
    npm install
    cd ../..
    ```
3. **Set up a MongoDB Server Connection**
    3.0. Go to the server directory and add a .env file. This file will simply have the name of '.env', where no text is in front of the '.' part. This will be set up in the server directory, which is inside the top-level code directory of the project.
      3.0.1 Make sure to create two variables named MONGODB_URI and JWT_SECRET 
      3.0.2 For the MONGODB_URI variable, just leave it blank for now.
      3.0.3 For the JWT_SECRET, you can set that to any combination of 64 random characters  
      3.0.4 Examples of what these variables will look like can be found at the end of this MongoDB setup for step 3.
    3.1. Go to the MongoDB website [https://www.mongodb.com] (https://www.mongodb.com)  
    3.2. Either create an account for free or sign in with an existing account  
    3.3. Once inside of the Atlas, within a project, go to the "Overview" tab on the left side-nav, and create a new cluster if one does not already show up for you.   
    3.4. Go to the "Network Access" tab and whitelist your current IP address, or just whitelist all IP addresses. By default only the IP address of the user who created the account's computer can access the database. Whitelisting allows other IP addresses to read and write to the cluster (assuming they have access, which will be described in 3.5).
      3.4.1 To add a new IP address, click on the "Add IP Address" button.  
        3.4.1.1 If you want to whitelist all IP addresses, under the "Access List Entry" field, add the text "0.0.0.0/0"  
    3.5. Go to the "Database Access" side-nav tab, and select the "Add New Database User" button.   
      3.5.1 Create a new username and password, and grant them read/write access to the database for their built in role.  
      3.5.2 Make sure to click the button to add the user at the bottom.  
    3.6. Go the "Clusters" side-nav tab, and click on the "Connect" button  
      3.6.1 Select "Drivers", and then copy and paste the Connection String into the .env file, setting MONGODB_URI to be equal to that connection string.  
      3.6.2 Replace the username and password in the connection string with your created user's username and password.
    
    - Examples of what the .env file variables should look like to make it run:
    ```Bash
    MONGODB_URI=mongodb+srv://meal-match-USER:Vr0VhP08El1vzPam@cluster0.0zuqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    JWT_SECRET=2f5be5c1d7e02a64e8720514f97d35470bcce228c9a6c1f11036576fbd2dbe0f
    ```
      - **NOTE**, when setting up the .env variables, errors occur in their utilization, it may be necessary to set up quotation marks around the variable values. Ex. MONGODB_URI="mongodb+srv://..."

  Now the server should be ready to run and connect to the database.
   
4. **Start the backend server:**
    ```bash
    cd code/server
    npm run start
    ```
5. **Start the frontend application:**
    5.1 Open another terminal
    5.2 navigate to the software-dev-ii-project directory
    ```bash
    cd code/client
    npm start
    ```
6. **Open Browser Tab**
    6.1 Open up a browser tab
    6.2 Navigate to http://localhost:3000
      6.2.1 It may be necessary to navigate to http://127.0.0.1:3000 if the localhost address does not work.