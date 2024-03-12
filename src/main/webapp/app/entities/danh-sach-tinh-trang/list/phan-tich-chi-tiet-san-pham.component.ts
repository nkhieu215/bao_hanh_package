import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { HttpClient } from '@angular/common/http';
import { PhanTichSanPhamService } from 'app/entities/phan-tich-san-pham/service/phan-tich-san-pham.service';
import { Component } from '@angular/core';
import { Column, GridOption, AngularGridInstance, Formatters, OnEventArgs, FieldType, Filters } from 'angular-slickgrid';
import { IPhanTichSanPham } from 'app/entities/phan-tich-san-pham/phan-tich-san-pham.model';
@Component({
  template: `<div id="demo-container" class="container-fluid"></div>`,
})
export class PhanTichChiTietSanPhamComponent {
  phanTichSanPhams: any[] = [];
  columnDefinitions?: IPhanTichSanPham[];
  columnDefinitions1: Column[] = [];
  gridOptions1!: GridOption;
  dataset1!: any[];
  angularGrid?: AngularGridInstance;

  isLoading = false;

  constructor(
    protected phanTichSanPhamService: PhanTichSanPhamService,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  loadAll(): void {
    this.isLoading = true;
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    this.columnDefinitions = [];
    this.columnDefinitions1 = [
      {
        id: 'edit',
        field: 'id',
        name: 'Option',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        params: { iconCssClass: 'fa fa-pencil pointer' },
        maxWidth: 60,
        minWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          // console.log(args);
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },
      {
        id: 'id',
        name: 'STT',
        field: 'id',
        sortable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
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
  }
}
