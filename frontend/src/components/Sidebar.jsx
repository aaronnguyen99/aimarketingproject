import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {routes} from '../routes/index'

export default function Sidebar() {
  const navigate=useNavigate();
  const navItems = [
    { name: "Dashboard", icon: "📊" ,nav:"/dashboard"},
    { name: "Prompts", icon: "💬" ,nav:"/prompt"},
    { name: "Sources", icon: "🌐",nav:"/source" },
    { name: "Schools", icon: "🏢" ,nav:"/company"},
    { name: "Setting", icon: "⚙️" ,nav:"/setting"},
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-100 border-r border-gray-200 p-6 flex flex-col justify-between shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-8 tracking-tight">
          MeiryoAI
        </h1>
        <nav className="space-y-1">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors text-left group"
              onClick={() => navigate(item.nav)}
            >
              <div className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-200 transition-colors text-left group ">
                <div className="text-gray-700 font-medium group-hover:text-gray-900">
                  {item.name}
                </div>

                {/* Right side: icon */}
                <div className="text-gray-500 group-hover:text-gray-700 filter grayscale self-center">
                  {item.icon}
                </div>

              </div>
              {item.badge && (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
