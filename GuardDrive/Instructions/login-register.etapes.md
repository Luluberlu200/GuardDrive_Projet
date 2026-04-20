# Étapes de développement — Login & Register

## Fichiers à modifier / créer

| Fichier | Action |
|---|---|
| `src/pages/Login.tsx` | Modifier |
| `src/pages/Register.tsx` | Modifier |
| `src/styles/auth.css` | Créer |

> Ne pas toucher : `App.tsx`, `main.tsx`, `AuthLayout.tsx`, `layout.css`

---

## Étape 1 — Imports à mettre en tête de fichier

```tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
```

---

## Étape 2 — États locaux (dans la fonction)

**Login :**
```tsx
const navigate = useNavigate();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
```

**Register (ajouter en plus) :**
```tsx
const [confirmPassword, setConfirmPassword] = useState('');
```

---

## Étape 3 — Fonction handleSubmit

**Login :**
```tsx
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!email || !password) {
    setError('Remplis tous les champs.');
    return;
  }
  // TODO : appel API auth
  navigate('/dashboard');
}
```

**Register :**
```tsx
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!email || !password || !confirmPassword) {
    setError('Remplis tous les champs.');
    return;
  }
  if (password !== confirmPassword) {
    setError('Les mots de passe ne correspondent pas.');
    return;
  }
  // TODO : appel API register
  navigate('/login');
}
```

---

## Étape 4 — JSX à retourner

**Login :**
```tsx
return (
  <div className="auth-page">
    <h1 className="auth-title">GuardDrive</h1>
    <p className="auth-subtitle">Connecte-toi à ton véhicule</p>

    <form onSubmit={handleSubmit} className="auth-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="auth-error">{error}</p>}
      <button type="submit">Se connecter</button>
    </form>

    <Link to="/register" className="auth-link">
      Pas de compte ? S'inscrire
    </Link>
  </div>
);
```

**Register (ajouter le champ confirmPassword avant le bouton) :**
```tsx
<input
  type="password"
  placeholder="Confirmer le mot de passe"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
/>
```
Et changer le bouton en `S'inscrire` et le lien en :
```tsx
<Link to="/login" className="auth-link">
  Déjà un compte ? Se connecter
</Link>
```

---

## Étape 5 — Créer src/styles/auth.css

```css
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  gap: 16px;
}

.auth-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: #f5f7fb;
}

.auth-subtitle {
  margin: 0;
  color: #94a3b8;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(100%, 380px);
}

.auth-form input {
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.6);
  color: #f5f7fb;
  font-size: 1rem;
  outline: none;
}

.auth-form input:focus {
  border-color: #ec4899;
}

.auth-form button {
  margin-top: 4px;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ec4899, #f472b6);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}

.auth-error {
  color: #f87171;
  font-size: 0.875rem;
  margin: 0;
}

.auth-link {
  color: #94a3b8;
  font-size: 0.9rem;
  text-decoration: none;
}

.auth-link:hover {
  color: #ec4899;
}
```

---

## Résumé de l'ordre d'exécution

1. Créer `src/styles/auth.css`
2. Compléter `Login.tsx` (imports → états → handleSubmit → JSX)
3. Compléter `Register.tsx` (idem + champ confirmPassword)
4. Tester sur `http://localhost:8000/login` et `/register`
