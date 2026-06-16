import { useState, useEffect } from 'react';
import './index.css';
import type { User } from './types';

const translations = {
  es: {
    title: "Directorio Compacto",
    subtitle: "Gestiona tus conexiones con un diseño eficiente y profesional.",
    searchPlaceholder: "Buscar por nombre, correo, teléfono, empresa...",
    allGenders: "Todos los géneros",
    allCountries: "Todos los países",
    allJobs: "Todos los puestos",
    loading: "Cargando...",
    noResults: 'No se encontraron profesionales para',
    phone: "Teléfono",
    job: "Cargo",
    email: "Email",
    company: "Empresa",
    location: "Ubicación",
    gender: "Género",
    dob: "Nacimiento",
    cell: "Celular",
    map: "Mapa",
    notSpecified: "No especificado",
    professional: "Profesional",
    genders: {
      male: "Masculino",
      female: "Femenino",
      nonbinary: "No binario",
    } as Record<string, string>
  }
};

function App() {
  const t = translations.es;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const uniqueGenders = Array.from(new Set(users.map(u => u.gender).filter(Boolean)));
  const uniqueCountries = Array.from(new Set(users.map(u => u.country).filter(Boolean)));
  const uniqueJobs = Array.from(new Set(users.map(u => u.job).filter(Boolean))).sort();

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();

    const matchGender = selectedGender === '' || user.gender === selectedGender;
    const matchCountry = selectedCountry === '' || user.country === selectedCountry;
    const matchJob = selectedJob === '' || user.job === selectedJob;

    // Búsqueda general en todos los campos visibles relevantes
    const matchSearch = (
      user.full_name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term) ||
      user.city?.toLowerCase().includes(term) ||
      user.country?.toLowerCase().includes(term) ||
      user.company?.toLowerCase().includes(term) ||
      user.job?.toLowerCase().includes(term) ||
      user.dob?.toLowerCase().includes(term) ||
      user.cell?.toLowerCase().includes(term)
    );

    return matchGender && matchCountry && matchJob && matchSearch;
  });
  const formatPhone = (phone: string) => {
    if (!phone) return '';
    // Quitamos la extensión si la hay
    const mainPhone = phone.split(/x/i)[0].trim();

    // Extraemos solo los números
    const digits = mainPhone.replace(/\D/g, '');

    // Formato (XXX) XXX-XXXX para 10 dígitos
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    // Formato +1 (XXX) XXX-XXXX para 11 dígitos que empiecen en 1
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    // Si no coincide, retornamos el número limpio sin la extensión
    return mainPhone;
  };

  const getAvatarUrl = (user: User) => {
    // Solo bloqueamos servicios de "placeholders" que muestran texto/cajas grises.
    if (!user.avatar || user.avatar.includes('placehold') || user.avatar.includes('dummyimage')) {
      return "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%239CA3AF%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%2F%3E%3C%2Fsvg%3E";
    }
    return user.avatar;
  };

  const formatGender = (g?: string) => {
    if (!g) return t.notSpecified;
    return t.genders[g.toLowerCase()] || g;
  };

  return (
    <div className="dashboard-layout">
      {/* Contenido Principal */}
      <div className="main-wrapper">

        <main className="main-content">
          <div className="header-compact">
            <div className="header-compact-left">
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
            </div>
          </div>

          <div className="search-container">
            <div className="search-filters-container">
              <div className="search-input-wrapper">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filters-wrapper">
                <select
                  className="filter-select"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="">{t.allGenders}</option>
                  {uniqueGenders.map(gender => (
                    <option key={gender} value={gender}>{formatGender(gender)}</option>
                  ))}
                </select>

                <select
                  className="filter-select"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">{t.allCountries}</option>
                  {uniqueCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>

                <select
                  className="filter-select"
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <option value="">{t.allJobs}</option>
                  {uniqueJobs.map(job => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <div className="loader-text">{t.loading}</div>
            </div>
          ) : (
            <div className="user-list">
              {filteredUsers.length === 0 ? (
                <div className="no-results">{t.noResults} "{searchTerm}"</div>
              ) : (
                filteredUsers.map((user) => {
                  return (
                    <div key={user.id} className="user-card-horizontal" onClick={() => setSelectedUser(user)}>
                      <div className="card-left">
                        <img
                          src={getAvatarUrl(user)}
                          alt={`Foto de ${user.full_name}`}
                          className="avatar-compact"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%239CA3AF%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%2F%3E%3C%2Fsvg%3E";
                          }}
                        />
                        <div className="user-info-compact">
                          <div className="name-row">
                            <h2>{user.full_name}</h2>
                          </div>
                          <span className="job-compact">{user.job || t.professional}</span>
                          <span className="company-compact">{user.company || t.company}</span>
                        </div>
                      </div>

                      <div className="card-right">
                        <div className="actions-compact">
                          <a href={`mailto:${user.email}`} className="action-icon" title="Email" onClick={(e) => e.stopPropagation()}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                          </a>
                          <a href={`tel:${user.phone}`} className="action-icon" title="Teléfono" onClick={(e) => e.stopPropagation()}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                          </a>
                          <a href={user.url || '#'} target="_blank" rel="noreferrer" className="action-icon" title="Mensaje" onClick={(e) => e.stopPropagation()}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                          </a>
                        </div>
                        <svg className="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
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
          <div className="modal-content-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="modal-close-btn" onClick={() => setSelectedUser(null)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <div className="modal-avatar-wrapper">
                <img
                  src={getAvatarUrl(selectedUser)}
                  alt={`Foto de ${selectedUser.full_name}`}
                  className="modal-avatar-circle"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%239CA3AF%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%2F%3E%3C%2Fsvg%3E";
                  }}
                />
              </div>
              <div className="modal-title-area">
                <h2>{selectedUser.full_name}</h2>
                <div className="modal-subtitle">
                  <span className="modal-job">{selectedUser.job || t.professional}</span>
                  <span className="modal-dot-separator">•</span>
                  <span className="modal-company">{selectedUser.company || t.notSpecified}</span>
                </div>
              </div>

              <div className="modal-actions-centered">
                <a href={`mailto:${selectedUser.email}`} className="action-icon" title="Email" onClick={(e) => e.stopPropagation()}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </a>
                <a href={`tel:${selectedUser.phone}`} className="action-icon" title="Teléfono" onClick={(e) => e.stopPropagation()}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </a>
              </div>
            </div>

            <div className="modal-body">

              <div className="modal-grid-details">
                {/* Teléfono */}
                <div className="modal-detail-item">
                  <div className="modal-icon-bg">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div className="modal-detail-text">
                    <span className="detail-label">{t.phone}</span>
                    <span className="detail-value">{formatPhone(selectedUser.phone)}</span>
                  </div>
                </div>

                {/* Celular */}
                <div className="modal-detail-item">
                  <div className="modal-icon-bg">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="modal-detail-text">
                    <span className="detail-label">{t.cell}</span>
                    <span className="detail-value">{formatPhone(selectedUser.cell || '')}</span>
                  </div>
                </div>


                {/* Cargo */}
                <div className="modal-detail-item">
                  <div className="modal-icon-bg">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="modal-detail-text">
                    <span className="detail-label">{t.job}</span>
                    <span className="detail-value">{selectedUser.job || t.notSpecified}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="modal-detail-item">
                  <div className="modal-icon-bg">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="modal-detail-text">
                    <span className="detail-label">{t.email}</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                </div>

                {/* Empresa */}
                <div className="modal-detail-item">
                  <div className="modal-icon-bg">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                  <div className="modal-detail-text">
                    <span className="detail-label">{t.company}</span>
                    <span className="detail-value">{selectedUser.company || t.notSpecified}</span>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="modal-detail-item">
                  <div className="modal-icon-bg">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div className="modal-detail-text">
                    <span className="detail-label">{t.location}</span>
                    <span className="detail-value">{selectedUser.city ? `${selectedUser.city}, ` : ''}{selectedUser.country}</span>
                  </div>
                </div>

                {/* Género */}
                <div className="modal-detail-item">
                  <div className="modal-icon-bg">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <div className="modal-detail-text">
                    <span className="detail-label">{t.gender}</span>
                    <span className="detail-value" style={{ textTransform: 'capitalize' }}>{formatGender(selectedUser.gender)}</span>
                  </div>
                </div>


                {/* Fecha de Nacimiento */}
                <div className="modal-detail-item">
                  <div className="modal-icon-bg">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="modal-detail-text">
                    <span className="detail-label">{t.dob}</span>
                    <span className="detail-value">{selectedUser.dob || t.notSpecified}</span>
                  </div>
                </div>
              </div>

              {/* Mapa de Ubicación */}
              {selectedUser.latitude && selectedUser.longitude && (
                <div className="modal-map-container" style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>{t.map}</h3>
                  <iframe
                    title="Mapa de Ubicación"
                    width="100%"
                    height="200"
                    style={{ border: 0, borderRadius: '12px' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${selectedUser.latitude},${selectedUser.longitude}&z=10&output=embed`}
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
