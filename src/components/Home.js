import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import RawMaterials from './RawMaterials';
import Products from './Products';
import Orders from './Orders';
import Invoice from './Invoice';
import Accounts from './Accounts';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="main-content">
        
        <Routes>
          <Route path="raw-materials/*" element={<RawMaterials />} />
          <Route path="products/*" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="accounts" element={<Accounts />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
