# Meal Match Setup Guide

## Setup Project (assuming it is already fully installed)

The following is a guide for setting up the project dependencies and important software to prepare it for any personal modification. To find the installation steps, view either the [UserDocumentation.md](./UserDocumentation.md#running-the-software:) or the [INSTALL.md](./INSTALL.md).

1. **Set up a MongoDB Server Connection**
    1.0. Go to the server directory and add a .env file. This file will simply have the name of '.env', where no text is in front of the '.' part. This will be set up in the server directory, which is inside the top-level code directory of the project.
      1.0.1 Make sure to create two variables named MONGODB_URI and JWT_SECRET 
      1.0.2 For the MONGODB_URI variable, just leave it blank for now.
      1.0.3 For the JWT_SECRET, you can set that to any combination of 64 random characters  
      3.0.4 Examples of what these variables will look like can be found at the end of this MongoDB setup for step 3.
    1.1. Go to the MongoDB website [https://www.mongodb.com] (https://www.mongodb.com)  
    1.2. Either create an account for free or sign in with an existing account  
    1.3. Once inside of the Atlas, within a project, go to the "Overview" tab on the left side-nav, and create a new cluster if one does not already show up for you.   
    1.4. Go to the "Network Access" tab and whitelist your current IP address, or just whitelist all IP addresses. By default only the IP address of the user who created the account's computer can access the database. Whitelisting allows other IP addresses to read and write to the cluster (assuming they have access, which will be described in 1.5).
      1.4.1 To add a new IP address, click on the "Add IP Address" button.  
        1.4.1.1 If you want to whitelist all IP addresses, under the "Access List Entry" field, add the text "0.0.0.0/0"  
    1.5. Go to the "Database Access" side-nav tab, and select the "Add New Database User" button.   
      1.5.1 Create a new username and password, and grant them read/write access to the database for their built in role.  
      1.5.2 Make sure to click the button to add the user at the bottom.  
    1.6. Go the "Clusters" side-nav tab, and click on the "Connect" button  
      1.6.1 Select "Drivers", and then copy and paste the Connection String into the .env file, setting MONGODB_URI to be equal to that connection string.  
      1.6.2 Replace the username and password in the connection string with your created user's username and password.
   
    - Examples of what the .env file variables should look like to make it run:
    ```Bash
    MONGODB_URI=mongodb+srv://meal-match-USER:Vr0VhP08El1vzPam@cluster0.0zuqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    JWT_SECRET=2f5be5c1d7e02a64e8720514f97d35470bcce228c9a6c1f11036576fbd2dbe0f
    ```
      - **NOTE**, when setting up the .env variables, errors occur in their utilization, it may be necessary to set up quotation marks around the variable values. Ex. MONGODB_URI="mongodb+srv://..."

  Now the server should be ready to run and connect to the database.
   
2. **Start the backend server:**
    ```bash
    cd code/server
    npm run start
    ```
3. **Start the frontend application:**
    3.1 Open another terminal
    3.2 navigate to the software-dev-ii-project directory
    ```bash
    cd code/client
    npm start
    ```
4. **Open Browser Tab**
    4.1 Open up a browser tab
    4.2 Navigate to http://localhost:3000
      4.2.1 It may be necessary to navigate to http://127.0.0.1:3000 if the localhost address does not work.