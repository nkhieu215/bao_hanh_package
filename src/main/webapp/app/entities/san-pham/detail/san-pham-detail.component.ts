import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISanPham } from '../san-pham.model';

@Component({
  selector: 'jhi-san-pham-detail',
  templateUrl: './san-pham-detail.component.html',
})
export class SanPhamDetailComponent implements OnInit {
  sanPham: ISanPham | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sanPham }) => {
      this.sanPham = sanPham;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
