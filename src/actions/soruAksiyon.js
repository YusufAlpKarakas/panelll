import axios from 'axios';

export const SORU_EKLE = 'SORU_EKLE';
export const SORU_EKLE_ERROR = 'SORU_EKLE_ERROR';

export const soruyuEkle = (soru) => async (dispatch) => {
  try {
    // API'ye POST isteği gönderiyoruz
    const response = await axios.post('http://localhost:3000/kitaplar/sorular', {
      soru_metni: soru.soru_metni,
      sik_A: soru.sik_A,
      sik_B: soru.sik_B,
      sik_C: soru.sik_C,
      sik_D: soru.sik_D,
      sik_E: soru.sik_E,
      dogru_cevap: soru.dogru_cevap, // Doğru cevap alanı eklendi
    });

    // Başarıyla eklenmişse soruyu Redux'a gönderiyoruz
    dispatch({
      type: SORU_EKLE,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: SORU_EKLE_ERROR,
      payload: error.message,
    });
  }
};

// Başka isteğin varsa söyle, hemen ekleyelim! 🚀
