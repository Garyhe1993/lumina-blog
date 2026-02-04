
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { BlogList } from './pages/BlogList';
import { PostDetail } from './pages/PostDetail';
import { Admin } from './pages/Admin';
import { Feed } from './pages/Feed';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
