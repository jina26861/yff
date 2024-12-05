import "./assets/css/meyawo.css";
import "./assets/css/mystyle.css";
import "./assets/vendors/themify-icons/css/themify-icons.css";

import Footer from "./components/Footer";
import Main from "./pages/Main";
import Learn from "./pages/Learn";
import Test from "./pages/Test";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Sign from "./pages/Sign";
import Join from "./pages/Join";
import Mypage from "./pages/Mypage";
import Mytest from "./pages/Mytest";
import LearnAdd from "./pages/LearnAdd";
import Album from "./pages/Album";
import BlogAdd from "./pages/BlogAdd";
import BlogDetail from "./pages/BlogDetail";
import Learning from "./pages/Learning";
import MyLearning from "./pages/MyLearning";
import MyAlbum from "./pages/MyAlbum";

import styled from "styled-components";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

const AppDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  padding-top: 20px;
`;




function App() {
  return (
    <AppDiv className='header'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Learn />} />
          <Route path='/main' element={<Main />} />
          <Route path='/learn' element={<Learn />} />
          <Route path='/test' element={<Test />} />
          <Route path='/sign' element={<Sign />} />
          <Route path='/join' element={<Join />} />
          <Route path='/mypage' element={<Mypage />} />

          <Route path='/mytest' element={<Mytest />} />

          <Route path='/album/:id' element={<Album />} />
          <Route path='/myalbum/:id' element={<MyAlbum />} />

          <Route path='/learnAdd/:albumId' element={<LearnAdd />} />
          <Route path='/Learning/:albumId' element={<Learning />} />
          <Route path='/MyLearning/:id' element={<MyLearning />} />

          <Route path='/blog' element={<Blog />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/blogAdd' element={<BlogAdd />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          <Route path='/BlogDetail/:id' element={<BlogDetail />} />

        </Routes>
      </BrowserRouter>
      <Footer />
    </AppDiv>
  );
}

export default App;