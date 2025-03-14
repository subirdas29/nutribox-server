# NutriBox Server

NutriBox is a meal planning and delivery web application that allows users to personalize meal plans, schedule deliveries, and manage orders. This server handles authentication, meal providers, orders, and user management.

## 🌍 Live Demo

# Client Site: [Visit NutriBox](https://nutribox-client.vercel.app/)
# Server Site: [Visit NutriBox Api](https://nutribox-server.vercel.app/)
---

## Features
- User authentication and authorization (JWT-based)
- Role-based access control (Customer, Meal Provider)
- Meal providers can add, update, and manage meals
- Customers can browse meals, place orders, and manage their profiles
- Cloud-based image storage with Cloudinary
- Order tracking and management

## Technologies Used
- **Node.js** & **Express.js** - Backend framework
- **MongoDB** & **Mongoose** - Database & ODM
- **TypeScript** - Strongly typed JavaScript
- **JWT** - Authentication & Authorization
- **Zod** - Input validation
- **Multer & Cloudinary** - Image upload & storage
- **ESLint & Prettier** - Code linting & formatting
- **dotenv** - Environment variable management


## API Routes
### Auth Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token

### User Routes
- `POST /api/user/register` - Register a new user
- `PATCH /api/user/profile-data` - Update profile data
- `GET /api/user/my-data` - Get user details

### Order Routes
- `POST /api/orders` - Place an order (Customer)
- `GET /api/orders/:orderId` - Get order details (Customer, Meal Provider)
- `PATCH /api/orders/orderdetails/:orderId` - Update order details
- `GET /api/orders/myorder/alldata` - Get customer orders
- `GET /api/orders/allorder/mealprovider` - Get all orders for a meal provider

### Meal Routes
- `POST /api/meals/menu` - Add a new meal (Meal Provider)
- `GET /api/meals` - Get all meals
- `GET /api/meals/mymeals` - Get meal provider's meals
- `GET /api/meals/:mealId` - Get meal details
- `PATCH /api/meals/update/:mealId` - Update meal details

### Meal Provider Routes
- `POST /api/meal-provider` - Register as a meal provider
- `GET /api/meal-provider/mydata` - Get meal provider's data

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/subirdas29/car-stores-server
   cd nutribox-server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the required environment variables.

4. Build and run the server:
   ```sh
   npm run build
   npm start
   ```
   For development:
   ```sh
   npm run start:dev
   ```


## Contribution
Contributions are welcome! Feel free to open an issue or submit a pull request.

## License
This project is licensed under the ISC License.

