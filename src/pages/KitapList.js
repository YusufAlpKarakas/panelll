/*
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KitapList = () => {
  const [books, setBooks] = useState([]); // Başlangıçta boş dizi
  const [loading, setLoading] = useState(true); // Yüklenme durumu

  useEffect(() => {
    // API'den kitap listesini çekiyoruz
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/kitaplar');
        const data = await response.json();
        setBooks(data); // Veriyi state'e kaydediyoruz
        setLoading(false); // Yüklenme tamamlandı
      } catch (error) {
        console.error('Kitapları çekerken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Kitaplar yükleniyor...</div>;
  }

  if (books.length === 0) {
    return <div>Henüz eklenmiş kitap yok.</div>;
  }

  return (
    <div>
      <h1>Kitap Listesi</h1>
      <ul>
        {books.map((kitap) => (
          <li key={kitap.id}>
            <Link to={`/kitap/${kitap.id}`}>
              {kitap.ders_adi} - {kitap.kategori} - {kitap.sinif}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KitapList;
*/

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/KitapList.css'; // CSS dosyasını ekliyoruz

const KitapList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/kitaplar');
      setBooks(response.data);
    } catch (error) {
      console.error('Kitapları çekerken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3000/kitaplar/${id}`);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error('Kitap silinirken hata oluştu:', error);
    }
  };

  if (loading) return <div>Kitaplar yükleniyor...</div>;
  if (books.length === 0) return <div>Henüz eklenmiş kitap yok.</div>;

  return (
    // <div>
    //   <h1>Kitap Listesi</h1>
    //   <ul style={{ listStyle: 'none', padding: 0 }}>
    //     {books.map((kitap) => (
    //       <li
    //         key={kitap.id}
    //         onClick={() => navigate(`/kitaplar/${kitap.id}`)}
    //         style={{
    //           backgroundColor: '#333',
    //           marginBottom: '20px',
    //           padding: '15px',
    //           borderRadius: '8px',
    //           color: '#fff',
    //           cursor: 'pointer',
    //           boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    //         }}
    //       >
    //         <h3>{kitap.isim}</h3>
    //         <p>Ders Adı: {kitap.ders_adi}</p>
    //         <p>Kategori: {kitap.kategori}</p>
    //         <p>Sınıf: {kitap.sinif}</p>
    //         <p>Fiyat: {kitap.price}₺</p>
    //         {kitap.indirim && <p>İndirim: {kitap.indirim}%</p>}
    //         <p>İndirimli Fiyat: {kitap.indirim_fiyat}₺</p>
    //         {kitap.image_url && (
    //           <img
    //             src={`http://localhost:3000${kitap.image_url}`}
    //             alt={kitap.isim}
    //             style={{ width: '100px', height: '150px', objectFit: 'cover' }}
    //           />
    //         )}
    //         <div style={{ marginTop: '10px' }}>
    //           <button
    //             onClick={(e) => {
    //               e.stopPropagation();
    //               navigate(`/kitaplar/${kitap.id}`);
    //             }}
    //             style={{
    //               marginRight: '10px',
    //               padding: '5px 10px',
    //               backgroundColor: '#007bff',
    //               color: '#fff',
    //               border: 'none',
    //               borderRadius: '4px',
    //               cursor: 'pointer'
    //             }}
    //           >
    //             Düzenle
    //           </button>
    //           <button
    //             onClick={(e) => deleteBook(kitap.id, e)}
    //             style={{
    //               padding: '5px 10px',
    //               backgroundColor: '#dc3545',
    //               color: '#fff',
    //               border: 'none',
    //               borderRadius: '4px',
    //               cursor: 'pointer'
    //             }}
    //           >
    //             Sil
    //           </button>
    //         </div>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <>
      <nav className="navbar">
        <h1>YAKIN KİTAP</h1>
      </nav>

      <div className="kitap-listesi-container">
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: '20px',
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
        <ul className="kitap-listesi">
          {books.map((kitap) => (
            <li
              key={kitap.id}
              className="kitap-karti"
              onClick={() => navigate(`/kitaplar/${kitap.id}`)}
            >

              <div className="kitap-karti-flexbox" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                backgroundColor: '#ffcccc',
                // borderRadius: '8px',
                // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                gap: '20px'
              }}>

                <img
                  src={`http://localhost:3000${kitap.image_url}`}
                  alt={kitap.isim}
                  className="kitap-resim"
                />

                <div className="sag-panel">
                  <div className="kitap-detaylar">
                    <p><strong>Ad</strong> : {kitap.isim}</p>
                    <p><strong>Ders</strong> : {kitap.ders_adi}</p>
                    <p><strong>Sınıf</strong> : {kitap.sinif}</p>
                    <p><strong>Soru Sayısı</strong> : {kitap.soru_sayisi || '-'}</p>
                    <p><strong>Kategori</strong> : {kitap.kategori}</p>
                    <p><strong>Fiyat</strong> : {kitap.price}₺</p>
                  </div>
                  <div className="kitap-butonlar">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/kitaplar/${kitap.id}`);
                      }}
                      className="btn-duzenle"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={(e) => deleteBook(kitap.id, e)}
                      className="btn-sil"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>


  );
};

export default KitapList;






