import React from 'react'
import Sidebar from './Sidebar'

const DefaultComponent = ({children}) => {
  return (
<div className="flex h-screen">
  {/* Sidebar on the left */}
  <div className="w-64 h-full fixed">
    <Sidebar />
  </div>

  {/* Main content area */}
  <div className="flex-1 ml-64 p-6 overflow-y-auto">
    {children}
  </div>
</div>
  )
}

export default DefaultComponent