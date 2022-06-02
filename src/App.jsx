import Header from './shared/Header/Header'
import Footer from './shared/Footer/Footer'
import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home';
import PathsDetail from './pages/Paths/PathDetail/PathDetail';
import Paths from './pages/Paths/Paths';
import About from './pages/About/About';
import Blog from './pages/Blog/Blog';
import Suggestions from './pages/Suggestions/Suggestions';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Admin from './pages/Admin/Admin';
import UserTutorials from './pages/Admin/UserTutorials/UserTutorials';
import UserRutas from './pages/Admin/UserRutas/UserRutas';
import UserSuggestions from './pages/Admin/UserSuggestions/UserSuggestions';
import UserProfile from './pages/Admin/UserProfile/UserProfile';
import UserList from './pages/Admin/UserList/UserList';
import Tutorials from './pages/Tutorials/Tutorials';
import PostDetail from './pages/Blog/PostDetail/PostDetail'
import LogOut from './components/LogOut/LogOut';
import { PrivateRoute }  from './components/PrivateRoute/PrivateRoute';
import { Provider } from 'react-redux'
import { store } from './Store/Store'
import AddRutaVideos from './pages/Admin/AddRutaVideos/AddRutaVideos';
import AdminBlog from './pages/Admin/AdminBlog/AdminBlog';
import Video from './components/VideosRuta/Video/Video'
import BlogEdit from './pages/Admin/AdminBlog/BlogEdit/BlogEdit';
import Register from './pages/Register/Register';
import EditUserTutorials from './pages/Admin/UserTutorials/EditUserTutorials/EditUserTutorials';
import UserFollowedRutas from './pages/Admin/UserFollowedRutas/UserFollowedRutas';
import EditUserRutas from './pages/Admin/UserRutas/EditUserRutas.jsx/EditUserRutas';

function App() {

  return (
    <>
    <Provider store={store}>
      <Router>
        <Header />
        <main>
          <div className="container">
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rutas" element={<Paths />} />
              <Route path="/ruta/:id" element={<PathsDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/post/:slug" element={<PostDetail />} />
              <Route path="/sugerencias" element={<Suggestions />} />
              <Route path="/tutoriales" element={<Tutorials />} />
              <Route path="/registro" element={<Register />} />

              <Route exact path='/admin' element={<PrivateRoute/>}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/rutas" element={<UserRutas />} />
                <Route path="/admin/rutas-seguidas" element={<UserFollowedRutas />} />
                <Route path="/admin/edit-user-ruta/:id" element={<EditUserRutas />} />
                <Route path="/admin/tutoriales" element={<UserTutorials />} />
                <Route path="/admin/tutoriales/edit/:id" element={<EditUserTutorials />} />
                <Route path="/admin/sugerencias" element={<UserSuggestions />} />
                <Route path="/admin/usuarios" element={<UserList />} />
                <Route path="/admin/perfil" element={<UserProfile />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/post/edit/:id" element={<BlogEdit />} />
                <Route path="/admin/add-video/:id" element={<AddRutaVideos />} />
                <Route path="/admin/video/:id" element={<Video />} />
              </Route>
                
                <Route path="/logout" element={<LogOut />} />
              <Route path="*" element={<ErrorPage />} />
          </Routes>
          </div>
        </main>
        </Router>
      <Footer />
      </Provider>
    </>
  );
}

export default App;
