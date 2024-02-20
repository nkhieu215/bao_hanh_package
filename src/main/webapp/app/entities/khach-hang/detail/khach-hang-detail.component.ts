import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKhachHang } from '../khach-hang.model';

@Component({
  selector: 'jhi-khach-hang-detail',
  templateUrl: './khach-hang-detail.component.html',
})
export class KhachHangDetailComponent implements OnInit {
  khachHang: IKhachHang | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ khachHang }) => {
      this.khachHang = khachHang;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
