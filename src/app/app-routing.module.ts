import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutBasicComponent } from './layout/layout-basic/layout-basic.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutBasicComponent,
    children: [{ path: '', redirectTo: 'home', pathMatch: 'full' }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
