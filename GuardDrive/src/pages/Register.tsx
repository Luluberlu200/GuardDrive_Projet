import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmpty =
    name.trim() === '' ||
    email.trim() === '' ||
    password.trim() === '' ||
    confirmPassword.trim() === '';

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Nom requis'); return; }
    if (!email.trim()) { setError('Email requis'); return; }
    if (!validateEmail(email)) { setError("Format d'email invalide"); return; }
    if (!password.trim()) { setError('Mot de passe requis'); return; }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères'); return; }
    if (!confirmPassword.trim()) { setError('Confirmation requise'); return; }
    if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = register(name, email, password);

    if (success) {
      navigate('/login');
    } else {
      setError('Cet email est déjà utilisé');
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1 className="auth-page__logo">GuardDrive</h1>
        <p className="auth-page__subtitle">Créez votre compte en quelques secondes</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h2 className="auth-form__title">Inscription</h2>

        <div className="auth-form__field">
          <label htmlFor="name" className="auth-form__label">Nom</label>
          <input
            id="name"
            type="text"
            className="auth-form__input"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

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
              autoComplete="new-password"
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

        <div className="auth-form__field">
          <label htmlFor="confirmPassword" className="auth-form__label">Confirmation du mot de passe</label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            className="auth-form__input"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        {error && <p className="auth-form__error">{error}</p>}

        <button
          type="submit"
          className="auth-form__submit"
          disabled={isEmpty || loading}
        >
          {loading ? <span className="auth-form__loader" /> : "Créer mon compte"}
        </button>
      </form>

      <p className="auth-page__footer">
        Déjà un compte ?{' '}
        <Link to="/login" className="auth-page__link">Se connecter</Link>
      </p>
    </div>
  );
}
