import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TreeService } from '../tree.service';
import { TreeNode } from 'src/app/models/dataModels';
import { TreeDataService } from '../tree-data.service';

export interface BranchSelectedEvent {
  path: string;
  branchComponentRef: BranchComponent | undefined;
}

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css'],
})
export class BranchComponent implements OnInit {
  isBranchOpen: boolean = false;
  isSelected: boolean = false;
  enableBranchNameEdit: boolean = false;

  @Input() treeNode!: TreeNode;
  @Input() currNodePath!: string;
  @Output() onBranchSelect = new EventEmitter<BranchSelectedEvent>();
  @ViewChild('branchNameField') branchNameField!: ElementRef<HTMLInputElement>;

  constructor(
    private treeService: TreeService,
    private treeDataService: TreeDataService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.treeNode.branchName.length === 0) {
      this.onBranchNameEdit();
    }

    this.treeService.addBranchClickEvent().subscribe((branchName: string) => {
      if (this.treeNode.branchName === branchName) {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
    });
  }

  toggleBranch() {
    this.isBranchOpen = !this.isBranchOpen;

    if (this.isBranchOpen) {
      console.log('branch is now open');
      this.treeService.onClick(this.treeNode.branchName);
      this.branchSelected({
        path: this.currNodePath,
        branchComponentRef: this,
      });
    } else {
      this.treeService.onClick(this.treeNode.branchName);
      this.branchSelected({
        path: '',
        branchComponentRef: undefined,
      });
    }
  }

  isPaddingNeededForPages() {
    let condition1 = this.treeNode.pages && this.treeNode.pages.length > 0;
    let condition2 = this.treeNode.childs && this.treeNode.childs.length > 0;

    if (condition1 && condition2) {
      return true;
    }
    return false;
  }

  branchSelected(branchEvent: BranchSelectedEvent) {
    this.onBranchSelect.emit(branchEvent);
  }

  onBranchNameEdit() {
    this.enableBranchNameEdit = true;
    this.changeDetectorRef.detectChanges();
    this.branchNameField.nativeElement.focus();
  }

  renameBranch(e: Event) {
    if (this.enableBranchNameEdit) {
      let input = e.target as HTMLInputElement;
      let newName = input.value.trim();

      if (
        !this.treeDataService.isNodeAlreadyPresentInPath(
          this.currNodePath,
          newName,
          this.treeNode.branchId
        ) &&
        this.treeNode.branchName !== newName &&
        newName.length > 0
      ) {
        this.treeDataService.addOrRenameBranch(
          this.treeNode.branchName,
          newName,
          this.currNodePath
        );
      } else {
        // Show A toast message with Message: ${Folder Name} Already Present.

        if (this.treeNode.branchName.length == 0) {
          this.treeDataService.removeChildFromPath(this.currNodePath, '');
        } else {
          input.value = this.treeNode.branchName;
        }
      }

      this.enableBranchNameEdit = false;
    }
  }

  async removeNode() {
    await this.treeDataService.removeNode(this.currNodePath);
    console.log('Node Deleted');
  }
}
