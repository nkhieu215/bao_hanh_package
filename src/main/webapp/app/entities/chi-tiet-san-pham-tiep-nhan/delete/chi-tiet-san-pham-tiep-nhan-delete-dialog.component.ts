import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChiTietSanPhamTiepNhan } from '../chi-tiet-san-pham-tiep-nhan.model';
import { ChiTietSanPhamTiepNhanService } from '../service/chi-tiet-san-pham-tiep-nhan.service';

@Component({
  templateUrl: './chi-tiet-san-pham-tiep-nhan-delete-dialog.component.html',
})
export class ChiTietSanPhamTiepNhanDeleteDialogComponent {
  chiTietSanPhamTiepNhan?: IChiTietSanPhamTiepNhan;

  constructor(protected chiTietSanPhamTiepNhanService: ChiTietSanPhamTiepNhanService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chiTietSanPhamTiepNhanService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
