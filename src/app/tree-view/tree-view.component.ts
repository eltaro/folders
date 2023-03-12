import { FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeFlatDataSource, MatTreeModule, MatTreeFlattener } from '@angular/material/tree';
import { ITreeViewNode, NodeType } from '../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatButtonModule, MatIconModule, ScrollingModule],
  // providers: [MatButton, MatTree],
  template: `
    <h3>Tree view component</h3>
    <cdk-virtual-scroll-viewport [itemSize]="200">
      <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
        <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
          <button mat-button>{{node.name}}</button>
        </mat-tree-node>
        <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
          <button mat-button matTreeNodeToggle>
            <mat-icon class="mat-icon-rtl-mirror">
              {{treeControl.isExpanded(node) ? 'folder_open' : 'folder'}}
            </mat-icon>
            {{node.name}}
          </button>
        </mat-tree-node>
      </mat-tree>
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
      level: level
    }
  }
  hasChild =  (_: number, node: FlatNode) => node.expandable;
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

  ngOnInit(): void {
    this.dataSource.data = this.data;
  }
}
