import React, { FC, useState } from 'react';
import { GetAvailableTasks_availableTasks_tasks } from 'gql/types/GetAvailableTasks';
import { useAvailableTasks } from 'gql/tasks';
import {
  makeStyles,
  createStyles,
  Theme,
  Box,
  Typography,
  Divider,
} from '@material-ui/core';
import { Modal } from 'components/modal';
import { Loading } from 'components/loading';
import { Error } from 'components/error';
import { Currency } from 'components/billing/currency';
import { AvailableTask } from './available-task';

export interface AvailableTasksProps {
  accountId: number;
}

export const AvailableTasks: FC<AvailableTasksProps> = ({ accountId }) => {
  const c = useStyles();

  const { availableTasks, pageInfo, loading, error, fetchMore } = useAvailableTasks({
    accountId,
  });

  const [
    selectedTask,
    setSelectedTask,
  ] = useState<GetAvailableTasks_availableTasks_tasks | null>();

  function handleTaskClick(task: GetAvailableTasks_availableTasks_tasks) {
    setSelectedTask(task);
  }

  function handleSelectedTaskDetailsClose() {
    setSelectedTask(null);
  }

  // function handleTakeTask() {
  //   handleSelectedTaskDetailsClose();
  // }

  function handleScroll(e: any) {
    if (!pageInfo?.afterCursor) {
      // if no more content
      return;
    }
    const target = e.target;
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom) {
      fetchMore({
        variables: { afterCursor: pageInfo?.afterCursor },
        updateQuery: ({ availableTasks }: any, { fetchMoreResult }: any) => {
          return {
            availableTasks: {
              ...availableTasks,
              tasks: [
                ...availableTasks.tasks,
                ...fetchMoreResult.availableTasks.tasks,
              ],
              pageInfo: {
                ...fetchMoreResult.availableTasks.pageInfo,
                afterCursor: fetchMoreResult.availableTasks.pageInfo.afterCursor,
              },
            },
          };
        },
      });
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (!availableTasks || error) {
    return (
      <Error header={'Ошибка загрузки доступных заданий'} error={error?.message} />
    );
  }

  return (
    <Box className={c.root}>
      <Typography variant='h4' gutterBottom={Number(pageInfo?.totalRecords) > 0}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <span>Доступные задания</span>
          <Box color='text.hint'>{pageInfo?.totalRecords || ''}</Box>
        </Box>
      </Typography>

      {availableTasks.length > 0 ? (
        <Box mt={1}>
          <Divider className={c.divider} />
          <Box className={c.tasks} onScroll={handleScroll}>
            {availableTasks.map((task) => (
              <Box
                key={task.taskId}
                className={c.task}
                onClick={() => handleTaskClick(task)}
              >
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Typography variant='h6'>
                    <Currency
                      value={
                        task.reward +
                        Math.round((task.reward * task.bonusRate) / 100)
                      }
                    />
                  </Typography>
                  <Typography className={c.taskType}>
                    {task.taskType?.name}
                  </Typography>
                </Box>

                {task.description && (
                  <Typography color='textSecondary' style={{ marginTop: 6 }}>
                    {task.description}
                  </Typography>
                )}

                <Box
                  mt={0.75}
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Typography variant='body2'>Выплата: сразу</Typography>
                  <Typography variant='body2'>Одобрение: авто</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box fontWeight='fontWeightMedium' color='text.hint' mt={1}>
          <Typography>Нет доступных заданий</Typography>
        </Box>
      )}

      <Modal open={!!selectedTask} onClose={handleSelectedTaskDetailsClose}>
        {selectedTask && (
          <AvailableTask
            accountId={accountId}
            task={selectedTask}
            // onTake={handleSelectedTaskDetailsClose}
          />
        )}
      </Modal>
    </Box>
  );
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'initial',
    },
    divider: {
      display: 'none',
      [theme.breakpoints.up('lg')]: {
        marginBottom: theme.spacing(3),
        display: 'block',
      },
    },
    tasks: {
      // [theme.breakpoints.up('lg')]: {
      maxHeight: 560,
      overflowY: 'scroll',
      // },
    },
    task: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2.5, 2, 1.6),
      cursor: 'pointer',
      '&:hover': {
        background: theme.palette.grey['100'],
      },
      marginTop: theme.spacing(1),
    },
    taskType: {
      fontWeight: theme.typography.fontWeightMedium,
    },
  }),
);
