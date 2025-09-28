import React from 'react'
import { useNavigate } from 'react-router-dom';
import Features from '../home/Features';
import Hero from '../home/Hero';
import Footer from '../home/Footer';
import Header from '../home/Header';
import Pricing from '../home/Pricing';
import Contact from '../home/Contact';

const HomePage = () => {
    const navigate=useNavigate();
  return (
    
    <div className=" flex justify-center flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <Header/>
      <Hero/>
      <Features/>
      <Pricing/>
      <Contact/>
      <Footer/>
    </div>
  );
}

export default HomePage