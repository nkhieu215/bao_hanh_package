import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPhanTichLoi } from '../phan-tich-loi.model';

@Component({
  selector: 'jhi-phan-tich-loi-detail',
  templateUrl: './phan-tich-loi-detail.component.html',
})
export class PhanTichLoiDetailComponent implements OnInit {
  phanTichLoi: IPhanTichLoi | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ phanTichLoi }) => {
      this.phanTichLoi = phanTichLoi;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
