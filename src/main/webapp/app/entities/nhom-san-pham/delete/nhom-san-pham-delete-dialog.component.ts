import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INhomSanPham } from '../nhom-san-pham.model';
import { NhomSanPhamService } from '../service/nhom-san-pham.service';

@Component({
  templateUrl: './nhom-san-pham-delete-dialog.component.html',
})
export class NhomSanPhamDeleteDialogComponent {
  nhomSanPham?: INhomSanPham;

  constructor(protected nhomSanPhamService: NhomSanPhamService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.nhomSanPhamService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
