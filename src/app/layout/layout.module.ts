import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { LayoutBasicComponent } from './layout-basic/layout-basic.component';

const NZ_ZORRO_MODULES = [NzLayoutModule, NzMenuModule];

@NgModule({
  declarations: [LayoutBasicComponent],
  imports: [CommonModule, RouterModule, ...NZ_ZORRO_MODULES],
})
export class LayoutModule {}
