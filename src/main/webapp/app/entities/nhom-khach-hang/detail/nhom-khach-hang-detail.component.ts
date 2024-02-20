import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INhomKhachHang } from '../nhom-khach-hang.model';

@Component({
  selector: 'jhi-nhom-khach-hang-detail',
  templateUrl: './nhom-khach-hang-detail.component.html',
})
export class NhomKhachHangDetailComponent implements OnInit {
  nhomKhachHang: INhomKhachHang | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nhomKhachHang }) => {
      this.nhomKhachHang = nhomKhachHang;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
