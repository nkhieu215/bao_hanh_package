import { IPhanLoaiChiTietTiepNhan } from './../../phan-loai-chi-tiet-tiep-nhan/phan-loai-chi-tiet-tiep-nhan.model';
import { FormBuilder } from '@angular/forms';
import { IPhanTichSanPham } from 'app/entities/phan-tich-san-pham/phan-tich-san-pham.model';
import { ChiTietSanPhamTiepNhanService } from 'app/entities/chi-tiet-san-pham-tiep-nhan/service/chi-tiet-san-pham-tiep-nhan.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { PhanTichSanPhamService } from 'app/entities/phan-tich-san-pham/service/phan-tich-san-pham.service';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { IChiTietSanPhamTiepNhan } from 'app/entities/chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.model';
import { FieldType, Filters, OnEventArgs, Formatters, AngularGridInstance, GridOption, Column, Formatter } from 'angular-slickgrid';
import { Component } from '@angular/core';
import { PhanTichSanPhamComponent } from './phan-tich-san-pham.component';
@Component({
  template: `<div id="demo-container" class="container-fluid">
    <angular-slickgrid
      gridId="phanTichThongTinSanPhams"
      [columnDefinitions]="columnDefinitions1"
      [gridOptions]="gridOptions1"
      [dataset]="phanTichThongTinSanPhams"
    ></angular-slickgrid>

    <!-- <ng-template #content let-c="close" let-d="dismiss"> -->

    <!-- </ng-template> -->
  </div>`,
})
export class PhanTichThongTinSanPhamComponent {
  chiTietThongTinSanPhamUrl = this.applicationConfigService.getEndpointFor('api/phan-tich-san-phams');
  chiTietThongTinSanPhamUrl2 = this.applicationConfigService.getEndpointFor('api/phan-loai-chi-tiet-tiep-nhans');

  danhSachTinhTrangs: any[] = [];
  phanTichThongTinSanPhams: any[] = [];

  columnDefinitions?: IPhanTichSanPham[];

  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions1!: GridOption;
  gridOptions2!: GridOption;
  dataset1!: any[];
  dataset2!: any[];
  angularGrid?: AngularGridInstance;

  phanTichChiTietSanPham1?: IPhanTichSanPham[];
  phanTichChiTietSanPham2?: IPhanLoaiChiTietTiepNhan[];

  isLoading = false;

  predicate!: string;
  ascending!: boolean;

  formSearch = this.formBuilder.group({
    id: [],
    tenSanPham: [],
    lot: [],
    partNumber: [],
    namSanXuat: [],
    userName: [],
    ngayKiemTra: [],
    user: [],
    trangThai: [],
  });

  editForm = this.formBuilder.group({});

  popupChiTietLoi = false;
  type = '';

  constructor(
    protected chiTietSanPhamTiepNhanService: ChiTietSanPhamTiepNhanService,
    protected phanTichSanPhamService: PhanTichSanPhamService,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected formBuilder: FormBuilder,
    protected aaaa: PhanTichSanPhamComponent
  ) {}
  buttonTongHop: Formatter<any> = (_row, _cell, value) =>
    value ? `<button class="btn btn-primary">G</button>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };

  buttonSerial: Formatter<any> = (_row, _cell, value) =>
    value ? `<button class="btn btn-primary">S</button>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };

  buttonLot: Formatter<any> = (_row, _cell, value) =>
    value ? `<button class="btn btn-primary">L</button>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };
  loadAll(): void {
    this.chiTietSanPhamTiepNhanService.query().subscribe({
      next: (res: HttpResponse<IPhanTichSanPham[]>) => {
        this.isLoading = false;
        this.phanTichThongTinSanPhams = res.body ?? [];
        // console.log('ccc', this.phanTichThongTinSanPhams);
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.isLoading = true;
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    this.columnDefinitions = [];
    this.columnDefinitions1 = [
      {
        id: 'popup',
        field: 'id',
        name: 'Tổng hợp',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonTongHop,
        maxWidth: 90,
        minWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          // console.log(args);
          this.resultPopup('lot');
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },
      {
        id: 'popup',
        field: 'id',
        name: 'Serial',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonSerial,
        maxWidth: 60,
        minWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          // console.log(args);
          this.resultPopup('lot');
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },
      {
        id: 'popup',
        field: 'id',
        name: 'LOT',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonLot,
        maxWidth: 60,
        minWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          // console.log(args);
          this.resultPopup('lot');
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },
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
        id: 'name',
        name: 'Sản phẩm',
        field: 'chiTietSanPhamTiepNhan.sanPham.name',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,

        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'detail',
        name: 'Số lô',
        field: 'detail',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,

        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'lotNumber',
        name: 'LOT Number',
        field: 'lot',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,

        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'namSanXuat',
        name: 'Năm sản xuất',
        field: 'namSanXuat',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,

        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'tenNhanVienPhanTich',
        name: 'Nhân viên phân tích',
        field: 'tenNhanVienPhanTich',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,

        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'ngayKiemTra',
        name: 'Ngày kiểm tra',
        field: 'ngayKiemTra',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,

        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'username',
        name: 'User',
        field: 'username',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,

        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'trangThai',
        name: 'Trạng thái',
        field: 'trangThai',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,

        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
    ];
    this.gridOptions1 = {
      enableAutoResize: true,
      enableSorting: true,
      gridHeight: 225,
      gridWidth: 1780,
      enablePagination: true,
      enableColumnPicker: true,
      pagination: {
        pageSize: 10,
        pageSizes: [5, 10, 20],
      },
    };
    this.loadAll();
    this.getThongTinPhanTichChiTietSanPham();
  }

  getThongTinPhanTichChiTietSanPham(): void {
    this.http.get<any>(this.chiTietThongTinSanPhamUrl).subscribe(res => {
      this.phanTichChiTietSanPham1 = res;
      sessionStorage.setItem('phan tich chi tiet san pham', JSON.stringify(res));
      // console.log('res', res);
    });

    this.http.get<any>(this.chiTietThongTinSanPhamUrl2).subscribe(res2 => {
      this.phanTichChiTietSanPham2 = res2;
      sessionStorage.setItem('phan tich chi tiet san pham 2', JSON.stringify(res2));
      // console.log('res2', res2);
    });
  }

  resultPopup(type: string): void {
    this.popupChiTietLoi = true;
    this.aaaa.resultPopup(this.popupChiTietLoi, type);
  }
}
