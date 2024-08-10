import React from 'react'
import SignUp from './components/SignUp'
import Login from './components/LogIn'
import LocationAccessPage from './components/LocationAccessPage'
import {BrowserRouter as Router,Route,Routes} from  'react-router-dom'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Login } />
        <Route path='/signup' Component={SignUp } />
        <Route path='/location'Component={LocationAccessPage} />
      </Routes>
    </Router>
  )
}

export default App