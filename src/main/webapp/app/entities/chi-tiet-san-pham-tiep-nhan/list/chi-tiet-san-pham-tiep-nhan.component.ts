import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChiTietSanPhamTiepNhan } from '../chi-tiet-san-pham-tiep-nhan.model';
import { ChiTietSanPhamTiepNhanService } from '../service/chi-tiet-san-pham-tiep-nhan.service';
import { ChiTietSanPhamTiepNhanDeleteDialogComponent } from '../delete/chi-tiet-san-pham-tiep-nhan-delete-dialog.component';
import { AngularGridInstance, Column, ExternalResource, FieldType, Filters, Formatters, GridOption } from 'angular-slickgrid';
import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'jhi-chi-tiet-san-pham-tiep-nhan',
  templateUrl: './chi-tiet-san-pham-tiep-nhan.component.html',
})
export class ChiTietSanPhamTiepNhanComponent implements OnInit {
  tongHopUrl = this.applicationConfigService.getEndpointFor('api/tong-hop');
  searchDateUrl = this.applicationConfigService.getEndpointFor('api/search-date');
  tongHopCaculateUrl = this.applicationConfigService.getEndpointFor('api/tong-hop-caculate');
  chiTietSanPhamTiepNhans?: IChiTietSanPhamTiepNhan[];
  popupViewCTL = false;
  isLoading = false;
  columnDefinitions: Column[] = [];
  conlumDefinitionCTL: Column[] = [];
  gridOptions: GridOption = {};
  gridOptionCTL: GridOption = {};
  angularGrid!: AngularGridInstance;
  gridObj: any;
  dataViewObj: any;
  chiTietSanPhamTiepNhan: any[] = [];
  chiTietSanPhamTiepNhanGoc: any[] = [];
  chiTietSanPhamTiepNhanCTL: ITongHop[] = [];
  chiTietSanPhamTiepNhanCTLGoc: ITongHop[] = [];
  chiTietSanPhamTiepNhanExport: IChiTietSanPhamTiepNhan[] = [];
  excelExportService: ExcelExportService;

  // startDate: Date
  fileName = 'bao-cao-doi-tra';
  dataSearch: {
    maTiepNhan: string;
    nhanVienGiaoHang: string;
    tenKhachHang: string;
    nhomKhachHang: string;
    tinhThanh: string;
    tenSanPham: string;
    tenNganh: string;
    tenChungLoai: string;
    tenNhomSanPham: string;
  } = {
    maTiepNhan: '',
    nhanVienGiaoHang: '',
    tenKhachHang: '',
    nhomKhachHang: '',
    tinhThanh: '',
    tenSanPham: '',
    tenNganh: '',
    tenChungLoai: '',
    tenNhomSanPham: '',
  };
  data: {
    donBaoHanhId?: number;
    maTiepNhan?: string;
    namSanXuat?: Date;
    ngayTiepNhan?: Date;
    ngayPhanTich?: Date;
    nhanVienGiaoHang?: string;
    tenKhachHang?: string;
    nhomKhachHang?: string;
    tinhThanh?: string;
    tenSanPham?: string;
    tenNganh?: string;
    tenChungLoai?: string;
    tenNhomSanPham?: string;
    soLuongKhachGiao?: number;
    slTiepNhan?: number;
    tenNhomLoi?: string;
    soLuongTheoTungLoi?: number;
    trangThai?: string;
  }[] = [];

  dataCTL: ITongHop[] = [];

  constructor(
    protected chiTietSanPhamTiepNhanService: ChiTietSanPhamTiepNhanService,
    protected modalService: NgbModal,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient
  ) {
    this.excelExportService = new ExcelExportService();
  }

  loadAll(): void {
    this.isLoading = true;

    this.chiTietSanPhamTiepNhanService.query().subscribe({
      next: (res: HttpResponse<IChiTietSanPhamTiepNhan[]>) => {
        this.isLoading = false;
        this.chiTietSanPhamTiepNhans = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.dataShow();
    this.getTongHopUrl();
  }

  dataShow(): void {
    this.columnDefinitions = [
      {
        id: 'id',
        field: 'id',
        name: 'STT',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        sortable: true,
        minWidth: 40,
        maxWidth: 50,
      },
      {
        id: 'maTiepNhan',
        field: 'maTiepNhan',
        name: 'Mã tiếp nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 140,
        minWidth: 50,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'ngayTiepNhan',
        field: 'ngayTiepNhan',
        name: 'Ngày tiếp nhận',
        formatter: Formatters.dateTimeIso,
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 150,
        minWidth: 50,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'ngayPhanTich',
        field: 'ngayPhanTich',
        name: 'Ngày phân tích',
        formatter: Formatters.dateTimeIso,
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 150,
        minWidth: 50,
      },
      {
        id: 'nhanVienGiaoHang',
        field: 'nhanVienGiaoHang',
        name: 'Nhân viên giao hàng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 150,
        minWidth: 50,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'tenKhachHang',
        field: 'tenKhachHang',
        name: 'Tên Khách hàng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 360,
        minWidth: 50,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'nhomKhachHang',
        field: 'nhomKhachHang',
        name: 'Nhóm khách hàng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 360,
        minWidth: 50,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'tinhThanh',
        field: 'tinhThanh',
        name: 'Tỉnh thành',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 10,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'tenSanPham',
        field: 'tenSanPham',
        name: 'Tên sản phẩm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 360,
        minWidth: 150,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'tenNganh',
        field: 'tenNganh',
        name: 'Ngành',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 50,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'tenChungLoai',
        field: 'tenChungLoai',
        name: 'Chủng loại',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 200,
        minWidth: 50,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'tenNhomSanPham',
        field: 'tenNhomSanPham',
        name: 'Nhóm sản phẩm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 200,
        minWidth: 50,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'soLuongKhachGiao',
        field: 'soLuongKhachGiao',
        name: 'Số lượng khách giao',
        cssClass: 'column-item',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 20,
      },
      {
        id: 'slTiepNhan',
        field: 'slTiepNhan',
        name: 'Số lượng thực nhận',
        cssClass: 'column-item',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 50,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'tenNhomLoi',
        field: 'tenNhomLoi',
        name: 'Nhóm lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 50,
      },
      {
        id: 'tongSoLuong',
        field: 'tongSoLuong',
        name: 'Tổng lỗi',
        cssClass: 'column-item',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 80,
        minWidth: 50,
      },
      {
        id: 'trangThai',
        field: 'trangThai',
        name: 'Trạng thái',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 50,
      },
    ];

    this.conlumDefinitionCTL = [
      {
        id: 'id',
        field: 'id',
        name: 'STT',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        sortable: true,
        // maxWidth: 60,
        minWidth: 40,
        maxWidth: 50,
      },
      {
        id: 'maTiepNhan',
        field: 'maTiepNhan',
        name: 'Mã tiếp nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 140,
        minWidth: 50,
      },
      {
        id: 'namSanXuat',
        field: 'namSanXuat',
        name: 'Năm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        minWidth: 60,
        maxWidth: 60,
      },
      {
        id: 'ngayTiepNhan',
        field: 'ngayTiepNhan',
        name: 'Ngày tiếp nhận',
        formatter: Formatters.dateTimeIso,
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 150,
        minWidth: 50,
      },
      {
        id: 'ngayPhanTich',
        field: 'ngayPhanTich',
        name: 'Ngày phân tích',
        formatter: Formatters.dateTimeIso,
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 150,
        minWidth: 50,
      },
      {
        id: 'nhanVienGiaoHang',
        field: 'nhanVienGiaoHang',
        name: 'Nhân viên giao hàng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 150,
        minWidth: 50,
      },
      {
        id: 'tenKhachHang',
        field: 'tenKhachHang',
        name: 'Tên Khách hàng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 360,
        minWidth: 50,
      },
      {
        id: 'nhomKhachHang',
        field: 'nhomKhachHang',
        name: 'Nhóm khách hàng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 360,
        minWidth: 50,
      },
      {
        id: 'tinhThanh',
        field: 'tinhThanh',
        name: 'Tỉnh thành',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 10,
      },
      {
        id: 'tenSanPham',
        field: 'tenSanPham',
        name: 'Tên sản phẩm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 360,
        minWidth: 150,
      },
      {
        id: 'tenNganh',
        field: 'tenNganh',
        name: 'Ngành',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 50,
      },
      {
        id: 'tenChungLoai',
        field: 'tenChungLoai',
        name: 'Chủng loại',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 200,
        minWidth: 50,
      },
      {
        id: 'tenNhomSanPham',
        field: 'tenNhomSanPham',
        name: 'Nhóm sản phẩm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 200,
        minWidth: 50,
      },
      {
        id: 'soLuongKhachGiao',
        field: 'soLuongKhachGiao',
        name: 'Số lượng khách giao',
        cssClass: 'column-item',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 20,
      },
      {
        id: 'slTiepNhan',
        field: 'slTiepNhan',
        name: 'Số lượng thực nhận',
        cssClass: 'column-item',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 50,
      },
      {
        id: 'lotNumber',
        field: 'lotNumber',
        name: 'LOT',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 160,
        minWidth: 60,
      },
      {
        id: 'serial',
        field: 'serial',
        name: 'Serial',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 160,
        minWidth: 50,
      },
      {
        id: 'tenNhomLoi',
        field: 'tenNhomLoi',
        name: 'Tên nhóm lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 50,
      },
      {
        id: 'tenLoi',
        field: 'tenLoi',
        name: 'Tên lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 360,
        minWidth: 200,
      },
      {
        id: 'soLuongTheoTungLoi',
        field: 'soLuongTheoTungLoi',
        cssClass: 'column-item',
        name: 'Số lượng lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 80,
        minWidth: 10,
      },
    ];
    console.log('header', this.conlumDefinitionCTL);
    this.gridOptions = {
      enableAutoResize: true,
      enableSorting: true,
      enableFiltering: true,
      enablePagination: true,
      enableAutoSizeColumns: true,
      asyncEditorLoadDelay: 1000,
      pagination: {
        pageSizes: [20, 50, this.chiTietSanPhamTiepNhan.length],
        pageSize: this.chiTietSanPhamTiepNhan.length,
      },
      presets: {
        columns: [
          { columnId: 'maTiepNhan' },
          { columnId: 'namSanXuat' },
          { columnId: 'ngayTiepNhan' },
          { columnId: 'ngayPhanTich' },
          { columnId: 'nhanVienGiaoHang' },
          { columnId: 'tenKhachHang' },
          { columnId: 'nhomKhachHang' },
          { columnId: 'tinhThanh' },
          { columnId: 'tenSanPham' },
          { columnId: 'tenNganh' },
          { columnId: 'tenChungLoai' },
          { columnId: 'tenNhomSanPham' },
          { columnId: 'soLuongKhachGiao' },
          { columnId: 'slTiepNhan' },
          { columnId: 'tenNhomLoi' },
          { columnId: 'tongSoLuong' },
          { columnId: 'trangThai' },
        ],
      },
      editable: true,
      enableCellNavigation: true,
      gridHeight: 620,
      gridWidth: '100%',
      autoHeight: true,
      autoFitColumnsOnFirstLoad: true,
      asyncEditorLoading: true,
      forceFitColumns: true,
      enableExcelExport: true,
      // enableExcelCopyBuffer: true,
      excelExportOptions: {
        sanitizeDataExport: true,
        filename: 'bao-cao-doi-tra',
        sheetName: 'bao-cao-tong-hop',
      },
      registerExternalResources: [new ExcelExportService() as any],
      // registerExternalResources: [this.excelExportService],
    };
    this.gridOptionCTL = {
      enableAutoResize: true,
      enableSorting: true,
      enableFiltering: true,
      enablePagination: true,
      pagination: {
        pageSizes: [20, 50, this.chiTietSanPhamTiepNhanCTL.length],
        pageSize: this.chiTietSanPhamTiepNhanCTL.length,
      },

      editable: true,
      enableCellNavigation: true,
      gridHeight: 620,
      gridWidth: '100%',
      autoHeight: true,
      presets: {
        columns: [
          { columnId: 'maTiepNhan' },
          { columnId: 'namSanXuat' },
          { columnId: 'ngayTiepNhan' },
          { columnId: 'ngayPhanTich' },
          { columnId: 'nhanVienGiaoHang' },
          { columnId: 'tenKhachHang' },
          { columnId: 'nhomKhachHang' },
          { columnId: 'tinhThanh' },
          { columnId: 'tenSanPham' },
          { columnId: 'tenNganh' },
          { columnId: 'tenChungLoai' },
          { columnId: 'tenNhomSanPham' },
          { columnId: 'soLuongKhachGiao' },
          { columnId: 'slTiepNhan' },
          { columnId: 'lotNumber' },
          { columnId: 'serial' },
          { columnId: 'tenNhomLoi' },
          { columnId: 'tenLoi' },
          { columnId: 'soLuongTheoTungLoi' },
        ],
      },
      // enableExcelExport: true,
      // // enableExcelCopyBuffer: true,
      // excelExportOptions: {
      //   sanitizeDataExport: true,
      //   filename: 'bao-cao-doi-tra',
      //   sheetName: 'bao-cao-tong-hop',
      // },
      // registerExternalResources: [new ExcelExportService() as any],
      // registerExternalResources: [this.excelExportService],
    };
  }

  getTongHopUrl(): void {
    this.http.get<any>(this.tongHopUrl).subscribe(res => {
      this.chiTietSanPhamTiepNhanCTLGoc = res.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);
      for (let i = 0; i < this.chiTietSanPhamTiepNhanCTLGoc.length; ++i) {
        this.chiTietSanPhamTiepNhanCTLGoc[i].id = i + 1;
      }
      this.dataCTL = res.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);
      this.chiTietSanPhamTiepNhanCTL = this.chiTietSanPhamTiepNhanCTLGoc;
      console.log('tong Hop', res);
    });
    this.http.get<any>(this.tongHopCaculateUrl).subscribe(resTongHop => {
      this.chiTietSanPhamTiepNhanGoc = resTongHop.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);
      for (let i = 0; i < this.chiTietSanPhamTiepNhanGoc.length; ++i) {
        this.chiTietSanPhamTiepNhanGoc[i].id = i + 1;
      }
      this.data = resTongHop.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);
      this.chiTietSanPhamTiepNhan = this.chiTietSanPhamTiepNhanGoc;
      console.log('caculate', resTongHop);
    });
  }

  trackId(_index: number, item: IChiTietSanPhamTiepNhan): number {
    return item.id!;
  }

  delete(chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan): void {
    const modalRef = this.modalService.open(ChiTietSanPhamTiepNhanDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chiTietSanPhamTiepNhan = chiTietSanPhamTiepNhan;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  changeDate(): void {
    let dateTimeSearchKey: { startDate: string; endDate: string } = { startDate: '', endDate: '' };
    document.getElementById('dateForm')?.addEventListener('submit', function (event) {
      event.preventDefault();

      const startDateInp = document.getElementById('startDate') as HTMLInputElement;
      const endDateInp = document.getElementById('endDate') as HTMLInputElement;

      const startDate = startDateInp.value;
      const endDate = endDateInp.value;
      dateTimeSearchKey = { startDate: startDateInp.value, endDate: endDateInp.value };
    });
    setTimeout(() => {
      console.log('startDate:', dateTimeSearchKey);
      this.http.post<any>(this.tongHopUrl, dateTimeSearchKey).subscribe(res => {
        console.log('check ressult search:', res);
        this.chiTietSanPhamTiepNhanCTLGoc = res;
        for (let i = 0; i < this.chiTietSanPhamTiepNhanCTLGoc.length; ++i) {
          this.chiTietSanPhamTiepNhanCTLGoc[i].id = i + 1;
        }
        this.dataCTL = res.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);
        this.chiTietSanPhamTiepNhanCTL = this.chiTietSanPhamTiepNhanCTLGoc;
      });

      this.http.post<any>(this.tongHopCaculateUrl, dateTimeSearchKey).subscribe(resCaculate => {
        this.chiTietSanPhamTiepNhanGoc = resCaculate;
        for (let i = 0; i < this.chiTietSanPhamTiepNhanGoc.length; ++i) {
          this.chiTietSanPhamTiepNhanGoc[i].id = i + 1;
        }
        this.data = resCaculate.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);
        this.chiTietSanPhamTiepNhan = this.chiTietSanPhamTiepNhanGoc;
      });
    }, 100);
  }

  exportToExcel(): void {
    const sortedData = this.data.map(item => ({
      donBaoHanhId: item.donBaoHanhId,
      maTiepNhan: item.maTiepNhan,
      namSanXuat: item.namSanXuat,
      ngayTiepNhan: item.ngayTiepNhan,
      ngayPhanTich: item.ngayPhanTich,
      nhanVienGiaoHang: item.nhanVienGiaoHang,
      tenKhachHang: item.tenKhachHang,
      nhomKhachHang: item.nhomKhachHang,
      tinhThanh: item.tinhThanh,
      tenSanPham: item.tenSanPham,
      tenNganh: item.tenNganh,
      tenChungLoai: item.tenChungLoai,
      tenNhomSanPham: item.tenNhomSanPham,
      soLuongKhachGiao: item.soLuongKhachGiao,
      slTiepNhan: item.slTiepNhan,
      tenNhomLoi: item.tenNhomLoi,
      soLuongTheoTungLoi: item.soLuongTheoTungLoi,
      trangThai: item.trangThai,
    }));

    const sortedDataCTL = this.dataCTL.map((itemCTL: ITongHop) => ({
      donBaoHanhId: itemCTL.donBaoHanhId,
      maTiepNhan: itemCTL.maTiepNhan,
      namSanXuat: itemCTL.namSanXuat,
      ngayTiepNhan: itemCTL.ngayTiepNhan,
      ngayPhanTich: itemCTL.ngayPhanTich,
      nhanVienGiaoHang: itemCTL.nhanVienGiaoHang,
      tenKhachHang: itemCTL.tenKhachHang,
      nhomKhachHang: itemCTL.nhomKhachHang,
      tinhThanh: itemCTL.tinhThanh,
      tenSanPham: itemCTL.tenSanPham,
      tenNganh: itemCTL.tenNganh,
      tenChungLoai: itemCTL.tenChungLoai,
      tenNhomSanPham: itemCTL.tenNhomSanPham,
      soLuongKhachGiao: itemCTL.soLuongKhachGiao,
      slTiepNhan: itemCTL.slTiepNhan,
      // tenTinhTrangPhanLoai: itemCTL.tenTinhTrangPhanLoai,
      lotNumber: itemCTL.lotNumber,
      serial: itemCTL.serial,
      tenNhomLoi: itemCTL.tenNhomLoi,
      tenLoi: itemCTL.tenLoi,
      soLuongTheoTungLoi: itemCTL.soLuongTheoTungLoi,
      trangThai: itemCTL.trangThai,
    }));
    console.log('dataCTL', this.dataCTL);
    // const data = document.getElementById("table-data");
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sortedData);
    const wsCTL: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sortedDataCTL);
    // create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'bao-cao-tong-hop');
    XLSX.utils.book_append_sheet(wb, wsCTL, 'bao-cao-chi-tiet');
    XLSX.writeFile(wb, `${this.fileName}.xlsx`);
  }

  openPopupViewCTL(): void {
    // this.handleSearchCTL();
    setTimeout(() => {
      this.popupViewCTL = true;
    }, 100);
    // this.chiTietSanPhamTiepNhanCTL = this.chiTietSanPhamTiepNhanCTLGoc;
  }

  closePopupViewCTL(): void {
    this.popupViewCTL = false;
  }

  onFilterChange(event: Event): void {
    const filterText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.angularGrid) {
      this.angularGrid.filterService.updateFilters([{ columnId: 'donBaoHanhId', operator: 'Contains', searchTerms: [filterText] }]);
    }
  }
  // Lấy thông tin từ khóa tìm kiếm tổng hợp
  onSearchChange(e: any): void {
    // detail is the args data payload
    const args = e.detail;
    if (args.columnId === 'maTiepNhan') {
      if (args.searchTerms === undefined) {
        this.dataSearch.maTiepNhan = '';
      } else {
        this.dataSearch.maTiepNhan = args.searchTerms[0];
      }
    }
    if (args.columnId === 'nhanVienGiaoHang') {
      if (args.searchTerms === undefined) {
        this.dataSearch.nhanVienGiaoHang = '';
      } else {
        this.dataSearch.nhanVienGiaoHang = args.searchTerms[0];
      }
    }
    if (args.columnId === 'tenKhachHang') {
      if (args.searchTerms === undefined) {
        this.dataSearch.tenKhachHang = '';
      } else {
        this.dataSearch.tenKhachHang = args.searchTerms[0];
      }
    }
    if (args.columnId === 'nhomKhachHang') {
      if (args.searchTerms === undefined) {
        this.dataSearch.nhomKhachHang = '';
      } else {
        this.dataSearch.nhomKhachHang = args.searchTerms[0];
      }
    }
    if (args.columnId === 'tinhThanh') {
      if (args.searchTerms === undefined) {
        this.dataSearch.tinhThanh = '';
      } else {
        this.dataSearch.tinhThanh = args.searchTerms[0];
      }
    }
    if (args.columnId === 'tenSanPham') {
      if (args.searchTerms === undefined) {
        this.dataSearch.tenSanPham = '';
      } else {
        this.dataSearch.tenSanPham = args.searchTerms[0];
      }
    }
    if (args.columnId === 'tenNganh') {
      if (args.searchTerms === undefined) {
        this.dataSearch.tenNganh = '';
      } else {
        this.dataSearch.tenNganh = args.searchTerms[0];
      }
    }
    if (args.columnId === 'tenChungLoai') {
      if (args.searchTerms === undefined) {
        this.dataSearch.tenChungLoai = '';
      } else {
        this.dataSearch.tenChungLoai = args.searchTerms[0];
      }
    }
    if (args.columnId === 'tenNhomSanPham') {
      if (args.searchTerms === undefined) {
        this.dataSearch.tenNhomSanPham = '';
      } else {
        this.dataSearch.tenNhomSanPham = args.searchTerms[0];
      }
    }
    this.handleSearchCTL();
    console.log('header search body', this.dataSearch);
    // this.handleSearchCTL();
  }
  //Filter trong danh sách chi tiết
  handleSearchCTL(): void {
    this.data = this.chiTietSanPhamTiepNhanGoc.filter(
      item =>
        item.maTiepNhan.toLowerCase().includes(this.dataSearch.maTiepNhan) &&
        item.nhanVienGiaoHang.toLowerCase().includes(this.dataSearch.nhanVienGiaoHang) &&
        item.tenKhachHang.toLowerCase().includes(this.dataSearch.tenKhachHang) &&
        item.nhomKhachHang.toLowerCase().includes(this.dataSearch.nhomKhachHang) &&
        item.tinhThanh.toLowerCase().includes(this.dataSearch.tinhThanh) &&
        item.tenSanPham.toLowerCase().includes(this.dataSearch.tenSanPham) &&
        item.tenNganh.toLowerCase().includes(this.dataSearch.tenNganh) &&
        item.tenChungLoai.toLowerCase().includes(this.dataSearch.tenChungLoai) &&
        item.tenNhomSanPham.toLowerCase().includes(this.dataSearch.tenNhomSanPham)
    );
    this.chiTietSanPhamTiepNhanCTL = this.chiTietSanPhamTiepNhanCTLGoc.filter(
      item =>
        item.maTiepNhan.toLowerCase().includes(this.dataSearch.maTiepNhan) &&
        item.nhanVienGiaoHang.toLowerCase().includes(this.dataSearch.nhanVienGiaoHang) &&
        item.tenKhachHang.toLowerCase().includes(this.dataSearch.tenKhachHang) &&
        item.nhomKhachHang.toLowerCase().includes(this.dataSearch.nhomKhachHang) &&
        item.tinhThanh.toLowerCase().includes(this.dataSearch.tinhThanh) &&
        item.tenSanPham.toLowerCase().includes(this.dataSearch.tenSanPham) &&
        item.tenNganh.toLowerCase().includes(this.dataSearch.tenNganh) &&
        item.tenChungLoai.toLowerCase().includes(this.dataSearch.tenChungLoai) &&
        item.tenNhomSanPham.toLowerCase().includes(this.dataSearch.tenNhomSanPham)
    );
    console.log('result', this.chiTietSanPhamTiepNhanCTL);
    this.dataCTL = this.chiTietSanPhamTiepNhanCTLGoc.filter(
      item =>
        item.maTiepNhan.toLowerCase().includes(this.dataSearch.maTiepNhan) &&
        item.nhanVienGiaoHang.toLowerCase().includes(this.dataSearch.nhanVienGiaoHang) &&
        item.tenKhachHang.toLowerCase().includes(this.dataSearch.tenKhachHang) &&
        item.nhomKhachHang.toLowerCase().includes(this.dataSearch.nhomKhachHang) &&
        item.tinhThanh.toLowerCase().includes(this.dataSearch.tinhThanh) &&
        item.tenSanPham.toLowerCase().includes(this.dataSearch.tenSanPham) &&
        item.tenNganh.toLowerCase().includes(this.dataSearch.tenNganh) &&
        item.tenChungLoai.toLowerCase().includes(this.dataSearch.tenChungLoai) &&
        item.tenNhomSanPham.toLowerCase().includes(this.dataSearch.tenNhomSanPham)
    );
  }
  angularGridReady(angularGrid: any): void {
    this.angularGrid = angularGrid;

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }
}

export interface ITongHop {
  id: number;
  chiTietId: number;
  donBaoHanhId: number;
  maTiepNhan: string;
  namSanXuat: Date;
  ngayTiepNhan: Date;
  ngayPhanTich: Date;
  nhanVienGiaoHang: string;
  tenKhachHang: string;
  nhomKhachHang: string;
  tinhThanh: string;
  tenSanPham: string;
  tenNganh: string;
  tenChungLoai: string;
  tenNhomSanPham: string;
  soLuongKhachGiao: number;
  slTiepNhan: number;
  soLuongDoiMoi: number;
  loiKT: number;
  loiLinhDong: number;
  trangThai: string;
  lotNumber: string;
  serial: string;
  soLuongTheoTungLoi: number;
  tenLoi: string;
  tenNhomLoi: string;
  phanTichSanPhamId: number;
  tenTinhTrangPhanLoai: string;
}
