import React, { FC, ReactNode } from 'react';
import { Preloader } from 'components/common/preloader';
import { Router } from '@reach/router';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from 'routes';
import { AuthPage } from 'components/auth/auth-page';
import { useAuth0 } from '@auth0/auth0-react';

export interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <AuthPage path={LOGIN_ROUTE} default />
        <AuthPage path={SIGNUP_ROUTE} signUp />
      </Router>
    );
  }

  return <>{children}</>;
};
