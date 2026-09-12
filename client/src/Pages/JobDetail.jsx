import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Briefcase, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../Components/Context/AuthContext';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');


 useEffect(() => {
  async function loadJob() {
    try {
      const data = await apiFetch(`/jobs/${id}`);
      console.log('API response:', data);
      setJob(data.job);
    } catch (error) {                              // parameter name here
      console.log('Fetch error:', error);          // must match here — use "error", not "err"
      setError('This job could not be found.');
    } finally {
      setLoading(false);
    }
  }
  loadJob();
}, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyMessage('');
    try {
      await apiFetch(`/jobs/${id}/apply`, {
        method: 'POST',
        body: JSON.stringify({ resumeUrl }),
      });
      setApplyMessage('Application submitted successfully.');
    } catch (err) {
      setApplyMessage(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#5B5470]">Loading role…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-red-600">{error}</p>
        <Link to="/jobs/listing" className="text-[#6D28D9] font-medium">Back to listings</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#E4E0F0]">
        <div className="max-w-3xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl text-[#17132B]">Jobolio</Link>
          <Link
                    to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
                    className="text-sm font-medium text-[#5B5470] hover:text-[#17132B]"
                  >
                    Dashboard
                  </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <button
          onClick={() => navigate('/jobs/listing')}
          className="inline-flex items-center gap-1.5 text-sm text-[#5B5470] hover:text-[#17132B] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all roles
        </button>

        <h1 className="font-display text-4xl text-[#17132B]">{job.title}</h1>
      

        <div className="mt-4 flex items-center gap-5 text-sm text-[#5B5470]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {job.location}
          </span>
          {job.Salary && (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              ${job.Salary.toLocaleString()}
            </span>
          )}
        </div>

        {job.tag?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tag.map((t) => (
              <span key={t} className="text-xs font-medium text-[#6D28D9] bg-[#F5F3FC] px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        <p className="mt-8 text-[#5B5470] leading-relaxed whitespace-pre-line">{job.description}</p>

        <div className="mt-12 border-t border-[#E4E0F0] pt-8">
          {!user && (
            <p className="text-sm text-[#5B5470]">
              <Link to="/signup/candidate" className="text-[#6D28D9] font-medium">Sign up as a candidate</Link> to apply for this role.
            </p>
          )}

          {user && user.role === 'candidate' && (
            <form onSubmit={handleApply} className="max-w-sm space-y-4">
              <h2 className="font-display text-xl text-[#17132B]">Apply for this role</h2>
              <div>
                <label className="text-sm font-medium text-[#17132B]">Resume link</label>
                <input
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://…"
                  className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9]"
                />
              </div>
              {applyMessage && <p className="text-sm text-[#5B5470]">{applyMessage}</p>}
              <button
                type="submit"
                disabled={applying}
                className="px-7 py-3 bg-[#17132B] text-white font-medium rounded-md hover:bg-[#6D28D9] transition-colors disabled:opacity-50"
              >
                {applying ? 'Submitting…' : 'Submit application'}
              </button>
            </form>
          )}

          {user && user.role === 'employer' && (
            <p className="text-sm text-[#5B5470]">Employers can't apply to roles.</p>
          )}
        </div>
      </main>
    </div>
  );
}

  

export default JobDetail;