import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateProduct, fetchProducts } from '../reducers/productSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const product = products.find((p) => p.id === parseInt(id));

  const [formData, setFormData] = useState({
    name: product ? product.name : '',
    price: product ? product.price : '',
    image_url: product ? product.image_url : '',
  });

  useEffect(() => {
    if (!product) {
      dispatch(fetchProducts());
    }
  }, [dispatch, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id: parseInt(id), ...formData }));
    alert('Ürün başarıyla güncellendi!');
  };

  if (!product) {
    return <p>Ürün bilgisi yükleniyor...</p>;
  }

  return (
    <div>
      <h1>Ürün Detayı</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ürün Adı:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Fiyat:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Resim URL:</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Güncelle</button>
      </form>
    </div>
  );
};

export default ProductDetail;
