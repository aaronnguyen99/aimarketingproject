import React, { Fragment, useEffect } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {routes} from './routes'
import DefaultComponent from './components/DefaultComponent'
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPages from './pages/AuthPage';
import HomePage from './pages/HomePage';
export default function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPages />} />
          
          {routes.map((route)=>{
            const Page=route.page
            const Layout=route.isShowSidebar ? DefaultComponent:Fragment
            return(

              <Route key={route.path} path={route.path} element={
                <ProtectedRoute>
                <Layout>
                  <Page/>
                  </Layout></ProtectedRoute>
                }>

              </Route>
            )
          })}

        </Routes>
      </Router>
   </AuthProvider>   
  )
}