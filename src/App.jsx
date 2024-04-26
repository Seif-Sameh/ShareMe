import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import Home from './containers/Home'
import UserProfile from './components/UserProfile'
import Feed from './containers/Feed'
import CreatePin from './components/CreatePin'
import { userQuery } from './utils/data'
import { client } from './client'
import PinDetail from './components/PinDetail'
import Search from './components/Search'



function App() {
  const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()
  const [user, setUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const query = userQuery(userInfo?.jti)
    client.fetch(query)
    .then((res) => {
      setUser(res[0])
  
    if(!user) navigate('/login')
  
    }) 
  }, [])

  return (
    <>
      <Routes>
        <Route path='login' element={<Login/>}/>
        <Route path='/' element={<Home user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}>
          <Route path='/' element={<Feed user={user}/>}/>
          <Route path='/user-profile/:userId' element={<UserProfile />}/>
          <Route path='/category/:category' element={<Feed />}/>
          <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}/>
          <Route path='/pin-detail/:pinId' element={<PinDetail user={user}/>}/>
          <Route path='/create-pin' element={<CreatePin user={user}/>}/>
        </Route> 
      </Routes>
    </>
  )
}

export default App
