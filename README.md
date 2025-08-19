# E-Commerce Backend API

A comprehensive e-commerce backend built with Node.js, Express, MongoDB, and Stripe integration.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: CRUD operations with advanced filtering, search, and pagination
- **Shopping Cart**: Full cart management with real-time updates
- **Order Processing**: Complete order lifecycle with payment integration
- **User Management**: Profile management, wishlist, and address handling
- **Admin Panel**: Dashboard with analytics, user management, and product control
- **Payment Integration**: Stripe payment processing with webhooks
- **Security**: Rate limiting, input validation, and secure password handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API
- **Security**: Helmet, CORS, bcryptjs, express-rate-limit
- **Validation**: express-validator

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filtering, search, pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/pay` - Update order to paid
- `POST /api/orders/:id/create-payment-intent` - Create Stripe payment intent
- `PUT /api/orders/:id/cancel` - Cancel order

### Users
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist
- `PUT /api/users/address` - Update user address

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/products` - Get all products (admin view)
- `GET /api/admin/analytics/sales` - Get sales analytics

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harshwardhan-26/ecommerce-backend.git
   cd ecommerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Seed the database (optional)**
   ```bash
   node utils/seedData.js
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Database Models

### User Model
- Personal information (name, email, phone)
- Authentication (password, role)
- Address and wishlist
- Account status and activity tracking

### Product Model
- Basic info (name, description, price, category)
- Inventory (stock, SKU)
- Media (images, specifications)
- Reviews and ratings
- SEO and marketing (tags, features, discount)

### Cart Model
- User association
- Cart items with quantities and prices
- Automatic total calculations

### Order Model
- Order items and quantities
- Shipping address and payment info
- Order status tracking
- Payment integration data

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers and protection

## Payment Integration

- **Stripe Integration**: Secure payment processing
- **Payment Intents**: Modern payment flow
- **Webhook Support**: Real-time payment updates
- **Multiple Currencies**: Support for different currencies

## Admin Features

- **Dashboard Analytics**: Sales, revenue, and user metrics
- **User Management**: Role assignment and account control
- **Product Management**: Inventory and catalog control
- **Order Management**: Order status and tracking
- **Sales Analytics**: Revenue trends and insights

## API Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Error Handling

- Comprehensive error middleware
- Validation error formatting
- Development vs production error responses
- HTTP status code standards

## Deployment

The API is designed to be deployed on platforms like:
- Render
- Railway
- Heroku
- AWS
- DigitalOcean

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email harshwardhangoyal09@gmail.com or create an issue in the repository.