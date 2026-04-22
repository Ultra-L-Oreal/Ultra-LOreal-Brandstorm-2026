// src/pages/dashboard/Dashboard.tsx
import RequireAuth from '../../components/auth/RequireAuth';

function DashboardContent() {
  return (
    <div className="min-h-screen bg-neutral-900 py-12">
      <div className="container">
        <div className="max-w-5xl mx-auto bg-neutral-900/60 border border-neutral-800 p-8 rounded-xl">
          <h1 className="text-3xl font-serif text-white mb-4">Your Ultra Dashboard</h1>
          <p className="text-neutral-300">Orders, Memory Capsules, Safety Passport and more will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
