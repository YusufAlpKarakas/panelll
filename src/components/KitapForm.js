/*
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBook } from '../actions/kitapAksiyon' // Doğru action import edildi

const KitapForm = () => {
  const dispatch = useDispatch();
  const [dersAdi, setDersAdi] = useState('');
  const [kategori, setKategori] = useState('tyt');
  const [sinif, setSinif] = useState(9);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBook({ dersAdi, kategori, sinif }));
    setDersAdi('');
    setKategori('tyt');  // Varsayılan kategori
    setSinif(9);  // Varsayılan sınıf
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Yeni Kitap Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ders Adı"
          value={dersAdi}
          onChange={(e) => setDersAdi(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <select
          value={kategori}
          onChange={(e) => {
            setKategori(e.target.value);
            setSinif(e.target.value === 'tyt' ? 9 : 11);
          }}
          className="border p-2 w-full"
        >
          <option value="tyt">TYT</option>
          <option value="ayt">AYT</option>
        </select>
        <select
          value={sinif}
          onChange={(e) => setSinif(Number(e.target.value))}
          className="border p-2 w-full"
        >
          {kategori === 'tyt' ? (
            <>
              <option value={9}>9. Sınıf</option>
              <option value={10}>10. Sınıf</option>
            </>
          ) : (
            <>
              <option value={11}>11. Sınıf</option>
              <option value={12}>12. Sınıf</option>
            </>
          )}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Kitap Ekle
        </button>
      </form>
    </div>
  );
};

export default KitapForm;
*/
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KitapForm = () => {
  const navigate = useNavigate();

  // Adım 1: Kitap bilgileri
  const [isim, setIsim] = useState('');
  const [dersAdi, setDersAdi] = useState('');
  const [kategori, setKategori] = useState('tyt');
  const [siniflar, setSiniflar] = useState([]);
  const [price, setPrice] = useState('');
  const [indirim, setIndirim] = useState('');
  const [image, setImage] = useState(null);

  // Adım 2: Ünite ve Konular
  const [uniteInput, setUniteInput] = useState('');
  const [konuInput, setKonuInput] = useState('');
  const [konular, setKonular] = useState({});
  const [currentUnite, setCurrentUnite] = useState('');
  const konuInputRef = useRef(null);

  const [showDetails, setShowDetails] = useState(false);

  const getSinifSecenekleri = () => {
    return kategori === 'tyt' ? [9, 10] : [11, 12];
  };

  const toggleSinif = (value) => {
    setSiniflar(prev =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleDevam = (e) => {
    e.preventDefault();
    setShowDetails(true);
  };

  const handleKitabiBitir = () => {
    const uniteList = Object.keys(konular);
    const konuList = uniteList.map(unite => ({
      unite,
      konular: konular[unite],
    }));

    const formData = new FormData();
    formData.append('isim', isim);
    formData.append('dersAdi', dersAdi);
    formData.append('kategori', kategori);
    formData.append('sinif', JSON.stringify(siniflar));
    formData.append('price', price);
    formData.append('indirim', indirim);
    formData.append('unite', JSON.stringify(uniteList));
    formData.append('konu', JSON.stringify(konuList));
    if (image) formData.append('image', image);

    axios.post('http://localhost:3000/kitaplar', formData)
      .then(() => {
        alert('Kitap başarıyla eklendi!');
        navigate('/kitap-listesi');
      })
      .catch((err) => {
        console.error('Kitap ekleme hatası:', err);
        alert('Kitap eklenemedi.');
      });
  };

  const handleUniteEkle = () => {
    if (!uniteInput.trim()) return;
    if (!konular[uniteInput]) {
      setKonular(prev => ({ ...prev, [uniteInput]: [] }));
    }
    setCurrentUnite(uniteInput);
    setUniteInput('');
    setTimeout(() => {
      konuInputRef.current?.focus();
    }, 100);
  };

  const handleKonuEkle = () => {
    if (!konuInput.trim() || !currentUnite) return;
    setKonular(prev => ({
      ...prev,
      [currentUnite]: [...(prev[currentUnite] || []), konuInput],
    }));
    setKonuInput('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Kitap Ekle</h2>

      {!showDetails ? (
        <form onSubmit={handleDevam} className="space-y-4">
          <label>Kitap ismi:</label>
          <input type="text" value={isim} onChange={(e) => setIsim(e.target.value)} className="border p-2 w-full" required />

          <label>Ders Adı:</label>
          <select value={dersAdi} onChange={(e) => setDersAdi(e.target.value)} className="border p-2 w-full" required>
            <option value="">Ders Seçin</option>
            <option value="Matematik">Matematik</option>
            <option value="Türkçe">Türkçe</option>
            <option value="Kimya">Kimya</option>
            <option value="Fizik">Fizik</option>
            <option value="Biyoloji">Biyoloji</option>
          </select>

          <label>Kategori:</label>
          <select value={kategori} onChange={(e) => { setKategori(e.target.value); setSiniflar([]); }} className="border p-2 w-full">
            <option value="tyt">TYT</option>
            <option value="ayt">AYT</option>
          </select>

          <label>Sınıf(lar):</label>
          <div className="flex gap-4 flex-wrap">
            {getSinifSecenekleri().map((s) => (
              <label key={s} className="flex items-center gap-1">
                <input type="checkbox" value={s} checked={siniflar.includes(s)} onChange={() => toggleSinif(s)} />
                {s}. Sınıf
              </label>
            ))}
          </div>

          <label>Fiyat (₺):</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full" required />

          <label>İndirim (%):</label>
          <input type="number" value={indirim} onChange={(e) => setIndirim(e.target.value)} className="border p-2 w-full" placeholder="Opsiyonel" />

          <label>Yeni Görsel (İsteğe Bağlı):</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} className="border p-2 w-full" />

          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Devam</button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label>Ünite:</label>
            <input type="text" value={uniteInput} onChange={(e) => setUniteInput(e.target.value)} className="border p-2 w-full" />
            <button onClick={handleUniteEkle} className="bg-gray-300 px-4 py-1 mt-1 rounded">Ekle</button>
          </div>

          {currentUnite && (
            <div>
              <label>{currentUnite} - Konu:</label>
              <input
                type="text"
                ref={konuInputRef}
                value={konuInput}
                onChange={(e) => setKonuInput(e.target.value)}
                className="border p-2 w-full"
              />
              <button onClick={handleKonuEkle} className="bg-gray-300 px-4 py-1 mt-1 rounded">Ekle</button>
            </div>
          )}

          <div>
            {Object.entries(konular).map(([unite, konulari]) => (
              <div key={unite} className="mt-4">
                <h3 className="font-bold">{unite}</h3>
                <ul className="list-disc ml-5">
                  {konulari.map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <button onClick={handleKitabiBitir} className="bg-green-600 text-white p-2 rounded w-full">Kitabı Bitir</button>
        </div>
      )}
    </div>
  );
};

export default KitapForm;



















