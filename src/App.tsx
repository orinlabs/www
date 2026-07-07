import { useEffect } from 'react';

import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Layout from './components/Layout';
import Careers from './pages/Careers';
import Handbook from './pages/Handbook';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import OgHorizonCapture from './pages/OgHorizonCapture';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Research from './pages/Research';
import Horizon from './pages/research/Horizon';
import LongHorizonAgents from './pages/research/LongHorizonAgents';
import ProactiveVoiceAgents from './pages/research/ProactiveVoiceAgents';
import Role from './pages/Role';
import Solutions, { SolutionRedirect } from './pages/Solutions';
import TermsOfService from './pages/TermsOfService';

// The handbook owns its own scroll container, so only reset window scroll on
// the public pages. Navigations targeting an anchor (e.g. /solutions#bidding)
// are left alone so the destination page can scroll to it.
function useScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();
  const isHandbook = pathname.startsWith('/handbook');

  useEffect(() => {
    if (isHandbook || hash) {
      return;
    }

    window.scrollTo(0, 0);
  }, [isHandbook, hash, pathname]);
}

function App() {
  useScrollToTopOnNavigate();

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
            <Layout footerDark>
              <Research />
            </Layout>
          }
        />
        <Route
          path="/careers"
          element={
            <Layout footerDark>
              <Careers />
            </Layout>
          }
        />
        <Route
          path="/research/long-horizon-agents"
          element={
            <Layout footerDark>
              <LongHorizonAgents />
            </Layout>
          }
        />
        <Route
          path="/research/conversationality"
          element={
            <Layout footerDark>
              <ProactiveVoiceAgents />
            </Layout>
          }
        />
        <Route
          path="/research/horizon"
          element={
            <Layout footerDark>
              <Horizon />
            </Layout>
          }
        />
        <Route
          path="/roles/:slug"
          element={
            <Layout footerDark>
              <Role />
            </Layout>
          }
        />
        <Route
          path="/solutions"
          element={
            <Layout footerDark>
              <Solutions />
            </Layout>
          }
        />
        <Route path="/solutions/:slug" element={<SolutionRedirect />} />
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
            <Layout footerDark>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
