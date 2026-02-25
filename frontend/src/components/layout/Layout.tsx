import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
     
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

    </div>
  );
}
