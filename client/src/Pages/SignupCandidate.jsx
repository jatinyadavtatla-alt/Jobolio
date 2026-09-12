import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupCandidate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3002/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, role: 'candidate' }),
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
      <div className="flex items-center justify-center p-10 order-2 md:order-1">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-[#17132B]">Find your next role</h1>
          <p className="text-[#5B5470] mt-2 text-sm">Create a candidate account to start applying.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-[#17132B]">Full name</label>
              <input
                name="name" type="text" required value={form.name} onChange={handleChange}
                className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#2F6FED]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#17132B]">Email</label>
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#2F6FED]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#17132B]">Password</label>
              <input
                name="password" type="password" required value={form.password} onChange={handleChange}
                className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#2F6FED]"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-[#2F6FED] text-white font-medium rounded-md hover:bg-[#6D28D9] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create candidate account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#5B5470] text-center">
            Hiring instead?{' '}
            <Link to="/signup/employer" className="text-[#2F6FED] font-medium">Sign up as an employer</Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex flex-col justify-between bg-[#F5F3FC] p-12 order-1 md:order-2">
        <Link to="/" className="font-display text-2xl">Jobolio</Link>
        <div>
          <p className="font-display text-3xl leading-snug text-[#17132B]">
            "Applied on Monday, interviewing by Thursday."
          </p>
          <p className="mt-4 text-sm text-[#5B5470]">Candidate, hired via Jobolio</p>
        </div>
        <span className="text-sm text-[#5B5470]">For candidates</span>
      </div>
    </div>
  );
}

export default SignupCandidate;