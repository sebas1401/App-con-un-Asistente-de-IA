import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AnimatePresence, motion } from 'framer-motion';
import Spotlight from '../components/FX/Spotlight';

export default function PrivateLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <Spotlight />
      <Sidebar />
      <div className="relative">
        <div className="sticky top-0 z-40">
          <Header />
        </div>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-6"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
