// import { useParams } from 'react-router-dom';
// import { useState } from 'react';
// import axios from 'axios';
// import '../styles/SoruForm.css'; // CSS dosyasını dahil ediyoruz

// const SoruForm = () => {
//   const { kitapId, uniteAdi, konuAdi } = useParams();
//   const [formData, setFormData] = useState({
//     soru_metni: '',
//     resim_url: '',
//     resim_aciklama: '',
//     onerge_metni: '',
//     onbilgi: '',
//     sik_A: '',
//     sik_A_resim: '',
//     sik_B: '',
//     sik_B_resim: '',
//     sik_C: '',
//     sik_C_resim: '',
//     sik_D: '',
//     sik_D_resim: '',
//     sik_E: '',
//     sik_E_resim: '',
//     dogru_cevap: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // const handleFileChange = (e, name) => {
//   //   const file = e.target.files[0];
//   //   if (!file) return;

//   //   const reader = new FileReader();
//   //   reader.onloadend = () => {
//   //     setFormData((prev) => ({ ...prev, [name]: reader.result }));
//   //   };
//   //   reader.readAsDataURL(file);

//   // };
// const handleFileChange = (file, name) => {
//   if (!file) return;
//   const reader = new FileReader();
//   reader.onloadend = () => {
//     console.log("Base64:", reader.result); // burada dolu mu?
//     setFormData((prev) => {
//       const updated = { ...prev, [name]: reader.result };
//       console.log("Güncellenmiş formData:", updated);
//       return updated;
//     });
//   };
//   reader.readAsDataURL(file);
// };



//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:3000/sorular', {
//         ...formData,
//         kitap_id: kitapId,
//         unite: uniteAdi,
//         konu: konuAdi,
//       });
//       alert('Soru başarıyla eklendi.');
//     } catch (error) {
//       console.error('Soru eklenirken hata oluştu:', error);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Soru Ekle</h2>
//       <p><strong>Kitap ID:</strong> {kitapId}</p>
//       <p><strong>Ünite:</strong> {uniteAdi}</p>
//       <p><strong>Konu:</strong> {konuAdi}</p>

//       <form onSubmit={handleSubmit}>
//         <label>Soru Metni</label>
//         <textarea name="soru_metni" onChange={handleChange} required />

//         {/* <label>Resim Ekle</label>
//         <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'resim_url')} /> */}

//         <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0], 'resim_url')} />



//         <label>Resim Açıklama</label>
//         <input name="resim_aciklama" onChange={handleChange} />

//         <label>Önerge Metni</label>
//         <input name="onerge_metni" onChange={handleChange} />

//         <label>Önbilgi</label>
//         <input name="onbilgi" onChange={handleChange} />

//         <hr />

//         {['A', 'B', 'C', 'D', 'E'].map((secenek) => (
//           <div className="secenek-grup" key={secenek}>
//             <label>Şık {secenek}</label>
//             <input
//               name={`sik_${secenek}`}
//               placeholder={`Şık ${secenek}`}
//               onChange={handleChange}
//               required={['A', 'B', 'C', 'D'].includes(secenek)}
//             />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, `sik_${secenek}_resim`)}
//             />
//           </div>
//         ))}

//         <label>Doğru Cevap</label>
//         <select name="dogru_cevap" required onChange={handleChange}>
//           <option value="">Seçiniz</option>
//           <option value="A">A</option>
//           <option value="B">B</option>
//           <option value="C">C</option>
//           <option value="D">D</option>
//           <option value="E">E</option>
//         </select>

//         <button type="submit">Kaydet</button>
//       </form>
//     </div>
//   );
// };

// export default SoruForm;

import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../styles/SoruForm.css';

const SoruForm = () => {
  const { kitapId, uniteAdi, konuAdi } = useParams();

  const [formData, setFormData] = useState({
    soru_metni: '',
    resim_aciklama: '',
    onerge_metni: '',
    onbilgi: '',
    sik_A: '',
    sik_A_resim: null,
    sik_B: '',
    sik_B_resim: null,
    sik_C: '',
    sik_C_resim: null,
    sik_D: '',
    sik_D_resim: null,
    sik_E: '',
    sik_E_resim: null,
    dogru_cevap: '',
  });

  // Genel metin inputları için
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dosya inputları için (File objesi olarak sakla)
  const handleFileChange = (e, name) => {
    const file = e.target.files[0] || null;
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    // Metin alanlarını ekle
    form.append('soru_metni', formData.soru_metni);
    form.append('dogru_cevap', formData.dogru_cevap);
    form.append('resim_aciklama', formData.resim_aciklama || '');
    form.append('onerge_metni', formData.onerge_metni || '');
    form.append('onbilgi', formData.onbilgi || '');
    form.append('sik_A', formData.sik_A || '');
    form.append('sik_B', formData.sik_B || '');
    form.append('sik_C', formData.sik_C || '');
    form.append('sik_D', formData.sik_D || '');
    form.append('sik_E', formData.sik_E || '');
    form.append('kitap_id', kitapId);
    form.append('unite', uniteAdi);
    form.append('konu', konuAdi);

    // Dosyaları ekle (varsa)
    if (formData.resim_url) form.append('image', formData.resim_url);
    if (formData.sik_A_resim) form.append('sik_A_resim', formData.sik_A_resim);
    if (formData.sik_B_resim) form.append('sik_B_resim', formData.sik_B_resim);
    if (formData.sik_C_resim) form.append('sik_C_resim', formData.sik_C_resim);
    if (formData.sik_D_resim) form.append('sik_D_resim', formData.sik_D_resim);
    if (formData.sik_E_resim) form.append('sik_E_resim', formData.sik_E_resim);

    try {
      await axios.post('http://localhost:3000/sorular', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Soru başarıyla eklendi.');
    } catch (error) {
      console.error('Soru eklenirken hata oluştu:', error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <h1>YAKIN KİTAP</h1>
      </nav>
      <div className="form-container">

        <h2>Soru Ekle</h2>
        <p><strong>Kitap ID:</strong> {kitapId}</p>
        <p><strong>Ünite:</strong> {uniteAdi}</p>
        <p><strong>Konu:</strong> {konuAdi}</p>

        <form onSubmit={handleSubmit}>

          <label>Soru Metni</label>
          <textarea name="soru_metni" onChange={handleChange} required />

          <label>Resim Ekle</label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'resim_url')} />

          <label>Resim Açıklama</label>
          <input name="resim_aciklama" onChange={handleChange} />

          <label>Önerge Metni</label>
          <input name="onerge_metni" onChange={handleChange} />

          <label>Önbilgi</label>
          <input name="onbilgi" onChange={handleChange} />

          <hr />

          {['A', 'B', 'C', 'D', 'E'].map(secenek => (
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
                onChange={e => handleFileChange(e, `sik_${secenek}_resim`)}
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
      <nav className="navbar" style={{ marginTop: '50px', height: '20px' }}>


      </nav>
    </>
  );
};

export default SoruForm;

