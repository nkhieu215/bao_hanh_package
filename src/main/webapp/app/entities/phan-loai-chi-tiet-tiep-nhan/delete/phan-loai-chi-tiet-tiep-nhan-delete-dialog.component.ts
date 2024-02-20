import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhanLoaiChiTietTiepNhan } from '../phan-loai-chi-tiet-tiep-nhan.model';
import { PhanLoaiChiTietTiepNhanService } from '../service/phan-loai-chi-tiet-tiep-nhan.service';

@Component({
  templateUrl: './phan-loai-chi-tiet-tiep-nhan-delete-dialog.component.html',
})
export class PhanLoaiChiTietTiepNhanDeleteDialogComponent {
  phanLoaiChiTietTiepNhan?: IPhanLoaiChiTietTiepNhan;

  constructor(protected phanLoaiChiTietTiepNhanService: PhanLoaiChiTietTiepNhanService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.phanLoaiChiTietTiepNhanService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
