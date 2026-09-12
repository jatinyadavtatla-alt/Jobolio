// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { apiFetch } from '../services/api';

// function JobListing() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);         // ✅ Fix 1: track error in state

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const data = await apiFetch('/jobs');
//         setJobs(data);
//       } catch (err) {
//         console.error(err.message);                  // ✅ Fix 3: console.error not log
//         setError('Failed to load jobs.');            // ✅ Fix 1: store error message
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // ── Early returns ──────────────────────────────
//   if (loading) return <p>Loading...</p>;

//   if (error) return <p>{error}</p>;                 // ✅ Fix 1: show error to user

//   // ── Render ─────────────────────────────────────
//   return (
//     <div>
//       <h1>Available Jobs</h1>

//       {jobs.length === 0 ? (
//         <p>No jobs available</p>
//       ) : (
//         jobs.map((job, index) => (
//           <div key={job.id ?? index}>              {/* ✅ Fix 2: safe key fallback */}
//             <h2>{job.title}</h2>
//             <p>{job.company}</p>
//             <p>{job.location}</p>
//             <p>
//               {job.description?.length > 150        /* ✅ Fix 4: truncate description */
//                 ? job.description.slice(0, 150) + '...'
//                 : job.description}
//             </p>

//             <Link to={`/jobs/${job.id}`}>View Job</Link>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default JobListing;



const BASE_URL ='';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}