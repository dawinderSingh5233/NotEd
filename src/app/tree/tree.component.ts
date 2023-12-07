import { Component, OnInit } from '@angular/core';
import {
  BranchComponent,
  BranchSelectedEvent,
} from './branch/branch.component';
import { TreeDataService } from './tree-data.service';
import { Page, TreeNode } from '../models/dataModels';
import { TreeService } from './tree.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit {
  currSelectedBranch!: BranchComponent | undefined;
  canAddPage: boolean = false;
  nodes!: Array<TreeNode>;

  constructor(
    private treeDataService: TreeDataService,
    private treeService: TreeService
  ) {
    treeDataService.addChangeListener().subscribe((treeData) => {
      this.nodes = treeData;
    });
    this.treeDataService.initalizeTree();
  }

  ngOnInit(): void {
    // this.test1(this.nodes, 0);
  }

  test1(tree: TreeNode[], depth: number) {
    for (let branch of tree) {
      this.test2(branch, depth);
    }
  }

  test2(branch: TreeNode, depth: number) {
    let branchName = branch.branchName;
    let childs = branch.childs;
    let pages = branch.pages;

    let str = ''.padStart(depth, '    ') + '> ' + branchName;
    console.log(str);

    if (childs && childs.length > 0) {
      this.test1(childs, depth + 1);
    }

    // console.log(
    //   `Branch: ${branchName} Childs: ${childs?.length} Pages: ${pages}`
    // );
  }

  branchSelected(branchEvent: BranchSelectedEvent) {
    this.currSelectedBranch = branchEvent.branchComponentRef;
    this.canAddPage = true;

    if (!this.currSelectedBranch) {
      this.treeService.onClick('');
      this.canAddPage = false;
    }
  }

  addNewPage() {
    let page: Page = {
      pageId: '',
      pageName: '',
    };

    if (this.currSelectedBranch) {
      this.currSelectedBranch.treeNode.pages.push(page);
    }
  }

  addNewBranch() {
    let newBranch: TreeNode = {
      branchId: '',
      branchName: '',
      childs: [],
      pages: [],
    };

    if (this.currSelectedBranch) {
      this.currSelectedBranch.treeNode.childs?.push(newBranch);
    } else {
      this.nodes.push(newBranch);
    }
  }

  onRefresh() {
    this.treeDataService.initalizeTree();
    this.currSelectedBranch = undefined;
  }
}
