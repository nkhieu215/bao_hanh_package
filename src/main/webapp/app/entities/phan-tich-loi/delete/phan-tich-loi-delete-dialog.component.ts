import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhanTichLoi } from '../phan-tich-loi.model';
import { PhanTichLoiService } from '../service/phan-tich-loi.service';

@Component({
  templateUrl: './phan-tich-loi-delete-dialog.component.html',
})
export class PhanTichLoiDeleteDialogComponent {
  phanTichLoi?: IPhanTichLoi;

  constructor(protected phanTichLoiService: PhanTichLoiService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.phanTichLoiService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
