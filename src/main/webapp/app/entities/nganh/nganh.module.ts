import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NganhComponent } from './list/nganh.component';
import { NganhDetailComponent } from './detail/nganh-detail.component';
import { NganhUpdateComponent } from './update/nganh-update.component';
import { NganhDeleteDialogComponent } from './delete/nganh-delete-dialog.component';
import { NganhRoutingModule } from './route/nganh-routing.module';

@NgModule({
  imports: [SharedModule, NganhRoutingModule],
  declarations: [NganhComponent, NganhDetailComponent, NganhUpdateComponent, NganhDeleteDialogComponent],
  entryComponents: [NganhDeleteDialogComponent],
})
export class NganhModule {}
