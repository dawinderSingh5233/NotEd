// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://localhost:8080',
  apiUrl: 'https://noted-65z5.onrender.com',

  isAuthenticated: '/auth/loggedin',
  signup: '/auth/signup',
  login: '/auth/login',

  getTreeBranches: '/branch/branchNames',
  addTreeBranch: '/branch/add-new',
  renameBranch: '/branch/branch-rename',
  deleteBranch: '/branch/delete-branch',

  addPage: '/page/add-page',
  renamePage: '/page/page-rename',
  deletePage: '/page/delete-page',

  getPageData: '/page/get-page-data',
  addPageData: '/page/add-page-data',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
