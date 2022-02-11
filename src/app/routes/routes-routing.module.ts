import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotorStatesComponent } from './motor-states/motor-states.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'motor-states/0',
    pathMatch: 'full',
  },
  {
    path: 'motor-states/:id',
    component: MotorStatesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutesRoutingModule {}
