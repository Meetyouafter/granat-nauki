import { BrowserRouter, Route, Routes } from 'react-router'
import ToastProvider from './components/Toast/ToastProvider'
import Layout from './layouts/Layout'
import Home from './pages/Home/Home'
import Faq from './pages/Faq/Faq'
import Login from './pages/Login/Login'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Home />} />
            <Route path="faq" element={<Faq />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
