import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INhomSanPham } from '../nhom-san-pham.model';

@Component({
  selector: 'jhi-nhom-san-pham-detail',
  templateUrl: './nhom-san-pham-detail.component.html',
})
export class NhomSanPhamDetailComponent implements OnInit {
  nhomSanPham: INhomSanPham | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nhomSanPham }) => {
      this.nhomSanPham = nhomSanPham;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
