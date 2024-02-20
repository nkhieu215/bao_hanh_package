import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPhanLoaiChiTietTiepNhan } from '../phan-loai-chi-tiet-tiep-nhan.model';

@Component({
  selector: 'jhi-phan-loai-chi-tiet-tiep-nhan-detail',
  templateUrl: './phan-loai-chi-tiet-tiep-nhan-detail.component.html',
})
export class PhanLoaiChiTietTiepNhanDetailComponent implements OnInit {
  phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ phanLoaiChiTietTiepNhan }) => {
      this.phanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhan;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
