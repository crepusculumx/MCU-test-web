import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-basic',
  templateUrl: './layout-basic.component.html',
  styleUrls: ['./layout-basic.component.less'],
})
export class LayoutBasicComponent implements OnInit {
  constructor() {}

  public motors: Array<number> = [];

  ngOnInit(): void {
    for (let i = 0; i < 8; i++) {
      this.motors.push(i);
    }
  }
}
