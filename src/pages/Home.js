/*
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, fetchProducts } from "../reducers/productSlice";
import ProductList from "./ProductList";
import KitapForm from "../components/KitapForm";
import KitapList from "./KitapList";

const Home = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: null, // Dosya nesnesini burada tutacağız
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await dispatch(addProduct(data)).unwrap(); // Redux store'a ekle
      await dispatch(fetchProducts()); // Ürün listesini yenile
      setFormData({ name: "", price: "", image: null }); // Formu temizle
    } catch (error) {
      console.error("Ürün eklenirken hata:", error);
    }
  };

  return (
    <div>
      <h1>Ürünler Listesi</h1>

      <h2>Ürün Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ürün Adı:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Fiyat:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Resim Seç:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit">Ürün Ekle</button>
      </form>

      <ProductList />
      <KitapForm />
      <KitapList />
    </div>
  );
};

export default Home;
*/

import React from "react";
import { useNavigate } from "react-router-dom";
import HavaDurumu from "./HavaDurumu";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav>
        <h1>Yakın Kitap</h1>
      </nav>
      <section>
        <div>
          <div onClick={() => navigate("/kitap-listesi")}>Kitaplar</div>
          <div>Kod Oluştur</div>
          <div onClick={() => navigate("/kitap-ekle")}>Kitap Ekle</div>
        </div>
      </section>
    </div>
  );
};

export default Home;

