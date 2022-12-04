import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/Homepage';
import NoPage from './pages/Nopage';
import Dashboard from './pages/Dashboard';
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
