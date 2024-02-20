import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDonBaoHanh } from '../don-bao-hanh.model';
import { DonBaoHanhService } from '../service/don-bao-hanh.service';

@Component({
  templateUrl: './don-bao-hanh-delete-dialog.component.html',
})
export class DonBaoHanhDeleteDialogComponent {
  donBaoHanh?: IDonBaoHanh;

  constructor(protected donBaoHanhService: DonBaoHanhService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.donBaoHanhService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
