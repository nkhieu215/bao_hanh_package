import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKhachHang } from '../khach-hang.model';
import { KhachHangService } from '../service/khach-hang.service';

@Component({
  templateUrl: './khach-hang-delete-dialog.component.html',
})
export class KhachHangDeleteDialogComponent {
  khachHang?: IKhachHang;

  constructor(protected khachHangService: KhachHangService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.khachHangService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
