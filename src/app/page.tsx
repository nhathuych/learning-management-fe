import NonDashboardNavbar from '@/components/NonDashboardNavbar';
import Footer from '@/components/Footer';
import LandingView from '@/components/LandingView';

export default function Home() {
  return (
    <div className='nondashboard-layout'>
      <NonDashboardNavbar />

      <main className='nondashboard-layout__main'>
        <LandingView />
      </main>

      <Footer />
    </div>
  );
}
