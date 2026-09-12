import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../Components/Context/AuthContext';

const STATUS_STYLES = {
  applied: 'text-[#5B5470] bg-[#F5F3FC]',
  shortlisted: 'text-[#2F6FED] bg-[#EAF1FE]',
  hired: 'text-emerald-700 bg-emerald-50',
  rejected: 'text-red-700 bg-red-50',
};

function CandidateDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await apiFetch('/my-applications');
        setApplications(data.applications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#E4E0F0] ">
        <div className="max-w-3xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link to="/jobs/listing" className="font-display text-2xl text-[#17132B]">Jobolio</Link>
          <div className="flex items-center gap-5">
            <Link to="/jobs/listing" className="text-sm font-medium text-[#5B5470] hover:text-[#17132B]">
              Browse roles
            </Link>
            <span className="text-sm text-[#5B5470]">{user?.name}</span>
            <button
              onClick={async () => { await logout(); navigate('/'); }}
              className="text-sm font-medium text-[#5B5470] hover:text-[#17132B]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="font-display text-4xl text-[#17132B]">Your applications</h1>
        <p className="mt-2 text-[#5B5470]">
          {applications.length} application{applications.length !== 1 ? 's' : ''} submitted.
        </p>

        {loading ? (
          <p className="mt-10 text-[#5B5470]">Loading…</p>
        ) : applications.length === 0 ? (
          <div className="mt-10">
            <p className="text-[#5B5470]">You haven't applied to any roles yet.</p>
            <Link to="/jobs/listing" className="mt-3 inline-block text-[#6D28D9] font-medium">
              Browse open roles →
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="border border-[#E4E0F0] rounded-lg p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="font-medium text-lg text-[#17132B]">{app.job?.title}</h2>
                    <div className="mt-2 flex items-center gap-4 text-sm text-[#5B5470]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.job?.location}
                      </span>
                      {app.job?.Salary && (
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          ${app.job.Salary.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${STATUS_STYLES[app.status] || 'text-[#5B5470] bg-[#F5F3FC]'}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CandidateDashboard;