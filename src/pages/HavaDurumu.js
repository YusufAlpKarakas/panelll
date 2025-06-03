// App.jsx
import React, { useState } from 'react';
import axios from 'axios';

const HavaDurumu = () => {
  const [city, setCity] = useState('istanbul');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    setWeather(null);

    const API_KEY = "9830d4fbccde1327304a47b1feb3867b";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (error) {
      setError("Şehir bulunamadı veya API hatası oluştu.");
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Hava Durumu</h1>

      <input
        type="text"
        placeholder="Şehir girin (örn. ankara)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />
      <button onClick={fetchWeather}>Getir</button>

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "1rem" }}>
          <p>📍 Şehir: {weather.name}</p>
          <p>🌡️ Sıcaklık: {weather.main.temp}°C</p>
          <p>☁️ Durum: {weather.weather[0].description}</p>
          <p>💨 Rüzgar: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default HavaDurumu;
