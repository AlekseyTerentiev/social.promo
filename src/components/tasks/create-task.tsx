import React, { FC, useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  Theme,
  createStyles,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { GetTaskTypes_taskTypes } from 'gql/types/GetTaskTypes';
import { useMe, useCreateInstagramCommentTask } from 'gql';
import { DatePicker } from '@material-ui/pickers';

export interface CreateTaskProps {
  taskType: GetTaskTypes_taskTypes;
  onCreate?: () => void;
}

export const CreateTask: FC<CreateTaskProps> = ({ taskType, onCreate }) => {
  const { t } = useTranslation();
  const c = useStyles();

  const { me } = useMe();

  const [
    createInstagramCommentTask,
    { loading: creating, error: creatingError },
  ] = useCreateInstagramCommentTask();

  const [expireAt, handleExpiredDateChange] = useState<any>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  const [newTaskData, setNewTaskData] = useState<{
    postUrl: string;
    description: string;
    // expireAt: Date;
    totalBudget: number;
    bonusRate: number;
  }>({
    postUrl: '',
    description: '',
    // expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    totalBudget: 10, // In dollars
    bonusRate: 10,
  });

  const notEnoughtMoney =
    newTaskData.totalBudget * 100 > (me?.balance?.balance || 0);

  function handleChange(e: ChangeEvent<any>) {
    setNewTaskData({
      ...newTaskData,
      [e.target.name]:
        e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createInstagramCommentTask({
      variables: {
        ...newTaskData,
        taskTypeId: taskType.id,
        totalBudget: newTaskData.totalBudget * 100,
        expireAt,
      },
    });
    if (onCreate) {
      onCreate();
    }
  }

  return (
    <form onSubmit={handleSubmit} className={c.root}>
      <Typography variant='h4'>{t(taskType.title)}</Typography>
      <Box mt={1} />
      <Typography variant='body2' color='textSecondary'>
        {t(taskType.description)}
      </Typography>

      <Box mt={2.5} />

      <TextField
        type='url'
        label='Post Url'
        placeholder='https://www.instagram.com/p/CCEMRtuscla'
        id='postUrl'
        name='postUrl'
        value={newTaskData.postUrl}
        onChange={handleChange}
        variant='outlined'
        margin='dense'
        fullWidth
        autoFocus
        // required
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Description (optional)'
        placeholder=''
        id='description'
        name='description'
        value={newTaskData.description}
        onChange={handleChange}
        variant='outlined'
        margin='dense'
        fullWidth
        multiline
        rows={1}
        rowsMax={3}
      />

      <TextField
        error={notEnoughtMoney}
        type='number'
        label={notEnoughtMoney ? 'Недостаточно средств на счету' : 'Budget'}
        placeholder='0'
        id='totalBudget'
        name='totalBudget'
        value={newTaskData.totalBudget || ''}
        onChange={handleChange}
        variant='outlined'
        margin='dense'
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>,
        }}
        inputProps={{
          min: 0,
        }}
      />

      <FormControl fullWidth margin='dense' variant='outlined'>
        <InputLabel shrink={true}>{t('Expired At')}</InputLabel>
        <DatePicker
          id='expireAt'
          name='expireAt'
          inputVariant='outlined'
          value={expireAt}
          // format='MM/DD/YYYY'
          onChange={handleExpiredDateChange}
          variant='inline'
          autoOk={true}
        />
      </FormControl>

      <TextField
        type='number'
        label='Bonus'
        id='bonusRate'
        name='bonusRate'
        placeholder='0'
        value={newTaskData.bonusRate || ''}
        onChange={handleChange}
        variant='outlined'
        margin='dense'
        fullWidth
        helperText={
          'Наличие чаевых выделяет ваше задание и позволяет привлечь более качественных исполнителей'
        }
        InputProps={{
          startAdornment: <InputAdornment position='start'>%</InputAdornment>,
        }}
        inputProps={{
          min: 0,
          max: 100,
        }}
      />

      <Box mt={1} />

      <Typography variant='body2'>
        Примерное кол-во выполнений:{' '}
        {Math.floor(
          (newTaskData.totalBudget * 100) /
            (taskType.averageCost +
              (taskType.averageCost * newTaskData.bonusRate) / 100),
        )}
      </Typography>

      <Box mt={2} />

      <Button
        type='submit'
        color='primary'
        size='large'
        variant='contained'
        fullWidth
        disabled={
          creating ||
          !newTaskData.postUrl ||
          !newTaskData.totalBudget ||
          !expireAt ||
          notEnoughtMoney
          // !newTaskData.expireAt
        }
      >
        {t('Submit')}
      </Button>

      {creatingError && (
        <Typography color='error' style={{ marginTop: 14 }}>
          {creatingError && creatingError.message}
        </Typography>
      )}
    </form>
  );
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textAlign: 'center',
    },
  }),
);
