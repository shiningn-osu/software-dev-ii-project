import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './DirApp/App';

// can uncomment whichever one you want to insert, and change the tag in the React.StringMode to match your page name to display
//    your page's content for development.

// import Food from './DirFood/Food';
// import Grocery from './DirGrocery/Grocery';
// import Home from './DirHome/Home';
// import Nutrition from './DirNutrition/Nutrition';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
