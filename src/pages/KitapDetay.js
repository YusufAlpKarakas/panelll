import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/KitapDetay.css';

const KitapDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isim, setIsim] = useState('');
  const [dersAdi, setDersAdi] = useState('');
  const [kategori, setKategori] = useState('tyt');
  const [siniflar, setSiniflar] = useState([]);
  const [price, setPrice] = useState('');
  const [indirim, setIndirim] = useState('');
  const [indirimFiyat, setIndirimFiyat] = useState(null);
  const [image, setImage] = useState(null);
  const [mevcutImage, setMevcutImage] = useState(null);
  const [uniteler, setUniteler] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/kitaplar/${id}`)
      .then((res) => {
        const data = res.data;
        setIsim(data.isim);
        setDersAdi(data.dersAdi);
        setKategori(data.kategori);
        setSiniflar(JSON.parse(data.sinif));
        setPrice(data.fiyat);
        setIndirim(data.indirim || '');
        setMevcutImage(data.image);

        if (data.indirim && data.fiyat) {
          const hesapla = (data.fiyat * (1 - data.indirim / 100)).toFixed(2);
          setIndirimFiyat(hesapla);
        }
      })
      .catch((err) => {
        console.error('Veri alınamadı:', err);
        alert('Kitap bilgisi alınamadı.');
      });

    axios.get(`http://localhost:3000/kitaplar/${id}/uniteler`)
      .then((res) => {
        setUniteler(res.data);
      })
      .catch((err) => {
        console.error('Üniteler alınamadı:', err);
      });
  }, [id]);

  const getSinifSecenekleri = () => kategori === 'tyt' ? [9, 10] : [11, 12];

  const toggleSinif = (value) => {
    setSiniflar(prev =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleIndirimChange = (e) => {
    const indirimOrani = e.target.value;
    setIndirim(indirimOrani);

    if (indirimOrani && price) {
      const hesapla = (parseFloat(price) * (1 - indirimOrani / 100)).toFixed(2);
      setIndirimFiyat(hesapla);
    } else {
      setIndirimFiyat(null);
    }
  };

  const handlePriceChange = (e) => {
    const yeniFiyat = e.target.value;
    setPrice(yeniFiyat);

    if (indirim) {
      const hesapla = (parseFloat(yeniFiyat) * (1 - indirim / 100)).toFixed(2);
      setIndirimFiyat(hesapla);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('isim', isim);
    formData.append('dersAdi', dersAdi);
    formData.append('kategori', kategori);
    formData.append('sinif', JSON.stringify(siniflar));
    formData.append('fiyat', price);
    formData.append('indirim', indirim);
    formData.append('indirim_fiyat', indirimFiyat);
    if (image) formData.append('image', image);

    axios.put(`http://localhost:3000/kitaplar/${id}`, formData)
      .then(() => {
        alert('Kitap güncellendi!');
        navigate('/kitap-listesi');
      })
      .catch((err) => {
        console.error('Güncelleme hatası:', err);
        alert('Güncelleme başarısız.');
      });
  };

  return (
    // <div className="p-4">
    //   <h2 className="text-xl mb-4">Kitap Güncelle</h2>
    //   <form onSubmit={handleSubmit} className="space-y-4">
    //     <div>
    //       <label>Kitap İsmi:</label>
    //       <input
    //         type="text"
    //         value={isim}
    //         onChange={(e) => setIsim(e.target.value)}
    //         className="border p-2 w-full"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label>Ders Adı:</label>
    //       <select
    //         value={dersAdi}
    //         onChange={(e) => setDersAdi(e.target.value)}
    //         className="border p-2 w-full"
    //         required
    //       >
    //         <option value="">Ders Seçin</option>
    //         <option value="Matematik">Matematik</option>
    //         <option value="Türkçe">Türkçe</option>
    //         <option value="Kimya">Kimya</option>
    //         <option value="Fizik">Fizik</option>
    //         <option value="Biyoloji">Biyoloji</option>
    //       </select>
    //     </div>

    //     <div>
    //       <label>Kategori:</label>
    //       <select
    //         value={kategori}
    //         onChange={(e) => {
    //           setKategori(e.target.value);
    //           setSiniflar([]);
    //         }}
    //         className="border p-2 w-full"
    //       >
    //         <option value="tyt">TYT</option>
    //         <option value="ayt">AYT</option>
    //       </select>
    //     </div>

    //     <div>
    //       <label>Sınıf(lar):</label>
    //       <div className="flex gap-4 flex-wrap">
    //         {getSinifSecenekleri().map((s) => (
    //           <label key={s} className="flex items-center gap-2">
    //             <input
    //               type="checkbox"
    //               checked={siniflar.includes(s)}
    //               onChange={() => toggleSinif(s)}
    //             />
    //             {s}. Sınıf
    //           </label>
    //         ))}
    //       </div>
    //     </div>

    //     <div>
    //       <label>Fiyat (₺):</label>
    //       <input
    //         type="number"
    //         value={price}
    //         onChange={handlePriceChange}
    //         className="border p-2 w-full"
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label>İndirim (%):</label>
    //       <input
    //         type="number"
    //         value={indirim}
    //         onChange={handleIndirimChange}
    //         className="border p-2 w-full"
    //         min="0"
    //         max="100"
    //       />
    //       {indirimFiyat && (
    //         <p className="text-green-600 font-semibold mt-1">
    //           İndirimli Fiyat: {indirimFiyat}₺
    //         </p>
    //       )}
    //     </div>

    //     <div>
    //       <label>Yeni Görsel (İsteğe Bağlı):</label>
    //       <input
    //         type="file"
    //         onChange={(e) => setImage(e.target.files[0])}
    //         className="border p-2 w-full"
    //       />
    //       {mevcutImage && (
    //         <div className="mt-2">
    //           <p>Mevcut Görsel:</p>
    //           <img
    //             src={`http://localhost:3000/${mevcutImage}`}
    //             alt="Kitap Görseli"
    //             className="w-32 h-32 object-cover border"
    //           />
    //         </div>
    //       )}
    //     </div>

    //     <button
    //       type="submit"
    //       className="bg-blue-600 text-white p-2 rounded w-full"
    //     >
    //       Güncelle
    //     </button>
    //   </form>

    //   <div className="mt-8">
    //     <h3 className="text-lg font-semibold mb-2">Üniteler</h3>
    //     {uniteler.length === 0 ? (
    //       <p>Bu kitaba ait ünite bulunmuyor.</p>
    //     ) : (
    //       <ul className="space-y-4">
    //         {uniteler.map((unite) => (
    //           <li key={unite.id} className="border p-3 rounded">
    //             <p className="font-semibold">{unite.unite_adi}</p>
    //             {unite.konular && unite.konular.length > 0 ? (
    //               <ul className="list-disc list-inside mt-1 ml-4 text-sm text-blue-600">
    //                 {unite.konular.map((konu, i) => (
    //                   <li
    //                     key={i}
    //                     className="cursor-pointer hover:underline"
    //                     onClick={() =>
    //                       navigate(`/soru-ekle/${id}/${encodeURIComponent(unite.unite_adi)}/${encodeURIComponent(konu)}`)
    //                     }
    //                   >
    //                     {konu}
    //                   </li>
    //                 ))}
    //               </ul>
    //             ) : (
    //               <p className="text-sm text-gray-500">Bu üniteye ait konu yok.</p>
    //             )}
    //           </li>
    //         ))}
    //       </ul>
    //     )}
    //   </div>
    // </div>


    <>          <nav className="navbar">
      <h1>YAKIN KİTAP-GÜNCELLEME</h1>
    </nav>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '20px',
          marginLeft: '20px',
          padding: '8px 16px',
          backgroundColor: '#ffcccc',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Geri
      </button>
      <div className="book-update-container">
        <h2 className="title">Kitap Güncelle</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Kitap İsmi:</label>
            <input
              type="text"
              value={isim}
              onChange={(e) => setIsim(e.target.value)}
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Ders Adı:</label>
            <select
              value={dersAdi}
              onChange={(e) => setDersAdi(e.target.value)}
              required
              className="input"
            >
              <option value="">Ders Seçin</option>
              <option value="Matematik">Matematik</option>
              <option value="Türkçe">Türkçe</option>
              <option value="Kimya">Kimya</option>
              <option value="Fizik">Fizik</option>
              <option value="Biyoloji">Biyoloji</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kategori:</label>
              <select
                value={kategori}
                onChange={(e) => {
                  setKategori(e.target.value);
                  setSiniflar([]);
                }}
                className="input"
              >
                <option value="tyt">TYT</option>
                <option value="ayt">AYT</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fiyat (₺):</label>
              <input
                type="number"
                value={price}
                onChange={handlePriceChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Sınıf(lar):</label>
            <div className="checkbox-group">
              {getSinifSecenekleri().map((s) => (
                <label key={s} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={siniflar.includes(s)}
                    onChange={() => toggleSinif(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>İndirim (%):</label>
            <input
              type="number"
              value={indirim}
              onChange={handleIndirimChange}
              min="0"
              max="100"
              className="input"
            />
            {indirimFiyat && (
              <p className="discount-info">
                İndirimli Fiyat: {indirimFiyat}₺
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Yeni Görsel (İsteğe Bağlı):</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="input"
            />
            {mevcutImage && (
              <div className="image-preview">
                <p>Mevcut Görsel:</p>
                <img
                  src={`http://localhost:3000/${mevcutImage}`}
                  alt="Kitap Görseli"
                  className="kitap-image"
                />
              </div>
            )}
          </div>

          <button type="submit" className="save-button">
            Güncelle
          </button>
        </form>
      </div>

      <div className="uniteler-section">
        <h3 className="uniteler-title">Üniteler</h3>
        {uniteler.length === 0 ? (
          <p className="uniteler-empty">Bu kitaba ait ünite bulunmuyor.</p>
        ) : (
          <div className="uniteler-grid">
            {uniteler.map((unite) => (
              <div key={unite.id} className="unite-box">
                <p className="unite-box-title">{unite.unite_adi}</p>
                {unite.konular && unite.konular.length > 0 ? (
                  <ul className="konu-list">
                    {unite.konular.map((konu, index) => (
                      <li
                        key={index}
                        className="konu-item"
                        onClick={() =>
                          navigate(`/soru-ekle/${id}/${encodeURIComponent(unite.unite_adi)}/${encodeURIComponent(konu)}`)
                        }
                      >
                        {konu}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="konu-empty">Bu üniteye ait konu yok.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>



      <nav className="navbar" style={{ marginTop: '50px', height: '20px' }}>


      </nav>

    </>




  );
};

export default KitapDetay;
