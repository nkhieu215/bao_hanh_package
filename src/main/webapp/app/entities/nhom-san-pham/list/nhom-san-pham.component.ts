import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INhomSanPham } from '../nhom-san-pham.model';
import { NhomSanPhamService } from '../service/nhom-san-pham.service';
import { NhomSanPhamDeleteDialogComponent } from '../delete/nhom-san-pham-delete-dialog.component';

@Component({
  selector: 'jhi-nhom-san-pham',
  templateUrl: './nhom-san-pham.component.html',
})
export class NhomSanPhamComponent implements OnInit {
  nhomSanPhams?: INhomSanPham[];
  isLoading = false;

  constructor(protected nhomSanPhamService: NhomSanPhamService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.nhomSanPhamService.query().subscribe({
      next: (res: HttpResponse<INhomSanPham[]>) => {
        this.isLoading = false;
        this.nhomSanPhams = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: INhomSanPham): number {
    return item.id!;
  }

  delete(nhomSanPham: INhomSanPham): void {
    const modalRef = this.modalService.open(NhomSanPhamDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.nhomSanPham = nhomSanPham;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
