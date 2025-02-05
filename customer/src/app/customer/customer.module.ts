import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerPageComponent } from '../customer-page/customer-page.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CustomerPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CustomerPageComponent },
    ]),
  ],
})
export class CustomerModule { }
