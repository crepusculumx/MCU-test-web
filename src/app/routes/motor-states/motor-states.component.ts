import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { Line } from '@antv/g2plot';

@Component({
  templateUrl: './motor-states.component.html',
  styleUrls: ['./motor-states.component.less'],
})
export class MotorStatesComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}

  public motorId$ = this.route.paramMap.pipe(
    map((params: ParamMap) => {
      return parseInt(params.get('id')!);
    })
  );
}
