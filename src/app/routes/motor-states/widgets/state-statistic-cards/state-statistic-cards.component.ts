import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AsyncSubject,
  BehaviorSubject,
  map,
  Observable,
  pipe,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  MotorConnectionMode,
  MotorConnectionState,
  MotorMode,
  MotorState,
} from 'src/app/interfaces/motor-interfaces';
import { MotorService } from 'src/app/services/motor.service';

@Component({
  selector: 'app-state-statistic-cards',
  templateUrl: './state-statistic-cards.component.html',
})
export class StateStatisticCardsComponent implements OnInit, OnDestroy {
  @Input() motorId$!: Observable<number>;
  constructor(private motorService: MotorService) {}

  private onDestroy$ = new AsyncSubject<void>();

  motorState$!: Observable<MotorState>;

  communicationState$!: Observable<string>;
  motorStateMode$!: Observable<string>;
  motorStateValue$!: Observable<number>;

  ngOnInit(): void {
    this.motorState$ = this.motorId$.pipe(
      switchMap((id: number) => {
        return this.motorService.getMotorStateById$(id);
      })
    );

    this.communicationState$ = this.motorId$.pipe(
      switchMap((id: number) => {
        return this.motorService.getMotorConnectionStateById$(id);
      }),
      map((motorConnectionState: MotorConnectionState): MotorConnectionMode => {
        return motorConnectionState.mode;
      }),
      map((motorConnectionMode: MotorConnectionMode): string => {
        switch (motorConnectionMode) {
          case MotorConnectionMode.noMotor:
            return '无该电机';
            break;
          case MotorConnectionMode.serverErr:
            return '服务器错误';
            break;
          case MotorConnectionMode.on:
            return '连接正常';
            break;
          case MotorConnectionMode.off:
            return '无连接';
            break;
          default:
            return '未知状态';
            break;
        }
      }),
      startWith('无该电机')
    );

    this.motorStateMode$ = this.motorState$.pipe(
      map((motorState: MotorState) => {
        switch (motorState.mode) {
          case MotorMode.velocity:
            return '速度';
            break;
          case MotorMode.position:
            return '位置';
            break;
          case MotorMode.current:
            return '电流';
            break;
          default:
            return '未知状态';
            break;
        }
      }),
      startWith('未知状态')
    );

    this.motorStateValue$ = this.motorState$.pipe(
      map((motorState: MotorState): number => {
        return motorState.value;
      }),
      startWith(0)
    );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
