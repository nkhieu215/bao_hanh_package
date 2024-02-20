import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDanhSachTinhTrang } from '../danh-sach-tinh-trang.model';
import { DanhSachTinhTrangService } from '../service/danh-sach-tinh-trang.service';

@Component({
  templateUrl: './danh-sach-tinh-trang-delete-dialog.component.html',
})
export class DanhSachTinhTrangDeleteDialogComponent {
  danhSachTinhTrang?: IDanhSachTinhTrang;

  constructor(protected danhSachTinhTrangService: DanhSachTinhTrangService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.danhSachTinhTrangService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
