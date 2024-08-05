import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import './AvailableRawMaterials.css';

const AvailableRawMaterials = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantityToUse, setQuantityToUse] = useState('');
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const fetchRawMaterials = async () => {
      const querySnapshot = await getDocs(collection(db, 'rawMaterials'));
      const materials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRawMaterials(materials);
    };

    fetchRawMaterials();
  }, []);

  const handleMaterialChange = (e) => {
    const materialId = e.target.value;
    setSelectedMaterialId(materialId);
    const material = rawMaterials.find(m => m.id === materialId);
    setSelectedMaterial(material);
  };

  const handleUseChange = (e) => {
    setQuantityToUse(e.target.value);
  };

  const extractNumber = (quantity) => {
    const result = quantity.match(/\d+/);
    return result ? parseInt(result[0], 10) : NaN;
  };

  const extractUnit = (quantity) => {
    const result = quantity.match(/[a-zA-Z]+/);
    return result ? result[0] : '';
  };

  const handleUse = async (e) => {
    e.preventDefault();
    const usedQuantity = parseInt(quantityToUse, 10);
    const availableQuantity = extractNumber(selectedMaterial.quantity);
    const unit = extractUnit(selectedMaterial.quantity);

    if (!isNaN(usedQuantity) && usedQuantity > 0 && usedQuantity <= availableQuantity) {
      const newQuantity = availableQuantity - usedQuantity;
      const newQuantityWithUnit = `${newQuantity} ${unit}`;
      const materialDoc = doc(db, 'rawMaterials', selectedMaterial.id);

      await updateDoc(materialDoc, { quantity: newQuantityWithUnit });

      // Save used quantity to consumedRawMaterials collection
      const consumedMaterialDoc = doc(db, 'consumedRawMaterials', selectedMaterial.id);
      const consumedMaterialSnapshot = await getDoc(consumedMaterialDoc);

      if (consumedMaterialSnapshot.exists()) {
        const currentConsumed = consumedMaterialSnapshot.data().consumed;
        await updateDoc(consumedMaterialDoc, { consumed: `${extractNumber(currentConsumed) + usedQuantity} ${unit}` });
      } else {
        await setDoc(consumedMaterialDoc, { material: selectedMaterial.material, consumed: `${usedQuantity} ${unit}` });
      }

      setRawMaterials(rawMaterials.map(m => (m.id === selectedMaterial.id ? { ...m, quantity: newQuantityWithUnit } : m)));
      setSelectedMaterialId('');
      setSelectedMaterial(null);
      setQuantityToUse('');
      setErrorMessages({});
    } else {
      setErrorMessages({ [selectedMaterial.id]: `Invalid quantity entered. Please enter a value between 1 and ${availableQuantity}.` });
    }
  };

  return (
    <div className="available-raw-materials">
      <h2>Available Raw Materials</h2>
      <form onSubmit={handleUse} className="material-form">
        <div className="form-group">
          <label htmlFor="material-select">Select Material</label>
          <select
            id="material-select"
            value={selectedMaterialId}
            onChange={handleMaterialChange}
            required
          >
            <option value="">--Select Material--</option>
            {rawMaterials.map(material => (
              <option key={material.id} value={material.id}>
                {material.material}
              </option>
            ))}
          </select>
        </div>
        {selectedMaterial && (
          <>
            <div className="form-group">
              <label htmlFor="available-quantity">Available Quantity</label>
              <input
                type="text"
                id="available-quantity"
                value={selectedMaterial.quantity}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity-to-use">Use Quantity</label>
              <input
                type="number"
                id="quantity-to-use"
                value={quantityToUse}
                onChange={handleUseChange}
                required
              />
            </div>
            <button type="submit">Consume</button>
            {errorMessages[selectedMaterial.id] && (
              <div className="error-message">{errorMessages[selectedMaterial.id]}</div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default AvailableRawMaterials;
