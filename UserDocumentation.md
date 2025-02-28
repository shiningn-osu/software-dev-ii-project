# User Manual

## Project Name: Meal Match

### High-level description:
Meal Match is a meal planning and grocery assistance application that helps users plan meals, generate grocery lists, find stores selling the required ingredients, view recipes, and track their nutritional intake over time. The system integrates meal planning, grocery price comparison, nutrition tracking, and long-term meal data storage to simplify the meal preparation process.

### Key Features:
- **Meal Planning:** Select meals from a vast recipe database and schedule them for the week.
- **Grocery List Generation:** Automatically create shopping lists based on planned meals.
- **Store Price Comparison:** Compare prices of local stores for provided ingredients.
- **Nutrition Tracking:** Monitor calorie and macronutrient intake over time.

## Installation Guide

### Prerequisites:
To install and run Meal Match, ensure you have the following installed:
- **MongoDB (version 6.x or later)** - Required for storing user data, meal plans, and grocery lists.  
  Download: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **Node.js (version 18.x or later)** - Needed to build a React app and backend services.  
  Download: [https://nodejs.org/en](https://nodejs.org/en)
- **Git** - For version control and cloning the repository.  
  Download: [https://git-scm.com/downloads/win](https://git-scm.com/downloads/win)

### Running the Software:
1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-repository/meal-match.git
    cd meal-match
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up MongoDB**  
   Work in progress.
   
4. **Start the backend server:**
    ```bash
    cd server
    npm run server
    ```
5. **Start the frontend application:**
    ```bash
    npm start
    ```
    Once installation is complete, open a web browser and navigate to:  
    [http://localhost:3000](http://localhost:3000)

## How To Use the Software

### Account Login/Sign Up
1. Click on the Account Login/Sign Up button located on the top right of any page.
2. If you are logging in, log in using your email address and password.
3. If you are signing up, first, enter an active email address and password. Once signed up, there will be a series of questions to help determine your goals and the nutritional information that comes with those goals.

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
