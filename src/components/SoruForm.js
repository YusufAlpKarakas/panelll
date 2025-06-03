import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../styles/SoruForm.css'; // CSS dosyasını dahil ediyoruz

const SoruForm = () => {
  const { kitapId, uniteAdi, konuAdi } = useParams();
  const [formData, setFormData] = useState({
    soru_metni: '',
    resim_url: '',
    resim_aciklama: '',
    onerge_metni: '',
    onbilgi: '',
    sik_A: '',
    sik_A_resim: '',
    sik_B: '',
    sik_B_resim: '',
    sik_C: '',
    sik_C_resim: '',
    sik_D: '',
    sik_D_resim: '',
    sik_E: '',
    sik_E_resim: '',
    dogru_cevap: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [name]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/sorular', {
        ...formData,
        kitap_id: kitapId,
        unite: uniteAdi,
        konu: konuAdi,
      });
      alert('Soru başarıyla eklendi.');
    } catch (error) {
      console.error('Soru eklenirken hata oluştu:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Soru Ekle</h2>
      <p><strong>Kitap ID:</strong> {kitapId}</p>
      <p><strong>Ünite:</strong> {uniteAdi}</p>
      <p><strong>Konu:</strong> {konuAdi}</p>

      <form onSubmit={handleSubmit}>
        <label>Soru Metni</label>
        <textarea name="soru_metni" onChange={handleChange} required />

        <label>Resim Ekle</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'resim_url')} />

        <label>Resim Açıklama</label>
        <input name="resim_aciklama" onChange={handleChange} />

        <label>Önerge Metni</label>
        <input name="onerge_metni" onChange={handleChange} />

        <label>Önbilgi</label>
        <input name="onbilgi" onChange={handleChange} />

        <hr />

        {['A', 'B', 'C', 'D', 'E'].map((secenek) => (
          <div className="secenek-grup" key={secenek}>
            <label>Şık {secenek}</label>
            <input
              name={`sik_${secenek}`}
              placeholder={`Şık ${secenek}`}
              onChange={handleChange}
              required={['A', 'B', 'C', 'D'].includes(secenek)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, `sik_${secenek}_resim`)}
            />
          </div>
        ))}

        <label>Doğru Cevap</label>
        <select name="dogru_cevap" required onChange={handleChange}>
          <option value="">Seçiniz</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
        </select>

        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
};

export default SoruForm;
