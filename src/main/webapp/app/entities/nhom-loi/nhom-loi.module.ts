import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NhomLoiComponent } from './list/nhom-loi.component';
import { NhomLoiDetailComponent } from './detail/nhom-loi-detail.component';
import { NhomLoiUpdateComponent } from './update/nhom-loi-update.component';
import { NhomLoiDeleteDialogComponent } from './delete/nhom-loi-delete-dialog.component';
import { NhomLoiRoutingModule } from './route/nhom-loi-routing.module';

@NgModule({
  imports: [SharedModule, NhomLoiRoutingModule],
  declarations: [NhomLoiComponent, NhomLoiDetailComponent, NhomLoiUpdateComponent, NhomLoiDeleteDialogComponent],
  entryComponents: [NhomLoiDeleteDialogComponent],
})
export class NhomLoiModule {}
