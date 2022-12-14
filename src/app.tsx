import React, { FC } from 'react';
import { useMe } from 'gql/user';
import { Router, Redirect } from '@reach/router';
import {
  SIGNUP_CALLBACK_ROUTE,
  SIGNUP_COMPLETE_ROUTE,
  EXECUTION_ROUTE,
  PUBLICATION_ROUTE,
  ACCOUNT_ROUTE,
  BILLING_ROUTE,
} from 'routes';
import { AppBar } from 'components/common/app-bar';
import { Hidden, Container } from '@material-ui/core';
import { SignUpCallbackPage } from 'components/auth/signup-callback-page';
import { SignUpCompletePage } from 'components/auth/signup-complete-page';
import { PublicationPage } from 'components/publication/publication-page';
import { ExecutionPage } from 'components/execution/execution-page';
import { AccountPage } from 'components/account/account-page';
import { BillingPage } from 'components/billing/billing-page';
import { BotNav } from 'components/common/bot-nav';
import { Preloader } from 'components/common/preloader';
import { Error } from 'components/common/error';
import { PwaPrompt } from 'components/common/pwa-prompt';
import { PushNotyPrompt } from 'components/common/push-noty-prompt';

import { useStyles } from './app.s';

export const App: FC = () => {
  const { me, loading, error } = useMe();

  const c = useStyles();

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <Error error={error} mt='40vh' />;
  }

  return (
    <div className={c.root}>
      <Hidden xsDown={!!me}>
        <AppBar />
      </Hidden>
      <Router component={Container} primary={false}>
        {!me ? (
          <>
            <SignUpCallbackPage path={SIGNUP_CALLBACK_ROUTE} />
            <SignUpCompletePage path={SIGNUP_COMPLETE_ROUTE} />
            <Redirect default from='*' to={SIGNUP_COMPLETE_ROUTE} noThrow />
          </>
        ) : (
          <>
            <Redirect default from='*' to={PUBLICATION_ROUTE} noThrow />
            <PublicationPage path={PUBLICATION_ROUTE + '/*'} />
            <ExecutionPage path={EXECUTION_ROUTE + '/*'} />
            <AccountPage path={ACCOUNT_ROUTE} />
            <BillingPage path={BILLING_ROUTE} />
          </>
        )}
      </Router>
      {me && (
        <Hidden smUp>
          <BotNav />
        </Hidden>
      )}
      {(!!me?.createdTasks || !!me?.accounts.length) && (
        <>
          <PwaPrompt />
          <PushNotyPrompt userId={me.id} />
        </>
      )}
    </div>
  );
};
