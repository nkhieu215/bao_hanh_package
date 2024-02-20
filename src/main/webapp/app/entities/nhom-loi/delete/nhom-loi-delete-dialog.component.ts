import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INhomLoi } from '../nhom-loi.model';
import { NhomLoiService } from '../service/nhom-loi.service';

@Component({
  templateUrl: './nhom-loi-delete-dialog.component.html',
})
export class NhomLoiDeleteDialogComponent {
  nhomLoi?: INhomLoi;

  constructor(protected nhomLoiService: NhomLoiService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.nhomLoiService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
