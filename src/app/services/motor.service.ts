import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import {
  MotorCmd,
  MotorConnectionMode,
  MotorConnectionState,
  MotorMode,
  MotorState,
} from '../interfaces/motor-interfaces';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class MotorService {
  constructor(private errorService: ErrorService) {
    this.motorCmd$.subscribe(() => {}); // 保持订阅否则无法发送
  }

  private motorState$ = webSocket<MotorState>(
    `${environment.baseWsUrl}motor-state`
  ).pipe(
    catchError(
      this.errorService.handleError<MotorState>(
        '无法与后端建立WebSocet连接，检查服务器',
        {
          id: -1,
          mode: -1,
          value: -1,
        }
      )
    )
  );
  private motorCmd$ = webSocket<MotorCmd>(`${environment.baseWsUrl}motor-cmd`);
  private motorConnectionState$ = webSocket<MotorConnectionState>(
    `${environment.baseWsUrl}motor-connection-state`
  ).pipe(
    catchError(
      this.errorService.handleError<MotorConnectionState>(
        '无法与后端建立WebSocet连接，检查服务器',
        { id: -1, mode: MotorConnectionMode.serverErr }
      )
    )
  );

  private motorStateCache = new Map<number, Observable<MotorState>>();
  private motorConnectionStateCache = new Map<
    number,
    Observable<MotorConnectionState>
  >();

  getMotorStateById$(id: number): Observable<MotorState> {
    if (!this.motorStateCache.has(id)) {
      let motorStateReplay$ = new ReplaySubject<MotorState>(1000); // 缓存1000个数据
      this.motorState$
        .pipe(
          filter((motorState: MotorState) => {
            return motorState.id === id ? true : false;
          })
        )
        .subscribe(motorStateReplay$);
      this.motorStateCache.set(id, motorStateReplay$.asObservable());
    }

    return this.motorStateCache.get(id)!;
  }

  getMotorConnectionStateById$(id: number): Observable<MotorConnectionState> {
    if (!this.motorConnectionStateCache.has(id)) {
      let motorConnectionStateReplay$ = new ReplaySubject<MotorConnectionState>(
        1
      );

      this.motorConnectionState$
        .pipe(
          filter((motorConnectionState: MotorConnectionState) => {
            return motorConnectionState.id === id ? true : false;
          })
        )
        .subscribe(motorConnectionStateReplay$);

      this.motorConnectionStateCache.set(
        id,
        motorConnectionStateReplay$.asObservable()
      );
    }

    return this.motorConnectionStateCache.get(id)!;
  }

  sendMotorCmd(motorCmd: MotorCmd) {
    this.motorCmd$.next(motorCmd);
  }
}
