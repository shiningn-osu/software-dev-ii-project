# User Manual

## Project Name: Meal Match

### High-level description:
Meal Match is a meal planning and grocery assistance application that helps users plan meals, generate grocery lists, find stores selling the required ingredients, view recipes, and track their nutritional intake over time. The system integrates meal planning, grocery price comparison, nutrition tracking, and long-term meal data storage to simplify the meal preparation process.

### Key Features:
- **Account Tracking** Create an account to store your data across usage sessions.
- **Diary:** Log your meals and their nutritional breakdowns.
- **Recipe Search:** Find recipes to use by searching for partial name matches.
- **Meal Planning:** Have a meal plan generated for you that satisfies custom constraints.
- **Grocery List Generation:** Create personal grocery lists.
- **Grocery Search:** Search for information about Kroger stocked groceries that match the searched name.
- **Nutrition Tracking:** Modify your nutritional goals, and view your nutritional history.

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
    cd ../..
    ```
3. **Set up a MongoDB Server Connection**  
    3.0. Go to the server repository and add a .env file.
      3.0.1 Make sure to create two variables named MONGODB_URI and JWT_SECRET
      3.0.2 For the JWT_SECRET, you can set that to any combination of 32 random characters
    3.1. Go to the MongoDB website [https://www.mongodb.com] (https://www.mongodb.com)
    3.2. Either create an account for free or sign in with an existing account
    3.3. Once inside of the Atlas, within a project, go to the "Overview" tab on the left side-nav, and create a new cluster if one does not already show up for you. 
    3.4. Go to the "Network Access" tab and whitelist your current IP address, or just whitelist all IP addresses.
      3.4.1 To add a new IP address, click on the add IP address button.
        3.4.1.1 If you want to whitelist all IP addresses, under the "Access List Entry" field, add the text "0.0.0.0/0"
    3.5. Go to the "Database Access" side-nav tab, and select to add a new database user. 
      3.5.1 Create a new username and password, and grant them read/write access to the database for their built in role.
      3.5.2 Make sure to add click the button to add the user.
    3.6. Go the "Clusters" side-nav tab, and click on the connect button
      3.6.1 Select "Drivers", and then copy and paste that selection string into the .env file, setting MONGODB_URI to be equal to that connection string.
      3.6.2 Replace the username and password in the connection string with your created user's username and password.

  Now the server should be ready to run and connect to the database.
   
4. **Start the backend server:**
    ```bash
    cd code/server
    npm run start
    ```
5. **Start the frontend application:**
    5.1 Open another terminal
    5.2 navigate to the software-dev-ii-project repository
    ```bash
    cd code/client
    npm start
    ```
6. **Open Browser Tab**
    6.1 Open up a browser tab
    6.2 Navigate to http://localhost:3000
      6.2.1 It may be necessary to navigate to http://127.0.0.1:3000 if the localhost address does not work.

## How To Use the Software

### Account Login/Sign Up
1. If you are signing up, first, enter an active username and password. Once signed up, you will need to login using your account information.
2. If you are logging in, log in using your username and password.
  2.1 Optionally, you may enter macronutrient intake goals as you log in to view the associated quantities to view progress regarding it displayed in the homepage's "Daily Nutrition Goals" table. This is carried across usage sessions between logging out and logging back in.

### Log Food in a Diary
1. Navigate to the Meal Plan page by clicking "Diary" navbar item from the navbar at the top of the screen.
2. Click the "Add Food" button, and then fill out the fields for the nutritional information related to the food you'd like to log.
3. Once you add the food, the nutritional information of the day's meals will be displayed under the "Today's Totals" section, and the food entries will be presented under the "Today's Meals" section.
4. You can then return back to the homepage by selecting the "Home" navbar item from the navbar at the top of the page.
  4.1 You can then view that the pie chart has be updated with distributions related to the much macro nutrients you've logged for the day.
  4.2 Additionally, you can view the nutrient information about the most recent meal you've logged in the table under the "Most Recent Nutrition Breakdown" header.

### Find Recipes
1. Navigate to the Recipe Search page by clicking the "Recipe Search" navbar item from the navbar at the top of the screen.
2. Type in a portion of the recipe name you'd like to create a meal around (ex. chicken, rice, brocolli, tuna, etc.).
  2.1 Searching will match what you entered with recipes that include what you entered from the Edamam recipe database.
3. Click on the "View Recipe" button associated with the desired recipe to view the recipe information from linked website.

### Creating a Meal Plan
1. Navigate to the Meal Plan page by clicking the "Go to Meal Planning" button on the home page, or by clicking the "Meal Plan" page navbar item from the navbar.
2. Enter in the field information for bounding the types of foods present in the meal plan.
3. Save your meal plan for the week by clicking the green “Save” button, and then giving your meal plan a name.
4. Re-access your meal plan by selecting the "Load Plan" button under your saved meal plans.

### Generating a Grocery List
1. Navigate to the Grocery List page through the home page by clicking the "Go to Grocery List" button, or by clicking the "Grocery List" navbar item from the navbar at the top of the screen.
2. Add a new item to the grocery list by entering the item name, and then clicking the "Add Item" button.
3. View your added item underneath the adding item field under the "Grocery List" header.

### Grocery List Search
1. Navigate to the Grocery Search page by clicking the "Grocery Search" navbar item from the navbar at the top of the screen.
2. Enter in the name of the ingredient you are looking for (ex. chicken, rice, brocolli, tuna, etc.) and search by clicking the "Search" button.
3. View the product information from the nearest Kroger's ingredient offerings that match the ingredient you searched for underneath the search bar. (Currently only uses Corvallis' Fred Meyers, but we are working on making it link to a local Kroger based on IP address).

### Tracking Nutrition
1. Navigate to the Nutrition page through the home page by clicking on the "Go to Nutrition" button, or by clicking the "Nutrition" navbar item from the navbar at the top of the screen.
2. Click on "Edit Nutrition Goals" button.
  2.1 Fill out the fields to adjust your account's nutrition goals per day.
  2.2 You can return to the home page by selecting the "Home" navbar item from the navbar at the top of the page,
  2.2.1 This will show you an updated table for your nutritional goals under the "Daily Nutrition Goals" table header.
3. Return to the Nutrition page, and then click on the "Nutrition History" button.
4. Select the timeframe you wish to see nutritional history for to then view the information in summary form, and also in table form for a daily breakdown.

## Bugs

### Report a Bug:
To report a bug, follow the steps outlined in this document:  
[Bug Reporting Guidelines](https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html).  

### Known Bugs:
- Price comparison across stores is still in progress.
- Work in progress.
