import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsNavbarComponent } from './docs-navbar.component';

describe('DocsNavbarComponent', () => {
  let component: DocsNavbarComponent;
  let fixture: ComponentFixture<DocsNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
