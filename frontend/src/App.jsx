import React, { Fragment, useEffect } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {routes} from './routes'
import DefaultComponent from './components/DefaultComponent'
import {  useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPages from './pages/AuthPage';
import HomePage from './pages/HomePage';
import { useState } from 'react';
import api from './services/api';
import LoadingPage from './pages/LoadingPage';
export default function App() {
  const { user, login, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/info"); // cookie sent automatically
        login(response.data.user); // restore state
        console.log("respone",response.data.user);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
    if (loading) return <LoadingPage/> // optional loading state

  return (
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
  )
}