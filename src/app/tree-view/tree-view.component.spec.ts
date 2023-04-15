import { HttpUrlEncodingCodec } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ITreeViewNode, NodeType } from '../interfaces';

import { TreeViewComponent } from './tree-view.component';

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeViewComponent],
      providers: [
        {provide: HttpUrlEncodingCodec, useValue: { transform: () => ''}}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;

    component.data$ = of(source);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have attach paths to the data', () => {

    component.data$.subscribe(data => {
      expect(data[0].path).not.toBe(undefined);
    });

  });
});

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
                name: 'They are not joking.bmp',
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
