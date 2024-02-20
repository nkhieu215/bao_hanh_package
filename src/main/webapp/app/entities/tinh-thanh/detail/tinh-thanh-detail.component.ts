import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITinhThanh } from '../tinh-thanh.model';

@Component({
  selector: 'jhi-tinh-thanh-detail',
  templateUrl: './tinh-thanh-detail.component.html',
})
export class TinhThanhDetailComponent implements OnInit {
  tinhThanh: ITinhThanh | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tinhThanh }) => {
      this.tinhThanh = tinhThanh;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
