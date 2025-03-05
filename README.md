# NoteTakingApp

A full-stack **NestJS + React (Vite) + PostgreSQL** application that allows users to create, edit, and share notes in real-time using WebSockets.

## Features
- User Authentication (JWT)
- Create, Edit, and Delete Notes  
- Real-time Updates using WebSockets  
- Note Sharing with Other Users  
- PostgreSQL Database Integration

## Project Structure
- frontend (React)
- backend (NestJS)

## Pre-requisite
- NodeJS
- PostgreSQL
- NestJS


## Clone the repo

```bash
git clone https://github.com/shubham151/NoteTakingApp.git
```

## Install npm modules

```bash
cd NodeTakingApp/fronted
npm install
```

## set end file for frontend and backend



### Backend
Change the config if required
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=spidermines
DB_PASS=12345
DB_NAME=notes
JWT_SECRET=spidermines123

```

### Frontend
Change the config if required 
```bash
VITE_API_URL=http://localhost:3000

```


## Start app


### FrontEnd

```bash
cd frontend
npm run dev
```

### Backend

```bash
cd backend
npm run start
```

