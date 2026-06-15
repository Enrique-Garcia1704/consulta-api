import { useState, useEffect } from 'react';
import './index.css';
import type { User } from './types';
// Ya no necesitamos el JSON local, usaremos la API real

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="dashboard-layout">
      {/* Overlay del Sidebar para móviles */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar Izquierdo */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="network-info">
          <div className="network-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h3>Network</h3>
        </div>
        <p className="network-subtitle">Directorio Verificado</p>

        <button className="btn-new-contact">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Nuevo Contacto
        </button>

        <div className="sidebar-menu">
          <div className="menu-item active">
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Todos los contactos
          </div>
          <div className="menu-item">
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            Favoritos
          </div>
          <div className="menu-item">
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Recientes
          </div>
          <div className="menu-item">
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Equipos
          </div>
          <div className="menu-item">
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            Directorio
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="main-wrapper">
        <nav className="top-navbar">
          <div className="nav-left">
            <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div className="logo">MyDirectory</div>
            <div className="nav-links">
              <span className="nav-link active">Directorio</span>
              <span className="nav-link">Equipos</span>
              <span className="nav-link">Recientes</span>
            </div>
          </div>
          <div className="nav-right">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <div className="nav-avatar"></div>
          </div>
        </nav>

        <main className="main-content">
          <header>
            <h1>Directorio</h1>
            <p>Gestion del personal.</p>
          </header>

          <div className="search-container">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              placeholder="Buscar contactos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <div className="loader-text">Cargando...</div>
            </div>
          ) : (
            <div className="user-grid">
              {filteredUsers.length === 0 ? (
                <div className="no-results">No se encontraron profesionales para "{searchTerm}"</div>
              ) : (
                filteredUsers.map((user) => {
                  const tags = [];
                  if (user.company) tags.push(user.company.substring(0, 15));
                  if (user.city) tags.push(user.city);

                  const statusColors = ['status-green', 'status-grey', 'status-orange'];
                  const statusClass = statusColors[user.full_name.length % 3];

                  return (
                    <div key={user.id} className="user-card" onClick={() => setSelectedUser(user)}>
                      <div className="avatar-container">
                        <div className="avatar-ring">
                          <img
                            src={user.avatar}
                            alt={`Foto de ${user.full_name}`}
                            className="avatar"
                            onError={(e) => {
                              e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.full_name) + "&background=random";
                            }}
                          />
                        </div>
                        <div className={`status-dot ${statusClass}`}></div>
                      </div>

                      <div className="user-info">
                        <h2>{user.full_name}</h2>
                        <span className="job">{user.job || 'Profesional'}</span>
                      </div>

                      <div className="tags">
                        {tags.map((tag, i) => (
                          <span key={i} className="tag">{tag}</span>
                        ))}
                      </div>

                      <hr className="divider" />

                      <div className="actions">
                        <a href={`mailto:${user.email}`} className="action-icon" title="Email">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </a>
                        <a href={`tel:${user.phone}`} className="action-icon" title="Teléfono">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                        </a>
                        <a href={user.url || '#'} target="_blank" rel="noreferrer" className="action-icon" title="Mensaje">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL DEL CONTACTO */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedUser(null)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="modal-image-container">
              <img 
                src={selectedUser.avatar} 
                alt={`Foto de ${selectedUser.full_name}`} 
                className="modal-image"
                onError={(e) => {
                  e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedUser.full_name) + "&background=random";
                }}
              />
              <div className="modal-badge">
                <span className="modal-badge-dot"></span> Active
              </div>
              <div className="modal-floating-actions">
                <button className="modal-btn-circle" onClick={() => window.location.href = `mailto:${selectedUser.email}`} title="Email">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </button>
                <button className="modal-btn-circle" onClick={() => window.location.href = `tel:${selectedUser.phone}`} title="Llamar">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </button>
              </div>
            </div>
            
            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label detail-title">{selectedUser.full_name}</span>
                <span className="detail-value">{selectedUser.city}, {selectedUser.country}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Teléfono:</span>
                <span className="detail-value">{selectedUser.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Cargo:</span>
                <span className="detail-value">{selectedUser.job || 'No especificado'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Empresa:</span>
                <span className="detail-value">{selectedUser.company || 'No especificada'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Zona Horaria:</span>
                <span className="detail-value">{selectedUser.timezone}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
