/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountTaskStatus, TranscationStatus, TaskTypeName } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: VerifyInstagramCommentAccountTask
// ====================================================

export interface VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramStoryAccountTask_taskType {
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

export interface VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramStoryAccountTask {
  __typename: "InstagramStoryAccountTask";
  id: number;
  status: AccountTaskStatus;
  reward: number;
  taskExpiredAt: any;
  /**
   * Date of deadline
   */
  accountTaskExpiredAt: any;
  bonusRate: number;
  bonus: number;
  bonusStatus: TranscationStatus;
  description: string;
  taskType: VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramStoryAccountTask_taskType;
}

export interface VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramCommentAccountTask_taskType {
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

export interface VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramCommentAccountTask_post {
  __typename: "InstagramPost";
  url: string;
  smallPreviewUrl: string | null;
  mediumPreviewUrl: string | null;
  largePreviewUrl: string | null;
  description: string | null;
  ownerUsername: string;
  ownerProfilePic: string | null;
}

export interface VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramCommentAccountTask {
  __typename: "InstagramCommentAccountTask";
  id: number;
  status: AccountTaskStatus;
  reward: number;
  taskExpiredAt: any;
  /**
   * Date of deadline
   */
  accountTaskExpiredAt: any;
  bonusRate: number;
  bonus: number;
  bonusStatus: TranscationStatus;
  description: string;
  taskType: VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramCommentAccountTask_taskType;
  post: VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramCommentAccountTask_post;
}

export type VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask = VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramStoryAccountTask | VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask_InstagramCommentAccountTask;

export interface VerifyInstagramCommentAccountTask {
  verifyInstagramCommentAccountTask: VerifyInstagramCommentAccountTask_verifyInstagramCommentAccountTask;
}

export interface VerifyInstagramCommentAccountTaskVariables {
  accountTaskId: number;
}
