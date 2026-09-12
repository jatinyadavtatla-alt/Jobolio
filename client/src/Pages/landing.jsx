import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  const listings = [
    { title: 'Senior Product Designer', company: 'Aster Studio', location: 'Remote', tag: 'New' },
    { title: 'Backend Engineer', company: 'Northlane', location: 'Bengaluru', tag: null },
    { title: 'Marketing Lead', company: 'Fernweh', location: 'Remote', tag: null },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
        <span className="font-display text-2xl text-[#17132B]">Jobolio</span>
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-medium text-[#5B5470] hover:text-[#17132B] transition-colors"
        >
          Log in
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-10 pt-16 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.1] text-[#17132B]">
            Work that fits.
            <br />
            People who fit it.
          </h1>
          <p className="mt-6 text-lg text-[#5B5470] max-w-md">
            Jobolio is a focused space where employers post real roles and candidates apply without the noise.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/signup/employer')}
              className="px-7 py-3.5 bg-[#17132B] text-white font-medium rounded-md hover:bg-[#6D28D9] transition-colors"
            >
              Hire on Jobolio
            </button>
            <button
              onClick={() => navigate('/signup/candidate')}
              className="px-7 py-3.5 bg-white text-[#17132B] font-medium rounded-md border border-[#E4E0F0] hover:border-[#6D28D9] transition-colors"
            >
              Find your next role
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-[#F5F3FC] rounded-2xl -z-10" />
          <div className="space-y-3">
            {listings.map((job, i) => (
              <div
                key={i}
                className="bg-white border border-[#E4E0F0] rounded-lg p-5 shadow-sm"
                style={{ marginLeft: i * 16 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-[#17132B]">{job.title}</p>
                    <p className="text-sm text-[#5B5470] mt-1">{job.company} · {job.location}</p>
                  </div>
                  {job.tag && (
                    <span className="text-xs font-medium text-[#6D28D9] bg-[#F5F3FC] px-2.5 py-1 rounded-full">
                      {job.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;