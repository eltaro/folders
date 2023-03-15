import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, of, pairwise } from 'rxjs';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { ITreeViewNode, NodeType } from './interfaces';
import { TreeViewComponent } from './tree-view/tree-view.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="wrapper">
      <h3 *ngIf="path$ | async as path">{{path[1] | urldecode }}</h3>
      <div fxLayout="row" fxLayoutAlign="center center" class="container">
        <div fxFlex="50" class="tree-view">
          <app-tree-view [path$]="path$" [data$]="data$"></app-tree-view>
        </div>
        <div fxFlex="50" class="detail-view">
          <app-detail-view></app-detail-view>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'folders';

  path$ = this._router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    pairwise(),
    map((navigationData, _) => [(navigationData[0] as NavigationEnd).url, (navigationData[1] as NavigationEnd).url]),
  );

  data$ = of(source);

  @ViewChild(TreeViewComponent, { static: true }) treeView!: TreeViewComponent;
  @ViewChild(DetailViewComponent, { static: true }) detailView!: DetailViewComponent;

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
    this.detailView.currentlySelectedNode$ = this.treeView.currentlySelectedNode$;
  }
}

const source: ITreeViewNode[] = [
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
            children: [
              {
                name: 'They are here.bmp',
                type: NodeType.File,
              },
              {
                name: 'Hands up.bmp',
                type: NodeType.File,
              },
              {
                name: 'We surrender.bmp',
                type: NodeType.File,
              },
              {
                name: 'Not so fast.bmp',
                type: NodeType.File,
              },
              {
                name: 'Escaping time.bmp',
                type: NodeType.File,
              },
              {
                name: 'Sparky-sparky.bmp',
                type: NodeType.File,
              },
              {
                name: 'Surprised pikachu face.bmp',
                type: NodeType.File,
              },
              {
                name: 'Maybe next time.bmp',
                type: NodeType.File,
              },
              {
                name: 'Nothing to do here.bmp',
                type: NodeType.File,
              },
              {
                name: 'Just chilling.bmp',
                type: NodeType.File,
              },
              {
                name: 'Some really long file name that doesn\'t properly fit into the container.bmp',
                type: NodeType.File,
              }
            ]
          },
          {
            name: 'The son',
            type: NodeType.Folder,
          },
          {
            name: 'The daughter',
            type: NodeType.Folder,
          }
        ]
      },
      {
        name: 'Eugens Birthday',
        type: NodeType.Folder,
      },
      {
        name: 'Our little party',
        type: NodeType.Folder,
      }
    ]
  }
];


