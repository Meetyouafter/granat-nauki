import AppProviders from './providers/AppProviders'
import AppRoutes from './routes/AppRoutes'

import './styles/index.scss'

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default App
