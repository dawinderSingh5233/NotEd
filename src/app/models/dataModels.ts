export interface ToastData {
  status: 'Success' | 'Error' | 'Info';
  message: string;
}

export interface Page {
  pageId: string;
  pageName: string;
}

export interface TreeNode {
  branchId: string;
  branchName: string;
  childs: TreeNode[];
  pages: Page[];
}
