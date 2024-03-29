import { Spinner } from 'vtex.styleguide'
import { AuthServiceLazy } from 'vtex.react-vtexid'

import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { getRootPath } from '../common/global'
import styles from '../styles.css'

function OAuthAutoRedirect({ intl, provider, redirect }) {
  useEffect(() => {
    redirect()
  }, [])
  return (
    <div className={styles.oauthAutoRedirect}>
      <div className="w-100 flex flex-column pv5">
        <p className="tc ph4">
          {intl.formatMessage(
            {
              id: 'store/login.autoRedirect.message',
            },
            { provider }
          )}
        </p>
        <div
          className={`self-center c-emphasis ${styles.oauthAutoRedirectLoading}`}
        >
          <Spinner color="currentColor" size={24} />
        </div>
      </div>
    </div>
  )
}

OAuthAutoRedirect.propTypes = {
  redirect: PropTypes.func.isRequired,
  provider: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  intl: intlShape,
}

function Wrapper({ provider, ...props }) {
  const errorFallbackUrl = useMemo(() => {
    const {
      location: {
        origin: currentDomain = '',
        search: currentSearch = '',
        hash: currentHash = '',
      } = {},
    } = window || {}
    return new URL(
      `${getRootPath()}/login${currentSearch}${currentHash}`,
      currentDomain
    ).href
  }, [])

  return (
    <AuthServiceLazy.OAuthRedirect
      errorFallbackUrl={errorFallbackUrl}
      useNewSession
      provider={provider}
    >
      {({ loading, action: redirectToOAuthPage }) => (
        <OAuthAutoRedirect
          {...props}
          loading={loading}
          provider={provider}
          redirect={redirectToOAuthPage}
        />
      )}
    </AuthServiceLazy.OAuthRedirect>
  )
}

Wrapper.propTypes = {
  provider: PropTypes.string.isRequired,
}

export default injectIntl(Wrapper)
