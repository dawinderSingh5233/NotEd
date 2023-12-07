import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Page } from 'src/app/models/dataModels';
import { TreeDataService } from '../../tree-data.service';
import { TreeService } from '../../tree.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})
export class PageComponent implements OnInit {
  enablePageNameEdit: boolean = false;

  @Input() pageData!: Page;
  @Input() parentNodePath!: string;
  @ViewChild('pageNameField') pageNameField!: ElementRef<HTMLInputElement>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private treeDataService: TreeDataService,
    private treeService: TreeService
  ) {}

  ngOnInit(): void {
    if (this.pageData.pageName.length === 0) {
      this.editPageName();
    }
  }

  editPageName() {
    this.enablePageNameEdit = true;
    this.changeDetectorRef.detectChanges();
    this.pageNameField.nativeElement.focus();
  }

  renamePage() {
    if (this.enablePageNameEdit) {
      let newPageTitle = this.pageNameField.nativeElement.value;
      newPageTitle = newPageTitle.trim();

      if (
        !this.treeDataService.isPageAlreadyPresent(
          this.parentNodePath,
          newPageTitle
        ) &&
        this.pageData.pageName.toLowerCase() !== newPageTitle.toLowerCase() &&
        newPageTitle.length > 0
      ) {
        this.treeDataService.addOrRenamePage(
          this.parentNodePath,
          this.pageData.pageName,
          newPageTitle
        );
      } else {
        if (this.pageData.pageName.length == 0) {
          this.treeDataService.removePageFromPath(this.parentNodePath, '');
        } else {
          this.pageNameField.nativeElement.value = this.pageData.pageName;
        }
      }

      this.enablePageNameEdit = false;
    }
  }

  removePage() {
    this.treeDataService.deletePage(this.pageData.pageId);
  }

  pageSelected() {
    this.treeService.onPageSelected(this.pageData);
  }
}
