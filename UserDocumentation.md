# User Manual

## Project Name: Meal Match

### High-level description:
Meal Match is a meal planning and grocery assistance application that helps users plan meals, generate grocery lists, find stores selling the required ingredients, view recipes, and track their nutritional intake over time. The system integrates meal planning, grocery price comparison, nutrition tracking, and long-term meal data storage to simplify the meal preparation process.

### Key Features:
- **Meal Planning:** Select meals from a vast recipe database and schedule them for the week.
- **Grocery List Generation:** Automatically create shopping lists based on planned meals.
- **Store Price Comparison:** Compare prices of local stores for provided ingredients. (Unfinished)
- **Nutrition Tracking:** Monitor calorie and macronutrient intake over time.

## Installation Guide

### Prerequisites:
To install and run Meal Match, ensure you have the following installed:
- **Git** - For version control and cloning the repository.  
  Download: [https://git-scm.com/downloads/](https://git-scm.com/downloads/)
- **Node.js (version 18.x or later)** - Needed to build a React app and backend services.  
  Download: [https://nodejs.org/en](https://nodejs.org/en)

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
    cd ..
    ```
3. **Set up a MongoDB Server Connection**  
    0. Go to the server repository and add a .env file.
      0.1 Make sure to create two variables named MONGODB_URI and JWT_SECRET
      0.2 For the JWT_SECRET, you can set that to any combination of 32 random characters
    1. Go to the MongoDB website [https://www.mongodb.com] (https://www.mongodb.com)
    2. Either create an account for free or sign in with an existing account
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
   
4. **Start the backend server:**
    ```bash
    cd server
    npm run start
    ```
5. **Start the frontend application:**
    1. Open another terminal
    2. navigate to the software-dev-ii-project repository
    ```bash
    cd code/client
    npm start
    ```
6. **Open Browser Tab**
    1. Open up a browser tab
    2. Navigate to http://localhost:3000
      2.1 It may be necessary to navigate to http://127.0.0.1:3000 if the localhost address does not work.

## How To Use the Software

### Account Login/Sign Up
1. If you are logging in, log in using your username and password.
2. If you are signing up, first, enter an active username and password. Once signed up, you will need to login using your account information.

### Creating a Meal Plan
1. Navigate to the Meal Plan page by clicking "Food" in the nav bar then "Meal Plan."
2. Select meals from recipes supplied by a custom query such as “Chicken”, or add custom meals.
3. Save your meal plan for the week by clicking the blue “Save” button.

### Generating a Grocery List
1. Click on “Generate Grocery List” by clicking “Grocery” on the nav bar and then clicking “Generate Grocery List”.
2. Create a grocery list by either inputting specific grocery items or clicking "Create Grocery List from Meal Plan," then select which meal to add (which will add all ingredients from that meal).
3. Compare prices of ingredients from the meal plan by clicking on the “Compare Prices” button. This will navigate you to the “Store Comparison” page. Once there, input your zip code and hit search to analyze the prices of the ingredients from different stores.

### Comparing Grocery Pricing
1. Click on the “Compare Grocery Pricing” by clicking on “Grocery” in the nav bar and then clicking “Compare Grocery Pricing.”
2. First, input your zip code to specify the area of stores you would like to observe.
3. Then, adjust the mile radius to determine the radius for stores to be compared to your zip code.
4. Add an ingredient item and hit “Search” for which you would like to compare prices for using your zip code and mile radius.

### Tracking Nutrition
1. Navigate to the “Nutrition Tracker” page by clicking on “Nutrition” then “Nutrition Tracker.”
2. Click on the day to update nutrition information.
3. Enter food intake into the Nutrition Tracker by inputting food into either Breakfast, Snack, Lunch, or Dinner.
4. Below the section to input foods, there will be a breakdown of nutrition information in a table specifying Calories, Protein, Fats, and Carbs.

### User Stats
1. Navigate to the “User Stats” page by clicking on the “Nutrition” tab located in the nav bar then clicking “User Stats.”
    Work in Progress.

### Report a Bug:
To report a bug, follow the steps outlined in this document:  
[Bug Reporting Guidelines](https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html).  

### Known Bugs:
- Price comparison across stores is still in progress.
- Work in progress.
