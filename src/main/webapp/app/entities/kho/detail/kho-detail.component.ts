import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKho } from '../kho.model';

@Component({
  selector: 'jhi-kho-detail',
  templateUrl: './kho-detail.component.html',
})
export class KhoDetailComponent implements OnInit {
  kho: IKho | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kho }) => {
      this.kho = kho;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
