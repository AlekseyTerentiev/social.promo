import React, { FC, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from '@reach/router';
import { useUpsertUser } from 'gql/user';
import {
  createStyles,
  makeStyles,
  Theme,
  Box,
  Typography,
  TextField,
  Button,
  Hidden,
  CircularProgress,
  Link,
} from '@material-ui/core';
import figures from 'img/figures.svg';
import { Error } from 'components/common/error';
import 'react-phone-number-input/style.css';
import { PhoneInput } from 'components/account/phone-input';

export interface SignUpCompletePageProps extends RouteComponentProps {}

const locationInfo = {
  country: '',
  city: '',
  region: '',
  timezone: '',
};

export const SignUpCompletePage: FC<SignUpCompletePageProps> = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language.split('-')[0];
  const c = useStyles();

  const [upsertUser, { loading: upsertingUser, error }] = useUpsertUser();

  const [userData, setUserData] = useState<any>({
    nickname: '',
    phone: '',
  });

  useEffect(() => {
    fetch('https://ipapi.co/json')
      .then((res) => res.json())
      .then((ipInfo) => {
        locationInfo.country = ipInfo.country;
        locationInfo.city = ipInfo.city;
        locationInfo.region = ipInfo.region;
        locationInfo.timezone = ipInfo.timezone;
      });
  }, []);

  const handleChange = (e: ChangeEvent<any>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await upsertUser({
      variables: {
        ...locationInfo,
        ...userData,
        language,
        locale: i18n.language,
      },
    });
    (window as any).gtag('event', 'signup_complete');
    (window as any).fbq('trackCustom', 'signup_complete');
  };

  return (
    <>
      <form
        className={c.root}
        onSubmit={handleSubmit}
        // noValidate
        // autoComplete="off"
      >
        <Typography variant='h6' style={{ marginBottom: 1 }}>
          {t('Welcome to Earnon Social!')}
        </Typography>

        <Typography
          align='center'
          variant='body2'
          color='textSecondary'
          style={{ marginBottom: 14 }}
        >
          {t('To complete the registration')}
          <br />
          {t('enter your details')}
        </Typography>

        <Box mt={1.5} />

        <TextField
          label={t('Nickname')}
          id='nickname'
          name='nickname'
          value={userData.nickname}
          onChange={handleChange}
          variant='outlined'
          margin='dense'
          fullWidth
        />

        <PhoneInput
          value={userData.phone}
          onChange={(phone) => {
            setUserData({
              ...userData,
              phone,
            });
          }}
        />

        {error && <Error error={error} />}

        <Box mt={1} />

        <Button
          type='submit'
          color='primary'
          size='large'
          variant='contained'
          fullWidth
          disabled={!userData.nickname || !userData.phone || upsertingUser}
        >
          {upsertingUser ? (
            <CircularProgress style={{ width: 28, height: 28 }} />
          ) : (
            t('Submit')
          )}
        </Button>

        <Typography
          variant='caption'
          color='textSecondary'
          display='block'
          style={{ marginTop: 10, fontSize: '0.85rem' }}
        >
          {t('By registering your account, you agree to our')}{' '}
          <Link
            href={`https://earnon.social/terms_of_service${
              language === 'ru' ? '_ru' : ''
            }.pdf`}
            target='_blank'
          >
            {t('Terms of Service')}
          </Link>{' '}
          {t('and')}{' '}
          <Link
            href={`https://earnon.social/privacy_policy${
              language === 'ru' ? '_ru' : ''
            }.pdf`}
            target='_blank'
          >
            {t('Privacy Policy')}
          </Link>
          .
        </Typography>
      </form>

      <Hidden smDown>
        <img
          src={figures}
          style={{ position: 'absolute', left: '15%', top: '30%' }}
          alt='img'
        />
        <img
          src={figures}
          style={{
            position: 'absolute',
            left: '15%',
            bottom: '25%',
            transform: 'scaleY(-1)',
          }}
          alt='img'
        />
        <img
          src={figures}
          style={{
            position: 'absolute',
            right: '15%',
            top: '30%',
            transform: 'scaleX(-1)',
          }}
          alt='img'
        />
        <img
          src={figures}
          style={{
            position: 'absolute',
            right: '15%',
            bottom: '25%',
            transform: 'scaleY(-1) scaleX(-1)',
          }}
          alt='img'
        />
      </Hidden>
    </>
  );
};

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    root: {
      maxWidth: 400,
      margin: 'auto',
      padding: t.spacing(6, 0),
      textAlign: 'center',
      [t.breakpoints.up('md')]: {
        padding: t.spacing(16, 0),
      },
    },
    phoneInput: {
      position: 'absolute',
      width: '100%',
      top: '70%',
      transform: 'translateY(-50%)',
      padding: t.spacing(0, 2),
      '& input': {
        padding: 0,
        paddingLeft: 4,
        fontFamily: t.typography.fontFamily,
        fontSize: t.typography.fontSize + 1,
        fontWeight: t.typography.fontWeightMedium,
        background: 'transparent',
        border: 'none',
        '&::placeholder': {
          color: 'rgba(52, 55, 76, 0.7)',
          fontWeight: t.typography.fontWeightRegular,
        },
        '&:focus': {
          outline: 'none',
        },
      },
      '& .PhoneInputCountry': {
        '--PhoneInputCountryFlag-height': '0.8em',
      },
      '& .PhoneInputCountrySelectArrow': {
        borderStyle: 'solid',
        borderTopWidth: '0',
        borderBottomWidth: 'var(--PhoneInputCountrySelectArrow-borderWidth)',
        borderLeftWidth: '0',
        borderRightWidth: 'var(--PhoneInputCountrySelectArrow-borderWidth)',
      },
    },
  }),
);
