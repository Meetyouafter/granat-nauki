import { Route, Routes } from 'react-router'

import { FaqPage } from '@pages/faq'
import { HomePage } from '@pages/home'
import { LoginPage } from '@pages/login'
import { ReviewPage } from '@pages/review'
import { ReviewsPage } from '@pages/reviews'

import { paths } from '@shared/config'

import Layout from '../layouts/Layout'

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.faq} element={<FaqPage />} />
        <Route path={paths.reviews} element={<ReviewsPage />} />
        <Route path={`${paths.reviews}/:id`} element={<ReviewPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
