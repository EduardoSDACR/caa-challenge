# Comments Metrics Dashboard

A full-stack application built with NestJS (backend) and Next.js (frontend) for analyzing social media comment metrics stored in a PostgreSQL database. The application provides data visualization through interactive charts.

## Features

- Backend API built with NestJS
- Frontend dashboard built with Next.js
- PostgreSQL database integration
- Data visualization with charts
- JWT authentication

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- PostgreSQL database

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
    ```
   npm install
   ```
3. Create a .env file in the backend root directory with the following variables:
    ```
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET_KEY=your_jwt_secret_key
   JWT_EXPIRATION_TIME=expiration_time (for example 3600s)
   PORT=desired_port_number (default is 3000)
    ```
4. Start the development server:
    ```
    npm run start:dev
    ```
### Frontend Setup

1. Navigate to the frontend directory:
    ```
    cd frontend
    ```
2. Install dependencies:
    ```
   npm install 
    ```
3. Create a .env file in the frontend root directory with the following variables:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:4000 (it's the backend URL for client side components)
    API_URL=http://localhost:4000 (it's the backend URL for server side components)
    NEXTAUTH_URL=http://localhost:3000 (it's the frontend URL)
    NEXTAUTH_SECRET=your_nextauth_secret_key
   ```
4. Start the development server:
    ```
   npm run dev
   ```

### Docker

It's posible to use docker compose to launch the entire application:
```
docker compose up -d
```