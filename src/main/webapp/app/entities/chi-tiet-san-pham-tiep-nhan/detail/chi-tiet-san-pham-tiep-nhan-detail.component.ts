import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChiTietSanPhamTiepNhan } from '../chi-tiet-san-pham-tiep-nhan.model';

@Component({
  selector: 'jhi-chi-tiet-san-pham-tiep-nhan-detail',
  templateUrl: './chi-tiet-san-pham-tiep-nhan-detail.component.html',
})
export class ChiTietSanPhamTiepNhanDetailComponent implements OnInit {
  chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chiTietSanPhamTiepNhan }) => {
      this.chiTietSanPhamTiepNhan = chiTietSanPhamTiepNhan;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
