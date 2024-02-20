import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChungLoai } from '../chung-loai.model';
import { ChungLoaiService } from '../service/chung-loai.service';

@Component({
  templateUrl: './chung-loai-delete-dialog.component.html',
})
export class ChungLoaiDeleteDialogComponent {
  chungLoai?: IChungLoai;

  constructor(protected chungLoaiService: ChungLoaiService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chungLoaiService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
