import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, interval, Observable, Subject, Subscription} from 'rxjs';
import {finalize, map, takeUntil, takeWhile, tap} from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Diff {
  id: number;
  xPct: number;
  yPct: number;
  rPct: number;
  found?: boolean;
}

export interface Level {
  id: string;
  name: string;
  originalUrl: string;
  alteredUrl: string;
  diffs: Diff[];
}

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private _level = new BehaviorSubject<Level | null>(null);
  level$ = this._level.asObservable();

  private _diffs = new BehaviorSubject<Diff[]>([]);
  diffs$ = this._diffs.asObservable();

  readonly totalTime = 120;
  private _timeLeft = new BehaviorSubject<number>(120);
  timeLeft$ = this._timeLeft.asObservable();

  // Barra de tempo
  timePct$ = this.timeLeft$.pipe(map(t => (t / this.totalTime) * 100));

  /** controle do ciclo de vida do timer */
  private stopTimer$ = new Subject<void>();
  private timerSub: Subscription | null = null;

  foundCount$: Observable<number> = this.diffs$.pipe(
    map(d => d.filter(x => x.found).length)
  );
  totalCount$: Observable<number> = this.diffs$.pipe(map(d => d.length));

  constructor(private http: HttpClient) {}

  private startTimer() {
    this.stopTimer$.next();
    if (this.timerSub) { this.timerSub.unsubscribe(); }

    // reseta o valor e inicia contagem
    this._timeLeft.next(this.totalTime);

    this.timerSub = interval(1000).pipe(
      takeUntil(this.stopTimer$),

      takeWhile(() => this._timeLeft.value > 0, true),

      tap(() => {
        const next = this._timeLeft.value - 1;
        this._timeLeft.next(next >= 0 ? next : 0);
      }),

      // ao finalizar, garanta que terminou em 0
      finalize(() => {
        if (this._timeLeft.value < 0) { this._timeLeft.next(0); }
      })
    ).subscribe();
  }

  /** interrompe o timer (reset não obrigatório) */
  private stopTimer() {
    this.stopTimer$.next();
    if (this.timerSub) { this.timerSub.unsubscribe(); this.timerSub = null; }
  }

  loadLevel(id: string) {
    return this.http.get<{ level: Level }>(`${environment.apiBase}/levels/${id}`)
      .pipe(
        tap(({ level }) => {
          // torna as URLs absolutas para irem ao backend
          const full = {
            ...level,
            originalUrl: `${environment.apiBase}${level.originalUrl}`,
            alteredUrl:  `${environment.apiBase}${level.alteredUrl}`
          };
          this._level.next(full);
          this._diffs.next(full.diffs.map(d => ({ ...d, found: false })));

          this.startTimer();
        })
      )
      .toPromise();
  }

  async attempt(xPct: number, yPct: number) {
    if (this._timeLeft.value <= 0) { return; }
    const level = this._level.value;
    if (!level) return;

    const resp = await this.http.post<{ hit: boolean; diffId: number | null }>(
      `${environment.apiBase}/levels/${level.id}/attempt`,
      { xPct, yPct }
    ).toPromise();

    if (resp && resp.hit && resp.diffId != null) {
      const diffs = this._diffs.value.map(d =>
        d.id === resp.diffId ? { ...d, found: true } : d
      );
      this._diffs.next(diffs);
    }
  }

  resetFound() {
    const diffs = this._diffs.value.map(d => ({ ...d, found: false }));
    // zera e recomeça o relógio
    this.startTimer();
    this._diffs.next(diffs);
  }
}
