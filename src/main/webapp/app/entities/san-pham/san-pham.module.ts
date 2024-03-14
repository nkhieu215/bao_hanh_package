import { AngularSlickgridModule, ContainerService } from 'angular-slickgrid';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SanPhamComponent } from './list/san-pham.component';
import { SanPhamDetailComponent } from './detail/san-pham-detail.component';
import { SanPhamUpdateComponent } from './update/san-pham-update.component';
import { SanPhamDeleteDialogComponent } from './delete/san-pham-delete-dialog.component';
import { SanPhamRoutingModule } from './route/san-pham-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';
@NgModule({
  imports: [SharedModule, SanPhamRoutingModule, NgxPaginationModule, Ng2SearchPipeModule, AngularSlickgridModule],
  declarations: [SanPhamComponent, SanPhamDetailComponent, SanPhamUpdateComponent, SanPhamDeleteDialogComponent],
  entryComponents: [SanPhamDeleteDialogComponent],
  providers: [ContainerService, NavbarComponent],
})
export class SanPhamModule {}
