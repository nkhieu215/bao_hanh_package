import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhanTichSanPham } from '../phan-tich-san-pham.model';
import { PhanTichSanPhamService } from '../service/phan-tich-san-pham.service';

@Component({
  templateUrl: './phan-tich-san-pham-delete-dialog.component.html',
})
export class PhanTichSanPhamDeleteDialogComponent {
  phanTichSanPham?: IPhanTichSanPham;

  constructor(protected phanTichSanPhamService: PhanTichSanPhamService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.phanTichSanPhamService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
