import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MapPin, Briefcase, Users, X } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../Components/Context/AuthContext';

function EmployerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/my-jobs');
      setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const openApplicants = async (job) => {
    setSelectedJob(job);
    setApplicantsLoading(true);
    try {
      const data = await apiFetch(`/jobs/${job._id}/applicants`);
      setApplicants(data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await apiFetch(`/applications/${applicationId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setApplicants((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#E4E0F0]">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl text-[#17132B]">Jobolio</Link>
          <div className="flex items-center gap-5">
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

      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-[#17132B]">Your roles</h1>
            <p className="mt-2 text-[#5B5470]">{jobs.length} role{jobs.length !== 1 ? 's' : ''} posted.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#17132B] text-white font-medium rounded-md hover:bg-[#6D28D9] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post a role
          </button>
        </div>

        {loading ? (
          <p className="mt-10 text-[#5B5470]">Loading…</p>
        ) : jobs.length === 0 ? (
          <p className="mt-10 text-[#5B5470]">You haven't posted any roles yet.</p>
        ) : (
          <div className="mt-8 space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-[#E4E0F0] rounded-lg p-6 flex items-center justify-between"
              >
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
                </div>
                <button
                  onClick={() => openApplicants(job)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#6D28D9] border border-[#6D28D9] rounded-md hover:bg-[#F5F3FC] transition-colors"
                >
                  <Users className="w-4 h-4" />
                  View applicants
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <CreateJobModal
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); loadJobs(); }}
        />
      )}

      {selectedJob && (
        <ApplicantsModal
          job={selectedJob}
          applicants={applicants}
          loading={applicantsLoading}
          onClose={() => setSelectedJob(null)}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}

function CreateJobModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', location: '', Salary: '', tag: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await apiFetch('/jobs', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          Salary: Number(form.Salary),
          tag: form.tag.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#5B5470] hover:text-[#17132B]">
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-display text-2xl text-[#17132B]">Post a new role</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-[#17132B]">Title</label>
            <input name="title" required value={form.title} onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#17132B]">Description</label>
            <textarea name="description" required rows={3} value={form.description} onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#17132B]">Location</label>
            <input name="location" required value={form.location} onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#17132B]">Salary</label>
            <input name="Salary" type="number" required value={form.Salary} onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#17132B]">Tags (comma separated)</label>
            <input name="tag" placeholder="react, remote, senior" value={form.tag} onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2.5 border border-[#E4E0F0] rounded-md focus:outline-none focus:border-[#6D28D9]" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting}
            className="w-full py-3 bg-[#17132B] text-white font-medium rounded-md hover:bg-[#6D28D9] transition-colors disabled:opacity-50">
            {submitting ? 'Posting…' : 'Post role'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ApplicantsModal({ job, applicants, loading, onClose, onStatusChange }) {
  const statuses = ['applied', 'shortlisted', 'rejected', 'hired'];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-8 max-h-[80vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#5B5470] hover:text-[#17132B]">
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-display text-2xl text-[#17132B]">{job.title}</h2>
        <p className="text-sm text-[#5B5470] mt-1">Applicants</p>

        <div className="mt-6 space-y-3">
          {loading && <p className="text-sm text-[#5B5470]">Loading applicants…</p>}
          {!loading && applicants.length === 0 && (
            <p className="text-sm text-[#5B5470]">No applicants yet.</p>
          )}
          {applicants.map((app) => (
            <div key={app._id} className="border border-[#E4E0F0] rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#17132B]">{app.candidate?.name}</p>
                <p className="text-sm text-[#5B5470]">{app.candidate?.email}</p>
              </div>
              <select
                value={app.status}
                onChange={(e) => onStatusChange(app._id, e.target.value)}
                className="text-sm border border-[#E4E0F0] rounded-md px-3 py-2 focus:outline-none focus:border-[#6D28D9]"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;