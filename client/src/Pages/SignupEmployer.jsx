import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Components/Context/AuthContext';


function SignupEmployer() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); 
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, role: 'employer' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-[#17132B] text-white p-12">
        <Link to="/" className="font-display text-2xl">Jobolio</Link>
        <div>
          <p className="font-display text-3xl leading-snug">
            "We filled two senior roles in under three weeks."
          </p>
          <p className="mt-4 text-sm text-[#B8B2D6]">Aster Studio, hiring manager</p>
        </div>
        <span className="text-sm text-[#B8B2D6]">For employers</span>
      </div>

      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-[#17132B]">Post your first role</h1>
          <p className="text-[#5B5470] mt-2 text-sm">Create an employer account to start hiring.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-[#17132B]">Company or your name</label>
              <input
                name="name" type="text" required value={form.name} onChange={handleChange}
                className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#17132B]">Work email</label>
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
              {loading ? 'Creating account…' : 'Create employer account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#5B5470] text-center">
            Looking for work instead?{' '}
            <Link to="/signup/candidate" className="text-[#6D28D9] font-medium">Sign up as a candidate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupEmployer;