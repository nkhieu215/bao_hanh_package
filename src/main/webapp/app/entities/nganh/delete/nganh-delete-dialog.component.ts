import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INganh } from '../nganh.model';
import { NganhService } from '../service/nganh.service';

@Component({
  templateUrl: './nganh-delete-dialog.component.html',
})
export class NganhDeleteDialogComponent {
  nganh?: INganh;

  constructor(protected nganhService: NganhService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.nganhService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
