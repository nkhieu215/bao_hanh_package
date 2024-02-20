import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKho } from '../kho.model';
import { KhoService } from '../service/kho.service';

@Component({
  templateUrl: './kho-delete-dialog.component.html',
})
export class KhoDeleteDialogComponent {
  kho?: IKho;

  constructor(protected khoService: KhoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.khoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
