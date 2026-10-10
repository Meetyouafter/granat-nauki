import { Route, Routes } from 'react-router';

import { FaqPage } from '@pages/faq';
import { HomePage } from '@pages/home';
import { ReviewPage } from '@pages/review';
import { ReviewsPage } from '@pages/reviews';
import { SignInPage } from '@pages/signin';
import { SignUpPage } from '@pages/signup';

import { paths } from '@shared/config';

import RootLayout from '../layouts/rootLayout/RootLayout';
import SignLayout from '../layouts/signLayout/SignLayout';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<SignLayout />}>
        <Route index element={<SignInPage />} />
        <Route path={paths.signup} element={<SignUpPage />} />
      </Route>
      <Route element={<RootLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.faq} element={<FaqPage />} />
        <Route path={paths.reviews} element={<ReviewsPage />} />
        <Route path={`${paths.reviews}/:id`} element={<ReviewPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
