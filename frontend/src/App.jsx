import React, { Fragment, useEffect } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {routes} from './routes'
import DefaultComponent from './components/DefaultComponent'

export default function App() {

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route)=>{
            const Page=route.page
            const Layout=route.isShowSidebar ? DefaultComponent:Fragment
            return(
              <Route key={route.path} path={route.path} element={
                <Layout>
                  <Page/>
                  </Layout>}>

              </Route>
            )
          })}

        </Routes>
      </Router>
    </div>
  )
}