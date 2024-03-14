import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhanTichLoi } from '../phan-tich-loi.model';
import { PhanTichLoiService } from '../service/phan-tich-loi.service';
import { PhanTichLoiDeleteDialogComponent } from '../delete/phan-tich-loi-delete-dialog.component';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-phan-tich-loi',
  templateUrl: './phan-tich-loi.component.html',
})
export class PhanTichLoiComponent implements OnInit {
  phanTichLois?: IPhanTichLoi[];
  isLoading = false;
  @Input() itemPerPage = 10;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  ngbPaginationPage = 1;

  constructor(protected phanTichLoiService: PhanTichLoiService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.phanTichLoiService.query().subscribe({
      next: (res: HttpResponse<IPhanTichLoi[]>) => {
        this.isLoading = false;
        this.phanTichLois = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPhanTichLoi): number {
    return item.id!;
  }

  delete(phanTichLoi: IPhanTichLoi): void {
    const modalRef = this.modalService.open(PhanTichLoiDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.phanTichLoi = phanTichLoi;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
