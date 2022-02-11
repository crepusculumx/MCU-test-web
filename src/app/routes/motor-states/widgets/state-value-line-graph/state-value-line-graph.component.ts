import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Chart } from '@antv/g2';
import { Line } from '@antv/g2plot';
import {
  AsyncSubject,
  BehaviorSubject,
  combineLatest,
  Observable,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MotorState } from 'src/app/interfaces/motor-interfaces';
import { MotorService } from 'src/app/services/motor.service';

@Component({
  selector: 'app-state-value-line-graph',
  templateUrl: './state-value-line-graph.component.html',
  styleUrls: ['./state-value-line-graph.component.less'],
})
export class StateValueLineGraphComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() motorId$!: Observable<number>;

  constructor(private motorService: MotorService) {}
  private destroy$ = new AsyncSubject<void>();

  public isGraphRun$ = new BehaviorSubject<boolean>(true);

  private motorState$!: Observable<MotorState>;

  private data: Array<any> = [];
  private cnt = 0;

  ngOnInit(): void {
    this.motorState$ = this.motorId$.pipe(
      switchMap((id: number) => {
        return this.motorService.getMotorStateById$(id);
      }),
      takeUntil(this.destroy$)
    );

    for (let i = -100; i < 0; i++) {
      this.data.push({
        x: i,
        y: 0,
      });
    }
  }

  ngAfterViewInit(): void {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500,
      syncViewPadding: true,
    });
    chart.animate(false).data(this.data).line().position('x*y');

    chart.render();
    combineLatest([this.motorState$, this.isGraphRun$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([motorState, isGraphRun]) => {
        this.data.push({
          x: this.cnt % 10000000,
          y: motorState.value,
        });
        this.cnt++;

        if (this.data.length > 100) {
          this.data.shift();
        }
        if (isGraphRun) {
          chart.changeData(this.data);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
