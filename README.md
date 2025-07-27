# Event Registration System with Sequelize ORM

This application allows parents to register their students for events, selecting three out of multiple available classes per student. The system tracks student information, food allergies, and class enrollment using Sequelize ORM with a PostgreSQL database.

## Features

- Multiple student registration
- Class selection (3 per student)
- Food allergy tracking
- Admin dashboard
- PostgreSQL database with Sequelize ORM for persistent storage

## Technology Stack

- **Frontend**: React with styled components
- **Backend**: Node.js with Express
- **ORM**: Sequelize
- **Database**: PostgreSQL

## Installation and Setup

### Prerequisites

- Node.js and npm
- PostgreSQL
- Git (optional, for cloning the repository)

### Database Setup

1. Run `setup_db.bat`
2. When prompted, enter your PostgreSQL credentials
3. The script will create a database named `event_registration` (or a name of your choice)
4. Environment variables will be saved to `backend/.env`

### Application Setup

1. Run `setup.bat` to install all dependencies for backend and frontend
2. This will also create the default configuration if it doesn't exist

### Running the Application

- Run `run.bat` to start both the backend server and frontend development server
- Backend will run on http://localhost:5000
- Frontend will run on http://localhost:3000

## Customizing Classes

You can customize the available classes by editing the configuration file:
`backend/config/classes.json`

The file structure should be:

```json
{
  "classes": [
    {
      "name": "Class Name",
      "capacity": 20,
      "description": "Class description."
    }
    // More classes...
  ]
}
```
