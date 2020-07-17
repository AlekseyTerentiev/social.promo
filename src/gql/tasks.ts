import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ME } from './user';
import { TASK_TYPE_DATA } from './task-types';

import {
  GetAvailableTasks,
  GetAvailableTasksVariables,
} from './types/GetAvailableTasks';
import { GetAccountTasks, GetAccountTasksVariables } from './types/GetAccountTasks';
import {
  CreateInstagramCommentTask,
  CreateInstagramCommentTaskVariables,
} from './types/CreateInstagramCommentTask';
import {
  TakeInstagramCommentTask,
  TakeInstagramCommentTaskVariables,
} from './types/TakeInstagramCommentTask';

export const INSTAGRAM_POST_DATA = gql`
  fragment InstagramPostData on InstagramPost {
    displayUrl
    description
    ownerUsername
  }
`;

export const AVAILABLE_INSTAGRAM_COMMENT_TASK_DATA = gql`
  fragment AvailableInstagramCommentTaskData on AvailableInstagramCommentTask {
    postUrl
    post {
      ...InstagramPostData
    }
  }
  ${INSTAGRAM_POST_DATA}
`;

export const DETAILED_TASK_DATA = gql`
  fragment DetailedTaskData on DetailedTask {
    id
    description
    verified
    expiredAt
    totalBudget
    currentBudget
    bonusRate
    taskType {
      ...TaskTypeData
    }
    instagramCommentTask {
      ...AvailableInstagramCommentTaskData
    }
  }
  ${TASK_TYPE_DATA}
  ${AVAILABLE_INSTAGRAM_COMMENT_TASK_DATA}
`;

export const GET_AVAILABLE_TASKS = gql`
  query GetAvailableTasks(
    $accountId: Int!
    $beforeCursor: String
    $afterCursor: String
    $limit: Int
  ) {
    availableTasks(
      data: {
        accountId: $accountId
        pageInfo: {
          beforeCursor: $beforeCursor
          afterCursor: $afterCursor
          limit: $limit
        }
      }
    ) {
      tasks {
        taskId
        description
        verified
        expiredAt
        bonusRate
        reward
        taskType {
          ...TaskTypeData
        }
        instagramCommentTask {
          ...AvailableInstagramCommentTaskData
        }
      }
      pageInfo {
        beforeCursor
        afterCursor
        limit
        totalPages
        totalRecords
      }
    }
  }
  ${TASK_TYPE_DATA}
  ${AVAILABLE_INSTAGRAM_COMMENT_TASK_DATA}
`;

export const GET_ACCOUNT_TASKS = gql`
  query GetAccountTasks($accountId: Int!) {
    accountTasks(accountId: $accountId) {
      id
      description
      status
      rating
      reward
      expiredAt
      bonusRate
      bonus
      taskType {
        ...TaskTypeData
      }
      instagramCommentTask {
        ...AvailableInstagramCommentTaskData
      }
    }
  }
  ${TASK_TYPE_DATA}
  ${AVAILABLE_INSTAGRAM_COMMENT_TASK_DATA}
`;

export const CREATE_INSTAGRAM_COMMENT_TASK = gql`
  mutation CreateInstagramCommentTask(
    $taskTypeId: Int!
    $postUrl: String!
    $description: String!
    $expiredAt: Date!
    $totalBudget: Float!
    $bonusRate: Int!
  ) {
    createInstagramCommentTask(
      data: {
        taskTypeId: $taskTypeId
        postUrl: $postUrl
        description: $description
        expiredAt: $expiredAt
        totalBudget: $totalBudget
        bonusRate: $bonusRate
      }
    ) {
      id
      postUrl
      description
      verified
      expiredAt
      totalBudget
      currentBudget
      bonusRate
      taskType {
        ...TaskTypeData
      }
    }
  }
  ${TASK_TYPE_DATA}
`;

export const TAKE_INSTAGRAM_COMMENT_TASK = gql`
  mutation TakeInstagramCommentTask($taskId: Int!, $accountId: Int!) {
    takeInstagramCommentTask(data: { taskId: $taskId, accountId: $accountId }) {
      accountTaskId
      postUrl
      description
      expiredAt
      reward
      bonus
    }
  }
`;

/*=== HOOKS ===*/

export const useAvailableTasks = (variables: GetAvailableTasksVariables) => {
  const q = useQuery<GetAvailableTasks, GetAvailableTasksVariables>(
    GET_AVAILABLE_TASKS,
    { variables },
  );
  return {
    availableTasks: q.data?.availableTasks.tasks,
    pageInfo: q.data?.availableTasks.pageInfo,
    ...q,
  };
};

export const useTakeInstagramCommentTask = () => {
  return useMutation<TakeInstagramCommentTask, TakeInstagramCommentTaskVariables>(
    TAKE_INSTAGRAM_COMMENT_TASK,
    {
      update(cache, { data }) {
        // todo: remove taken task from available tasks array in cache
        // console.log(data);
        // const cachedData: any = cache.readQuery({ query: GET_AVAILABLE_TASKS });
        // console.log(cachedData);
        // cache.writeQuery({
        //   query: GET_AVAILABLE_TASKS,
        //   data: { investments: [...cachedData.investments, createInvestment] },
        // });
      },
      // refetchQueries: [{ query: GET_ACCOUNT_TASKS }],
      // refetchQueries: [{ query: GET_AVAILABLE_TASKS }],
      // todo: remove taken task from available tasks
    },
  );
};

// import { useApolloClient, useQuery } from '@apollo/react-hooks';
// import { GET_AVAILABLE_TASKS } from 'gql/tasks';
// const cachedAvailableTasks: any = apolloClient.cache.readQuery({
//   query: GET_AVAILABLE_TASKS,
//   variables: { accountId: 1, limit: 5 },
// });
// console.log('cached available tasks', cachedAvailableTasks);

export const useAccountTasks = (variables: GetAccountTasksVariables) => {
  const q = useQuery<GetAccountTasks, GetAccountTasksVariables>(GET_ACCOUNT_TASKS, {
    variables,
  });
  return { accountTasks: q.data?.accountTasks, ...q };
};

export const useCreateInstagramCommentTask = () => {
  return useMutation<
    CreateInstagramCommentTask,
    CreateInstagramCommentTaskVariables
  >(CREATE_INSTAGRAM_COMMENT_TASK, {
    refetchQueries: [{ query: GET_ME }],
  });
};
