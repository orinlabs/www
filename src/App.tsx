import {
  useEffect,
  useRef,
} from 'react';

import Lenis from 'lenis';
import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Research from './pages/Research';
import Horizon, { HorizonHero } from './pages/research/Horizon';
import LongHorizonAgents from './pages/research/LongHorizonAgents';
import ProactiveVoiceAgents from './pages/research/ProactiveVoiceAgents';
import Role from './pages/Role';
import TermsOfService from './pages/TermsOfService';

function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      // Higher lerp = snappier catch-up = even less smoothing.
      lerp: 0.4,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
}

function App() {
  useSmoothScroll();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/research"
          element={
            <Layout>
              <Research />
            </Layout>
          }
        />
        <Route
          path="/research/long-horizon-agents"
          element={
            <Layout>
              <LongHorizonAgents />
            </Layout>
          }
        />
        <Route
          path="/research/conversationality"
          element={
            <Layout>
              <ProactiveVoiceAgents />
            </Layout>
          }
        />
        <Route
          path="/research/horizon"
          element={
            <Layout hero={<HorizonHero />}>
              <Horizon />
            </Layout>
          }
        />
        <Route
          path="/roles/:slug"
          element={
            <Layout>
              <Role />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout>
              <TermsOfService />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
