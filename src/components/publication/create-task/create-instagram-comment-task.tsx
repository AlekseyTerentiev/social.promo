import React, { FC, useState, useMemo, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMe } from 'gql/user';
import { GetTaskTypes_taskTypes } from 'gql/types/GetTaskTypes';
import { useTaskTypeCost } from 'gql/task-types';
import { useCreateInstagramCommentTask } from 'gql/created-tasks';
import {
  makeStyles,
  Theme,
  createStyles,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  IconButton,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { TaskBudgetInput } from './task-budget-input';
import { Error } from 'components/common/error';
import { AccountLanguage, Gender } from 'gql/types/globalTypes';
import { TaskFilters, CreateTaskFilters } from './create-task-filters';
import { LeftOutlined } from '@ant-design/icons';
import { Currency } from 'components/billing/currency';
import _ from 'lodash';
import { RefillBalance } from './refill-balance';

export interface CreateInstagramCommentTaskProps {
  taskType: GetTaskTypes_taskTypes;
  taskTypeSelector: React.ReactNode;
  onCreate?: (taskId: number) => void;
  onCancel?: () => void;
}

export const CreateInstagramCommentTask: FC<CreateInstagramCommentTaskProps> = ({
  taskType,
  taskTypeSelector,
  onCreate,
  onCancel,
}) => {
  const c = useStyles();
  const { t, i18n } = useTranslation();
  const language = i18n.language.split('-')[0];

  const { me } = useMe();

  const [viewIndex, setViewIndex] = useState(0);

  const [postUrl, setPostUrl] = useState('');
  const [totalBudget, setTotalBudget] = useState('5');
  const [bonusRate, setBonusRate] = useState('10');
  const [description, setDescription] = useState('');

  const [filters, setFilters] = useState<TaskFilters>({
    countries: [me?.country || 'US'],
    languages: [
      Object.keys(AccountLanguage).includes(language)
        ? AccountLanguage[language as keyof typeof AccountLanguage]
        : AccountLanguage.en,
    ],
    genders: [Gender.male, Gender.female],
    ageFrom: '18',
    ageTo: '65',
  });

  const handleFiltersChange = (filters: TaskFilters) => {
    setFilters(filters);
  };

  const [expiredAt, handleExpiredDateChange] = useState<any>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  );

  const { taskTypeCost } = useTaskTypeCost({
    id: taskType.id,
    countries: filters.countries,
  });

  const executionCost = {
    from: taskTypeCost?.costFrom || 0,
    to: taskTypeCost?.costTo || 0,
  };

  const executions = useMemo<{ from: number; to: number }>(() => {
    const costFrom =
      executionCost.from + executionCost.from * Number(bonusRate) * 0.01;
    const costTo = executionCost.to + executionCost.to * Number(bonusRate) * 0.01;
    return {
      from: costTo === 0 ? 0 : _.round((Number(totalBudget) * 100) / costTo),
      to: costFrom === 0 ? 0 : _.round((Number(totalBudget) * 100) / costFrom),
    };
  }, [executionCost, totalBudget, bonusRate]);

  const [
    createInstagramCommentTask,
    { loading: creating, error: creatingError },
  ] = useCreateInstagramCommentTask();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const createdTask = await createInstagramCommentTask({
      variables: {
        postUrl,
        description,
        taskTypeId: taskType.id,
        totalBudget: Math.round(Number(totalBudget) * 100),
        bonusRate: Number(bonusRate),
        expiredAt,
        countries: filters.countries,
        languages: filters.languages,
        genders: filters.genders,
        ageFrom: Number(filters.ageFrom),
        ageTo: Number(filters.ageTo),
      },
    });
    const createdTaskId = createdTask.data?.createInstagramCommentTask?.id;
    if (!createdTaskId) {
      return;
    }
    (window as any).gtag('event', 'task_create', {
      type: taskType.type,
      budget: totalBudget,
    });
    (window as any).fbq('trackCustom', 'task_create', {
      type: taskType.type,
      budget: totalBudget,
    });
    if (onCreate) {
      onCreate(createdTaskId);
    }
  };

  const notEnoughtMoney = Number(totalBudget) * 100 > (me?.balance?.balance || 0);
  const budgetValid = Number(totalBudget) && !notEnoughtMoney;
  const filtersValid =
    executions.from !== 0 &&
    filters.countries.length &&
    filters.languages.length &&
    filters.genders.length;
  const submitDisabled =
    creating || !budgetValid || !filtersValid || !expiredAt || !postUrl;

  const handleNextClick = (e: FormEvent) => {
    e.preventDefault();
    setViewIndex(viewIndex + 1);
  };

  const handleBackClick = () => {
    if (viewIndex === 0) {
      return onCancel && onCancel();
    }
    setViewIndex(viewIndex - 1);
  };

  const BackButton = () => (
    <IconButton
      onClick={handleBackClick}
      size='small'
      edge='start'
      className={c.backButton}
    >
      <LeftOutlined />
    </IconButton>
  );

  const NextButton = ({ disabled }: { disabled: boolean }) => (
    <Button
      type='submit'
      color='primary'
      size='large'
      variant='contained'
      fullWidth
      disabled={disabled}
    >
      {t('Next Step')}
    </Button>
  );

  return (
    <>
      {viewIndex === 0 && (
        <form onSubmit={handleNextClick}>
          {taskTypeSelector}

          <Box mt={1.75} />

          <Typography className={c.label}>{t('Filter Influencers')}</Typography>
          <CreateTaskFilters filters={filters} onChange={handleFiltersChange} />

          <Box mt={2} />

          <Box display='flex'>
            {onCancel && <BackButton />}
            <NextButton disabled={!filtersValid} />
          </Box>
        </form>
      )}

      {viewIndex === 1 && (
        <form onSubmit={handleNextClick}>
          <TextField
            type='url'
            label={t('Post Url')}
            placeholder='https://www.instagram.com/p/CCEMRtuscla'
            name='postUrl'
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            variant='outlined'
            margin='dense'
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label={t('Additional wishes')}
            placeholder={`(${t('optional')})`}
            InputLabelProps={{ shrink: true }}
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant='outlined'
            margin='dense'
            fullWidth
            multiline
            rows={1}
            rowsMax={3}
          />

          <FormControl fullWidth margin='dense' variant='outlined'>
            <InputLabel shrink={true}>{t('Expired at')}</InputLabel>
            <DatePicker
              id='expiredAt'
              name='expiredAt'
              inputVariant='outlined'
              value={expiredAt}
              // format='MM/DD/YYYY'
              onChange={handleExpiredDateChange}
              variant='inline'
              autoOk={true}
            />
          </FormControl>

          <Box mt={2} />

          <Box display='flex'>
            <BackButton />
            <NextButton disabled={!postUrl || !expiredAt} />
          </Box>
        </form>
      )}

      {viewIndex === 2 && (
        <form onSubmit={handleSubmit}>
          <div className={c.predict}>
            <Box>
              <Typography className={c.predictValue}>
                {executionCost.from !== 0 &&
                  executionCost.from !== executionCost.to && (
                    <>
                      <Currency value={executionCost.from} /> -{' '}
                    </>
                  )}
                <Currency value={executionCost.to} />
              </Typography>
              <Typography className={c.predictLabel}>
                {t('comment price')}
              </Typography>
            </Box>
            <Box mx={1} />
            <Box textAlign='right'>
              <Typography className={c.predictValue}>
                {executions.from !== 0 && executions.from !== executions.to
                  ? `${executions.from} - ${executions.to}`
                  : `~${executions.to}`}
              </Typography>
              <Typography className={c.predictLabel}>
                {t('number of comments')}
              </Typography>
            </Box>
          </div>

          <TaskBudgetInput
            budget={totalBudget}
            bonus={bonusRate}
            onBudgetChange={setTotalBudget}
            onBonusChange={setBonusRate}
          />

          <Box mt={2.5}>
            {notEnoughtMoney ? (
              <RefillBalance />
            ) : (
              <Box display='flex'>
                <BackButton />
                <Button
                  type='submit'
                  color='primary'
                  size='large'
                  variant='contained'
                  fullWidth
                  disabled={submitDisabled}
                >
                  {creating ? (
                    <CircularProgress style={{ width: 28, height: 28 }} />
                  ) : (
                    t('Publish')
                  )}
                </Button>
              </Box>
            )}
          </Box>
        </form>
      )}

      {creatingError && <Error error={creatingError} />}
    </>
  );
};

export const useStyles = makeStyles((t: Theme) =>
  createStyles({
    root: {},
    predict: {
      padding: t.spacing(0.5, 0, 1.75),
      display: 'flex',
      justifyContent: 'space-between',
    },
    predictValue: {
      color: t.palette.primary.main,
      fontWeight: t.typography.fontWeightBold,
      fontSize: '1.35rem',
    },
    predictLabel: {
      fontSize: '0.95rem',
      lineHeight: 1.2,
      color: '#48484a',
    },
    label: {
      color: 'rgba(166, 167, 177, 1)',
      textTransform: 'uppercase',
      fontWeight: 600,
      fontSize: 12,
      lineHeight: '18px',
      letterSpacing: 0.8,
      marginBottom: t.spacing(0.5),
    },
    backButton: {
      marginRight: t.spacing(1),
      color: t.palette.text.hint,
      border: `1px solid ${t.palette.divider}`,
      borderRadius: t.shape.borderRadius,
      padding: 11,
    },
  }),
);
