import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';        // 修改：去掉了 ./components/
import { Home } from './Home';            // 修改：去掉了 ./pages/
import { BlogList } from './BlogList';    // 修改：去掉了 ./pages/
import { PostDetail } from './PostDetail';// 修改：去掉了 ./pages/
import { Admin } from './Admin';          // 修改：去掉了 ./pages/
import { Feed } from './Feed';            // 修改：去掉了 ./pages/

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
