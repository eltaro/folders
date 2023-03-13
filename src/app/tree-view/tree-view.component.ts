import { CdkTreeModule, FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeFlatDataSource, MatTreeModule, MatTreeFlattener } from '@angular/material/tree';
import { ITreeViewNode, NodeType } from '../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FolderService } from '../services';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  type: NodeType;
}

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatButtonModule, MatIconModule, ScrollingModule, CdkTreeModule],
  template: `
    <h3>Tree view component</h3>
    <cdk-virtual-scroll-viewport class="virtual-scroll-container" itemSize="18">
      <ng-container *cdkVirtualFor="let node of dataSource">
        <!-- Note that the [style.padding-left] is essentially what cdkTreeNodePadding is doing under the hood -->
        <div class="node" [style.padding-left]="node.level * 24 + 'px'">
          <!-- Note that treeControl.toggle(node) is essentially what cdkTreeNodeToggle is doing under the hood -->
          <button mat-button (click)="treeControl.toggle(node)" *ngIf="hasChild(node.level, node)" (click)="selectFolder(node)">
            <mat-icon>
              {{treeControl.isExpanded(node) ? 'folder_open' : 'folder'}}
            </mat-icon>
            {{ node.name }}
          </button>
          <button mat-button *ngIf="!hasChild(node.level, node)" [disabled]="!node.expandable">
            <mat-icon>folder</mat-icon>
            {{ node.name }}
          </button>
        </div>
      </ng-container>
    </cdk-virtual-scroll-viewport>
  `,
  styleUrls: ['./tree-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeViewComponent implements OnInit {
  private _transformer = (node: ITreeViewNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type
    }
  }
  hasChild =  (_: number, node: FlatNode) => node.expandable;
  depth = (node: FlatNode) => node.level;
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  data: ITreeViewNode[] = [
    {
      name: 'Amazing photos',
      type: NodeType.Folder,
      children: [
        {
          name: '20th Anniversary',
          type: NodeType.Folder,
          children: [
            {
              name: 'Best moments',
              type: NodeType.Folder,
            },
            {
              name: 'The son',
              type: NodeType.Folder
            },
            {
              name: 'The daughter',
              type: NodeType.Folder
            }
          ]
        },
        {
          name: 'Eugens Birthday',
          type: NodeType.Folder
        },
        {
          name: 'Our little party',
          type: NodeType.Folder
        }
      ]
    }
  ];

  constructor(private _folderService: FolderService) { }

  ngOnInit(): void {
    this.dataSource.data = this.data;
  }

  selectFolder(node: FlatNode) {
    this._folderService.currentlySelectedNode.next(node);
  }
}
