# Meal Match Installation Guide

## Live Version

**NOTE**: Currently, there is a live web application of this service available. This service has a 15-30 second "cold-start" time, meaning once a form is submitted for the first time in that usage session, then it will take around 15-30 seconds for a response to arrive back from the live server. This only occurs for the first time in that usage session, and not for any subsequent times. The usage session will reset after 15 minutes of inactivity, at which point another "cold-start" will occur before a response to the form submission can occur.

The live version of Meal Match can be found at https://meal-match-service.vercel.app/. 

## Installing the Project

The following is a guide for installing the repository and installing dependencies for the Node.js project. To find the setup steps, view either the [UserDocumentation.md](./UserDocumentation.md#running-the-software:) or the [SETUP.md](./SETUP.md)

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
