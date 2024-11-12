# React Book Search App

This project is a React-based book search application using Material UI and Vite as the build tool. The app includes features for searching books, adding selected books to a Todo list, and viewing the Todo books in a scrollable table.

## Features

- Book search with suggestions and keyboard navigation
- Add books to a Todo list
- View and manage a scrollable Todo list
- Styled using Material UI

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

- **Node.js**: Download Node.js from https://nodejs.org/ (version 14 or higher recommended)
- **Yarn**: Download Yarn from https://yarnpkg.com/

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine using:

```
git clone https://github.com/jeffordray92/books-app-frontend.git
```

### 2. Install Dependencies

Use Yarn to install project dependencies:

```
yarn install
```

### 3. Configure Environment Variables

Copy the `.env-sample` file to create your own `.env` file, to store environment variables.:

```bash
cp .env-sample .env
```

Edit the `.env` file to add your specific environment variables. Here's an example structure you might find in `.env-sample`:

```plaintext
VITE_API_URL=http://127.0.0.1:8000/api
```

Note: Adjust these settings as per your development environment. Vite requires all environment variables to be prefixed with `VITE_`. Ensure that your API URL is prefixed with `VITE_` as shown.

### 4. Start the Development Server

Run the development server with:

```
yarn dev
```

This will start the Vite server. Open http://localhost:5173 to view the app in your browser.
