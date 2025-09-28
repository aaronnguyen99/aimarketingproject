import React from 'react'
const Hero = () => {
  return (
<section id="hero" className="bg-gradient-to-r from-sky-200 via-indigo-200 to-purple-200 min-h-screen flex items-center justify-center text-gray-900">
  <div className="max-w-5xl mx-auto px-6 py-16 text-center">
  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
    Empower Your Institution with <span className="text-sky-500">MeriyoAI</span>
  </h1>
  <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
    Monitor visibility, analyze sentiment, and understand how your institution is
    represented across AI platforms — all in one centralized platform.
  </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <a
        href="/dashboard"
        className="px-8 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow hover:bg-sky-600 transition"
      >
        Start Free Trial
      </a>
      <a
        href="mailto:youremail@domain.com?subject=Request a Demo&body=Hello, I’d like to request a demo for my school/university."
        className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-300 transition"
      >
        Request a Demo
      </a>
    </div>
  </div>
</section>


  );
}

export default Hero