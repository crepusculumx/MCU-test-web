import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesRoutingModule } from './routes-routing.module';
import { MotorStatesComponent } from './motor-states/motor-states.component';

import { SharedModule } from '../shared/shared.module';
import { StateStatisticCardsComponent } from './motor-states/widgets/state-statistic-cards/state-statistic-cards.component';
import { UserControllersComponent } from './motor-states/widgets/user-controllers/user-controllers.component';
import { StateValueLineGraphComponent } from './motor-states/widgets/state-value-line-graph/state-value-line-graph.component';

@NgModule({
  declarations: [
    MotorStatesComponent,
    StateStatisticCardsComponent,
    UserControllersComponent,
    StateValueLineGraphComponent,
  ],
  imports: [CommonModule, RoutesRoutingModule, SharedModule],
})
export class RoutesModule {}
