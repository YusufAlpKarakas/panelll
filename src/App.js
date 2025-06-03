import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import KitapForm from './components/KitapForm';
import KitapList from './pages/KitapList';
import KitapListDetay from './pages/KitapListDetay';
import KitapDetay from './pages/KitapDetay';
import Login from './pages/Login'
import SoruForm from './components/SoruForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kitap-ekle" element={<KitapForm />} />
        <Route path="/kitap-listesi" element={<KitapList />} />
        <Route path="/kitap/:id" element={<KitapListDetay />} />  {/* Dinamik rota */}
        <Route path="/kitaplar/:id" element={<KitapDetay />} />
        <Route path="/kitaplar/:kitapId" element={<SoruForm />} />
        <Route path="/soru-ekle/:kitapId/:uniteAdi/:konuAdi" element={<SoruForm />} />
      </Routes>
    </Router>
  );
};

export default App;
