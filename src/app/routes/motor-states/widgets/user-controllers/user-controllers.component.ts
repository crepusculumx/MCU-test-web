import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NzMarks } from 'ng-zorro-antd/slider';
import {
  AsyncSubject,
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subscription,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { MotorMode } from 'src/app/interfaces/motor-interfaces';
import { MotorService } from 'src/app/services/motor.service';

interface SliderOption {
  readonly maxValue: number;
  readonly minValue: number;
  readonly step: number;
  readonly marks: NzMarks;
}

@Component({
  selector: 'app-user-controllers',
  templateUrl: './user-controllers.component.html',
})
export class UserControllersComponent implements OnInit, OnDestroy {
  @Input() motorId$!: Observable<number>;

  constructor(private motorService: MotorService) {}

  private destroy$ = new AsyncSubject<void>();

  available$ = new BehaviorSubject<boolean>(false);
  selectMode$ = new BehaviorSubject<MotorMode>(MotorMode.velocity);
  options = [
    { label: MotorMode.velocity, value: '速度' },
    { label: MotorMode.position, value: '位置' },
    { label: MotorMode.current, value: '电流' },
  ];

  public sliderOption$!: Observable<SliderOption>;

  motorStateValue$ = new BehaviorSubject<number>(0);

  sliderMin$!: Observable<number>;
  sliderMax$!: Observable<number>;
  sliderStep$!: Observable<number>;
  sliderMarks$!: Observable<NzMarks>;

  /**
   * @description 初始化 sliderOption$
   * @description 依赖 selectMode$
   * @private
   */
  private initSliderOption(): void {
    this.sliderOption$ = this.selectMode$.pipe(
      map((motorMode: MotorMode): SliderOption => {
        let maxValue: number = 0;
        let minValue: number = 0;
        let step: number = 0;
        let marks: NzMarks = new NzMarks();

        switch (motorMode) {
          case MotorMode.velocity:
            maxValue = 10;
            minValue = -10;
            step = 0.1;
            marks = {
              '-10': '-10',
              '0': '0',
              '10': '10',
            };
            break;
          case MotorMode.position:
            maxValue = 180;
            minValue = -180;
            step = 1;
            marks = {
              '-180': '-180',
              '0': '0',
              '180': '180',
            };
            break;
          case MotorMode.current:
            maxValue = 10;
            minValue = -10;
            step = 1;
            marks = {
              '-100': '-100',
              '0': '0',
              '100': '100',
            };
            break;

          default:
            break;
        }

        return {
          maxValue: maxValue,
          minValue: minValue,
          step: step,
          marks: marks,
        };
      })
    );
  }

  /**
   * @description 初始化slider参数
   * @description 依赖 sliderOption$
   * @private
   */
  private initSliderParams(): void {
    this.sliderMin$ = this.sliderOption$.pipe(
      map((sliderOption: SliderOption): number => {
        return sliderOption.minValue;
      }),
      distinctUntilChanged()
    );

    this.sliderMax$ = this.sliderOption$.pipe(
      map((sliderOption: SliderOption): number => {
        return sliderOption.maxValue;
      }),
      distinctUntilChanged()
    );

    this.sliderStep$ = this.sliderOption$.pipe(
      map((sliderOption: SliderOption): number => {
        return sliderOption.step;
      }),
      distinctUntilChanged()
    );

    this.sliderMarks$ = this.sliderOption$.pipe(
      map((sliderOption: SliderOption): NzMarks => {
        return sliderOption.marks;
      }),
      distinctUntilChanged()
    );
  }

  /**
   * 向后端推送输入
   * @private
   */
  private initSendMotorCmdSubscription(): Subscription {
    return combineLatest([
      this.available$,
      this.motorId$,
      this.selectMode$,
      this.motorStateValue$,
      timer(0, 100),
    ])
      .pipe(
        filter(([available, id, mode, value, timer]) => {
          return available;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(([available, id, mode, value, timer]) => {
        this.motorService.sendMotorCmd({ id: id, mode: mode, value: value });
      });
  }

  ngOnInit(): void {
    this.initSliderOption();
    this.initSliderParams();

    this.initSendMotorCmdSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.available$.unsubscribe();
    this.selectMode$.unsubscribe();
    this.motorStateValue$.unsubscribe();
  }
}
