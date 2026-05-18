import { router } from './router/router'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './feachers/auth/context/AuthContext'

import './App.css'

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
