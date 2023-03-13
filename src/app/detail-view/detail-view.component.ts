import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderService } from '../services';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="currentlySelectedFolder$ | async as folder">
      {{folder | json}}
    </ng-container>
  `,
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent {
  currentlySelectedFolder$ = this._folderService.currentlySelectedNode;
  constructor(private _folderService: FolderService) { }
}
