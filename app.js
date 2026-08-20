const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Dummy users
let users = [];

let plans = [
  { id: 1, name: "Basic Plan", price: 9.99, billingCycle: "Monthly", features: "Basic features, 5GB Storage, Email Support" },
  { id: 2, name: "Standard Plan", price: 29.99, billingCycle: "Monthly", features: "All features, 50GB Storage, Priority Support" },
  { id: 3, name: "Premium Plan", price: 299.99, billingCycle: "Yearly", features: "Unlimited features, 500GB Storage, 24/7 Phone Support" }
];

let customers = [
  { id: 1, name: "Rahul Sharma", email: "rohit@example.com", phone: "9876543210" },
  { id: 2, name: "Priya Patel", email: "Nitish@example.com", phone: "9123456789" }
];

let subscriptions = [
  { id: 1, customerName: "Rahul Sharma", planName: "Basic Plan", startDate: "2025-01-10", status: "Active" },
  { id: 2, customerName: "Priya Patel", planName: "Standard Plan", startDate: "2025-02-01", status: "Active" }
];

let invoices = [
  { id: 1, customerName: "Rahul Sharma", planName: "Basic Plan", amount: 9.99, date: "2025-01-10", status: "Paid" },
  { id: 2, customerName: "Priya Patel", planName: "Standard Plan", amount: 29.99, date: "2025-02-01", status: "Paid" }
];

// ---------------- LOGIN / REGISTER ----------------
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  let id = users.length ? users[users.length - 1].id + 1 : 1;
  let newUser = {
    id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  users.push(newUser);
  res.redirect('/');
});

// ---------------- HOME ----------------
app.get('/', (req, res) => {
  let totalPlans = plans.length;
  let totalCustomers = customers.length;
  let activeSubscriptions = subscriptions.filter(s => s.status === 'Active').length;
  let totalRevenue = invoices.reduce((sum, i) => sum + Number(i.amount), 0);

  res.render('home', {
    totalPlans,
    totalCustomers,
    activeSubscriptions,
    totalRevenue,
    users
  });
});

// ---------------- PLANS ----------------
app.get('/plans', (req, res) => {
  res.render('plans', { plans });
});

app.get('/plan/new', (req, res) => {
  res.render('addPlan');
});

app.post('/plan', (req, res) => {
  let id = plans.length ? plans[plans.length - 1].id + 1 : 1;
  let newPlan = {
    id,
    name: req.body.name,
    price: Number(req.body.price),
    billingCycle: req.body.billingCycle,
    features: req.body.features
  };
  plans.push(newPlan);
  res.redirect('/plans');
});

app.get('/plan/edit/:id', (req, res) => {
  let plan = plans.find(p => p.id === Number(req.params.id));
  res.render('editPlan', { plan });
});

app.put('/plan/edit/:id', (req, res) => {
  let index = plans.findIndex(p => p.id === Number(req.params.id));
  if (index !== -1) {
    plans[index].name = req.body.name;
    plans[index].price = Number(req.body.price);
    plans[index].billingCycle = req.body.billingCycle;
    plans[index].features = req.body.features;
  }
  res.redirect('/plans');
});

app.delete('/plan/delete/:id', (req, res) => {
  let index = plans.findIndex(p => p.id === Number(req.params.id));
  if (index !== -1) plans.splice(index, 1);
  res.redirect('/plans');
});

// ---------------- CUSTOMERS ----------------
app.get('/customers', (req, res) => {
  res.render('customers', { customers });
});

app.get('/customer/new', (req, res) => {
  res.render('addCustomer');
});

app.post('/customer', (req, res) => {
  let id = customers.length ? customers[customers.length - 1].id + 1 : 1;
  let newCustomer = {
    id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };
  customers.push(newCustomer);
  res.redirect('/customers');
});

app.get('/customer/edit/:id', (req, res) => {
  let customer = customers.find(c => c.id === Number(req.params.id));
  res.render('editCustomer', { customer });
});

app.put('/customer/edit/:id', (req, res) => {
  let index = customers.findIndex(c => c.id === Number(req.params.id));
  if (index !== -1) {
    customers[index].name = req.body.name;
    customers[index].email = req.body.email;
    customers[index].phone = req.body.phone;
  }
  res.redirect('/customers');
});

app.delete('/customer/delete/:id', (req, res) => {
  let index = customers.findIndex(c => c.id === Number(req.params.id));
  if (index !== -1) customers.splice(index, 1);
  res.redirect('/customers');
});

// ---------------- SUBSCRIPTIONS ----------------
app.get('/subscriptions', (req, res) => {
  res.render('subscriptions', { subscriptions });
});

app.get('/subscription/new', (req, res) => {
  res.render('addSubscription', { customers, plans });
});

app.post('/subscription', (req, res) => {
  let id = subscriptions.length ? subscriptions[subscriptions.length - 1].id + 1 : 1;
  let newSub = {
    id,
    customerName: req.body.customerName,
    planName: req.body.planName,
    startDate: req.body.startDate,
    status: req.body.status
  };
  subscriptions.push(newSub);
  res.redirect('/subscriptions');
});

app.get('/subscription/edit/:id', (req, res) => {
  let subscription = subscriptions.find(s => s.id === Number(req.params.id));
  res.render('editSubscription', { subscription, customers, plans });
});

app.put('/subscription/edit/:id', (req, res) => {
  let index = subscriptions.findIndex(s => s.id === Number(req.params.id));
  if (index !== -1) {
    subscriptions[index].customerName = req.body.customerName;
    subscriptions[index].planName = req.body.planName;
    subscriptions[index].startDate = req.body.startDate;
    subscriptions[index].status = req.body.status;
  }
  res.redirect('/subscriptions');
});

app.put('/subscription/cancel/:id', (req, res) => {
  let sub = subscriptions.find(s => s.id === Number(req.params.id));
  if (sub) sub.status = 'Cancelled';
  res.redirect('/subscriptions');
});

app.delete('/subscription/delete/:id', (req, res) => {
  let index = subscriptions.findIndex(s => s.id === Number(req.params.id));
  if (index !== -1) subscriptions.splice(index, 1);
  res.redirect('/subscriptions');
});

// ---------------- INVOICES ----------------
app.get('/invoices', (req, res) => {
  res.render('invoices', { invoices });
});

app.get('/invoice/new', (req, res) => {
  res.render('addInvoice', { customers, plans });
});

app.post('/invoice', (req, res) => {
  let id = invoices.length ? invoices[invoices.length - 1].id + 1 : 1;
  let newInvoice = {
    id,
    customerName: req.body.customerName,
    planName: req.body.planName,
    amount: Number(req.body.amount),
    date: req.body.date,
    status: req.body.status
  };
  invoices.push(newInvoice);
  res.redirect('/invoices');
});

app.delete('/invoice/delete/:id', (req, res) => {
  let index = invoices.findIndex(i => i.id === Number(req.params.id));
  if (index !== -1) invoices.splice(index, 1);
  res.redirect('/invoices');
});
app.get('/reports', (req, res) => {
  let totalPlans = plans.length;
  let totalCustomers = customers.length;
  let activeSubscriptions = subscriptions.filter(s => s.status === 'Active').length;
  let totalRevenue = invoices.reduce((sum, i) => sum + Number(i.amount), 0);

  res.render('reports', {
    totalPlans,
    totalCustomers,
    activeSubscriptions,
    totalRevenue
  });
});

// ---------------- SERVER ----------------
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});