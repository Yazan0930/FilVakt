import { createLazyFileRoute } from '@tanstack/react-router'
import NewUser from '../pages/newUser'
import { Helmet } from 'react-helmet'
import { t } from 'i18next'

export const Route = createLazyFileRoute('/_auth/NewUser')({
  component: () => (
    <>
      <NewUser />
      <Helmet>
        <title>{t('NewUser')}</title>
      </Helmet>
    </>
  ),
})
