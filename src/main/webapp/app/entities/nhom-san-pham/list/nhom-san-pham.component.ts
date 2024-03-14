import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INhomSanPham } from '../nhom-san-pham.model';
import { NhomSanPhamService } from '../service/nhom-san-pham.service';
import { NhomSanPhamDeleteDialogComponent } from '../delete/nhom-san-pham-delete-dialog.component';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@Component({
  selector: 'jhi-nhom-san-pham',
  templateUrl: './nhom-san-pham.component.html',
})
export class NhomSanPhamComponent implements OnInit {
  nhomSanPhams?: INhomSanPham[];
  isLoading = false;
  @Input() itemPerPage = 10;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  ngbPaginationPage = 1;

  constructor(
    protected nhomSanPhamService: NhomSanPhamService,
    protected modalService: NgbModal,
    protected navBarComponent: NavbarComponent
  ) {}

  loadAll(): void {
    this.navBarComponent.toggleSidebar2();

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
