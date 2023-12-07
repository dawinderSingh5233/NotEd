import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GetTreeBranchesResponse } from '../models/responseModels';
import { Page, TreeNode } from '../models/dataModels';
import { AddBranchRequest } from '../models/requestModels';
import { RemoteTreeService } from './remote-tree.service';

@Injectable({
  providedIn: 'root',
})
export class TreeDataService {
  treeData!: TreeNode[];
  treeDataChanged = new EventEmitter<TreeNode[]>();

  constructor(
    private http: HttpClient,
    private remoteTreeService: RemoteTreeService
  ) {}

  async initalizeTree() {
    this.treeData = await this.remoteTreeService.fetchTreeData();
    this.onTreeDataChanged();
  }

  getTreeData() {
    return this.treeData.slice();
  }

  addChangeListener() {
    return this.treeDataChanged;
  }

  async onTreeDataChanged() {
    this.treeDataChanged.emit(this.getTreeData());
  }

  addOrRenameBranch(
    oldBranchName: string,
    newBranchName: string,
    path: string
  ) {
    let parentBranchRef = this.getParentBranchRef(path);

    if (parentBranchRef) {
      if (oldBranchName.length > 0) {
        this.renameBranch(path, newBranchName);
      } else {
        this.addBranch(path, parentBranchRef, newBranchName);
      }
    } else {
      if (oldBranchName.length > 0) {
        this.renameTopLevelNode(oldBranchName, newBranchName);
      } else {
        this.addTopLevelNode(newBranchName);
      }
    }

    this.onTreeDataChanged();
  }

  async addTopLevelNode(branchName: string) {
    let response = await this.remoteTreeService.addNewBranch(branchName);
    if (response.statusCode === 200) {
      this.treeData.push({
        branchId: response.branchId ? response.branchId : '',
        branchName: branchName,
        childs: [],
        pages: [],
      });
      this.initalizeTree();
    } else {
      //Show a toast with message that something went wrong
    }
  }

  async renameTopLevelNode(oldBranchName: string, newBranchName: string) {
    let index = this.getBranchIndex(this.treeData, oldBranchName);
    let treeData = this.getTreeData();
    let elementRef = treeData[index];

    let response = await this.remoteTreeService.renameBranch(
      elementRef.branchId,
      newBranchName
    );
    if (response.statusCode === 200) {
      elementRef.branchName = newBranchName;
    } else {
      //show a toast that something went wrong
    }
  }

  async addBranch(
    path: string,
    parentBranchRef: TreeNode,
    newBranchName: string
  ) {
    path = this.getParentPath(path) + '/' + newBranchName;
    let response = await this.remoteTreeService.addNewBranch(path);

    if (response.statusCode === 200) {
      let newBranch: TreeNode = {
        branchId: response.branchId ? response.branchId : '',
        branchName: newBranchName,
        childs: [],
        pages: [],
      };

      parentBranchRef.childs.push(newBranch);

      //Show a toast that new branch is added
    } else {
      //Show a taost that something went wrong
    }

    this.removeChildFromTree(parentBranchRef, '');
  }

  getParentPath(path: string) {
    let pathArr = path.split('/');
    pathArr = pathArr.slice(0, pathArr.length - 1);
    return pathArr.join('/');
  }

  async renameBranch(path: string, newBranchName: string) {
    let nodeRef = this.getLastNodeRef(path);
    if (nodeRef) {
      let id = nodeRef.branchId;
      let response = await this.remoteTreeService.renameBranch(
        id,
        newBranchName
      );

      if (response.statusCode === 200) {
        nodeRef.branchName = newBranchName;
        //Show a toast with message of: Branch renamed successfully
      } else {
        //Show a toast with message that something went wrong while renaming
      }
    }
  }

  removeChildFromTree(tree: TreeNode, branchName: string) {
    tree.childs = tree.childs.filter((branch) => {
      return branch.branchName.toLowerCase() !== branchName.toLowerCase();
    });
  }

  removeChildFromPath(treePath: string, branchName: string) {
    let treeRef = this.getParentBranchRef(treePath);

    if (treeRef) {
      treeRef.childs = treeRef.childs.filter((branch) => {
        return branch.branchName.toLowerCase() !== branchName.toLowerCase();
      });
    }

    this.onTreeDataChanged();
  }

  async removeNode(path: string) {
    let elementRef = this.getLastNodeRef(path);

    if (elementRef) {
      await this.remoteTreeService.removeBranch(elementRef.branchId);
      this.initalizeTree();
    }
  }

  //Checks if the branch with the given name already exists in the incoming tree or not.
  isNodeAlreadyPresentInTree(tree: TreeNode, branchName: string) {
    let branches = tree.childs;
    return branches.some((branch) => {
      return branch.branchName.toLowerCase() === branchName.toLowerCase();
    });
  }

  //Same as the above method, but Here it accepts the tree path instead of accepting tree object.
  isNodeAlreadyPresentInPath(
    path: string,
    branchName: string,
    branchId: string
  ) {
    let parentBranchRef = this.getParentBranchRef(path);

    if (parentBranchRef) {
      let siblings = parentBranchRef.childs;
      let isPresent = siblings.some((sibling) => {
        return (
          sibling.branchName.toLowerCase() === branchName.toLowerCase() &&
          sibling.branchId !== branchId
        );
      });

      return isPresent;
    }

    return false;
  }

  // Returns the Reference of Parent Node of last node in incoming path
  getParentBranchRef(path: string) {
    let pathArr = path.split('/');
    let currTree = this.getTreeData();
    let parentRef: TreeNode | undefined = undefined;

    for (let i = 0; i < pathArr.length - 1; i++) {
      let index = this.getBranchIndex(currTree, pathArr[i]);

      if (i === pathArr.length - 2) {
        parentRef = currTree[index];
        break;
      } else {
        currTree = currTree[index].childs;
      }
    }

    return parentRef;
  }

  //Returns the Index of given Branch name from the Array
  getBranchIndex(branches: TreeNode[], branchName: string) {
    return branches.findIndex((currBranch) => {
      return currBranch.branchName.toLowerCase() === branchName.toLowerCase();
    });
  }

  getLastNodeRef(path: string) {
    let pathArr = path.split('/');
    let currTree = this.getTreeData();
    let lastNode: TreeNode | undefined;

    for (let i = 0; i < pathArr.length; i++) {
      let index = this.getBranchIndex(currTree, pathArr[i]);

      if (i === pathArr.length - 1) {
        lastNode = currTree[index];
      } else {
        currTree = currTree[index].childs;
      }
    }

    return lastNode;
  }

  getPageList(path: string) {
    let nodeRef = this.getLastNodeRef(path);
    let pages: Page[] | undefined;

    if (nodeRef) {
      pages = nodeRef.pages;
    }

    return pages;
  }

  isPageAlreadyPresent(parentPath: string, newPageName: string) {
    let pageList = this.getPageList(parentPath);

    if (!pageList) {
      return false;
    } else {
      let res = pageList.some((page) => {
        return page.pageName.toLowerCase() === newPageName.toLowerCase();
      });
      console.log(res);
      return res;
    }
  }

  async addOrRenamePage(
    path: string,
    oldPageName: string,
    newPageName: string
  ) {
    let elementRef = this.getLastNodeRef(path);

    if (elementRef) {
      if (oldPageName.length > 0) {
        this.renamePage(elementRef, oldPageName, newPageName);
      } else {
        this.addPage(elementRef, newPageName);
        this.removePageFromPath(path, '');
      }
    }

    this.onTreeDataChanged();
  }

  async addPage(elementRef: TreeNode, newPageName: string) {
    let branchId = elementRef.branchId;
    let response = await this.remoteTreeService.addPage(branchId, newPageName);
    if (response.statusCode === 200) {
      elementRef.pages.push({
        pageId: response.pageId ? response.pageId : '',
        pageName: newPageName,
      });
    } else {
      // Show a toast that unable to add new page
    }
  }

  async renamePage(
    elementRef: TreeNode,
    oldPageName: string,
    newPageName: string
  ) {
    let pageIndex = elementRef.pages.findIndex((page) => {
      return page.pageName.toLowerCase() === oldPageName.toLowerCase();
    });
    let page = elementRef.pages[pageIndex];
    let pageId = page.pageId;

    let response = await this.remoteTreeService.renamePage(pageId, newPageName);

    if (response.statusCode === 200) {
      page.pageId = response.pageId ? response.pageId : '';
      page.pageName = newPageName;
    } else {
      //show a toast message with something went wrong
    }
  }

  removePageFromPath(path: string, branchName: string) {
    let elementRef = this.getLastNodeRef(path);

    if (elementRef) {
      elementRef.pages = elementRef.pages.filter((page) => {
        return page.pageName.toLowerCase() !== branchName.toLowerCase();
      });
    }

    this.onTreeDataChanged();
  }

  async deletePage(pageId: string) {
    let response = await this.remoteTreeService.deletePage(pageId);
    if (response.statusCode === 200) {
      //show that apge is deleted
      this.initalizeTree();
    } else {
      //show something went wrong
    }
  }
}
