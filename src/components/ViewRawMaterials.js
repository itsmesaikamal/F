import React, { useState, useEffect } from 'react';
import { db } from './firebase';  // Ensure the path is correct
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './ViewRawMaterials.css';

const ViewRawMaterials = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ material: '', quantity: '', price: '', dateBought: '' });

  useEffect(() => {
    const fetchRawMaterials = async () => {
      const querySnapshot = await getDocs(collection(db, 'rawMaterials'));
      const materials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRawMaterials(materials);
    };

    fetchRawMaterials();
  }, []);

  const handleEdit = (material) => {
    setEditing(material.id);
    setFormData({ material: material.material, quantity: material.quantity, price: material.price, dateBought: material.dateBought });
  };

  const handleDelete = async (id) => {
    const materialToDelete = rawMaterials.find(material => material.id === id);
    const materialName = materialToDelete.material.toLowerCase();

    // Delete from rawMaterials collection
    await deleteDoc(doc(db, 'rawMaterials', id));

    // Delete from consumedRawMaterials collection
    const consumedQuery = query(collection(db, 'consumedRawMaterials'));
    const consumedSnapshot = await getDocs(consumedQuery);

    consumedSnapshot.forEach(async (doc) => {
      const consumedMaterial = doc.data();
      if (consumedMaterial.material.toLowerCase() === materialName) {
        await deleteDoc(doc.ref);
      }
    });

    // Update local state
    setRawMaterials(rawMaterials.filter(material => material.id !== id));
  };

  const handleSave = async (id) => {
    const materialDoc = doc(db, 'rawMaterials', id);
    await updateDoc(materialDoc, formData);
    setRawMaterials(rawMaterials.map(material => (material.id === id ? { id, ...formData } : material)));
    setEditing(null);
    setFormData({ material: '', quantity: '', price: '', dateBought: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="view-raw-materials">
      <h2>View Raw Materials</h2>
      <div className="raw-materials-table">
        <div className="table-header">
          <div className="header-cell">Material</div>
          <div className="header-cell">Quantity</div>
          <div className="header-cell">Price</div>
          <div className="header-cell">Date Bought</div>
          <div className="header-cell">Actions</div>
        </div>
        {rawMaterials.map(material => (
          <div key={material.id} className="table-row">
            {editing === material.id ? (
              <>
                <div className="table-cell"><input type="text" name="material" value={formData.material} onChange={handleChange} /></div>
                <div className="table-cell"><input type="text" name="quantity" value={formData.quantity} onChange={handleChange} /></div>
                <div className="table-cell"><input type="number" name="price" value={formData.price} onChange={handleChange} /></div>
                <div className="table-cell"><input type="date" name="dateBought" value={formData.dateBought} onChange={handleChange} /></div>
                <div className="table-cell">
                  <FaEdit onClick={() => handleSave(material.id)} className="icon save-icon" />
                </div>
              </>
            ) : (
              <>
                <div className="table-cell">{material.material}</div>
                <div className="table-cell">{material.quantity}</div>
                <div className="table-cell">{material.price}</div>
                <div className="table-cell">{material.dateBought}</div>
                <div className="table-cell">
                  <FaEdit onClick={() => handleEdit(material)} className="icon edit-icon" />
                  <FaTrash onClick={() => handleDelete(material.id)} className="icon delete-icon" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewRawMaterials;
