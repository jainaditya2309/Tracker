import { faCheck, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import './SkincareTracker.css';

function SkincareTracker({ skincareData, setSkincareData }) {
  const [newProduct, setNewProduct] = useState({ name: '', category: '', frequency: 'daily' });
  const [editingId, setEditingId] = useState(null);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      // Edit existing product
      const updatedProducts = skincareData.products.map(product =>
        product.id === editingId ? { ...product, ...newProduct } : product
      );
      setSkincareData({
        ...skincareData,
        products: updatedProducts
      });
      setEditingId(null);
    } else {
      // Add new product
      const product = {
        id: Date.now(),
        ...newProduct,
        dateAdded: new Date().toISOString()
      };
      setSkincareData({
        ...skincareData,
        products: [...skincareData.products, product]
      });
    }
    setNewProduct({ name: '', category: '', frequency: 'daily' });
  };

  const handleCompleteRoutine = () => {
    const routine = {
      id: Date.now(),
      date: new Date().toISOString(),
      products: skincareData.products.map(product => ({
        id: product.id,
        name: product.name,
        used: true
      })),
      completed: true
    };

    setSkincareData({
      ...skincareData,
      routines: [...skincareData.routines, routine],
      lastRoutine: new Date().toISOString()
    });
  };

  const handleDeleteProduct = (id) => {
    setSkincareData({
      ...skincareData,
      products: skincareData.products.filter(product => product.id !== id)
    });
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      category: product.category,
      frequency: product.frequency
    });
    setEditingId(product.id);
  };

  return (
    <div className="skincare-tracker">
      <h1>Skincare Tracker</h1>

      <form onSubmit={handleAddProduct} className="product-form">
        <input
          type="text"
          placeholder="Product name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          required
        />
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
          required
        >
          <option value="">Select category</option>
          <option value="cleanser">Cleanser</option>
          <option value="toner">Toner</option>
          <option value="serum">Serum</option>
          <option value="moisturizer">Moisturizer</option>
          <option value="sunscreen">Sunscreen</option>
          <option value="other">Other</option>
        </select>
        <select
          value={newProduct.frequency}
          onChange={(e) => setNewProduct({...newProduct, frequency: e.target.value})}
          required
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button type="submit">
          <FontAwesomeIcon icon={editingId ? faEdit : faPlus} />
          {editingId ? ' Update Product' : ' Add Product'}
        </button>
      </form>

      <div className="products-list">
        <h2>My Skincare Products</h2>
        {skincareData.products.map(product => (
          <div key={product.id} className="product-item">
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>Category: {product.category} | Frequency: {product.frequency}</p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEditProduct(product)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDeleteProduct(product.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {skincareData.products.length > 0 && (
        <div className="complete-routine">
          <button onClick={handleCompleteRoutine} className="complete-button">
            <FontAwesomeIcon icon={faCheck} /> Complete Today's Routine
          </button>
          {skincareData.lastRoutine && (
            <p>Last routine completed: {new Date(skincareData.lastRoutine).toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SkincareTracker;
