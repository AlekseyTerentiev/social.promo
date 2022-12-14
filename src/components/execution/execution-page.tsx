import React, { FC, useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, useMatch, navigate } from '@reach/router';
import { ACCOUNT_TASK_ROUTE, AVAILABLE_TASK_ROUTE, EXECUTION_ROUTE } from 'routes';
import {
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
} from '@material-ui/core';
import { useMe } from 'gql/user';
import { Loading } from 'components/common/loading';
import { AddAccount } from 'components/account/add-account';
import { AvailableTasks } from 'components/execution/available-tasks';
import { AvailableTask } from 'components/execution/available-task';
import { AccountTasks } from 'components/execution/account-tasks';
import { AccountTask } from 'components/execution/account-task';
import { Modal } from 'components/common/modal';
import clsx from 'clsx';
import _ from 'lodash';

import { useStyles } from './execution-page.s';

export interface ExecutionPageProps extends RouteComponentProps {}

export enum ScreenType {
  availableTasks = 'availableTasks',
  accountTasks = 'accountTasks',
}

export const ExecutionPage: FC<ExecutionPageProps> = () => {
  const { t } = useTranslation();
  const c = useStyles();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const { me, loading: loadingMe, refetch: refetchMe } = useMe();
  const account = me?.accounts[0];

  const [screen, setScreen] = useState<ScreenType>(ScreenType.availableTasks);
  const handleScreenChange = (e: ChangeEvent<{}>, screen: ScreenType) => {
    setScreen(screen);
  };

  const availableTaskRouteMatch = useMatch(EXECUTION_ROUTE + AVAILABLE_TASK_ROUTE);
  const accountTaskRouteMatch = useMatch(EXECUTION_ROUTE + ACCOUNT_TASK_ROUTE);

  if (loadingMe) {
    return <Loading />;
  }

  if (
    !account ||
    account.status !== 'verified' ||
    ('accountType' in account && !account.accountType)
  ) {
    return (
      <Box py={3}>
        <AddAccount account={account} onComplete={refetchMe} />
      </Box>
    );
  }

  const detailedTaskModal = (
    <Modal
      open={!!availableTaskRouteMatch || !!accountTaskRouteMatch}
      onClose={() => navigate('../')}
      mobileSlideLeft
      keepMounted
      noContainer
    >
      {availableTaskRouteMatch?.accountId && availableTaskRouteMatch?.taskId && (
        <AvailableTask
          accountId={Number(availableTaskRouteMatch.accountId)}
          taskId={Number(availableTaskRouteMatch.taskId)}
        />
      )}
      {accountTaskRouteMatch?.accountId && accountTaskRouteMatch?.accountTaskId && (
        <AccountTask
          accountId={Number(accountTaskRouteMatch.accountId)}
          accountTaskId={Number(accountTaskRouteMatch.accountTaskId)}
        />
      )}
    </Modal>
  );

  if (mdUp) {
    return (
      <Box className={clsx(c.root, c.rootDesktop)}>
        <AvailableTasks account={account} withHeader />
        <AccountTasks accountId={account.id} withHeader />
        {detailedTaskModal}
      </Box>
    );
  }

  return (
    <Box
      className={c.root}
      // onScroll={handleScroll}
    >
      <Box className={c.account}>
        <Box mb={1}>
          <Typography className={c.label} variant='caption'>
            {t('Rating')}
          </Typography>
          <Typography>{_.round(account.rating, 2)}</Typography>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Avatar src={account.profilePic || undefined} className={c.avatar} />
          <Typography className={c.username}>{account.username}</Typography>
        </Box>
        <Box mb={1}>
          <Typography className={c.label} variant='caption'>
            {t('Level')}
          </Typography>
          <Typography variant='body2'>{t('Newbie')}</Typography>
        </Box>
      </Box>
      <Tabs
        value={screen}
        onChange={handleScreenChange}
        indicatorColor='primary'
        textColor='primary'
        variant='fullWidth'
        className={c.tabs}
      >
        <Tab
          label={t('Available Tasks')}
          value={ScreenType.availableTasks}
          className={c.tab}
        />
        <Tab
          label={t('Accepted Tasks')}
          value={ScreenType.accountTasks}
          className={c.tab}
        />
      </Tabs>

      {screen === ScreenType.availableTasks && <AvailableTasks account={account} />}

      {screen === ScreenType.accountTasks && <AccountTasks accountId={account.id} />}

      {detailedTaskModal}
    </Box>
  );
};
