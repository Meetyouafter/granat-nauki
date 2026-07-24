import { BrowserRouter, Route, Routes } from 'react-router'
import ToastProvider from './components/Toast/ToastProvider'
import Layout from './layouts/Layout'
import Home from './pages/Home/Home'
import Faq from './pages/Faq/Faq'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="faq" element={<Faq />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
