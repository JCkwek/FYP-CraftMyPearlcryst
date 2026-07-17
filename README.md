# CraftMyPearlCryst

CraftMyPearlCryst is a web-based jewelry customization and e-commerce platform that enables customers to browse handcrafted jewelry, customize existing products, generate AI-powered jewelry designs, and purchase products online. The system also provides an administration panel for managing products, orders, users, and AI customization components.

---

# Features

## Customer

* Register and log in to an account
* Browse jewelry products
* View detailed product information
* Customize existing jewelry
* Generate AI custom jewelry designs
* Receive AI jewelry recommendations
* Add products to cart
* Checkout using Stripe
* View order history
* Manage personal profile

## Business Owner

* Manage inventory
* Manage orders
* Manage AI customization components
* Review and process AI custom jewelry requests
* Monitor sales information

---

# Technologies Used

## Frontend

* React.js
* React Router
* Axios
* Bootstrap
* CSS Modules

## Backend

* Node.js
* Express.js
* Sequelize ORM
* MySQL
* JWT Authentication
* Stripe Payment Gateway
* Hugging Face API
* Google Gemini API

---

# Prerequisites

Before running the project, ensure the following software is installed:

* Node.js
* npm
* MySQL
* XAMPP (or another MySQL server)

---

# Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd CraftMyPearlCryst
```

---

## 2. Install dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

# Environment Variables

Create a `.env` file inside the **backend** folder and configure the required environment variables.

Example:

```env
PORT=3000

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:3001

GEMINI_API_KEY=your_gemini_api_key

STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

# Database

1. Start MySQL.
2. Create the project database.

Example:

```sql
CREATE DATABASE craftmypearlcryst_db;
```

3. Update the database configuration inside:

```
backend/db.js
```

with your MySQL username and password.

---

# Running the Project

## Backend

Navigate to the backend directory and start the development server.

```bash
cd backend
npm run dev
```

The backend server will run on:

```
http://localhost:3000
```

---

## Frontend

Navigate to the frontend directory and start the React application.

```bash
cd frontend
npm start
```

The frontend application will run on:

```
http://localhost:3001
```

---

# License

This project was developed as a Final Year Project (FYP) for academic purposes.
