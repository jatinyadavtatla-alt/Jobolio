import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Search } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../Components/Context/AuthContext';
function JobListing() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const { user } = useAuth();
  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/jobs');
      setJobs(data.jobs);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(query.toLowerCase()) ||
    job.location.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#5B5470]">Loading roles…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-white">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadJobs}
          className="px-6 py-3 bg-[#17132B] text-white font-medium rounded-md hover:bg-[#6D28D9] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
       <header className="border-b border-[#E4E0F0]">
    <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
      <Link to="/" className="font-display text-2xl text-[#17132B]">Jobolio</Link>
      {user ? (
        <Link
          to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
          className="text-sm font-medium text-[#5B5470] hover:text-[#17132B]"
        >
          Dashboard
        </Link>
      ) : (
        <Link to="/login" className="text-sm font-medium text-[#5B5470] hover:text-[#17132B]">Log in</Link>
      )}
    </div>
  </header>
      <main className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="font-display text-4xl text-[#17132B]">Open roles</h1>
        <p className="mt-2 text-[#5B5470]">{filteredJobs.length} role{filteredJobs.length !== 1 ? 's' : ''} available right now.</p>

        <div className="mt-8 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B5470]" />
          <input
            type="text"
            placeholder="Search by title or location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9] text-sm"
          />
        </div>

        <div className="mt-8 space-y-4">
          {filteredJobs.length === 0 && (
            <p className="text-[#5B5470] text-sm">No roles match your search.</p>
          )}

          {filteredJobs.map((job) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="block bg-white border border-[#E4E0F0] rounded-lg p-6 shadow-sm hover:border-[#6D28D9] transition-colors"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="font-medium text-lg text-[#17132B]">{job.title}</h2>
                  <div className="mt-2 flex items-center gap-4 text-sm text-[#5B5470]">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    {job.Salary && (
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        ${job.Salary.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {job.tag?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.tag.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-medium text-[#6D28D9] bg-[#F5F3FC] px-2.5 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default JobListing;