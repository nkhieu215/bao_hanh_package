import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INhomKhachHang } from '../nhom-khach-hang.model';
import { NhomKhachHangService } from '../service/nhom-khach-hang.service';

@Component({
  templateUrl: './nhom-khach-hang-delete-dialog.component.html',
})
export class NhomKhachHangDeleteDialogComponent {
  nhomKhachHang?: INhomKhachHang;

  constructor(protected nhomKhachHangService: NhomKhachHangService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.nhomKhachHangService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
