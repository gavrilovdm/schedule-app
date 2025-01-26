# Schedule App

A web application for managing and viewing schedules with user authentication and role-based access control.

## Main Features

- **User Authentication**: Secure login system with role-based access (admin/user)
- **Schedule Management**: 
  - View weekly schedule in a grid format
  - Time slots displayed in 24-hour format
  - Admin users can toggle time slot availability
  - Regular users can view the schedule
- **Persistent Sessions**: User authentication state persists across page refreshes
- **Simple Design**: Built with Angular Material for a modern, responsive UI
- **API**: Node.js with Express
## Technical Stack

- **Frontend**: Angular 19.1
- **UI Components**: Angular Material
- **State Management**: RxJS with BehaviorSubject
- **Authentication**: Local storage based session management
- **API Communication**: RESTful endpoints with HTTP interceptors

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the node.js server:
```bash
node server.js
```

3. Start the development server:
```bash
ng serve
```

4. Navigate to `http://localhost:4200/` in your browser

Login credentials:
- admin user - email: user1@example.com; password: user1@example.com
- regular user - email: user2@example.com; password: user2@example.com

## Development Notes

- The application uses a modular architecture with lazy-loaded routes
- Authentication guard protects restricted routes
- Admin-only features are protected both on frontend and backend
- CORS is configured for local development environment

## API Endpoints

- `POST /api/login`: User authentication (public)
- `GET /api/schedule`: Retrieve schedule data (authenticated only)
- `GET /api/schedule/:day/:hour`: Check if time slot is booked (public)
- `PATCH /api/schedule`: Update time slot status (admin only)
