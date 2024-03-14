import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INganh } from '../nganh.model';
import { NganhService } from '../service/nganh.service';
import { NganhDeleteDialogComponent } from '../delete/nganh-delete-dialog.component';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@Component({
  selector: 'jhi-nganh',
  templateUrl: './nganh.component.html',
})
export class NganhComponent implements OnInit {
  nganhs?: INganh[];
  isLoading = false;
  @Input() itemPerPage = 10;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  ngbPaginationPage = 1;

  constructor(protected nganhService: NganhService, protected modalService: NgbModal, protected navBarComponent: NavbarComponent) {}

  loadAll(): void {
    this.navBarComponent.toggleSidebar2();
    this.isLoading = true;
    this.nganhService.query().subscribe({
      next: (res: HttpResponse<INganh[]>) => {
        this.isLoading = false;
        this.nganhs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: INganh): number {
    return item.id!;
  }

  delete(nganh: INganh): void {
    const modalRef = this.modalService.open(NganhDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.nganh = nganh;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
