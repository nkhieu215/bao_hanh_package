import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INhomLoi } from '../nhom-loi.model';
import { NhomLoiService } from '../service/nhom-loi.service';
import { NhomLoiDeleteDialogComponent } from '../delete/nhom-loi-delete-dialog.component';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@Component({
  selector: 'jhi-nhom-loi',
  templateUrl: './nhom-loi.component.html',
})
export class NhomLoiComponent implements OnInit {
  nhomLois?: INhomLoi[];
  isLoading = false;
  @Input() itemPerPage = 10;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  ngbPaginationPage = 1;

  constructor(protected nhomLoiService: NhomLoiService, protected modalService: NgbModal, protected navBarComponent: NavbarComponent) {}

  loadAll(): void {
    this.navBarComponent.toggleSidebar2();
    this.isLoading = true;

    this.nhomLoiService.query().subscribe({
      next: (res: HttpResponse<INhomLoi[]>) => {
        this.isLoading = false;
        this.nhomLois = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: INhomLoi): number {
    return item.id!;
  }

  delete(nhomLoi: INhomLoi): void {
    const modalRef = this.modalService.open(NhomLoiDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.nhomLoi = nhomLoi;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
