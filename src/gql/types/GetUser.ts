/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_getUser {
  __typename: "User";
  id: string | null;
  email: string | null;
  avatarUrl: string | null;
  nickname: string | null;
  givenName: string | null;
  familyName: string | null;
  gender: string | null;
  birthDate: any | null;
  phone: string | null;
  language: string | null;
  locale: string | null;
}

export interface GetUser {
  getUser: GetUser_getUser | null;
}

export interface GetUserVariables {
  id: string;
}
