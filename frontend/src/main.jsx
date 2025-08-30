import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ReactDOM from 'react-dom/client';

import './index.css'
import App from './App.jsx';
import Sidebar from './components/Sidebar.jsx'
import PromptPage from './pages/PromptPage.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>

      <App/>
  </QueryClientProvider >

);
