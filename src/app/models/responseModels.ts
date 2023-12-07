import { TreeNode } from './dataModels';

export interface IsAutenticatedResponse {
  authenticated: boolean;
  reason: string;
  statusCode: number;
}

export interface LoginResponse {
  statusCode: number;
  token?: string;
  userId?: string;
  message?: string;
  data?: string;
}

export interface SignupResponse {
  statusCode: number;
  message: string;
  userId?: string;
  data?: string;
}

export interface GetTreeBranchesResponse {
  statusCode: number;
  branches?: TreeNode[];
  message?: string;
  data?: string;
}

export interface AddBranchResponse {
  statusCode: number;
  branchId?: string;
  branchName?: string;
  message?: string;
  data?: string;
}

export interface RenameBranchResponse {
  statusCode: number;
  branchId?: string;
  branchName?: string;
  message?: string;
}

export interface RemoveBranchResponse {
  statusCode: number;
  message?: string;
  deletedBranch?: string;
}

export interface AddPageResponse {
  statusCode: number;
  pageId?: string;
  branchPages?: string;
  message?: string;
  data?: string;
}

export interface RenamePageResponse {
  statusCode: number;
  pageId?: string;
  pageData?: string;
  message?: string;
}

export interface DeletePageResponse {
  statusCode: number;
  message: string;
  branchdata?: string;
}

export interface GetPageDataResponse {
  statusCode: number;
  pageId?: string;
  pageData?: string;
  message?: string;
}

export interface AddPageDataResponse {
  statusCode: number;
  pageId?: string;
  pageData?: string;
}
