import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Database, 
  LayoutGrid, 
  PlusCircle, 
  Settings, 
  UserCheck, 
  Key, 
  Lock, 
  AlertTriangle, 
  HelpCircle,
  AlertCircle,
  Plus,
  RefreshCw,
  LogOut,
  Terminal
} from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('login');
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [loginStatus, setLoginStatus] = useState(null); // 'success' | 'fail' | 'loading'
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showSQLHelp, setShowSQLHelp] = useState(true);

  // Catalog State
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [addProductStatus, setAddProductStatus] = useState(null); // 'success' | 'error'

  // Admin State
  const [adminCheckUser, setAdminCheckUser] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Fetch products on tab change
  useEffect(() => {
    if (activeTab === 'catalog') {
      fetchProducts();
    }
  }, [activeTab]);

  // Sync admin check username with logged in user
  useEffect(() => {
    if (loggedInUser) {
      setAdminCheckUser(loggedInUser);
    }
  }, [loggedInUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus('loading');
    
    const endpoint = isVulnerable ? '/auth/login-vulnerable' : '/auth/login-secure';
    
    // Spring Boot @RequestParam expects application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
      
      const result = await response.text();
      
      if (result === 'success') {
        setLoginStatus('success');
        setLoggedInUser(username);
      } else {
        setLoginStatus('fail');
        setLoggedInUser(null);
      }
    } catch (err) {
      console.error(err);
      setLoginStatus('fail');
      setLoggedInUser(null);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername('');
    setPassword('');
    setLoginStatus(null);
    setActiveTab('login');
  };

  const fetchProducts = async () => {
    setCatalogLoading(true);
    try {
      const response = await fetch('/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    
    setAddProductStatus('loading');
    try {
      const response = await fetch('/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProductName,
          price: parseFloat(newProductPrice),
          description: newProductDesc
        }),
      });
      
      if (response.ok) {
        setAddProductStatus('success');
        setNewProductName('');
        setNewProductPrice('');
        setNewProductDesc('');
        fetchProducts();
        setTimeout(() => setAddProductStatus(null), 3000);
      } else {
        setAddProductStatus('error');
      }
    } catch (err) {
      console.error(err);
      setAddProductStatus('error');
    }
  };

  const handleAdminCheck = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    try {
      const response = await fetch(`/admin?username=${encodeURIComponent(adminCheckUser)}`);
      const text = await response.text();
      setAdminResponse(text);
    } catch (err) {
      console.error(err);
      setAdminResponse("Erreur de connexion avec le serveur.");
    } finally {
      setAdminLoading(false);
    }
  };

  // Generate SQL statement visualization based on inputs
  const getSQLQuery = () => {
    if (isVulnerable) {
      return `SELECT * FROM users WHERE username='${username || '[username]'}' AND password='${password || '[password]'}'`;
    } else {
      return `SELECT * FROM users WHERE username = ? AND password = ?\n-- (Exécuté de manière sécurisée via requête préparée avec paramètres : [${username || '?'}, ${password || '?'}] )`;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <Shield className="brand-icon" />
          <div className="brand-text">
            <span className="brand-title">DevSecOps Lab</span>
            <span className="brand-subtitle">SQL Injection & Security Demo</span>
          </div>
        </div>
        <nav className="header-nav">
          <button 
            className={`nav-item ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            <Lock className="nav-icon" /> Connexion
          </button>
          <button 
            className={`nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <LayoutGrid className="nav-icon" /> Catalogue
          </button>
          <button 
            className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <Settings className="nav-icon" /> Admin Panel
          </button>
        </nav>
        {loggedInUser && (
          <div className="user-profile">
            <UserCheck className="profile-icon" />
            <div className="profile-details">
              <span className="profile-name">{loggedInUser}</span>
              <span className="profile-status">Connecté</span>
            </div>
            <button onClick={handleLogout} className="logout-btn" title="Se déconnecter">
              <LogOut className="logout-icon" />
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {activeTab === 'login' && (
          <div className="tab-content login-layout">
            <div className="login-card glass-panel">
              <div className="card-header">
                <h2>Portail d'Authentification</h2>
                <p className="card-subtitle">Testez la robustesse de l'authentification</p>
              </div>

              {/* Mode Toggle */}
              <div className="security-toggle-container">
                <span className="toggle-label">Mode de sécurité :</span>
                <div className="toggle-switch-wrapper">
                  <button 
                    type="button" 
                    className={`toggle-btn vulnerable ${isVulnerable ? 'active' : ''}`}
                    onClick={() => {
                      setIsVulnerable(true);
                      setLoginStatus(null);
                    }}
                  >
                    <ShieldAlert size={16} /> Vulnérable
                  </button>
                  <button 
                    type="button" 
                    className={`toggle-btn secure ${!isVulnerable ? 'active' : ''}`}
                    onClick={() => {
                      setIsVulnerable(false);
                      setLoginStatus(null);
                    }}
                  >
                    <ShieldCheck size={16} /> Sécurisé
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="username">Nom d'utilisateur</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="username" 
                      placeholder="Ex: admin, user, admin' --" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <div className="input-wrapper">
                    <input 
                      type="password" 
                      id="password" 
                      placeholder="Mot de passe" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      // Not required for SQLi demo since SQLi can bypass password check
                      required={!isVulnerable || !username.includes("'")}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isVulnerable ? 'btn-danger' : 'btn-primary'}`}
                  disabled={loginStatus === 'loading'}
                >
                  {loginStatus === 'loading' ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>

              {/* Login Status Alerts */}
              {loginStatus === 'success' && (
                <div className="alert alert-success">
                  <ShieldCheck className="alert-icon" />
                  <div>
                    <strong>Succès !</strong> Authentifié sous le pseudo : <code>{loggedInUser}</code>
                  </div>
                </div>
              )}

              {loginStatus === 'fail' && (
                <div className="alert alert-danger">
                  <AlertCircle className="alert-icon" />
                  <div>
                    <strong>Échec !</strong> Identifiants invalides ou erreur SQL.
                  </div>
                </div>
              )}
            </div>

            {/* SQL Visualizer & Security Inspector */}
            <div className="security-inspector glass-panel">
              <div className="inspector-header">
                <Terminal className="inspector-icon" />
                <h3>Inspecteur de Requêtes SQL</h3>
                <button 
                  onClick={() => setShowSQLHelp(!showSQLHelp)} 
                  className="help-toggle" 
                  title="Aide"
                >
                  <HelpCircle size={16} />
                </button>
              </div>

              <div className="sql-box">
                <div className="sql-box-header">
                  <span className="sql-title">Requête générée au niveau du Backend :</span>
                  <span className={`sql-badge ${isVulnerable ? 'badge-danger' : 'badge-success'}`}>
                    {isVulnerable ? 'VULNÉRABLE (Concaténation)' : 'SÉCURISÉ (Requête Préparée)'}
                  </span>
                </div>
                <pre className="sql-code">
                  <code>{getSQLQuery()}</code>
                </pre>
              </div>

              {showSQLHelp && (
                <div className="security-educational-info">
                  <h4>💡 Conseils pour le Test d'Injection SQL :</h4>
                  <ul>
                    <li>
                      <strong>Concept :</strong> En mode <em>Vulnérable</em>, les variables du formulaire sont directement collées dans la requête SQL sans nettoyage.
                    </li>
                    <li>
                      <strong>Attaque par contournement :</strong> Tapez <code>admin' --</code> dans le champ <em>Nom d'utilisateur</em> et laissez le mot de passe vide. La requête SQL résultante commentera le reste de la vérification du mot de passe.
                    </li>
                    <li>
                      <strong>Résultat :</strong> Vous devriez être authentifié instantanément en tant qu'admin !
                    </li>
                    <li>
                      <strong>Vérification de sécurité :</strong> Basculez en mode <em>Sécurisé</em> et réessayez la même attaque. Le backend utilisera une requête préparée et l'attaque échouera car la chaîne sera traitée comme une simple valeur littérale.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="tab-content catalog-layout">
            {/* Add Product Form */}
            <div className="add-product-card glass-panel">
              <div className="card-header">
                <h2>Ajouter un Produit</h2>
                <p className="card-subtitle">Enregistrez un nouveau produit dans la base de données</p>
              </div>
              <form onSubmit={handleAddProduct} className="catalog-form">
                <div className="form-group">
                  <label htmlFor="prod-name">Nom du produit</label>
                  <input 
                    type="text" 
                    id="prod-name"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Ex: Laptop Pro" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prod-price">Prix (€)</label>
                  <input 
                    type="number" 
                    id="prod-price"
                    step="0.01"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="Ex: 1299.99" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prod-desc">Description</label>
                  <textarea 
                    id="prod-desc"
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    placeholder="Description du produit..."
                    rows={3}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="submit-btn btn-primary"
                  disabled={addProductStatus === 'loading'}
                >
                  <Plus size={16} /> Ajouter au catalogue
                </button>
              </form>

              {addProductStatus === 'success' && (
                <div className="alert alert-success mt-4">
                  <ShieldCheck className="alert-icon" />
                  <div>Produit ajouté avec succès !</div>
                </div>
              )}
              {addProductStatus === 'error' && (
                <div className="alert alert-danger mt-4">
                  <AlertCircle className="alert-icon" />
                  <div>Erreur lors de la création du produit.</div>
                </div>
              )}
            </div>

            {/* Product List */}
            <div className="product-list-container glass-panel">
              <div className="list-header">
                <div>
                  <h2>Catalogue Produits</h2>
                  <p className="card-subtitle">Produits enregistrés en base MySQL</p>
                </div>
                <button onClick={fetchProducts} className="refresh-btn" title="Rafraîchir le catalogue">
                  <RefreshCw size={16} className={catalogLoading ? 'spin' : ''} />
                </button>
              </div>

              {catalogLoading ? (
                <div className="catalog-loading">Chargement des produits...</div>
              ) : products.length === 0 ? (
                <div className="catalog-empty">
                  <Database size={40} className="empty-icon" />
                  <p>Aucun produit en base de données.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <span className="product-price">{product.price.toFixed(2)} €</span>
                      </div>
                      <p className="product-desc">{product.description || 'Aucune description disponible.'}</p>
                      <div className="product-footer">
                        <span className="product-id">ID: {product.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="tab-content admin-layout">
            <div className="admin-card glass-panel">
              <div className="card-header">
                <h2>Espace Administration</h2>
                <p className="card-subtitle">Seuls les comptes ayant le rôle <code>ADMIN</code> ont accès.</p>
              </div>

              <div className="alert alert-warning">
                <AlertTriangle className="alert-icon" />
                <div>
                  <strong>Sécurité du panneau :</strong> L'accès est contrôlé par la route <code>/admin?username=...</code> qui effectue une vérification du rôle de l'utilisateur spécifié dans la base de données.
                </div>
              </div>

              <form onSubmit={handleAdminCheck} className="admin-check-form">
                <div className="form-group">
                  <label htmlFor="admin-check-user">Vérifier les droits pour l'utilisateur :</label>
                  <div className="input-row">
                    <input 
                      type="text" 
                      id="admin-check-user" 
                      placeholder="Nom de l'utilisateur à vérifier" 
                      value={adminCheckUser}
                      onChange={(e) => setAdminCheckUser(e.target.value)}
                      required
                    />
                    <button 
                      type="submit" 
                      className="submit-btn btn-primary"
                      disabled={adminLoading}
                    >
                      {adminLoading ? 'Vérification...' : 'Interroger le Serveur'}
                    </button>
                  </div>
                </div>
              </form>

              {adminResponse && (
                <div className={`admin-result-console ${adminResponse.includes('Bienvenue') ? 'success' : 'denied'}`}>
                  <div className="console-header">
                    <span className="console-dot red"></span>
                    <span className="console-dot yellow"></span>
                    <span className="console-dot green"></span>
                    <span className="console-title">Console de validation de privilèges</span>
                  </div>
                  <div className="console-body">
                    <div className="console-line">
                      <span className="prompt">$</span> curl http://localhost:8080/admin?username={adminCheckUser}
                    </div>
                    <div className="console-line response">
                      {adminResponse}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Projet DevSecOps - Démo Vulnérabilité Injection SQL & Pipelines CI/CD</p>
      </footer>
    </div>
  );
}

export default App;
