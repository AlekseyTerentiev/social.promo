/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus, AccountTaskStatus, AccountTaskRating, FeedBackType, TaskTypeName } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateInstagramStoryTask
// ====================================================

export interface CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_accountTasks_InstagramCommentTaskAccountTask {
  __typename: "InstagramCommentTaskAccountTask";
  taskId: number;
  accountId: number;
  accountTaskId: number;
  status: AccountTaskStatus;
  username: string;
  profilePic: string;
  completedAt: any | null;
  rating: AccountTaskRating | null;
  feedback: FeedBackType | null;
  commentText: string;
}

export interface CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_accountTasks_InstagramStoryTaskAccountTask {
  __typename: "InstagramStoryTaskAccountTask";
  taskId: number;
  accountId: number;
  accountTaskId: number;
  status: AccountTaskStatus;
  username: string;
  profilePic: string;
  completedAt: any | null;
  rating: AccountTaskRating | null;
  feedback: FeedBackType | null;
  storyUrl: string | null;
  storyScreenshotMediaLink: string | null;
}

export type CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_accountTasks = CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_accountTasks_InstagramCommentTaskAccountTask | CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_accountTasks_InstagramStoryTaskAccountTask;

export interface CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_taskType {
  __typename: "TaskType";
  id: number;
  name: string;
  title: string;
  description: string;
  averageCost: number;
  companyCommission: number;
  type: TaskTypeName;
  ready: boolean;
}

export interface CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_post {
  __typename: "InstagramPost";
  url: string;
  smallPreviewUrl: string | null;
  mediumPreviewUrl: string | null;
  largePreviewUrl: string | null;
  description: string | null;
  ownerUsername: string;
  ownerProfilePic: string | null;
}

export interface CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask {
  __typename: "InstagramCommentTask";
  id: number;
  description: string;
  verified: boolean;
  expiredAt: any;
  totalBudget: number;
  currentBudget: number;
  bonusRate: number;
  status: TaskStatus;
  accountTasks: CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_accountTasks[];
  taskType: CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_taskType;
  post: CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask_post;
}

export interface CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask_accountTasks_InstagramCommentTaskAccountTask {
  __typename: "InstagramCommentTaskAccountTask";
  taskId: number;
  accountId: number;
  accountTaskId: number;
  status: AccountTaskStatus;
  username: string;
  profilePic: string;
  completedAt: any | null;
  rating: AccountTaskRating | null;
  feedback: FeedBackType | null;
  commentText: string;
}

export interface CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask_accountTasks_InstagramStoryTaskAccountTask {
  __typename: "InstagramStoryTaskAccountTask";
  taskId: number;
  accountId: number;
  accountTaskId: number;
  status: AccountTaskStatus;
  username: string;
  profilePic: string;
  completedAt: any | null;
  rating: AccountTaskRating | null;
  feedback: FeedBackType | null;
  storyUrl: string | null;
  storyScreenshotMediaLink: string | null;
}

export type CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask_accountTasks = CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask_accountTasks_InstagramCommentTaskAccountTask | CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask_accountTasks_InstagramStoryTaskAccountTask;

export interface CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask_taskType {
  __typename: "TaskType";
  id: number;
  name: string;
  title: string;
  description: string;
  averageCost: number;
  companyCommission: number;
  type: TaskTypeName;
  ready: boolean;
}

export interface CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask {
  __typename: "InstagramStoryTask";
  id: number;
  description: string;
  verified: boolean;
  expiredAt: any;
  totalBudget: number;
  currentBudget: number;
  bonusRate: number;
  status: TaskStatus;
  accountTasks: CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask_accountTasks[];
  taskType: CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask_taskType;
  needApprove: boolean;
  accountUsername: string | null;
  websiteUrl: string | null;
  layoutMediaUrls: string[];
}

export type CreateInstagramStoryTask_createInstagramStoryTask = CreateInstagramStoryTask_createInstagramStoryTask_InstagramCommentTask | CreateInstagramStoryTask_createInstagramStoryTask_InstagramStoryTask;

export interface CreateInstagramStoryTask {
  createInstagramStoryTask: CreateInstagramStoryTask_createInstagramStoryTask;
}

export interface CreateInstagramStoryTaskVariables {
  taskTypeId: number;
  description: string;
  expiredAt: any;
  totalBudget: number;
  bonusRate: number;
  costFrom: number;
  costTo: number;
  needApprove: boolean;
  accountUsername?: string | null;
  websiteUrl?: string | null;
  layoutMediaUrls: string[];
}
