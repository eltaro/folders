import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="wrapper">
      <div fxLayout="row" fxLayoutAlign="center center" class="container">
        <div fxFlex="50" class="tree-view">
          <app-tree-view></app-tree-view>
        </div>
        <div fxFlex="50" class="detail-view">
          <app-detail-view></app-detail-view>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'folders';
}


