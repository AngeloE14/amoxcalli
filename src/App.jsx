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
import LeerLibro from './pages/ReadBook';
import MiBiblioteca from './pages/MyLibrary';
import MisResenas from './pages/MyReviews';
import Perfil from './pages/Profile';
import AdminLibros from './pages/AdminBooks';
import EstadoSuscripcion from './pages/SubscriptionStatus';
import Pago from './pages/Payment';
import HistorialCompras from './pages/PurchaseHistory';
import Favoritos from './pages/Favorites';
import ListaDeseos from './pages/Wishlist';
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
              <Route path="/books/:id/read" element={<RutaProtegida><LeerLibro /></RutaProtegida>} />
              <Route path="/payment/:id" element={<RutaProtegida><Pago /></RutaProtegida>} />
              <Route path="/library" element={<RutaProtegida><MiBiblioteca /></RutaProtegida>} />
              <Route path="/favorites" element={<RutaProtegida><Favoritos /></RutaProtegida>} />
              <Route path="/wishlist" element={<RutaProtegida><ListaDeseos /></RutaProtegida>} />
              <Route path="/my-reviews" element={<RutaProtegida><MisResenas /></RutaProtegida>} />
              <Route path="/profile" element={<RutaProtegida><Perfil /></RutaProtegida>} />
              <Route path="/subscription" element={<RutaProtegida><EstadoSuscripcion /></RutaProtegida>} />
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
