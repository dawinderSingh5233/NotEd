export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AddBranchRequest {
  path: string;
}

export interface RenameBranchRequest {
  branchId: string;
  branchName: string;
}

export interface RemoveBranchRequest {
  branchId: string;
}

export interface AddPageRequest {
  branchId: string;
  pageName: string;
}

export interface RenamePageRequest {
  pageId: string;
  pageName: string;
}

export interface DeletePageRequest {
  pageId: string;
}

export interface GetPageDataRequest {
  pageId: string;
}

export interface AddPageDataRequest {
  pageId: string;
  dataFile: string;
}
