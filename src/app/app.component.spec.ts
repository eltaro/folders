import { HttpUrlEncodingCodec } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { TreeViewComponent } from './tree-view/tree-view.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatInputModule,
        TreeViewComponent,
        DetailViewComponent
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: HttpUrlEncodingCodec, useValue: { transform: () => ''}},
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'folders'`, () => {
    expect(component.title).toEqual('folders');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    console.log(compiled);
    expect(compiled.querySelector('.wrapper')?.textContent).toContain('folders app is running!');
  });
});
