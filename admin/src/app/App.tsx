import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';

import './styles/index.scss';

const App = () => (
  <AppProviders>
    <AppRoutes />
  </AppProviders>
);

export default App;
