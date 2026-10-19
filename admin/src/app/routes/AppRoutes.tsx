import { Route, Routes } from 'react-router';

import { AccessRequestsPage } from '@pages/access-requests';
import { AccessRightsPage } from '@pages/access-rights';
import { FaqPage } from '@pages/faq';
import { HomePage } from '@pages/home';
import { ReviewPage } from '@pages/review';
import { ReviewsPage } from '@pages/reviews';
import { SettingsPage } from '@pages/settings';
import { SignInPage } from '@pages/signin';
import { SignUpPage } from '@pages/signup';

import { paths } from '@shared/config';

import RootLayout from '../layouts/rootLayout/RootLayout';
import SignLayout from '../layouts/signLayout/SignLayout';
import { GuestRoute, ProtectedRoute } from './guards';

const AppRoutes = () => (
  <Routes>
    <Route element={<GuestRoute />}>
      <Route element={<SignLayout />}>
        <Route index element={<SignInPage />} />
        <Route path={paths.signup} element={<SignUpPage />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute role="USER" />}>
      <Route path={paths.accessRights} element={<AccessRightsPage />} />
    </Route>
    <Route element={<ProtectedRoute role="ADMIN" />}>
      <Route element={<RootLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.accessRequests} element={<AccessRequestsPage />} />
        <Route path={paths.faq} element={<FaqPage />} />
        <Route path={paths.reviews} element={<ReviewsPage />} />
        <Route path={`${paths.reviews}/:id`} element={<ReviewPage />} />
        <Route path={paths.settings} element={<SettingsPage />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
