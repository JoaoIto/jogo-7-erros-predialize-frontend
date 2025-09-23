import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from './pages/play/play.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';



@NgModule({
  declarations: [PlayComponent, ScoreboardComponent],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
