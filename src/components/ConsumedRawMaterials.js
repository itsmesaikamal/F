import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ConsumedRawMaterials.css';

const ConsumedRawMaterials = () => {
  const [consumedMaterials, setConsumedMaterials] = useState([]);

  useEffect(() => {
    const fetchConsumedMaterials = async () => {
      const querySnapshot = await getDocs(collection(db, 'consumedRawMaterials'));
      const materials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConsumedMaterials(materials);
    };

    fetchConsumedMaterials();
  }, []);

  return (
    <div className="consumed-raw-materials">
      <h2>Consumed Raw Materials</h2>
      <div className="raw-materials-table">
        <div className="table-header">
          <div className="header-cell">Material</div>
          <div className="header-cell">Consumed Quantity</div>
        </div>
        {consumedMaterials.map(material => (
          <div key={material.id} className="table-row">
            <div className="table-cell">{material.material}</div>
            <div className="table-cell">{material.consumed}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumedRawMaterials;
