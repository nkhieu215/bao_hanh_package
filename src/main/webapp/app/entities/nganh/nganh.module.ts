import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NganhComponent } from './list/nganh.component';
import { NganhDetailComponent } from './detail/nganh-detail.component';
import { NganhUpdateComponent } from './update/nganh-update.component';
import { NganhDeleteDialogComponent } from './delete/nganh-delete-dialog.component';
import { NganhRoutingModule } from './route/nganh-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@NgModule({
  imports: [SharedModule, NganhRoutingModule, NgxPaginationModule],
  declarations: [NganhComponent, NganhDetailComponent, NganhUpdateComponent, NganhDeleteDialogComponent],
  entryComponents: [NganhDeleteDialogComponent, NavbarComponent],
  providers: [NavbarComponent],
})
export class NganhModule {}
