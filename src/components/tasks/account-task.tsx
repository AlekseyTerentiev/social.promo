import React, { FC, useEffect } from 'react';
import { useAccountTasks, useVerifyInstagramCommentAccountTask } from 'gql/tasks';
import { RouteComponentProps } from '@reach/router';
import {
  makeStyles,
  createStyles,
  Theme,
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Hidden,
} from '@material-ui/core';
import { Modal } from 'components/modal';
import { Loading } from 'components/loading';
import { Error } from 'components/error';
import { PostDescription } from 'components/post-description';
import { Currency } from 'components/billing/currency';
import Timer from 'react-compound-timer';

export interface AccountTaskProps extends RouteComponentProps {
  accountId?: string;
  accountTaskId?: string;
  onClose: () => void;
}

export const AccountTask: FC<AccountTaskProps> = ({
  accountId,
  accountTaskId,
  onClose,
}) => {
  const c = useStyles();

  const { accountTasks, refetch, loading, error } = useAccountTasks({
    accountId: Number(accountId),
  });

  const [
    verifyInstagramCommentAccountTask,
    { loading: verifying, error: verifyingError },
  ] = useVerifyInstagramCommentAccountTask();

  async function handleVerifyTask() {
    await verifyInstagramCommentAccountTask({
      variables: {
        accountTaskId: Number(accountTaskId),
      },
    });
  }

  const task = accountTasks?.find((task) => task.id === Number(accountTaskId));

  useEffect(() => {
    // Refetch when task expired (todo: refetch one current task, not all)
    if (!task) return;
    const expiredAt = new Date(task.accountTaskExpiredAt);
    let timeout: number;
    if (expiredAt.getTime() > Date.now()) {
      timeout = window.setTimeout(() => {
        refetch();
      }, expiredAt.getTime() - Date.now());
    } else if (task.status === 'inProgress') {
      refetch();
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [task]);

  return (
    <Modal open={true} maxWidth='sm' onClose={onClose}>
      {!accountId || !accountTaskId ? (
        <Error name='Bad request' />
      ) : // ) : loading ? (
      //   <Loading />
      error ? (
        <Error name='Ошибка загрузки заданий' error={error} />
      ) : !task ? (
        <Error name='Задание не найдено' />
      ) : (
        <>
          {task.instagramCommentTask?.post && (
            <PostDescription post={task.instagramCommentTask.post} />
          )}

          <Box mt={2.5} display='flex' justifyContent='space-between'>
            <Box>
              <Typography variant='h6'>
                <Currency value={task.reward + Math.round(task.bonus)} />
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                (<Currency value={task.reward} /> + чай{' '}
                <Currency value={Math.round(task.bonus)} />)
              </Typography>
            </Box>

            <Box mt={0.5}>
              <Typography variant='body2' gutterBottom>
                {task.taskType?.name} #{task.id}
              </Typography>
              <Typography variant='body2'>Выплата: сразу</Typography>
            </Box>
          </Box>

          <Box mt={1.5}>
            <Typography variant='subtitle2'>Описание задания:</Typography>
            {/* <Typography variant='subtitle2'>Заданиe:</Typography> */}
            <Typography variant='body2' color='textSecondary'>
              Необходимо принять участие в дискуссии на тему публикации <br />
              (минимум 4 слова)
            </Typography>
          </Box>

          {task.description && (
            <Box mt={1.5}>
              <Typography variant='subtitle2'>Дополнительные пожелания:</Typography>
              <Typography variant='body2' color='textSecondary'>
                {task.description}
              </Typography>
            </Box>
          )}

          <Box mt={2} mb={2.5}>
            <Divider />
          </Box>

          {task.status === 'expired' && (
            <Typography color='secondary' align='center' variant='body2'>
              Срок выполнения задания истек. <br /> Пожалуйста, возьмите другое
              задание.
            </Typography>
          )}

          {task.status === 'inProgress' && (
            <>
              <Box mt={1.5} className={c.timer}>
                До завершения:{' '}
                <Timer
                  initialTime={
                    new Date(task.accountTaskExpiredAt).getTime() - Date.now()
                  }
                  direction='backward'
                >
                  {() => (
                    <>
                      <Timer.Minutes /> минуты <Timer.Seconds /> секунды
                    </>
                  )}
                </Timer>
              </Box>

              {verifyingError && <Error error={verifyingError} />}

              <Box mt={2} display='flex'>
                <Button
                  target='_blank'
                  href={task.instagramCommentTask.postUrl}
                  color='secondary'
                  style={{ backgroundColor: '#32b336' }}
                  variant='contained'
                  fullWidth
                >
                  Открыть пост
                </Button>
                <Button
                  color='primary'
                  style={{ marginLeft: 8 }}
                  variant='contained'
                  fullWidth
                  disabled={verifying}
                  onClick={handleVerifyTask}
                >
                  {verifying ? (
                    <CircularProgress style={{ width: 24, height: 24 }} />
                  ) : (
                    'Проверить'
                  )}
                </Button>
              </Box>
            </>
          )}

          {task.status === 'completed' && (
            <>
              <Typography
                style={{ color: '#32b336' }}
                align='center'
                variant='body2'
              >
                Задание успешно выполнено! <br />
                <Currency value={task.reward} /> были переведены на ваш счет. <br />
                Чай <Currency value={Math.round(task.bonus)} /> будет переведен чуть
                позже, <br /> если заказчика устроит результат.
              </Typography>
            </>
          )}

          <Hidden mdUp>
            {task.status !== 'inProgress' && (
              <Button
                onClick={onClose}
                variant='outlined'
                color='default'
                style={{ display: 'block', margin: '12px auto 0' }}
              >
                Закрыть
              </Button>
            )}
          </Hidden>
        </>
      )}
    </Modal>
  );
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    timer: {
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.info.main,
      fontSize: '1rem',
      textAlign: 'center',
      width: '100%',
    },
  }),
);
