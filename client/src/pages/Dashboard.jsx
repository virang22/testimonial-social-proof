import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Overview from './Overview';
import Spaces from './Spaces';
import CreateSpace from './CreateSpace';
import Reviews from './Reviews';
import Analytics from './Analytics';

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="spaces" element={<Spaces />} />
          <Route path="spaces/new" element={<CreateSpace />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}
