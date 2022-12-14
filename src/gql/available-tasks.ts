import { gql, useQuery } from '@apollo/client';
import { TASK_TYPE_DATA } from './task-types';
import { INSTAGRAM_POST_DATA } from './instagram-post';
import {
  GetAvailableTasks,
  GetAvailableTasksVariables,
} from './types/GetAvailableTasks';
import {
  GetAvailableTask,
  GetAvailableTaskVariables,
} from './types/GetAvailableTask';

/*------------------------------------------------------------------------------*/
/*   FRAGMENTS                                                                  */
/*------------------------------------------------------------------------------*/

export const AVAILABLE_TASK_DATA = gql`
  fragment AvailableTaskData on AvailableTask {
    id
    verified
    expiredAt
    bonusRate
    reward
    description
    taskType {
      ...TaskTypeData
    }
    ... on AvailableInstagramCommentTask {
      post {
        ...InstagramPostData
      }
    }
    ... on AvailableInstagramStoryTask {
      needApprove
      accountUsername
      websiteUrl
      layoutMediaUrls
      costFrom
      costTo
    }
  }
  ${TASK_TYPE_DATA}
  ${INSTAGRAM_POST_DATA}
`;

/*------------------------------------------------------------------------------*/
/*   QUERIES                                                                    */
/*------------------------------------------------------------------------------*/

export const GET_AVAILABLE_TASKS = gql`
  query GetAvailableTasks(
    $accountId: Int!
    $beforeCursor: String
    $afterCursor: String
    $limit: Int
  ) {
    availableTasks(
      accountId: $accountId
      beforeCursor: $beforeCursor
      afterCursor: $afterCursor
      limit: $limit
    ) {
      tasks {
        ...AvailableTaskData
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
  ${AVAILABLE_TASK_DATA}
`;

export const useAvailableTasks = (variables: GetAvailableTasksVariables) => {
  const q = useQuery<GetAvailableTasks, GetAvailableTasksVariables>(
    GET_AVAILABLE_TASKS,
    { variables, notifyOnNetworkStatusChange: true },
  );
  return {
    availableTasks: q.data?.availableTasks.tasks,
    pageInfo: q.data?.availableTasks.pageInfo,
    ...q,
  };
};

export const GET_AVAILABLE_TASK = gql`
  query GetAvailableTask($taskId: Int!) {
    availableTask(taskId: $taskId) {
      ...AvailableTaskData
    }
  }
  ${AVAILABLE_TASK_DATA}
`;

export const useAvailableTask = (variables: GetAvailableTaskVariables) => {
  const q = useQuery<GetAvailableTask, GetAvailableTaskVariables>(
    GET_AVAILABLE_TASK,
    { variables },
  );
  return {
    availableTask: q.data?.availableTask,
    ...q,
  };
};
