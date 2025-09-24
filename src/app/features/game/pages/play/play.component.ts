import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GameStateService, Diff } from '../../services/game-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent implements AfterViewInit {
  level$ = this.gs.level$;
  diffs$: Observable<Diff[]> = this.gs.diffs$;
  @ViewChild('leftImgWrap', { static: false }) leftImgWrap!: ElementRef<HTMLDivElement>;

  constructor(public gs: GameStateService) {}

  async ngAfterViewInit() {
    await this.gs.loadLevel('1'); // carrega fase 1 ao abrir
  }

  async onClickLeft(ev: MouseEvent) {
    if (!this.leftImgWrap) { return; }
    const rect = this.leftImgWrap.nativeElement.getBoundingClientRect();
    const xPct = (ev.clientX - rect.left) / rect.width;
    const yPct = (ev.clientY - rect.top) / rect.height;
    await this.gs.attempt(xPct, yPct);
  }

  trackById(_i: number, d: Diff) { return d.id; }
}
