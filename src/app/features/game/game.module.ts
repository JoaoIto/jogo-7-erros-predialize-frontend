import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { PlayComponent } from './pages/play/play.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

@NgModule({
  declarations: [PlayComponent, ScoreboardComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: 'play', component: PlayComponent },
      { path: '', redirectTo: 'play', pathMatch: 'full' },
    ])
  ]
})
export class GameModule {}
