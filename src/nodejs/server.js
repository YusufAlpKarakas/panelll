const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer'); 
const path = require('path');
const app = express();
const port = 3000;

// MySQL bağlantısı
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bordo613613',
  database: 'test_db',
  port: 3306,
});

// Veritabanına bağlanma
connection.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanırken hata oluştu:', err.message);
    return;
  }
  console.log('MySQL bağlantısı başarılı!');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Resim dosyaları için statik dosya servisi

// Multer Konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Resimler "uploads" klasörüne kaydedilecek
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Benzersiz bir dosya adı oluştur
  },
});
const upload = multer({ storage });

// Ürünleri listeleme endpoint
app.get('/get-products', (req, res) => {
  const query = 'SELECT * FROM products';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
      return res.status(500).send('Veritabanından ürünler alınırken hata oluştu!.');
    }
    res.status(200).json(results);
  });
});

// Ürün detayını alma endpoint
app.get('/get-product/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM products WHERE id = ?';
  connection.query(query, [productId], (err, result) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
      return res.status(500).send('Veritabanından ürün bilgileri alınırken hata oluştu.');
    }
    res.status(200).json(result[0]);
  });
});

// Ürün ekleme endpoint
app.post('/add-product', upload.single('image'), (req, res) => {
  const { name, price } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : ''; // Resim URL'si oluştur

  if (!name || !price) {
    return res.status(400).send('Ürün adı ve fiyatı zorunludur.');
  }

  const query = 'INSERT INTO products (name, price, image_url) VALUES (?, ?, ?)';
  connection.query(query, [name, price, image_url], (err, result) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
      return res.status(500).send('Ürün eklenirken hata oluştu.');
    }
    res.status(200).json({ id: result.insertId, name, price, image_url });
  });
});

// Ürün güncelleme endpoint
app.put('/update-product/:id', upload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, price } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

  const query = 'UPDATE products SET name = ?, price = ?, image_url = ? WHERE id = ?';
  connection.query(query, [name, price, image_url, productId], (err, result) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
      return res.status(500).send('Ürün güncellenirken hata oluştu.');
    }
    res.status(200).send('Ürün başarıyla güncellendi!');
  });
});

// Ürün silme endpoint
app.delete('/delete-product/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM products WHERE id = ?';
  connection.query(query, [productId], (err, result) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
      return res.status(500).send('Ürün silinirken hata oluştu.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Ürün bulunamadı.');
    }
    res.status(200).send('Ürün başarıyla silindi!');
  });
});





// Kitapları listele
app.get('/kitaplar', (req, res) => {
  const query = 'SELECT * FROM kitap';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err); // Hata mesajlarını konsola yazdır
      return res.status(500).send('Veritabanından kitaplar alınırken hata oluştu.');
    }

    if (results.length === 0) {
      return res.status(404).send('Kitap bulunamadı.');
    }

    // Kitaplar başarıyla alındı
    res.status(200).json(results); // Verileri JSON formatında dön
  });
});

app.get('/kitaplar/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM kitap WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err);
      return res.status(500).send('Veritabanından kitap alınırken hata oluştu.');
    }

    if (results.length === 0) {
      return res.status(404).send('Kitap bulunamadı.');
    }

    res.status(200).json(results[0]); // Tek bir kitap döner
  });
});


//kitap güncelleme

// Kitap güncelleme
app.put('/kitaplar/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const {
    isim,
    dersAdi,
    kategori,
    sinif,
    fiyat,
    indirim,
    indirim_fiyat
  } = req.body;

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    UPDATE kitap
    SET isim = ?, ders_adi = ?, kategori = ?, sinif = ?, price = ?, indirim = ?, indirim_fiyat = ?, image_url = COALESCE(?, image_url)
    WHERE id = ?
  `;

  const values = [
    isim,
    dersAdi,
    kategori,
    sinif,
    parseFloat(fiyat),
    indirim ? parseFloat(indirim) : null,
    indirim_fiyat ? parseFloat(indirim_fiyat) : null,
    imageUrl,
    id
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Kitap güncellenirken hata:', err);
      return res.status(500).send('Kitap güncellenirken hata oluştu.');
    }

    res.status(200).json({ message: 'Kitap başarıyla güncellendi.' });
  });
});


// Kitap ekleme
app.post('/kitaplar', upload.single('image'), (req, res) => {
  const { isim, dersAdi, sinif, kategori, price, indirim, unite, konu } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  console.log("Gelen Veriler:");
  console.log("isim:", isim);
  console.log("dersAdi:", dersAdi);
  console.log("sinif:", sinif);
  console.log("kategori:", kategori);
  console.log("price:", price);
  console.log("indirim:", indirim);
  console.log("unite (ham):", unite);
  console.log("konu (ham):", konu);

  if (!isim || !dersAdi || !price || !sinif || !kategori) {
    return res.status(400).send('Eksik alanlar var. Lütfen tüm alanları doldurun.');
  }

  const priceValue = parseFloat(price);
  const indirimValue = indirim ? parseFloat(indirim) : null;
  const indirimFiyatValue = indirimValue
    ? (priceValue - (priceValue * indirimValue) / 100).toFixed(2)
    : null;

  let uniteJSON, konuJSON;

  try {
    uniteJSON = typeof unite === 'string' ? unite : JSON.stringify(unite);
    konuJSON = typeof konu === 'string' ? konu : JSON.stringify(konu);
  } catch (error) {
    console.log("Hatalı unite/konu:", error);
    return res.status(400).send('Unite veya konu verisi geçersiz.');
  }

  console.log("unite (JSON):", uniteJSON);
  console.log("konu (JSON):", konuJSON);

  const query = `
    INSERT INTO kitap (isim, ders_adi, sinif, kategori, price, indirim, indirim_fiyat, image_url, unite, konu)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [
      isim,
      dersAdi,
      sinif,
      kategori,
      priceValue,
      indirimValue,
      indirimFiyatValue,
      imageUrl,
      uniteJSON,
      konuJSON
    ],
    (err, result) => {
      if (err) {
        console.error('Kitap eklenirken hata:', err);
        return res.status(500).send('Kitap eklenirken hata oluştu.');
      }
      console.log("Kitap başarıyla eklendi. ID:", result.insertId);
      res.status(200).json({ message: 'Kitap başarıyla eklendi.' });
    }
  );
});




// routes/kitaplar.js içine ekle
app.get('/kitaplar/:id/uniteler', (req, res) => {
  const kitapId = req.params.id;
  const sql = 'SELECT unite, konu FROM kitap WHERE id = ?';

  connection.query(sql, [kitapId], (err, result) => {
    if (err) {
      console.error('Veri alınamadı:', err);
      return res.status(500).json({ hata: 'Sunucu hatası' });
    }

    if (result.length === 0) {
      return res.status(404).json({ hata: 'Kitap bulunamadı' });
    }

    try {
      const uniteListesi = JSON.parse(result[0].unite || '[]');
      const konuVerisi = JSON.parse(result[0].konu || '[]'); // Artık array olarak alıyoruz

      const uniteWithKonular = uniteListesi.map((unite, index) => {
        const konuObj = konuVerisi.find(k => k.unite === unite);
        return {
          id: index,
          unite_adi: unite,
          konular: konuObj ? konuObj.konular : []
        };
      });

      console.log('Ünite ve Konular:', uniteWithKonular);

      res.json(uniteWithKonular);
    } catch (e) {
      console.error('JSON parse hatası:', e);
      res.status(500).json({ hata: 'Veri bozuk' });
    }
  });
});








app.delete('/kitaplar/:id', (req, res) => {
  const kitapId = req.params.id;

  const query = 'DELETE FROM kitap WHERE id = ?';

  connection.query(query, [kitapId], (err, results) => {
    if (err) {
      console.error('Kitap silinirken hata oluştu:', err);
      return res.status(500).send('Kitap silinirken bir hata oluştu.');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Silinecek kitap bulunamadı.');
    }

    res.status(200).json({ message: 'Kitap başarıyla silindi.' });
  });
});









/*
app.get('/kitaplar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const kitap = await Kitap.findById(id);
    if (!kitap) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }

    res.status(200).json({ book: kitap });
  } catch (err) {
    console.error('Hata:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

*/

/*
app.put('/kitaplar/:id', (req, res) => {
  const { id } = req.params;
  const { isim, ders_adi, sinif, kategori, price, indirim } = req.body;

  const indirimOrani = indirim / 100;
  const indirimFiyat = price - (price * indirimOrani);

  const query = `
    UPDATE kitap 
    SET isim = ?, ders_adi = ?, sinif = ?, kategori = ?, price = ?, indirim = ?, indirim_fiyat = ? 
    WHERE id = ?
  `;

  connection.query(
    query,
    [isim, ders_adi, sinif, kategori, price, indirim, indirimFiyat, id],
    (err, result) => {
      if (err) {
        return res.status(500).send('Kitap güncellenirken hata oluştu.');
      }
      res.status(200).json({ message: 'Kitap başarıyla güncellendi!' });
    }
  );
});
*/


// Kitap Detayını ve Soruları Getirme
app.get('/kitap-detay/:id', (req, res) => {
  const bookId = req.params.id;

  // Kitap detaylarını al
  const bookQuery = 'SELECT * FROM kitap WHERE id = ?';
  connection.query(bookQuery, [bookId], (err, bookResult) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
      return res.status(500).send('Kitap bilgileri alınırken hata oluştu.');
    }
    if (bookResult.length === 0) {
      return res.status(404).send('Kitap bulunamadı.');
    }

    // Kitaba ait soruları al
    const questionsQuery = 'SELECT * FROM sorular WHERE kitap_id = ?';
    connection.query(questionsQuery, [bookId], (err, questionsResult) => {
      if (err) {
        console.error('Veritabanı hatası:', err.message);
        return res.status(500).send('Sorular alınırken hata oluştu.');
      }

      // Kitap ve soruları döndür
      res.status(200).json({
        book: bookResult[0],
        questions: questionsResult
      });
    });
  });
});



// Soruyu eklemek için POST isteği
// app.post('/sorular', upload.single('image'), (req, res) => {
//   const data = req.body;
//   const resim_url = req.file ? `/uploads/${req.file.filename}` : null;

//   // Zorunlu alan kontrolü
//   if (!data.soru_metni || !data.dogru_cevap) {
//     return res.status(400).json({ error: "Soru metni ve doğru cevap zorunludur." });
//   }

//   const query = `
//     INSERT INTO sorular (
//       soru_metni, resim_url, resim_aciklama, onerge_metni, onbilgi,
//       sik_A, sik_A_resim, sik_B, sik_B_resim, sik_C, sik_C_resim,
//       sik_D, sik_D_resim, sik_E, sik_E_resim, dogru_cevap,
//       kitap_id, unite, konu
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const values = [
//     data.soru_metni,
//     resim_url || null,
//     data.resim_aciklama || null,
//     data.onerge_metni || null,
//     data.onbilgi || null,
//     data.sik_A || null,
//     data.sik_A_resim || null,
//     data.sik_B || null,
//     data.sik_B_resim || null,
//     data.sik_C || null,
//     data.sik_C_resim || null,
//     data.sik_D || null,
//     data.sik_D_resim || null,
//     data.sik_E || null,
//     data.sik_E_resim || null,
//     data.dogru_cevap,
//     data.kitap_id || null,
//     data.unite || null,
//     data.konu || null
//   ];

//   connection.query(query, values, (err, result) => {
//     if (err) {
//       console.error('Soru eklenirken hata:', err);
//       return res.status(500).send('Soru eklenirken hata oluştu.');
//     }
//     res.status(200).json({ message: 'Soru başarıyla eklendi.' });
//   });
// });
app.post('/sorular', upload.single('image'), (req, res) => {
  const data = req.body;
  const resim_url = req.file ? `/uploads/${req.file.filename}` : null;

  // Zorunlu alan kontrolü
  if (!data.soru_metni || !data.dogru_cevap) {
    return res.status(400).json({ error: "Soru metni ve doğru cevap zorunludur." });
  }

  const query = `
    INSERT INTO sorular (
      soru_metni, resim_url, resim_aciklama, onerge_metni, onbilgi,
      sik_A, sik_A_resim, sik_B, sik_B_resim, sik_C, sik_C_resim,
      sik_D, sik_D_resim, sik_E, sik_E_resim, dogru_cevap,
      kitap_id, unite, konu
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.soru_metni,
    resim_url,
    data.resim_aciklama || null,
    data.onerge_metni || null,
    data.onbilgi || null,
    data.sik_A || null,
    data.sik_A_resim || null,
    data.sik_B || null,
    data.sik_B_resim || null,
    data.sik_C || null,
    data.sik_C_resim || null,
    data.sik_D || null,
    data.sik_D_resim || null,
    data.sik_E || null,
    data.sik_E_resim || null,
    data.dogru_cevap,
    data.kitap_id || null,
    data.unite || null,
    data.konu || null,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Soru eklenirken hata:', err);
      return res.status(500).send('Soru eklenirken hata oluştu.');
    }
    res.status(200).json({ message: 'Soru başarıyla eklendi.' });
  });
});



app.post('/soru-eklemeyi-bitir', (req, res) => {
  const { kitap_id, unite, konu } = req.body;

  if (!kitap_id || !unite || !konu) {
    return res.status(400).json({ error: 'Eksik parametreler.' });
  }

  // Var olan test sayısına göre ad belirle
  connection.query('SELECT COUNT(*) AS count FROM testler', (err, results) => {
    if (err) return res.status(500).json({ error: 'Test sayısı alınamadı.' });

    const count = results[0].count + 1;
    const test_adi = `Test ${count}`;

    const insertTestQuery = `
      INSERT INTO testler (kitap_id, unite, konu, test_adi)
      VALUES (?, ?, ?, ?)
    `;

    connection.query(insertTestQuery, [kitap_id, unite, konu, test_adi], (err, result) => {
      if (err) return res.status(500).json({ error: 'Test oluşturulamadı.' });

      const newTestId = result.insertId;

      const updateSorularQuery = `
        UPDATE sorular
        SET test_id = ?
        WHERE kitap_id = ? AND unite = ? AND konu = ? AND test_id IS NULL
      `;

      connection.query(updateSorularQuery, [newTestId, kitap_id, unite, konu], (err) => {
        if (err) return res.status(500).json({ error: 'Sorular güncellenemedi.' });

        res.status(200).json({ message: 'Test oluşturuldu ve sorular bağlandı.', test_id: newTestId });
      });
    });
  });
});






// Artık API'ye dogru_cevap alanı da gönderiliyor! 🚀




// Soruları listele
app.get('/sorular', (req, res) => {
  const query = 'SELECT * FROM sorular';
  
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Veritabanından sorular alınırken hata oluştu.');
    }
    res.status(200).json(results); // Soruları JSON formatında döner
  });
});




/* Kitap ekle
app.post('/kitaplar', (req, res) => {
  const {dersAdi, kategori, sinif, } = req.body;
  const query = 'INSERT INTO kitap (dersAdi, kategori, sinif) VALUES (?, ?, ?)';

  connection.query(query, [dersAdi, kategori, sinif], (err, result) => {
    if (err) {
      return res.status(500).send('Kitap eklenirken hata oluştu.');
    }
    res.status(200).json({ id: result.insertId, dersAdi, kategori, sinif });
  });
});
*/




// Kitap sil
app.delete('/delete-book/:id', (req, res) => {
  const bookId = req.params.id;
  const query = 'DELETE FROM kitap WHERE id = ?';

  connection.query(query, [bookId], (err, result) => {
    if (err) {
      return res.status(500).send('Kitap silinirken hata oluştu.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Kitap bulunamadı.');
    }
    res.status(200).send('Kitap başarıyla silindi!');
  });
});

// Belirli bir kitabın sorularını getirme
app.get('/kitaplar/:id/sorular', (req, res) => {
  const bookId = req.params.id;

  const questionsQuery = 'SELECT * FROM sorular WHERE kitap_id = ?';
  connection.query(questionsQuery, [bookId], (err, questionsResult) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
      return res.status(500).send('Sorular alınırken hata oluştu.');
    }

    if (questionsResult.length === 0) {
      return res.status(404).send('Bu kitaba ait soru bulunamadı.');
    }

    res.status(200).json(questionsResult);
  });
});


app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'istanbul';
  const API_KEY = '9830d4fbccde1327304a47b1feb3867b'; // 👈 senin key burada

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
