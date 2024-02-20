import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IKhachHang } from '../khach-hang.model';
import { KhachHangService } from '../service/khach-hang.service';
import { KhachHangDeleteDialogComponent } from '../delete/khach-hang-delete-dialog.component';

@Component({
  selector: 'jhi-khach-hang',
  templateUrl: './khach-hang.component.html',
  styleUrls: ['./khach-hang.component.css'],
})
export class KhachHangComponent implements OnInit {
  khachHangs?: IKhachHang[];
  isLoading = false;

  constructor(protected khachHangService: KhachHangService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.khachHangService.query().subscribe({
      next: (res: HttpResponse<IKhachHang[]>) => {
        this.isLoading = false;
        this.khachHangs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IKhachHang): number {
    return item.id!;
  }

  delete(khachHang: IKhachHang): void {
    const modalRef = this.modalService.open(KhachHangDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.khachHang = khachHang;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
