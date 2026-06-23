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
import Handbook from './pages/Handbook';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import OgHorizonCapture from './pages/OgHorizonCapture';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Research from './pages/Research';
import Horizon, { HorizonHero } from './pages/research/Horizon';
import LongHorizonAgents from './pages/research/LongHorizonAgents';
import ProactiveVoiceAgents from './pages/research/ProactiveVoiceAgents';
import Role from './pages/Role';
import TermsOfService from './pages/TermsOfService';

function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const { pathname } = useLocation();
  const isHandbook = pathname.startsWith('/handbook');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (isHandbook) {
      if (lenisRef.current) {
        cancelAnimationFrame(rafRef.current);
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      // Higher lerp = snappier catch-up = even less smoothing.
      lerp: 0.4,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isHandbook]);

  useEffect(() => {
    if (isHandbook) {
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [isHandbook, pathname]);
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
          path="/handbook"
          element={
            <Layout>
              <Handbook />
            </Layout>
          }
        />
        <Route
          path="/handbook/:slug"
          element={
            <Layout>
              <Handbook />
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
        <Route path="/og-horizon-capture" element={<OgHorizonCapture />} />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
