User Manual

Project Name: Meal Match

High-level description: Meal Match is a meal planning and grocery assistance application that helps users plan meals, generate grocery lists, find stores selling the required ingredients, view recipes, and track their nutritional intake over time. The system integrates meal planning, grocery price comparison, nutrition tracking, and long-term meal data storage to simplify the meal preparation process.

Key Features: 
Meal Planning: Select meals from a vast recipe database and schedule them for the week.
Grocery List Generation: Automatically create shopping lists based on planned meals.
Store Price Comparison: Compare prices of local stores for provided ingredients.
Nutrition Tracking: Monitor calorie and macronutrient intake over time.

Installation Guide: 

Prerequisites: 
To install and run Meal Match, ensure you have the following installed:
MongoDB (version 6.x or later) - Required for storing user data, meal plans, and grocery lists. 
Download: https://www.mongodb.com/try/download/community
Work in progress
Node.js (version 18.x or later) - Needed to build a React app and backend services
Download: https://nodejs.org/en
Git - For version control and cloning the repository
Download: https://git-scm.com/downloads/win

Running the Software:
	Clone the repository: 
git clone https://github.com/your-repository/meal-match.git
cd meal-match

	Install dependencies: 
npm install

	Set up MongoDB
Work in progress

	Start the backend server
cd server
npm run server

	Start the frontend application
npm start

	Once installation is complete, open a web browser and navigate to: 
http://localhost:3000

How To Use the Software: 

	Account Login/Sign Up
Click on the Account Login/Sign Up button located on the top right of any page
If you are logging in, log in using your email address and password.
If you are signing up, first, enter an active email address and password. Once signed up, there will be a series of questions to help determine your goals and the nutritional information that comes with those goals. 

	Creating a Meal Plan
Navigate to the Meal Plan page by clicking Food in the nav bar then Meal Plan. 
Select meals from recipes supplied by a custom query such as “Chicken”, or add custom meals. 
Save your meal plan for the week by clicking the blue “Save” button.

	Generating a Grocery List
Click on “Generate Grocery List” by clicking “Grocery” on the nav bar and then clicking “Generate Grocery List”. 
Create a grocery list by either inputting specific grocery items or clicking the create grocery list from the meal plan option then supply which meal you would like to add which will add all ingredients from that meal. 
Compare prices of ingredients from the meal plan by clicking on the “Compare Prices” button which will navigate you to the “Store Comparision” page. Once on this page input your zip code and hit search to analyze the prices of the ingredients from different stores. 
Comparing Grocery Pricing
Click on the “Compare Grocery Pricing” by clicking on “Grocery” on the nav bar and then clicking “Compare Grocery Pricing”.
First, input your zip code to which area of stores you would like to observe.
Then, adjust the mile radius to determine the radius for stores you would like to see compared to your zip code. 
Now, add an ingredient item and hit “Search” for which you would like to compare prices for using your zip code and mile radius. 

	Tracking Nutrition
Navigate to the “Nutrition Tracker” page by clicking on “Nutrition” then “Nutrition Tracker” 
Click on the day to which you would like update nutrition information. 
Enter food intake into the Nutrition Tracker by inputting food into either Breakfast, Snack, Lunch, or Dinner. 
Below the section to input foods, there will be a breakdown of nutrition information in a table specifying Calories, Protein, Fats, and Carbs. 

	User Stats
Navigate to the “User Stats” page by clicking on the “Nutriton” tab located in the nav bar then clicking “User Stats”
Work in Progress

Report a Bug:
To report a bug follow the steps outlined in this document https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html, more specifically follow the outline at the bottom of the page of the document. 

Known Bugs:
Price comparison across stores is still in progress
Work in progress
