import { Outlet } from 'react-router-dom';
import BottomTabs from '@/components/BottomTabs';
import TopHeader from '@/components/TopHeader';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-muted/50 max-w-lg mx-auto relative flex flex-col">
      {/* Top Navigation Bar */}
      <TopHeader />
      
      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      
      {/* Bottom Navigation Tabs */}
      <BottomTabs />
    </div>
  );
}