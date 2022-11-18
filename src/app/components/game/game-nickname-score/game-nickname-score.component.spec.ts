import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNicknameScoreComponent } from './game-nickname-score.component';

describe('GameNicknameScoreComponent', () => {
  let component: GameNicknameScoreComponent;
  let fixture: ComponentFixture<GameNicknameScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameNicknameScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNicknameScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
