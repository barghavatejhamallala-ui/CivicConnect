import { useEffect, useState } from 'react';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import GetStartedPage from './pages/GetStartedPage';
import IntroLoader from './components/IntroLoader';

function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const isGetStarted = hash === '#get-started';

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (isGetStarted) {
      window.scrollTo({ top: 0 });
      return;
    }

    const id = hash.replace('#', '');
    const timer = setTimeout(() => {
      if (id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0 });
      }
    }, 60);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, isGetStarted]);

  return (
    <>
      <IntroLoader />
      {isGetStarted ? <GetStartedPage /> : <LandingPage />}
    </>
  );
}

export default App;
