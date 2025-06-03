import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { soruyuEkle } from '../actions/soruAksiyon';

const Sorular = ({ kitapId }) => {
  const [soru, setSoru] = useState('');
  const [sik_A, setSikA] = useState('');
  const [sik_B, setSikB] = useState('');
  const [sik_C, setSikC] = useState('');
  const [sik_D, setSikD] = useState('');
  const [sik_E, setSikE] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const soruData = { soru_metni: soru, sik_A, sik_B, sik_C, sik_D, sik_E };

    dispatch(soruyuEkle(soruData)); // Soruyu ekler
    setSoru('');
    setSikA('');
    setSikB('');
    setSikC('');
    setSikD('');
    setSikE('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={soru}
        onChange={(e) => setSoru(e.target.value)}
        placeholder="Soru"
      />
      <input
        type="text"
        value={sik_A}
        onChange={(e) => setSikA(e.target.value)}
        placeholder="A Şıkkı"
      />
      <input
        type="text"
        value={sik_B}
        onChange={(e) => setSikB(e.target.value)}
        placeholder="B Şıkkı"
      />
      <input
        type="text"
        value={sik_C}
        onChange={(e) => setSikC(e.target.value)}
        placeholder="C Şıkkı"
      />
      <input
        type="text"
        value={sik_D}
        onChange={(e) => setSikD(e.target.value)}
        placeholder="D Şıkkı"
      />
      <input
        type="text"
        value={sik_E}
        onChange={(e) => setSikE(e.target.value)}
        placeholder="E Şıkkı"
      />
      <button type="submit">Soru Ekle</button>
    </form>
  );
};

export default Sorular;
