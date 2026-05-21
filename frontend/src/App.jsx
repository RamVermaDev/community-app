import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './components/auth/SignUp'
import Login from './components/auth/Login'
import Profile from './pages/Profile'
import Post from './pages/Post'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/:userId/:userName" element={<Home/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/:userId/:userName/profile" element={<Profile/>} />
        <Route path="/:userId/:userName/posts" element={<Post/>} />
      </Routes>
    </div>
  )
}
