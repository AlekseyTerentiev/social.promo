import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMe } from 'gql/user';
import { navigate, Location } from '@reach/router';
import { TASKS_ROUTE, CREATE_TASK_ROUTE, ACCOUNT_ROUTE } from 'routes';
import {
  makeStyles,
  Theme,
  createStyles,
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  Container,
  Typography,
  Hidden,
  Tabs,
  Tab,
} from '@material-ui/core';
import logoImg from 'img/logo.svg';
import { Language } from 'components/language';
import { AppBarUser } from 'components/app-bar-user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { Currency } from 'components/billing/currency';

export function AppBar() {
  const { t } = useTranslation();
  const c = useStyles();

  const { me, loading: loadingMe } = useMe();

  function handleNavigate(e: ChangeEvent<{}>, route: string) {
    navigate(route);
  }

  return (
    <MuiAppBar className={c.root} position='static' color='inherit'>
      <Container>
        <Toolbar className={c.toolbar} disableGutters>
          <Box className={c.brand} onClick={() => navigate(TASKS_ROUTE)}>
            <img className={c.brandIcon} src={logoImg} alt='Logo' />
            {/* <Hidden xsDown> */}
            <Typography className={c.brandText} noWrap>
              Influence Cloud
            </Typography>
            {/* </Hidden> */}
          </Box>

          {!loadingMe && me && (
            <Hidden smDown>
              <Location>
                {({ location }): any => (
                  <Tabs
                    value={'/' + location.pathname.split('/')[1]}
                    onChange={handleNavigate}
                    TabIndicatorProps={{ hidden: true }}
                  >
                    <Tab label={t('Tasks')} value={TASKS_ROUTE} />
                    <Tab label={t('Create task')} value={CREATE_TASK_ROUTE} />
                    <Tab label={t('Account')} value={ACCOUNT_ROUTE} />
                  </Tabs>
                )}
              </Location>
            </Hidden>
          )}

          <Box ml='auto' />

          {!me && <Language />}

          {me && (
            <Box className={c.balance}>
              <FontAwesomeIcon icon={faWallet} className={c.icon} />
              <Currency value={me.balance?.balance || 0} />
            </Box>
          )}

          <Hidden smDown={!!me}>
            <Box ml={1} />
            <AppBarUser />
          </Hidden>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(7),
      },
      cursor: 'pointer',
    },
    brandIcon: {
      marginRight: theme.spacing(1),
      height: 21,
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(1.25),
        height: 25,
      },
    },
    brandText: {
      fontFamily: 'Montserrat',
      color: '#484848',
      letterSpacing: -0.2,
      marginTop: 1,
      fontSize: 16,
      [theme.breakpoints.up('sm')]: {
        fontSize: 17,
      },
    },
    icon: {
      fontSize: '1rem',
      marginRight: theme.spacing(1),
      color: '#777',
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(1.25),
        fontSize: '1.1rem',
      },
    },
    balance: {
      fontSize: '1.1rem',
      fontWeight: theme.typography.fontWeightMedium,
      [theme.breakpoints.up('md')]: {
        fontSize: '1.2rem',
      },
    },
  }),
);
