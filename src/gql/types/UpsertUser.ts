/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Gender, AccountType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertUser
// ====================================================

export interface UpsertUser_upsertUser_balance {
  __typename: "UserBalance";
  id: number;
  balance: number;
}

export interface UpsertUser_upsertUser_accounts_instagramAccount {
  __typename: "InstagramAccount";
  id: number;
  username: string;
  profilePic: string;
  postsAmount: number;
  followersAmount: number;
  accountType: AccountType | null;
  country: string | null;
  region: string | null;
  city: string | null;
  language: string | null;
}

export interface UpsertUser_upsertUser_accounts {
  __typename: "SocialAccount";
  id: number;
  username: string;
  verified: boolean;
  rating: number;
  instagramAccount: UpsertUser_upsertUser_accounts_instagramAccount | null;
}

export interface UpsertUser_upsertUser {
  __typename: "User";
  id: string;
  email: string | null;
  avatarUrl: string | null;
  nickname: string | null;
  givenName: string | null;
  familyName: string | null;
  gender: Gender | null;
  birthDate: any | null;
  phone: string;
  language: string | null;
  locale: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  balance: UpsertUser_upsertUser_balance;
  completedTasks: number;
  accounts: UpsertUser_upsertUser_accounts[];
}

export interface UpsertUser {
  upsertUser: UpsertUser_upsertUser;
}

export interface UpsertUserVariables {
  nickname: string;
  givenName?: string | null;
  familyName?: string | null;
  gender?: Gender | null;
  birthDate?: any | null;
  phone: string;
  language?: string | null;
  locale?: string | null;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  timezone?: string | null;
}
