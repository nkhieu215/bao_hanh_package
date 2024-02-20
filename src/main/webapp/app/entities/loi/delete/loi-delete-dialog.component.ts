import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILoi } from '../loi.model';
import { LoiService } from '../service/loi.service';

@Component({
  templateUrl: './loi-delete-dialog.component.html',
})
export class LoiDeleteDialogComponent {
  loi?: ILoi;

  constructor(protected loiService: LoiService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.loiService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
