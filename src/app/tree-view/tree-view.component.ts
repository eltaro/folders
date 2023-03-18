import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule, FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, first, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { IFlatNode, ITreeViewNode, NodeType } from '../interfaces';
import { UrlDecoderPipe } from '../pipes';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, RouterModule, CdkTreeModule, ScrollingModule, MatButtonModule, MatIconModule],
  providers: [UrlDecoderPipe],
  template: `
    <ng-container *ngIf="data$ | async">
      <cdk-virtual-scroll-viewport class="virtual-scroll-container" itemSize="18">
        <ng-container *cdkVirtualFor="let node of dataSource">
          <div *ngIf="node.type === 'Folder'" class="node" [style.padding-left]="node.level * 12 + 'px'" [ngClass]="{ 'final-node': (currentlySelectedNode$ | async)?.name === node.name }">
            <button mat-button
                    *ngIf="hasChild(node.level, node)"
                    (click)="treeControl.toggle(node); this.currentlySelectedNode$.next(node)"
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
          <div *ngIf="node.type === 'File'" class="node" [style.padding-left]="node.level * 12 + 'px'" [ngClass]="{ 'final-node': (currentlySelectedNode$ | async)?.name === node.name }">
            <button mat-button
                    (click)="this.currentlySelectedNode$.next(node)"
                    [routerLink]="node.path">
              <mat-icon>file_open</mat-icon>
              {{ node.name }}
            </button>
          </div>
        </ng-container>
      </cdk-virtual-scroll-viewport>
    </ng-container>
    <ng-container *ngIf="path$ | async"></ng-container>
  `,
  styleUrls: ['./tree-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeViewComponent implements OnDestroy {
  private _transformer = (node: ITreeViewNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type,
      path: node.path,
      children: node.children,
      final: false
    }
  }

  private paths: string[] = [];

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

        this.paths.push(`${currentPath}/${node.name}`);

        return { ...node, path: `${currentPath}/${node.name}`, children: pathedChildren }
      }

      this.paths.push(`${currentPath}/${node.name}`);

      return {...node, path: `${currentPath}/${node.name}`};
    });

    return newData;
  }

  //Public API
  @Input() public data$: Observable<ITreeViewNode[]>;

  @Input() public path$: Observable<[string, string]>;

  @Input() public search$: Observable<string>;

  public currentlySelectedNode$ = new BehaviorSubject<IFlatNode | undefined>(undefined);
  //Public API end

  destroyed$ = new Subject();

  constructor(private _urlDecoder: UrlDecoderPipe) { }

  ngOnInit(): void {
    this.data$ = this.data$.pipe(map(d => this.generatePaths(d)), tap(d => this.dataSource.data = d));

    //Expand tree by path and select the node mentioned in the last path segment
    this.path$ = this.path$.pipe(tap(([_, current]) => {
      const pathSegments = current.split('/').map(s => this._urlDecoder.transform(s));

      const lastSegment = pathSegments[pathSegments.length-1];

      this.treeControl.dataNodes.forEach(node => {
        if (pathSegments.indexOf(node.name) === -1) {
          return;
        }
        if (this.treeControl.isExpandable(node)) {
          this.treeControl.expand(node);
        }

        if (node.name === lastSegment) {
          this.currentlySelectedNode$.next(node);

          node.final = true;
        }
      });
    }));

    this.data$ = combineLatest([this.data$, this.search$]).pipe(
      map(([nodes, searchString]) => {
        if (!searchString) {
          console.log('exiting0');
          return nodes;
        }
  
        const relatedNodes = this.treeControl.dataNodes.filter(node => node.name.toLowerCase().includes(searchString.toLowerCase()));
  
        if (relatedNodes.length === 0) {
          console.log('exiting1');
          return nodes;
        }
  
        console.log(relatedNodes);
  
        const nodesForTreeControl = new Map();
  
        //Remove all duplicates paths by shuffling them into the map
        relatedNodes.forEach(node => {
          const path = node.path!.substring(1);
          path.split('/').forEach(segment => nodesForTreeControl.set(segment, segment));
        });
  
        console.log(nodesForTreeControl);
  
        // const filteredNodes = this.treeControl.dataNodes.filter(node => nodesForTreeControl.has(node.name));
  
        // console.log(filteredNodes);
  
        // this.treeControl.dataNodes = filteredNodes;

        const result = this.filterNodesRecursively(Array.from(nodesForTreeControl.keys()), nodes);

        console.log(result);
  
        return result;
        
        // filteredNodes.map(filteredNode => {
        //   if (this.treeControl.isExpandable(filteredNode)) {
        //     console.log('here');
        //     this.treeControl.expand(filteredNode);
        //   }
        // });
      }
    ));

    // this.search$.pipe(takeUntil(this.destroyed$)).subscribe(searchString => {
    //   if (!searchString) {
    //     console.log('exiting0');
    //     return;
    //   }

    //   const relatedNodes = this.treeControl.dataNodes.filter(node => node.name.toLowerCase().includes(searchString.toLowerCase()));

    //   if (relatedNodes.length === 0) {
    //     console.log('exiting1');
    //     return;
    //   }

    //   console.log(relatedNodes);

    //   const nodesForTreeControl = new Map();

    //   //Remove all duplicates paths by shuffling them into the map
    //   relatedNodes.forEach(node => {
    //     const path = node.path!.substring(1);
    //     path.split('/').forEach(segment => nodesForTreeControl.set(segment, segment));
    //   });

    //   console.log(nodesForTreeControl);

    //   // const filteredNodes = this.treeControl.dataNodes.filter(node => nodesForTreeControl.has(node.name));

    //   // console.log(filteredNodes);

    //   // this.treeControl.dataNodes = filteredNodes;

    //   this.filterNodesRecursively()
      
    //   // filteredNodes.forEach(filteredNode => {
    //   //   if (this.treeControl.isExpandable(filteredNode)) {
    //   //     console.log('here');
    //   //     this.treeControl.expand(filteredNode);
    //   //   }
    //   // });

    // });
  }

  filterNodesRecursively(paths: string[], nodes: ITreeViewNode[]): ITreeViewNode[] {
    return nodes.filter(node => {
      if (!!node.children && node.children.length > 0) {
        const filteredChildren = this.filterNodesRecursively(paths, node.children);
        
        node.children = filteredChildren;
      }

      console.log(node.children);

      return !!(paths.indexOf(node.name) > 0);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(0);
  }
}
