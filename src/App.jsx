import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProveedorAuth } from './context/AuthContext';
import { ProveedorToast } from './context/ToastContext';
import Navbar from './components/Navbar';
import RutaProtegida from './components/ProtectedRoute';
import Inicio from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Planes from './pages/Plans';
import Catalogo from './pages/Catalog';
import DetalleLibro from './pages/BookDetail';
import MiBiblioteca from './pages/MyLibrary';
import Perfil from './pages/Profile';
import AdminLibros from './pages/AdminBooks';
import Pago from './pages/Payment';
import HistorialCompras from './pages/PurchaseHistory';
import LectorPdf from './pages/PdfReader';
import NoEncontrado from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ProveedorAuth>
        <ProveedorToast>
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/plans" element={<Planes />} />
              <Route path="/catalog" element={<Catalogo />} />
              <Route path="/books/:id" element={<DetalleLibro />} />
              <Route path="/books/:id/read" element={<RutaProtegida><LectorPdf /></RutaProtegida>} />
              <Route path="/payment/:id" element={<RutaProtegida><Pago /></RutaProtegida>} />
              <Route path="/library" element={<RutaProtegida><MiBiblioteca /></RutaProtegida>} />
              <Route path="/profile" element={<RutaProtegida><Perfil /></RutaProtegida>} />
              <Route path="/purchase-history" element={<RutaProtegida><HistorialCompras /></RutaProtegida>} />
              <Route path="/admin/books" element={<RutaProtegida><AdminLibros /></RutaProtegida>} />
              <Route path="*" element={<NoEncontrado />} />
            </Routes>
          </main>
        </ProveedorToast>
      </ProveedorAuth>
    </BrowserRouter>
  );
}

export default App;
