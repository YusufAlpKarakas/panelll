import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../redux/productSlice';

const ProductForm = () => {
  const [formData, setFormData] = useState({ id: '', name: '', price: '', image_url: '' });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    const newProduct = { id: Date.now(), ...formData };
    dispatch(addProduct(newProduct));
    fetch('http://localhost:3000/add-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    setFormData({ id: '', name: '', price: '', image_url: '' }); // Formu sıfırlama
  };

  const handleUpdate = () => {
    dispatch(updateProduct(formData));
    fetch(`http://localhost:3000/update-product/${formData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ id: '', name: '', price: '', image_url: '' }); // Formu sıfırlama
  };

  return (
    <div>
      <h2>Ürün Ekle/Güncelle</h2>
      <input
        type="text"
        name="id"
        placeholder="Ürün ID (Güncelleme için)"
        value={formData.id}
        onChange={handleChange}
      />
      <input
        type="text"
        name="name"
        placeholder="Ürün Adı"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Ürün Fiyatı"
        value={formData.price}
        onChange={handleChange}
      />
      <input
        type="text"
        name="image_url"
        placeholder="Resim URL"
        value={formData.image_url}
        onChange={handleChange}
      />
      <button onClick={handleAdd}>Ekle</button>
      <button onClick={handleUpdate}>Güncelle</button>
    </div>
  );
};

export default ProductForm;
