import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../reducers/productSlice';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts()); // Veriler yalnızca idle durumundayken çekilmeli
    }
  }, [dispatch, status]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap(); // Redux store'dan ürünü sil
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
    }
  };

  if (status === 'loading') {
    return <p>Yükleniyor...</p>;
  }

  if (status === 'failed') {
    return <p>Hata oluştu: {error}</p>;
  }

  return (
    <div className="container">
      <h1>Ürün Listesi</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <div className="product-card">
              {product.image_url && (
                <img
                  src={`http://localhost:3000${product.image_url}`} // Resim URL'sini burada ekliyoruz
                  alt={product.name}
                  className="product-image"
                />
              )}
              <h2>{product.name}</h2>
              <p>Fiyat: {product.price} TL</p>
              <button onClick={() => navigate(`/product-detail/${product.id}`)}>Detay</button>
              <button onClick={() => handleDelete(product.id)}>Sil</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
