import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

            if (user) {
                if (user.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }

        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            const user = await loginWithGoogle();
            if (user?.isAdmin) {
                navigate('/admin');
            } else {
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            console.error('Google sign-in error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled.');
            } else if (err.code === 'auth/unauthorized-domain') {
                setError('Domain not authorized. Please add this domain in Firebase Console.');
            } else {
                setError(err.message || 'Google sign-in failed. Please try again.');
            }
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Login to your Vatsalya account</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        onClick={handleGoogleSignIn}
                        className="btn btn-google"
                        disabled={loading}
                        type="button"
                    >
                        <span className="google-icon">G</span>
                        Continue with Google
                    </button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
