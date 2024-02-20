import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDanhSachTinhTrang } from '../danh-sach-tinh-trang.model';

@Component({
  selector: 'jhi-danh-sach-tinh-trang-detail',
  templateUrl: './danh-sach-tinh-trang-detail.component.html',
})
export class DanhSachTinhTrangDetailComponent implements OnInit {
  danhSachTinhTrang: IDanhSachTinhTrang | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ danhSachTinhTrang }) => {
      this.danhSachTinhTrang = danhSachTinhTrang;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
