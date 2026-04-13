import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';


function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

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
      <header className="auth-logo">
        <img src="/logo.png" alt="GuardDrive" className="auth-logo__shield" />
        <div className="auth-logo__wordmark">
          <h1 className="auth-logo__name">GuardDrive</h1>
          <p className="auth-logo__tagline">Surveillance automobile</p>
        </div>
      </header>

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
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
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
