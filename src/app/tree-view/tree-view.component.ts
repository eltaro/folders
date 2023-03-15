import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule, FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IFlatNode, ITreeViewNode, NodeType } from '../interfaces';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CdkTreeModule, ScrollingModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <!-- <form [formGroup]="form"></form> -->
    <ng-container *ngIf="data$ | async">
      <cdk-virtual-scroll-viewport class="virtual-scroll-container" itemSize="18">
        <ng-container *cdkVirtualFor="let node of dataSource">
          <div *ngIf="node.type === 'Folder'" class="node" [style.padding-left]="node.level * 24 + 'px'">
            <button mat-button
                    *ngIf="hasChild(node.level, node)"
                    (click)="treeControl.toggle(node); this.currentlySelectedNode$.next(node);"
                    [routerLink]="node.path">
              <mat-icon>
                {{ treeControl.isExpanded(node) ? 'folder_open' : 'folder' }}
              </mat-icon>
              {{ node.name }}
            </button>
            <button mat-button *ngIf="!hasChild(node.level, node)" [disabled]="!node.expandable">
              <mat-icon>folder</mat-icon>
              {{ node.name }}
            </button>
          </div>
          <div *ngIf="node.type === 'File'" class="node" [style.padding-left]="node.level * 24 + 'px'">
            <button mat-button
                    (click)="this.currentlySelectedNode$.next(node);"
                    [routerLink]="node.path">
              <mat-icon>file_open</mat-icon>
              {{ node.name }}
            </button>
          </div>
        </ng-container>
      </cdk-virtual-scroll-viewport>
    </ng-container>
  `,
  styleUrls: ['./tree-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeViewComponent {
  private _transformer = (node: ITreeViewNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type,
      path: node.path,
      children: node.children
    }
  }

  treeControl = new FlatTreeControl<IFlatNode>(
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

  hasChild =  (_: number, node: IFlatNode) => node.expandable;

  generatePaths(data: ITreeViewNode[]): ITreeViewNode[] {
    const currentPath = '';

    const result = this.addPathRecursively(data, currentPath);


    return result;
  }

  addPathRecursively(data: ITreeViewNode[], currentPath: string): ITreeViewNode[] {
    const newData = data.map((node: ITreeViewNode) => {
      if (node.children) {
        const pathedChildren = this.addPathRecursively(node.children, `${currentPath}/${node.name}`);

        return { ...node, path: `${currentPath}/${node.name}`, children: pathedChildren }
      }
      return {...node, path: `${currentPath}/${node.name}`};
    });

    return newData;
  }

  //Public API
  @Input() public data$: Observable<ITreeViewNode[]>;

  @Input() public path$: Observable<string[]>;

  public currentlySelectedNode$ = new BehaviorSubject<IFlatNode | undefined>(undefined);
  //Public API end

  ngOnInit(): void {
    this.data$ = this.data$.pipe(map(d => this.generatePaths(d)), tap(d => this.dataSource.data = d));
  }
}
