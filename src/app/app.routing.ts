import {NgModule} from '@angular/core';
import {RouterModule, PreloadAllModules, Routes} from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SupplierDashboardComponent } from './components/supplier-dashboard/supplier-dashboard.component';


const routes: Routes = [
  {path: 'supplier', component: SupplierDashboardComponent },
  {path: '', redirectTo: '/supplier', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
