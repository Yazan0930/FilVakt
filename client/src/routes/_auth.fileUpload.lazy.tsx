import { createLazyFileRoute } from '@tanstack/react-router'
import FileUpload from '../pages/fileUpload'
import { Helmet } from 'react-helmet'
import { t } from 'i18next'

export const Route = createLazyFileRoute('/_auth/fileUpload')({
  component: () => (
    <>
      <FileUpload />
      <Helmet>
        <title>{t('fileUpload')}</title>
      </Helmet>
    </>
  ),
})
