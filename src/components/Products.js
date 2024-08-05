import React from 'react';
import { Route, Routes } from 'react-router-dom';
import InsertProducts from './InsertProducts';
import ViewProducts from './ViewProducts';

const Products = () => {
  return (
    <Routes>
      <Route path="insert" element={<InsertProducts />} />
      <Route path="view" element={<ViewProducts />} />
    </Routes>
  );
};

export default Products;
