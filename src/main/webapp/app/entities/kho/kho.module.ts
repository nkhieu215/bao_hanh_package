import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KhoComponent } from './list/kho.component';
import { KhoDetailComponent } from './detail/kho-detail.component';
import { KhoUpdateComponent } from './update/kho-update.component';
import { KhoDeleteDialogComponent } from './delete/kho-delete-dialog.component';
import { KhoRoutingModule } from './route/kho-routing.module';

@NgModule({
  imports: [SharedModule, KhoRoutingModule],
  declarations: [KhoComponent, KhoDetailComponent, KhoUpdateComponent, KhoDeleteDialogComponent],
  entryComponents: [KhoDeleteDialogComponent],
})
export class KhoModule {}
