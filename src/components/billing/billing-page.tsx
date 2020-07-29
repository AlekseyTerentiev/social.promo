import React, { FC, useState, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useTranslation } from 'react-i18next';
import { CREATE_TASK_ROUTE } from 'routes';
import { navigate } from '@reach/router';
import {
  makeStyles,
  Theme,
  createStyles,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab,
  Hidden,
} from '@material-ui/core';
import { useMe } from 'gql/user';
import {
  useCreateBalanceTransaction,
  useCheckBalanceTransaction,
} from 'gql/billing';
import { Loading } from 'components/loading';
import { Error } from 'components/error';
import { Currency } from './currency';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Modal } from 'components/modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export type TransactionType = 'refill' | 'withdrawal';

export interface BillingPageProps extends RouteComponentProps {}

export const BillingPage: FC<BillingPageProps> = () => {
  const c = useStyles();
  const { t } = useTranslation();

  const { me, loading: loadingMe } = useMe();
  const [createBalanceTransaction] = useCreateBalanceTransaction();
  const [checkBalanceTransaction] = useCheckBalanceTransaction();

  const [transactionType, setTransactionType] = useState<TransactionType>('refill');
  const handleTransactionTypeChange = (
    e: ChangeEvent<{}>,
    type: TransactionType,
  ) => {
    setTransactionType(type);
  };

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);

  const [amount, setAmount] = useState(0); // In dollars
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    setAmount(Number(e.target.value));
  };

  const stripe = useStripe();
  const elements = useElements();
  const handleCardChange = ({ error }: any) => {
    setError(error);
  };

  const notEnoughtMoneyToWithdrawal =
    transactionType === 'withdrawal' && amount * 100 > (me?.balance?.balance || 0);

  const makeTransaction = async () => {
    if (transactionType === 'withdrawal') {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    const card: any = elements.getElement(CardElement);

    /** VALIDATION **/
    if (!amount) {
      throw 'Укажите необходимую сумму';
    } else if (card._empty) {
      throw 'Заполните данные карты';
    } else if (card._invalid) {
      return;
    }

    /** CREATE TRANSACTION **/
    const createTransactionRes = await createBalanceTransaction({
      variables: { amount: amount * 100 },
    });
    const transactionClientSecret =
      createTransactionRes.data?.createBalanceTransaction.clientSecret;
    if (!transactionClientSecret) {
      throw 'TransactionClientSecret key was not received';
    }

    /** CREATE PAYMENT METHOD **/
    const {
      error: createPaymentMethodError,
      paymentMethod,
    } = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
      billing_details: {
        name: `${me?.familyName} ${me?.givenName}`,
      },
    });

    if (createPaymentMethodError?.message) {
      throw createPaymentMethodError.message;
    } else if (!paymentMethod) {
      throw 'PaymentMethod was not created';
    }

    /** REFILL **/
    const {
      error: confirmCardPaymentError,
      paymentIntent,
    } = await stripe.confirmCardPayment(transactionClientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: `${me?.familyName} ${me?.givenName}`,
        },
      },
    });
    if (confirmCardPaymentError?.message) {
      throw confirmCardPaymentError.message;
    } else if (paymentIntent?.status !== 'succeeded') {
      throw `PaymentIntent status: ${paymentIntent?.status}`;
    }

    /** WITHDRAWAL */
    // const token = await stripe.createToken(card);

    /** CHECK TRANSACTION */
    await checkBalanceTransaction({
      variables: {
        paymentId: paymentIntent.id,
      },
    });

    /** SUCCESS */
    setSuccessAlertOpen(true);
    setAmount(0);
  };

  const handleTransactionSubmit = (e: FormEvent) => {
    e.preventDefault();

    setError('');

    setTimeout(async () => {
      // Timeout allows the card to be validated,
      // when user click submit while card input is focused and chaged
      setProcessing(true);
      try {
        await makeTransaction();
      } catch (e) {
        setError(e);
      } finally {
        setProcessing(false);
      }
    }, 0);
  };

  const handleSuccessAlertClose = () => setSuccessAlertOpen(false);

  const handleCreateTaskClick = (e: MouseEvent) => {
    e.preventDefault();
    navigate(CREATE_TASK_ROUTE);
  };

  if (loadingMe) {
    return <Loading />;
  }

  return (
    <Box className={c.root}>
      <Typography variant='h2'>
        <Currency value={me?.balance.balance} />
      </Typography>
      <Typography className={c.balanceLabel}>На счету</Typography>

      <Tabs
        value={transactionType}
        onChange={handleTransactionTypeChange}
        indicatorColor='primary'
        textColor='primary'
        variant='fullWidth'
        className={c.tabs}
        disabled={processing}
      >
        <Tab disabled={processing} label='Пополнение' value='refill' />
        <Tab disabled={processing} label='Вывод средств' value='withdrawal' />
      </Tabs>

      <form id={transactionType} onSubmit={handleTransactionSubmit}>
        <TextField
          type='number'
          label={
            notEnoughtMoneyToWithdrawal
              ? 'Недостаточно средств для вывода'
              : transactionType === 'refill'
              ? 'Сумма пополнения'
              : 'Сумма вывода'
          }
          name={transactionType + '-amount'}
          placeholder='0'
          error={notEnoughtMoneyToWithdrawal}
          value={amount || ''}
          onChange={handleAmountChange}
          variant='outlined'
          margin='normal'
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          }}
          inputProps={{
            min: 0,
          }}
        />

        <Box className={c.cardField}>
          <CardElement onChange={handleCardChange} />
        </Box>

        {error && <Error error={error} />}

        <Button
          variant='contained'
          color='primary'
          type='submit'
          size='large'
          fullWidth
          disabled={
            processing || !stripe || !elements || notEnoughtMoneyToWithdrawal
          }
          style={{ marginTop: 14 }}
        >
          {processing ? (
            <CircularProgress style={{ width: 24, height: 24 }} />
          ) : transactionType === 'refill' ? (
            t('Пополнить баланс')
          ) : (
            transactionType === 'withdrawal' && t('Вывести средства')
          )}
        </Button>
      </form>

      <Modal
        open={successAlertOpen}
        onClose={handleSuccessAlertClose}
        fullWidthOnMobile={false}
      >
        <Box className={c.successAlert}>
          <Box className={c.successAlertIconContainer}>
            <FontAwesomeIcon icon={faCheck} className={c.successAlertIcon} />
          </Box>

          <Typography variant='h5' gutterBottom>
            {transactionType === 'refill' && 'Баланс успешно пополнен!'}
            {transactionType === 'withdrawal' && 'Заявка на вывод успешно оформлена'}
          </Typography>

          {transactionType === 'refill' && (
            <>
              <Typography gutterBottom>
                На вашем счету:{' '}
                <Currency
                  className={c.successAlertBalance}
                  value={me?.balance.balance}
                />
              </Typography>
              <Typography className={c.successAlertText}>
                На эти средства вы можете создавать новые задания и выплачивать
                бонусы за их успешное выполнение{' '}
              </Typography>
            </>
          )}
          {transactionType === 'withdrawal' && (
            <Typography className={c.successAlertText}>
              Средства поступят на указанный вами счет{' '}
              <Hidden xsDown>
                <br />
              </Hidden>
              в течение 2-7 business days
            </Typography>
          )}

          <Box m='auto' mt={2}>
            {transactionType === 'refill' && (
              <Button
                href={CREATE_TASK_ROUTE}
                variant='outlined'
                color='primary'
                onClick={handleCreateTaskClick}
              >
                Создать задание
              </Button>
            )}
            {transactionType === 'withdrawal' && (
              <Button
                variant='outlined'
                color='primary'
                onClick={handleSuccessAlertClose}
              >
                Закрыть
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      maxWidth: 400,
      textAlign: 'center',
      margin: 'auto',
      padding: theme.spacing(4, 0),
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(8, 0),
      },
    },
    balanceLabel: {
      textTransform: 'uppercase',
      fontSize: '1.05rem',
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.text.hint,
    },
    tabs: {
      marginTop: theme.spacing(1.25),
      marginBottom: theme.spacing(1),
      borderBottom: '1px solid' + theme.palette.divider,
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1.5),
        borderWidth: 2,
      },
    },
    cardField: {
      padding: theme.spacing(2.75, 1.75, 2.25),
      borderRadius: theme.shape.borderRadius,
      border: '1px solid' + theme.palette.divider,
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(3, 1.75, 2.5),
        borderRadius: theme.shape.borderRadius * 1.5,
      },
    },
    successAlert: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    successAlertIconContainer: {
      marginBottom: theme.spacing(1.5),
      backgroundColor: theme.palette.grey[200],
      borderRadius: '50%',
      margin: 'auto',
      padding: theme.spacing(2.5),
    },
    successAlertIcon: {
      display: 'block',
      color: theme.palette.success.main,
      fontSize: '1.5rem',
      [theme.breakpoints.up('md')]: {
        fontSize: '1.75rem',
      },
    },
    successAlertBalance: {
      color: theme.palette.success.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    successAlertText: {
      fontWeight: theme.typography.body2.fontWeight,
      fontSize: theme.typography.body2.fontSize,
      color: theme.palette.text.secondary,
    },
  }),
);
