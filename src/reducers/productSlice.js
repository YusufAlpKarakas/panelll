import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Ürün güncelleme işlemi
export const updateProduct = createAsyncThunk('products/updateProduct', async (updatedProduct) => {
  const { id, ...rest } = updatedProduct;
  const response = await axios.put(`http://localhost:3000/update-product/${id}`, rest);
  return response.data; // Güncellenmiş ürün bilgisi
});

// Ürün ekleme, silme ve listeleme gibi diğer işlemler
export const addProduct = createAsyncThunk("products/addProduct", async (productData) => {
  const response = await axios.post("http://localhost:3000/add-product", productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
});
  

// Ürün listeleme işlemi
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await axios.get("http://localhost:3000/get-products");  // URL'yi güncelledik
  return response.data;
});


export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await axios.delete(`http://localhost:3000/delete-product/${id}`);
  return id;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [], // Burada listeyi başlatıyoruz
    status: 'idle', // Durum başlangıçta idle
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'; // Yükleme sırasında status'u loading yapıyoruz
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Veri başarılı şekilde geldiğinde succeeded yapıyoruz
        state.products = action.payload; // Veriyi Redux store'a ekliyoruz
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'; // Hata durumunda failed yapıyoruz
        state.error = action.error.message; // Hata mesajını kaydediyoruz
      });
  },
});

export default productSlice.reducer;
