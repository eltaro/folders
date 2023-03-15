import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { IFlatNode } from '../interfaces';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ScrollingModule],
  template: `
    <ng-container *ngIf="currentlySelectedNode$ | async as node">
      <cdk-virtual-scroll-viewport class="virtual-scroll-container" itemSize="18">
        <button mat-button>
          <mat-icon>{{ node.type === 'Folder' ? 'folder_open' : 'file_open' }}</mat-icon>
          {{ node.name }}
        </button>
        <ng-container *ngIf="hasChild(node.level, node)">
          <div *ngFor="let child of node.children" [style.padding-left]="24+'px'">
            <button mat-button *ngIf="!!child.children && child.children.length > 0">
              <mat-icon>{{ child.type === 'Folder' ? 'folder' : 'file_open' }}</mat-icon>
              {{ child.name }}
            </button>
            <button mat-button *ngIf="!child.children || child.children.length === 0" [disabled]="child.type === 'Folder'">
              <mat-icon>{{ child.type === 'Folder' ? 'folder' : 'file_open' }}</mat-icon>
              {{ child.name }}
            </button>
          </div>
        </ng-container>
      </cdk-virtual-scroll-viewport>
    </ng-container>
  `,
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent {
  //Public API
  public currentlySelectedNode$: Observable<IFlatNode | undefined> = of(undefined);

  hasChild =  (_: number, node: IFlatNode) => node.expandable;
}
