import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {routes} from '../routes/index'

export default function Sidebar() {
  const navigate=useNavigate();
  const navItems = [
    { name: "Dashboard", icon: "🏠" ,nav:"/dashboard"},
    { name: "Prompts", icon: "💬" ,nav:"/prompt"},
    { name: "Sources", icon: "🌐",nav:"/source" },
    { name: "Schools", icon: "🏢" ,nav:"/company"},
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-100 border-r border-gray-300 p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-6">Company name</h1>
        <nav className="space-y-2">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-200 transition-colors text-left"
              onClick={() => navigate(item.nav)}
            >
              <div className="flex items-center space-x-2">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* <div className="mt-6 text-center text-sm text-gray-500">
        <p>You're on trial</p>
        <p className="font-medium">3 days remaining</p>
        <button className="mt-2 text-blue-600 hover:underline">
          Select a plan
        </button>
      </div> */}
    </div>
  );
}
