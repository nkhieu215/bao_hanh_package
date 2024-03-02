import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LoiComponent } from './list/loi.component';
import { LoiDetailComponent } from './detail/loi-detail.component';
import { LoiUpdateComponent } from './update/loi-update.component';
import { LoiDeleteDialogComponent } from './delete/loi-delete-dialog.component';
import { LoiRoutingModule } from './route/loi-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [SharedModule, LoiRoutingModule, NgxPaginationModule],
  declarations: [LoiComponent, LoiDetailComponent, LoiUpdateComponent, LoiDeleteDialogComponent],
  entryComponents: [LoiDeleteDialogComponent],
})
export class LoiModule {}
