import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmpty = email.trim() === '' || password.trim() === '';

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Format d\'email invalide');
      return;
    }

    setLoading(true);

    // Simule un délai réseau (comme si on appelait un vrai serveur)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = login(email, password);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Identifiants invalides');
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1 className="auth-page__logo">GuardDrive</h1>
        <p className="auth-page__subtitle">Surveillez votre véhicule à distance</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h2 className="auth-form__title">Connexion</h2>

        <div className="auth-form__field">
          <label htmlFor="email" className="auth-form__label">Email</label>
          <input
            id="email"
            type="email"
            className="auth-form__input"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="password" className="auth-form__label">Mot de passe</label>
          <div className="auth-form__input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-form__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-form__toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {error && <p className="auth-form__error">{error}</p>}

        <button
          type="submit"
          className="auth-form__submit"
          disabled={isEmpty || loading}
        >
          {loading ? <span className="auth-form__loader" /> : 'Se connecter'}
        </button>
      </form>

      <p className="auth-page__footer">
        Pas encore de compte ?{' '}
        <Link to="/register" className="auth-page__link">Créer un compte</Link>
      </p>
    </div>
  );
}
