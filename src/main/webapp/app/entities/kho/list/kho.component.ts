import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IKho } from '../kho.model';
import { KhoService } from '../service/kho.service';
import { KhoDeleteDialogComponent } from '../delete/kho-delete-dialog.component';

@Component({
  selector: 'jhi-kho',
  templateUrl: './kho.component.html',
})
export class KhoComponent implements OnInit {
  khos?: IKho[];
  isLoading = false;

  constructor(protected khoService: KhoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.khoService.query().subscribe({
      next: (res: HttpResponse<IKho[]>) => {
        this.isLoading = false;
        this.khos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IKho): number {
    return item.id!;
  }

  delete(kho: IKho): void {
    const modalRef = this.modalService.open(KhoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.kho = kho;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
