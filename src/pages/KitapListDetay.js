import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const KitapListDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kitap, setKitap] = useState(null);
  const [question, setQuestion] = useState('');
  const [sik_A, setSikA] = useState('');
  const [sik_B, setSikB] = useState('');
  const [sik_C, setSikC] = useState('');
  const [sik_D, setSikD] = useState('');
  const [sik_E, setSikE] = useState('');
  const [dogruCevap, setDogruCevap] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3000/kitap-detay/${id}`)
      .then(response => setKitap(response.data.book))
      .catch(error => console.error('Kitap detayları alınırken hata oluştu:', error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const soruData = {
      soru_metni: question,
      sik_A,
      sik_B,
      sik_C,
      sik_D,
      sik_E,
      dogru_cevap: dogruCevap,
      kitap_id: id,
    };

    axios.post('http://localhost:3000/sorular', soruData)
      .then(() => {
        alert('Soru başarıyla eklendi!');
        setQuestion('');
        setSikA('');
        setSikB('');
        setSikC('');
        setSikD('');
        setSikE('');
        setDogruCevap('');
      })
      .catch(() => alert('Soruyu eklerken bir hata oluştu.'));
  };

  const handleGoBack = () => navigate(-1);

  return (
    <div className="container">
      <h2 className="title">Kitap Detayı - ID: {id}</h2>
      {kitap && (
        <div>
          <h3>{kitap.ders_adi} - {kitap.kategori}</h3>
          <p>Sinif: {kitap.sinif}</p>
        </div>
      )}
      <button onClick={handleGoBack}>Geri Git</button>

      <div className="question-form">
        <h3>Bir Soru Sor:</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Sorunuzu buraya yazın..."
            rows="4"
            cols="50"
            required
          />
          <br />
          <input type="text" value={sik_A} onChange={(e) => setSikA(e.target.value)} placeholder="A şıkkı" required />
          <input type="text" value={sik_B} onChange={(e) => setSikB(e.target.value)} placeholder="B şıkkı" required />
          <input type="text" value={sik_C} onChange={(e) => setSikC(e.target.value)} placeholder="C şıkkı" required />
          <input type="text" value={sik_D} onChange={(e) => setSikD(e.target.value)} placeholder="D şıkkı" required />
          <input type="text" value={sik_E} onChange={(e) => setSikE(e.target.value)} placeholder="E şıkkı" required />
          <br />
          <select value={dogruCevap} onChange={(e) => setDogruCevap(e.target.value)} required>
            <option value="">Doğru cevabı seçin</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
          <br />
          <button type="submit">Soruyu Gönder</button>
        </form>
      </div>
    </div>
  );
};

export default KitapListDetay;
