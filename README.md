# E-commerce Authentication & Category Selection App

A modern e-commerce application with user authentication and personalized category selection built with Next.js, MongoDB, and Tailwind CSS.

## Demo
click[Here](https://e-com-category-selection-app.vercel.app)

## Features

- **User Authentication**: Complete sign-up and login flow with JWT tokens
- **Protected Routes**: Secure pages accessible only to authenticated users
- **Category Management**: Browse and select from 100+ categories with pagination
- **Persistent Selections**: User category preferences saved across sessions
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies
- **Icons**: Lucide React
- **Data Generation**: Faker.js for category seeding

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/vishnuu5/E-com-Category-Selection-App.git
cd ecommerce-auth-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```bash
MONGODB_URI=mongodb://localhost:27017/ecommerce-auth
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

4. **Start MongoDB**

```bash
# If using local MongoDB
   mongod

# Or use MongoDB Atlas connection string in .env.local
```

5. **Seed the database**

```bash
npm run seed
```

6. **Start the development server**

```bash
npm run dev
```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Categories

- `GET /api/categories` - Get paginated categories
- `GET /api/user/interests` - Get user interests
- `POST /api/user/interests` - Save user interests
- `PUT /api/user/interests` - Update user interests

## Key Features Explained

### Authentication Flow

1. User registers with name, email, and password
2. Password is hashed using bcrypt
3. JWT token is generated and stored in HTTP-only cookie
4. User selects initial interests during registration
5. Protected routes check for valid JWT token

### Category Management

- 100 categories generated using Faker.js
- Pagination with 6 categories per page
- Real-time interest toggling with optimistic updates
- Persistent storage in MongoDB

### Security Features

- Password hashing with bcrypt
- JWT tokens with expiration
- HTTP-only cookies to prevent XSS
- Input validation and sanitization
- Protected API routes

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## License

This project is licensed under the MIT License.
