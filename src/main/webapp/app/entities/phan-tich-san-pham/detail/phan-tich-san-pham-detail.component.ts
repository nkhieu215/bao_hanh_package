import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPhanTichSanPham } from '../phan-tich-san-pham.model';

@Component({
  selector: 'jhi-phan-tich-san-pham-detail',
  templateUrl: './phan-tich-san-pham-detail.component.html',
})
export class PhanTichSanPhamDetailComponent implements OnInit {
  phanTichSanPham: IPhanTichSanPham | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ phanTichSanPham }) => {
      this.phanTichSanPham = phanTichSanPham;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
