/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountType } from "./globalTypes";

// ====================================================
// GraphQL fragment: InstagramAccountData
// ====================================================

export interface InstagramAccountData {
  __typename: "InstagramAccount";
  id: number | null;
  instagramId: string | null;
  username: string | null;
  profilePic: string | null;
  postsAmount: number | null;
  followersAmount: number | null;
  accountType: AccountType | null;
}
