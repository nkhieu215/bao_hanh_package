import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISanPham } from '../san-pham.model';
import { SanPhamService } from '../service/san-pham.service';

@Component({
  templateUrl: './san-pham-delete-dialog.component.html',
})
export class SanPhamDeleteDialogComponent {
  sanPham?: ISanPham;

  constructor(protected sanPhamService: SanPhamService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sanPhamService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
