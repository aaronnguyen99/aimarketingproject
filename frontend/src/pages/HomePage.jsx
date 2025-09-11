import React from 'react'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate=useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight">MeiryoAI</h1>
        <nav className="space-x-6 text-gray-600 font-medium">
          <a href="#features" className="hover:text-gray-900">Features</a>
          <a href="#about" className="hover:text-gray-900">About</a>
          <a href="#contact" className="hover:text-gray-900">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Unlock Insights with <span className="text-blue-600">MeiryoAI</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Smart, simple, and scalable AI tools to help your business grow.
        </p>
        <button               
        onClick={() => navigate('/auth')}
        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">⚡ Fast</h3>
            <p className="text-gray-600">Quick insights powered by advanced AI models.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🔍 Accurate</h3>
            <p className="text-gray-600">High-quality predictions you can rely on.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🌎 Scalable</h3>
            <p className="text-gray-600">Designed to grow with your business needs.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} MeiryoAI. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage