import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITinhThanh } from '../tinh-thanh.model';
import { TinhThanhService } from '../service/tinh-thanh.service';

@Component({
  templateUrl: './tinh-thanh-delete-dialog.component.html',
})
export class TinhThanhDeleteDialogComponent {
  tinhThanh?: ITinhThanh;

  constructor(protected tinhThanhService: TinhThanhService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tinhThanhService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
