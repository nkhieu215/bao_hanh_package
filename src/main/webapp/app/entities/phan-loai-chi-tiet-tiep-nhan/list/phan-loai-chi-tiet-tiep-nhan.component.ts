import { Column, GridOption, AngularGridInstance, Formatters } from 'angular-slickgrid';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhanLoaiChiTietTiepNhan } from '../phan-loai-chi-tiet-tiep-nhan.model';
import { PhanLoaiChiTietTiepNhanService } from '../service/phan-loai-chi-tiet-tiep-nhan.service';
import { PhanLoaiChiTietTiepNhanDeleteDialogComponent } from '../delete/phan-loai-chi-tiet-tiep-nhan-delete-dialog.component';

@Component({
  selector: 'jhi-phan-loai-chi-tiet-tiep-nhan',
  templateUrl: './phan-loai-chi-tiet-tiep-nhan.component.html',
})
export class PhanLoaiChiTietTiepNhanComponent implements OnInit {
  phanLoaiChiTietTiepNhans: any[] = [];
  isLoading = false;
  columnDefinitions?: IPhanLoaiChiTietTiepNhan[];
  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions1: GridOption = {};
  gridOptions2: GridOption = {};
  angularGrid?: AngularGridInstance;
  title = 'Phân tích chi tiết sản phẩm';

  constructor(protected phanLoaiChiTietTiepNhanService: PhanLoaiChiTietTiepNhanService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.phanLoaiChiTietTiepNhanService.query().subscribe({
      next: (res: HttpResponse<IPhanLoaiChiTietTiepNhan[]>) => {
        this.isLoading = false;
        this.phanLoaiChiTietTiepNhans = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.columnDefinitions = [];
    this.columnDefinitions1 = [
      {
        id: 'tenSanPham',
        name: 'Tên sản phẩm',
        field: 'chiTietSanPhamTiepNhan.sanPham.name',
      },
      {
        id: 'tinhTrang',
        name: 'Tình trạng bảo hành',
        field: 'danhSachTinhTrang.tenTinhTrangPhanloai',
      },
      {
        id: 'soLuong',
        name: 'Số lượng đã nhận',
        field: 'soLuong',
      },
      {
        id: 'soLuong',
        name: 'Số lượng tồn',
        field: 'soLuong',
      },
    ];
    this.gridOptions1 = {
      gridHeight: 100,
    };

    this.columnDefinitions2 = [
      {
        id: 'editLOT',
        name: 'Options',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        params: { iconCssClass: 'fa fa-pencil pinter' },
        minWidth: 60,
        maxWidth: 60,
      },
      {
        id: 'editPartNumber',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        params: { iconCssClass: 'fa fa-pencil pinter' },
        minWidth: 60,
        maxWidth: 60,
      },
      {
        id: 'stt',
        name: 'STT',
        field: 'id',
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: 'tenSanPham',
        name: 'Sản phẩm',
        field: 'name',
      },
      {
        id: 'detail',
        name: 'Số lô',
        field: 'phanTichSanPham.detail',
      },
      {
        id: 'lotNumber',
        name: 'LOT Number',
        field: 'phanTichSanPham.lotNumber',
      },
      {
        id: 'namSanXuat',
        name: 'Năm sản xuất',
        field: 'phanTichSanPham.namSanXuat',
      },
      {
        id: 'username',
        name: 'Nhân viên phân tích',
        field: 'phanTichSanPham.username',
      },
      {
        id: 'ngayKiemTra',
        name: 'Ngày kiểm tra',
        field: 'phanTichSanPham.ngayKiemTra',
      },
      {
        id: 'username',
        name: 'User',
        field: 'phanTichSanPham.username',
      },
      {
        id: 'trangThai',
        name: 'Trạng thái',
        field: 'phanTichSanPham.trangThai',
      },
    ];
    this.loadAll();
  }

  trackId(_index: number, item: IPhanLoaiChiTietTiepNhan): number {
    return item.id!;
  }

  delete(phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan): void {
    const modalRef = this.modalService.open(PhanLoaiChiTietTiepNhanDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.phanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhan;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
