# Task Manager (Frontend)

A powerful, production-ready Task Management application built with React, TypeScript, and Ant Design. The project features a modular Feature-Sliced Design (FSD) inspired architecture, centralized Redux state management, and full responsive design.

🚀 **Live Demo**: [https://tasks-manager-frontend-iv2e.onrender.com](https://tasks-manager-frontend-iv2e.onrender.com)

---

## 🛠️ Tech Stack

- **Framework & Tooling**: React, TypeScript, Vite, Sass
- **UI Components**: Ant Design (antd), `@ant-design/icons`
- **State Management**: Redux Toolkit, React Redux
- **Routing**: React Router DOM

---

## 📂 Project Structure

The project follows a scalable, modular structure grouped by business features:

```text
src/
│
├── app/                  # Application setup (API configurations, global Redux store)
│   ├── api/              # Base RTK Query / Axios setup (baseApi)
│   └── store             # Redux central store configuration
│
├── feachers/             # Independent business modules (features)
│   ├── auth/             # User authentication, Protected Routes, Login pages
│   ├── boards/           # Board management (CRUD, Details, Forms)
│   ├── comments/         # Task comments features (CRUD)
│   └── tasks/            # Tasks & Columns workflow logic (Kanban components)
│
├── hooks/                # Reusable global Custom React hooks
├── interfaces/           # Global TypeScript interfaces for API models
├── layouts/              # Core layout templates (Header, Footer, Main Layout)
├── router/               # Application routing mapping
├── types/                # Component prop types and local custom type definitions
└── App.tsx               # Root component
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the repository

```bash
git clone git@github.com:yaroslavnakonechniy/lesson-48.git
cd lesson-48
```

### 2. Install dependencies

```bash
npm install
npm install @ant-design/icons @reduxjs/toolkit antd react react-dom react-redux react-router-dom sass
```

### 3. Run the application

To fire up the development client along with the mock local database server, run the following commands in your terminal:

```bash
# Start Vite development server
npm run dev

# Start the API / Backend server
npm run start:server

# Start the mock DB instance
npm run start:db
```

---

## 💡 Key Features

- 🔐 **Secure Auth**: Context-driven authentication status with `ProtectedRoute` wrappers.
- 📋 **Interactive Boards**: Create, edit, and list distinct work boards.
- ⚡ **Dynamic Tasks**: Column-based progression workflow tracking.
- 💬 **Collaboration**: Threaded comments supported inside individual task details.
- 🎨 **Sass Custom Styling**: Styled using dynamic modern Ant Design components combined with modular Sass variables.
