import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreboardComponent {
  found$ = this.gs.foundCount$;
  total$ = this.gs.totalCount$;

  constructor(public gs: GameStateService) {}

  reset() { this.gs.resetFound(); }
}
