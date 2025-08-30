import React from 'react'
import Sidebar from './Sidebar'

const DefaultComponent = ({children}) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6 overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default DefaultComponent