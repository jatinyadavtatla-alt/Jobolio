import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    const res = await fetch('http://localhost:3002/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');

    if (data.user.role === 'employer') {
  navigate('/employer/dashboard');
    } else {
  navigate('/candidate/dashboard');
  }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display text-2xl text-[#17132B]">Jobolio</Link>

        <h1 className="font-display text-3xl text-[#17132B] mt-8">Welcome back</h1>
        <p className="text-[#5B5470] mt-2 text-sm">Log in to your account.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-[#17132B]">Email</label>
            <input
              name="email" type="email" required value={form.email} onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#17132B]">Password</label>
            <input
              name="password" type="password" required value={form.password} onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-[#17132B] text-white font-medium rounded-md hover:bg-[#6D28D9] transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#5B5470] text-center">
  New to Jobolio?{' '}
  <Link to="/signup/candidate" className="text-[#6D28D9] font-medium">Sign up as candidate</Link>
  {' '}or{' '}
  <Link to="/signup/employer" className="text-[#6D28D9] font-medium">as employer</Link>
</p>
      </div>
    </div>
  );
}

export default Login;