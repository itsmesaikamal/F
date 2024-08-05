import React, { useState } from 'react';
import { db } from './firebase';  // Ensure the path is correct
import { collection, addDoc } from 'firebase/firestore';
import './InsertRawMaterials.css';

const InsertRawMaterials = () => {
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [dateBought, setDateBought] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'rawMaterials'), {
        material,
        quantity,
        price,
        dateBought,
      });
      setSuccessMessage('Raw material added successfully!');
      console.log('Raw material added successfully!');
      setMaterial('');
      setQuantity('');
      setPrice('');
      setDateBought('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="insert-raw-materials">
      <h2>Insert Raw Materials</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Material:
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            required
          />
        </label>
        <label>
          Quantity:
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Date Bought:
          <input
            type="date"
            value={dateBought}
            onChange={(e) => setDateBought(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InsertRawMaterials;
