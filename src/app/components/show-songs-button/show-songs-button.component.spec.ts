import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSongsButtonComponent } from './show-songs-button.component';

describe('ShowSongsButtonComponent', () => {
  let component: ShowSongsButtonComponent;
  let fixture: ComponentFixture<ShowSongsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowSongsButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSongsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
