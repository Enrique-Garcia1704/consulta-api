import { useState, useEffect } from 'react';
import './index.css';
import type { User } from './types';
// Ya no necesitamos el JSON local, usaremos la API real

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Llamada a la API real
    const loadUsers = async () => {
      try {
        const response = await fetch('https://api.api-ninjas.com/v2/randomuser', {
          headers: {
            'X-Api-Key': import.meta.env.VITE_API_KEY
          }
        });

        if (!response.ok) {
          throw new Error('Error al conectar con la API');
        }

        const data = await response.json();
        
        // Procesamos los datos reales provenientes de la API
        if (Array.isArray(data)) {
          setUsers(data as User[]);
        } else if (data && data.error) {
          console.error('Error de API:', data.error);
          setUsers([]);
        } else if (data) {
          // Si la API devuelve solo un usuario (un objeto), lo metemos en un arreglo
          setUsers([data as User]);
        }
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    // Búsqueda general en todos los campos visibles relevantes
    return (
      user.full_name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term) ||
      user.city?.toLowerCase().includes(term) ||
      user.country?.toLowerCase().includes(term) ||
      user.company?.toLowerCase().includes(term) ||
      user.job?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="app-container">
      <header>
        <h1>Directorio de Profesionales</h1>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar por nombre, empresa, ciudad, teléfono..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      {loading ? (
        <div className="loader">Obteniendo información...</div>
      ) : (
        <div className="user-grid">
          {filteredUsers.length === 0 ? (
            <div className="no-results">No se encontraron profesionales para "{searchTerm}"</div>
          ) : (
            filteredUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="card-header">
                {/* Fallback por si la imagen falla */}
                <img
                  src={user.avatar}
                  alt={`Foto de ${user.full_name}`}
                  className="avatar"
                  onError={(e) => {
                    e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.full_name) + "&background=random";
                  }}
                />
                <div className="user-info">
                  <h2>{user.full_name}</h2>
                  <span className="job">{user.job}</span>
                </div>
              </div>
              <div className="card-body">
                <p>
                  <strong>Email</strong>
                  <a href={`mailto:${user.email}`} className="link">{user.email}</a>
                </p>
                <p>
                  <strong>Teléfono</strong>
                  {user.phone}
                </p>
                <p>
                  <strong>Ubicación</strong>
                  <span>{user.city}, {user.country}</span>
                </p>
                <p>
                  <strong>Zona Horaria</strong>
                  {user.timezone}
                </p>
                <p>
                  <strong>Compañía</strong>
                  {user.company}
                </p>
              </div>
              <div className="card-footer">
                <a href={user.url} target="_blank" rel="noreferrer" className="btn-website">
                  Visitar Sitio Web
                </a>
              </div>
            </div>
          )))}
        </div>
      )}
    </div>
  );
}

export default App;
