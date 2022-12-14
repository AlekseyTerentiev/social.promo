import React, { FC, useState, ChangeEvent } from 'react';
import { useMe } from 'gql/user';
import { useTranslation } from 'react-i18next';
import { useAvailableTasks, useAvailableTask } from 'gql/available-tasks';
import { useTakeInstagramCommentTask } from 'gql/instagram-comment-task';
import { useTakeInstagramStoryTask } from 'gql/instagram-story-task';
import { navigate } from '@reach/router';
import { accountTaskRoute } from 'routes';
import {
  Container,
  Box,
  Typography,
  Link,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@material-ui/core';
import { Loading } from 'components/common/loading';
import { Error } from 'components/common/error';
import { AccountStatsBanner } from 'components/account/account-stats-banner';
import { Currency } from 'components/billing/currency';
import CopyToClipboard from 'react-copy-to-clipboard';
import { PostDescription } from 'components/common/post-description';

import { useStyles } from './available-task.s';

export interface AvailableTaskProps {
  accountId: number;
  taskId: number;
}

export const AvailableTask: FC<AvailableTaskProps> = ({ accountId, taskId }) => {
  const c = useStyles();
  const { t } = useTranslation();

  const { me } = useMe();
  const account = me?.accounts.find((account) => account.id === accountId);

  const { availableTasks, loading, error } = useAvailableTasks({ accountId });
  const { availableTask } = useAvailableTask({ taskId });
  const task = availableTasks?.find((task) => task.id === taskId) || availableTask;

  const [
    takeInstagramCommentTask,
    { loading: takingCommentTask, error: takeCommentTaskError },
  ] = useTakeInstagramCommentTask(accountId, taskId);
  const [
    takeInstagramStoryTask,
    { loading: takingStoryTask, error: takeStoryTaskError },
  ] = useTakeInstagramStoryTask(accountId, taskId);
  const taking = takingCommentTask || takingStoryTask;
  const takingError = takeCommentTaskError || takeStoryTaskError;

  const [customerWishesAgreed, setCustomerWishesAgreed] = useState(false);
  const handleCustomerWishesAgreedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomerWishesAgreed(e.target.checked);
  };

  const handleTakeTask = async () => {
    let takenTaskId: number | undefined;
    if (!task) {
      return;
    }
    if (task.__typename === 'AvailableInstagramCommentTask') {
      const takenTask = await takeInstagramCommentTask({
        variables: { accountId, taskId },
      });
      takenTaskId = takenTask.data?.takeInstagramCommentTask?.id;
    } else if (task.__typename === 'AvailableInstagramStoryTask') {
      const takenTask = await takeInstagramStoryTask({
        variables: { accountId, taskId },
      });
      takenTaskId = takenTask.data?.takeInstagramStoryTask?.id;
    }
    if (takenTaskId) {
      navigate(accountTaskRoute(accountId, takenTaskId), { replace: true });
      (window as any).gtag('event', 'task_take', {
        type: task.taskType.type,
        reward: task.reward,
      });
      (window as any).fbq('trackCustom', 'task_take', {
        type: task.taskType.type,
        reward: task.reward,
      });
    }
  };

  const tip = task ? Math.round((task.reward * task.bonusRate) / 100) : 0;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error name={t('Loading Error')} error={error} />;
  }

  if (!task) {
    return null;
    // return <Error name={t('Task not found')} />;
  }

  const taskRequirement =
    task.__typename === 'AvailableInstagramCommentTask'
      ? `${t('Join discussion')} (${t('minimum 4 words')})`
      : task.__typename === 'AvailableInstagramStoryTask'
      ? `${t('Publish story with')} ${
          task.websiteUrl && !task.accountUsername
            ? t('destination link')
            : !task.websiteUrl && task.accountUsername
            ? t('mention account')
            : t('destination link and account username')
        }`
      : '';

  const needStatsVerify =
    task.__typename === 'AvailableInstagramStoryTask' &&
    !account?.statisticDataVerified;

  const acceptDisabled =
    needStatsVerify || (task.description && !customerWishesAgreed) || taking;

  return (
    <>
      {account && needStatsVerify && <AccountStatsBanner account={account} />}
      <Container>
        <Typography className={c.label}>{t('Task info')}</Typography>
        <Typography className={c.type}>
          {t(task.taskType?.name)} #{task.id}
        </Typography>

        <Box mt={1.5}>
          <Typography className={c.label}>{t('Payment Info')}</Typography>
          <Box display='flex' alignItems='baseline' flexWrap='wrap'>
            {needStatsVerify && 'costTo' in task ? (
              <Typography className={c.reward}>
                {t('up to')} <Currency value={task.costTo} />
              </Typography>
            ) : (
              <>
                <Typography className={c.reward}>
                  <Currency value={task.reward + tip} />
                </Typography>
                <Typography className={c.rewardDetailed}>
                  <Currency value={task.reward} /> + {t('tip')}{' '}
                  <Currency value={tip} />
                </Typography>
              </>
            )}
            <Box ml='auto' />
            <Typography className={c.payout}>
              {t('Payout')}: {t(task.taskType.payoutType)}
            </Typography>
          </Box>
        </Box>

        {task.__typename === 'AvailableInstagramCommentTask' && (
          <Box mt={1.5} mb={2}>
            <Typography className={c.label} style={{ marginBottom: 8 }}>
              {t('Target Post')}
            </Typography>
            <PostDescription post={task.post} />
          </Box>
        )}

        {task.__typename === 'AvailableInstagramStoryTask' &&
          task.layoutMediaUrls.length > 0 && (
            <Box mt={1.5} mb={2}>
              <Typography className={c.label}>{t('Attached Files')}</Typography>
              {task.layoutMediaUrls.map((url) => (
                <img key={url} src={url} className={c.layoutMedia} alt='' />
              ))}
            </Box>
          )}

        {task.__typename === 'AvailableInstagramStoryTask' && task.websiteUrl && (
          <Box mt={1.5}>
            <Typography className={c.label}>{t('Destination Link')}</Typography>
            <Box className={c.linkContainer}>
              <Link className={c.link} href={task.websiteUrl} target='_blank'>
                {task.websiteUrl}
              </Link>
              <CopyToClipboard text={task.websiteUrl}>
                <Button
                  className={c.copyButton}
                  data-clipboard-text={task.websiteUrl}
                  aria-label={t('Copy Link')}
                >
                  {t('Copy Link')}
                </Button>
              </CopyToClipboard>
            </Box>
          </Box>
        )}

        {task.__typename === 'AvailableInstagramStoryTask' && task.accountUsername && (
          <Box mt={1.5}>
            <Typography className={c.label}>{t('Mention Account')}</Typography>
            <Box className={c.linkContainer}>
              <Link
                className={c.link}
                href={'https://www.instagram.com/' + task.accountUsername}
                target='_blank'
                noWrap
              >
                @{task.accountUsername}
              </Link>
              <CopyToClipboard text={task.accountUsername}>
                <Button
                  className={c.copyButton}
                  data-clipboard-text={task.accountUsername}
                  aria-label={t('Copy Username')}
                >
                  {t('Copy Username')}
                </Button>
              </CopyToClipboard>
            </Box>
          </Box>
        )}

        <Box mt={1.5}>
          <Typography className={c.label}>{t('Requirements')}</Typography>
          {task.description ? (
            <FormGroup>
              <FormControlLabel
                className={c.checkboxControlLabel}
                control={
                  <Checkbox
                    disabled={needStatsVerify}
                    checked={true}
                    className={c.checkbox}
                    name='defaultRequirementAgreed'
                    color='primary'
                  />
                }
                label={taskRequirement}
              />
              <FormControlLabel
                className={c.checkboxControlLabel}
                control={
                  <Checkbox
                    disabled={needStatsVerify}
                    onChange={handleCustomerWishesAgreedChange}
                    className={c.checkbox}
                    name='customerWishesAgreed'
                    color='primary'
                  />
                }
                label={task.description}
              />
            </FormGroup>
          ) : (
            <Typography>{taskRequirement}</Typography>
          )}
        </Box>

        {takingError && <Error error={takingError} />}

        <Box mt={2}>
          <Button
            color='primary'
            variant='contained'
            fullWidth
            size='large'
            disabled={acceptDisabled}
            onClick={handleTakeTask}
          >
            {t('Accept')}
          </Button>
        </Box>
      </Container>
    </>
  );
};
