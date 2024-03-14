import { NgxPrintModule } from 'ngx-print';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonPrintComponent } from './list/button-print.component';
import { RowDetailViewComponent } from './list/rowdetail-view.component';
import { AngularSlickgridModule, ContainerService } from 'angular-slickgrid';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DonBaoHanhComponent } from './list/don-bao-hanh.component';
import { DonBaoHanhDetailComponent } from './detail/don-bao-hanh-detail.component';
import { DonBaoHanhUpdateComponent } from './update/don-bao-hanh-update.component';
import { DonBaoHanhDeleteDialogComponent } from './delete/don-bao-hanh-delete-dialog.component';
import { DonBaoHanhRoutingModule } from './route/don-bao-hanh-routing.module';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@NgModule({
  imports: [SharedModule, DonBaoHanhRoutingModule, AngularSlickgridModule, NgxPaginationModule, NgxPrintModule],
  declarations: [
    DonBaoHanhComponent,
    DonBaoHanhDetailComponent,
    DonBaoHanhUpdateComponent,
    DonBaoHanhDeleteDialogComponent,
    RowDetailViewComponent,
    ButtonPrintComponent,
  ],
  entryComponents: [DonBaoHanhDeleteDialogComponent],
  providers: [ContainerService, RowDetailViewComponent, NavbarComponent],
})
export class DonBaoHanhModule {}
