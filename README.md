# Car Hunt Server

This is the backend server for **Car Hunt**, a car store application. It provides APIs for managing users, cars, and orders. The server is built using **Node.js**, **Express**, **TypeScript**, and **MongoDB** with a modular architecture.


## 🌍 Live Demo

Client Site: [Visit Car Hunt](https://car-hunt.vercel.app/)
Server Site: [Visit Car Hunt Api](https://car-stores-api.vercel.app/)
---

## Features

- **User Management**:
  - User registration and authentication (JWT-based).
  - Role-based access control (Admin, User).
  - Block/unblock users.
  - Update user profile and change password.

- **Car Management**:
  - Add, update, and delete cars (Admin only).
  - Fetch all cars or details of a specific car.

- **Order Management**:
  - Create and manage orders.
  - Verify payments.
  - Fetch revenue statistics.

- **Authentication**:
  - Login and refresh token.
  - Password change functionality.

---

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer and Cloudinary
- **Payment Integration**: ShurjoPay
- **Validation**: Zod
- **Linting**: ESLint
- **Formatting**: Prettier
- **Environment Variables**: Dotenv

---

## Auth Routes

- **POST `/auth/login`**: User login.
- **POST `/auth/change-password`**: Change user password.
- **POST `/auth/refresh-token`**: Refresh access token.

---

## User Routes

- **POST `/user/register`**: Register a new user.
- **GET `/user/all-users`**: Get all users (Admin only).
- **GET `/user/:userId`**: Get a specific user (Admin only).
- **GET `/user/me/details`**: Get logged-in user details.
- **GET `/user/my-order/details`**: Get logged-in user's order details.
- **PATCH `/user/block-user/:userId`**: Block a user (Admin only).
- **PATCH `/user/unblock-user/:userId`**: Unblock a user (Admin only).
- **PATCH `/user/profile-data`**: Update logged-in user's profile.

---

## Car Routes

- **POST `/cars`**: Create a new car (Admin only).
- **GET `/cars`**: Get all cars.
- **GET `/cars/:carId`**: Get details of a specific car.
- **PUT `/cars/:carId`**: Update a car (Admin only).
- **PATCH `/cars/delete/:carId`**: Soft delete a car (Admin only).

---

## Order Routes

- **POST `/orders`**: Create a new order (User only).
- **GET `/orders/verify`**: Verify payment.
- **GET `/orders`**: Get all orders.
- **GET `/orders/:orderId`**: Get details of a specific order.
- **DELETE `/orders/:orderId`**: Delete an order.
- **GET `/orders/revenue`**: Get revenue statistics.

---

## Scripts

- **Start the server**: `npm start`
- **Start the server in development mode**: `npm run start:dev`
- **Build the project**: `npm run build`
- **Lint the code**: `npm run lint`
- **Fix linting issues**: `npm run lint:fix`
- **Format the code**: `npm run format`
- **Fix formatting issues**: `npm run format:fix`