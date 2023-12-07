import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TreeNode } from '../models/dataModels';
import {
  AddBranchResponse,
  AddPageResponse,
  DeletePageResponse,
  GetTreeBranchesResponse,
  RemoveBranchResponse,
  RenameBranchResponse,
  RenamePageResponse,
} from '../models/responseModels';
import {
  AddBranchRequest,
  AddPageRequest,
  RemoveBranchRequest,
  RenameBranchRequest,
  RenamePageRequest,
} from '../models/requestModels';
import { ResolveStart } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RemoteTreeService {
  constructor(private http: HttpClient) {}

  async fetchTreeData() {
    let url = environment.apiUrl + environment.getTreeBranches;

    return new Promise<TreeNode[]>((resolve, reject) => {
      this.http.get<GetTreeBranchesResponse>(url).subscribe((response) => {
        if (response.statusCode === 200) {
          if (response.branches) {
            resolve(response.branches);
          }
        } else {
          //Show the toast that something went wrong while fetching tree data.
          resolve([]);
        }
      });
    });
  }

  fetchStaticTreeData() {
    let tempTreeData: TreeNode[] = [
      {
        branchId: 'test-1',
        branchName: 'Operating systems',
        childs: [
          {
            branchId: 'test-2',
            branchName: 'Scheduling Algorithms',
            childs: [
              {
                branchId: 'test-3',
                branchName: 'FCFS',
                childs: [],
                pages: [
                  {
                    pageId: 'page-1',
                    pageName: 'What is FCFS',
                  },
                ],
              },
              {
                branchId: 'test-4',
                branchName: 'SJF',
                childs: [],
                pages: [
                  {
                    pageId: 'page-2',
                    pageName: 'What is SJF',
                  },
                ],
              },
              {
                branchId: 'test-5',
                branchName: 'RR',
                childs: [],
                pages: [
                  {
                    pageId: 'page-3',
                    pageName: 'What is Round Robin',
                  },
                ],
              },
            ],
            pages: [
              {
                pageId: 'page-4',
                pageName: 'What is SA',
              },
              {
                pageId: 'page-5',
                pageName: 'Types of SA',
              },
            ],
          },
        ],
        pages: [
          {
            pageId: 'page-6',
            pageName: 'What is OS',
          },
          {
            pageId: 'page-7',
            pageName: 'Types of OS',
          },
        ],
      },
    ];
    return tempTreeData;
  }

  addNewBranch(path: string) {
    let url = environment.apiUrl + environment.addTreeBranch;
    let body: AddBranchRequest = {
      path: path,
    };

    return new Promise<AddBranchResponse>((resolve, reject) => {
      this.http.post<AddBranchResponse>(url, body).subscribe((response) => {
        resolve(response);
      });
    });
  }

  renameBranch(branchId: string, newName: string) {
    let url = environment.apiUrl + environment.renameBranch;
    let body: RenameBranchRequest = {
      branchId: branchId,
      branchName: newName,
    };

    return new Promise<RenameBranchResponse>((resolve, reject) => {
      this.http.put<RenameBranchResponse>(url, body).subscribe((response) => {
        resolve(response);
      });
    });
  }

  removeBranch(branchId: string) {
    let url = environment.apiUrl + environment.deleteBranch;

    return new Promise<RemoveBranchResponse>((resolve, reject) => {
      this.http
        .delete<RemoveBranchResponse>(url + '/' + branchId)
        .subscribe((response) => {
          resolve(response);
        });
    });
  }

  addPage(branchId: string, pageName: string) {
    let url = environment.apiUrl + environment.addPage;
    let body: AddPageRequest = {
      branchId: branchId,
      pageName: pageName,
    };

    return new Promise<AddPageResponse>((resolve, reject) => {
      this.http.post<AddPageResponse>(url, body).subscribe((response) => {
        resolve(response);
      });
    });
  }

  renamePage(pageId: string, pageName: string) {
    let url = environment.apiUrl + environment.renamePage;
    let body: RenamePageRequest = {
      pageId: pageId,
      pageName: pageName,
    };

    return new Promise<RenamePageResponse>((resolve, reject) => {
      this.http.put<RenamePageResponse>(url, body).subscribe((response) => {
        resolve(response);
      });
    });
  }

  deletePage(pageId: string) {
    let url = environment.apiUrl + environment.deletePage;
    url = url + '/' + pageId;

    return new Promise<DeletePageResponse>((resolve, reject) => {
      this.http.delete<DeletePageResponse>(url).subscribe((response) => {
        resolve(response);
      });
    });
  }
}
