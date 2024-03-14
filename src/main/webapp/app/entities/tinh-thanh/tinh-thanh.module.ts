import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TinhThanhComponent } from './list/tinh-thanh.component';
import { TinhThanhDetailComponent } from './detail/tinh-thanh-detail.component';
import { TinhThanhUpdateComponent } from './update/tinh-thanh-update.component';
import { TinhThanhDeleteDialogComponent } from './delete/tinh-thanh-delete-dialog.component';
import { TinhThanhRoutingModule } from './route/tinh-thanh-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@NgModule({
  imports: [SharedModule, TinhThanhRoutingModule, NgxPaginationModule],
  declarations: [TinhThanhComponent, TinhThanhDetailComponent, TinhThanhUpdateComponent, TinhThanhDeleteDialogComponent],
  entryComponents: [TinhThanhDeleteDialogComponent],
  providers: [NavbarComponent],
})
export class TinhThanhModule {}
