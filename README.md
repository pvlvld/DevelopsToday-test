# DevelopsToday NestJS Project


## API Documentation

### Base URL
`/api`


### Endpoints
#### Get User Holidays
**GET** `/api/users/{userId}/calendar/holidays`

**Description:**
Retrieve all holidays in the calendar for a specific user.

**Path Parameters:**
- `userId` (integer, required): User ID

**Responses:**
- `200 OK`: Array of holiday objects for the user
- `404 Not Found`: User not found
- `500 Internal Server Error`: Failed to fetch holidays

---

#### Add Holidays to User Calendar
**POST** `/api/users/{userId}/calendar/holidays`

**Description:**
Add public holidays for a given country and year to a user's calendar. Optionally, specify a list of holiday names to filter which holidays are added.

**Path Parameters:**
- `userId` (integer, required): User ID

**Request Body:**
```json
{
  "countryCode": "US",         // string, ISO 3166-1 alpha-2 country code, required
  "year": 2025,                 // integer, required
  "holidays": ["New Year's Day", "Independence Day"] // array of strings, optional
}
```

**Responses:**
- `200 OK`: List of added holidays
- `404 Not Found`: User not found or no holidays found
- `500 Internal Server Error`: Failed to fetch or save holidays

---

#### Get Available Countries
**GET** `/api/countries`

**Description:**
Get a list of available countries for which public holiday data is available.

**Responses:**
- `200 OK`: Array of countries with country codes and names
- `500 Internal Server Error`: Failed to fetch available countries

---

#### Get Country Info
**GET** `/api/countries/{countryCode}`

**Description:**
Get detailed information about a country, including borders, population, and flag.

**Path Parameters:**
- `countryCode` (string, ISO 3166-1 alpha-2, required): Country code

**Responses:**
- `200 OK`: Country info object
- `500 Internal Server Error`: Failed to fetch country info

---

## Example Usage

Add holidays to user calendar:
```bash
curl -X POST \
  http://localhost:3000/api/users/1/calendar/holidays \
  -H 'Content-Type: application/json' \
  -d '{
    "countryCode": "US",
    "year": 2025,
    "holidays": ["New Year's Day"]
  }'
```

Get available countries:
```bash
curl http://localhost:3000/api/countries
```

Get country info:
```bash
curl http://localhost:3000/api/countries/US
```

## Overview
This project is a NestJS server-side application using PostgreSQL as the database. It is set up for local development with Docker and Prisma ORM.

## Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for local PostgreSQL)

## Getting Started

### 1. Start PostgreSQL with Docker Compose
Run the following command to start a local PostgreSQL instance:

```bash
docker compose up -d
```

This uses the configuration in `docker-compose.yml` and exposes the database on `localhost:5432`.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Database Migrations

```bash
npx prisma migrate deploy
```

### 4. Generating prisma client
```bash
npx prisma generate
```

### 5. Seed Testing Data

```bash
npm run seed
```
This will add a test user (id=1) and a couple of calendar events for him.

### 6. Start the Application

- For development (with hot reload):
  ```bash
  npm run start:dev
  ```
- For production:
  ```bash
  npm run start:prod
  ```

The application will connect to the database started by Docker Compose.

## Notes
- The database data is persisted in the `postgres_data/` directory.
- Working .env file was added as per task requirements.
- Husky is configured with a pre-commit hook to automatically format all staged files before each commit.
