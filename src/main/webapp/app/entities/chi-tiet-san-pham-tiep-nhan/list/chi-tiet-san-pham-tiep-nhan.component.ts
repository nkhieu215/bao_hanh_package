import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChiTietSanPhamTiepNhan } from '../chi-tiet-san-pham-tiep-nhan.model';
import { ChiTietSanPhamTiepNhanService } from '../service/chi-tiet-san-pham-tiep-nhan.service';
import { ChiTietSanPhamTiepNhanDeleteDialogComponent } from '../delete/chi-tiet-san-pham-tiep-nhan-delete-dialog.component';
import { Column, ExternalResource, FieldType, Filters, GridOption } from 'angular-slickgrid';
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
  tongHopCaculateUrl = this.applicationConfigService.getEndpointFor('api/tong-hop-caculate')
  chiTietSanPhamTiepNhans?: IChiTietSanPhamTiepNhan[];
  popupViewCTL = false;
  isLoading = false;
  columnDefinitions: Column[] = [];
  conlumDefinitionCTL: Column[] = [];
  gridOptions: GridOption = {};
  gridOptionCTL: GridOption = {};

  chiTietSanPhamTiepNhan: any[] = [];
  chiTietSanPhamTiepNhanCTL: ITongHop[] = [];

  chiTietSanPhamTiepNhanExport: IChiTietSanPhamTiepNhan[] = [];
  excelExportService: ExcelExportService;

  fileName = 'bao-cao-doi-tra';

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
  // dataExport(list: IChiTietSanPhamTiepNhan[]):void {

  //     const data1: {
  //       donbaoHanhId?: number,
  //   maTiepNhan?: string,
  //   namSanXuat?: Date,
  //   ngayTiepNhan?: Date,
  //   ngayPhanTich?: Date,
  //   nhanVienGiaoHang?: string,
  //   tenKhachHang?: string,
  //   nhomKhachHang?: string,
  //   tinhThanh?: string,
  //   tenSanPham?: string,
  //   tenNganh?: string,
  //   tenChungLoai?: string,
  //   tenNhomSanPham?: string,
  //   soLuongKhachGiao?:number,
  //   slTiepNhan?:number,
  //   soLuongDoiMoi?: number,
  //   loiKT?: number,
  //   loiLinhDong?: number,
  //   trangThai?: string
  //     }=this.data ;

  // }

  dataShow(): void {
    this.columnDefinitions = [
      {
        id: 'donBaoHanhId',
        field: 'index',
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
        // maxWidth: 60,
        minWidth: 140,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'namSanXuat',
        field: 'namSanXuat',
        name: 'Mã năm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
        sortable: true,
        // filterable: true,
        type: FieldType.string,
        // filter: {
        //   placeholder: 'search',
        //   model: Filters.compoundInputText,
        // },
      },
      // {
      //   id: 'ngayTiepNhan',
      //   field: 'ngayTiepNhan',
      //   name: 'Ngày tạo đơn',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   // maxWidth: 60,
      //   minWidth: 60,
      // },
      {
        id: 'ngayTiepNhan',
        field: 'ngayTiepNhan',
        name: 'Ngày tiếp nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 100,
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
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 100,

      },
      {
        id: 'nhanVienGiaoHang',
        field: 'nhanVienGiaoHang',
        name: 'Tên nhân viên',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 90,
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
        // maxWidth: 60,
        minWidth: 300,
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
        // maxWidth: 60,
        minWidth: 140,
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
        // maxWidth: 60,
        minWidth: 100,
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
        // maxWidth: 60,
        minWidth: 300,
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
        // maxWidth: 60,
        minWidth: 120,
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
        // maxWidth: 60,
        minWidth: 100,
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
        // maxWidth: 60,
        minWidth: 100,
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
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 100,

      },
      {
        id: 'slTiepNhan',
        field: 'slTiepNhan',
        name: 'Số lượng thực nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        maxWidth: 100,
        minWidth: 100,
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
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'tongSoLuong',
        field: 'tongSoLuong',
        name: 'Tổng lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,

      },
      {
        id: 'trangThai',
        field: 'trangThai',
        name: 'Trạng thái',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        minWidth: 180
      },
    ];

    this.conlumDefinitionCTL = [
      {
        id: 'donBaoHanhId',
        field: 'index',
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
        minWidth: 130,
      },
      {
        id: 'namSanXuat',
        field: 'namSanXuat',
        name: 'Mã năm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        minWidth: 30,
        maxWidth: 60,
      },
      {
        id: 'ngayTiepNhan',
        field: 'ngayTiepNhan',
        name: 'Ngày tiếp nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 90,

      },
      {
        id: 'nhanVienGiaoHang',
        field: 'nhanVienGiaoHang',
        name: 'Tên nhân viên',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'tenKhachHang',
        field: 'tenKhachHang',
        name: 'Tên Khách hàng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 300,
      },
      {
        id: 'nhomKhachHang',
        field: 'nhomKhachHang',
        name: 'Nhóm khách hàng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 100,
      },
      {
        id: 'tinhThanh',
        field: 'tinhThanh',
        name: 'Tỉnh thành',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 100,
      },
      {
        id: 'tenSanPham',
        field: 'tenSanPham',
        name: 'Tên sản phẩm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 300,
      },
      {
        id: 'slTiepNhan',
        field: 'slTiepNhan',
        name: 'Số lượng thực nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'tenNganh',
        field: 'tenNganh',
        name: 'Ngành',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 120,
      },
      {
        id: 'tenChungLoai',
        field: 'tenChungLoai',
        name: 'Chủng loại',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 100,
      },
      {
        id: 'tenNhomSanPham',
        field: 'tenNhomSanPham',
        name: 'Nhóm sản phẩm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 100,
      },
      {
        id: 'lotNumber',
        field: 'lotNumber',
        name: 'LOT',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 160,
      },
      {
        id: 'serial',
        field: 'serial',
        name: 'Serial',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 160,
      },
      {
        id: 'tenNhomLoi',
        field: 'tenNhomLoi',
        name: 'Tên nhóm lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 200,
      },
      {
        id: 'tenLoi',
        field: 'tenLoi',
        name: 'Tên lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 200,
      },
      {
        d: 'soLuongTheoTungLoi',
        field: 'soLuongTheoTungLoi',
        name: 'Số lượng lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 100,
      },
    ];
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

      editable: true,
      enableCellNavigation: true,
      gridHeight: 610,
      gridWidth: '100%',
      // autoHeight: true,
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
      // enableExcelExport: true,
      // // enableExcelCopyBuffer: true,
      // excelExportOptions: {
      //   sanitizeDataExport: true,
      //   filename: 'bao-cao-doi-tra',
      //   sheetName: 'bao-cao-tong-hop',
      // },
      // registerExternalResources: [new ExcelExportService() as any],
      // registerExternalResources: [this.excelExportService],
    }
  }

  getTongHopUrl(): void {
    this.http.get<any>(this.tongHopUrl).subscribe((res: ITongHop[]) => {
      console.log('res', res);
      for (let i = 0; i < this.chiTietSanPhamTiepNhan.length; ++i) {
        this.chiTietSanPhamTiepNhan[i].index = i;
      }
      this.chiTietSanPhamTiepNhan = res.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);
      this.dataCTL = res
      this.data = this.chiTietSanPhamTiepNhan.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);
    })

    this.http.get<any>(this.tongHopCaculateUrl).subscribe(resTongHop => {
      this.chiTietSanPhamTiepNhan = resTongHop;
      for (let i = 0; i < this.chiTietSanPhamTiepNhan.length; ++i) {
        this.chiTietSanPhamTiepNhan[i].index = i;
      }
      this.chiTietSanPhamTiepNhan = resTongHop.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);

      console.log('caculate', resTongHop)
    })
  }

  changeDate(): void {
    let dateTimeSearchKey: { startDate: string, endDate: string } = { startDate: '', endDate: '' }
    document.getElementById("dateForm")?.addEventListener('submit', function (event) {
      event.preventDefault();

      const startDateInp = document.getElementById("startDate") as HTMLInputElement;
      const endDateInp = document.getElementById("endDate") as HTMLInputElement;

      const startDate = startDateInp.value;
      const endDate = endDateInp.value;
      dateTimeSearchKey = { startDate: startDateInp.value, endDate: endDateInp.value }
    })

    setTimeout(() => {
      console.log("startDate:", dateTimeSearchKey)
      this.http.post<any>(this.tongHopUrl, dateTimeSearchKey).subscribe(res => {
        console.log("check ressult search:", res);

        this.chiTietSanPhamTiepNhanCTL = res;
      })
      const keySession = `ThongTinChung ${dateTimeSearchKey.toString()}`

      this.http.post<any>(this.tongHopCaculateUrl, dateTimeSearchKey).subscribe(resCaculate => {
        console.log("check ressult search 2:", resCaculate);

        console.log('ket qua tim kiem 2', resCaculate)
        sessionStorage.setItem(`ThongTinChung ${dateTimeSearchKey.toString()}`, JSON.stringify(resCaculate))
        this.chiTietSanPhamTiepNhan = resCaculate
      })
    }, 100)

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

  exportToExcel(): void {
    const sortedData = this.data.map((item) => ({
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
    }))

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
    }))
    console.log('dataCTL', this.dataCTL)
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
    this.popupViewCTL = true;
    this.http.get<any>(this.tongHopUrl).subscribe(res => {
      this.chiTietSanPhamTiepNhanCTL = res;
      for (let i = 0; i < this.chiTietSanPhamTiepNhanCTL.length; ++i) {
        this.chiTietSanPhamTiepNhanCTL[i].index = i;
      }
      this.getTongHopUrl()
      //  if()
    })
  }

  closePopupViewCTL(): void {
    this.popupViewCTL = false;
  }
}
export interface ITongHop {
  index: number;
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
