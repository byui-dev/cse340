// ===== 1. Core Imports =====
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// ===== 2. Custom Modules =====
const getClassifications = require('./utilities/classification'); // adjust path if needed

// ===== 3. Middleware Setup =====
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== 4. Session Configuration =====
app.use(session({
  secret: 'yourSecretKey', // replace with env variable in production
  resave: false,
  saveUninitialized: true
}));

// ===== 5. Global View Variables =====
app.use(async (req, res, next) => {
  try {
    const classifications = await getClassifications();
    res.locals.navItems = classifications.map(c => ({
      href: `/classification/${c.classification_name.toLowerCase()}`,
      label: c.classification_name
    }));
  } catch (err) {
    res.locals.navItems = [];
  }
  res.locals.loggedIn = req.session?.loggedIn || false;
  res.locals.title = 'CSE Motors';
  res.locals.currentPath = req.path; // add this for active link highlighting
  next();
});


// ===== 6. View Engine Setup =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== 7. Route Handlers =====
const homeRoutes = require('./routes/home');
const accountRoutes = require('./routes/account');
// Debugging
app.get('/debug', (req, res) => {
  res.send({
    navItems: res.locals.navItems,
    loggedIn: res.locals.loggedIn,
    currentPath: res.locals.currentPath
  });
});


app.use('/', homeRoutes);
app.use('/account', accountRoutes);

// ===== 8. Error Handling (Optional) =====
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).render('error', { message: 'Something went wrong!' });
// });

