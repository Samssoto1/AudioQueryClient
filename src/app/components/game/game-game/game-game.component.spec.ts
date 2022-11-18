import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameGameComponent } from './game-game.component';

describe('GameGameComponent', () => {
  let component: GameGameComponent;
  let fixture: ComponentFixture<GameGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
