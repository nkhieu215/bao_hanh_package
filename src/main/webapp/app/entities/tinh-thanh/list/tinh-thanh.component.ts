import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITinhThanh } from '../tinh-thanh.model';
import { TinhThanhService } from '../service/tinh-thanh.service';
import { TinhThanhDeleteDialogComponent } from '../delete/tinh-thanh-delete-dialog.component';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@Component({
  selector: 'jhi-tinh-thanh',
  templateUrl: './tinh-thanh.component.html',
})
export class TinhThanhComponent implements OnInit {
  tinhThanhs?: ITinhThanh[];
  isLoading = false;
  @Input() itemPerPage = 10;

  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  ngbPaginationPage = 1;

  constructor(protected tinhThanhService: TinhThanhService, protected modalService: NgbModal, protected navBarComponent: NavbarComponent) {}

  loadAll(): void {
    this.navBarComponent.toggleSidebar2();
    this.isLoading = true;

    this.tinhThanhService.query().subscribe({
      next: (res: HttpResponse<ITinhThanh[]>) => {
        this.isLoading = false;
        this.tinhThanhs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITinhThanh): number {
    return item.id!;
  }

  delete(tinhThanh: ITinhThanh): void {
    const modalRef = this.modalService.open(TinhThanhDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tinhThanh = tinhThanh;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
