import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Column, GridOption } from 'angular-slickgrid';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  template: `<angular-slickgrid gridId="chiTietLoi" [columnDefinitions]="conlumDefinitionCTL" [gridOptions]="gridOptionCTL"
          [dataset]="chiTietSanPhamTiepNhanCTL"></angular-slickgrid>`
})
export class ChiTietBaoCaoTongHopComponent {
  tongHopUrl = this.applicationConfigService.getEndpointFor('api/tong-hop');

  isLoading = false;
  conlumDefinitionCTL: Column[] = [];
  gridOptionCTL: GridOption = {};
  chiTietSanPhamTiepNhanCTL: ITongHop[] = [];

  constructor(
    protected modalService: NgbModal,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) { }

  loadAll(): void {
    this.isLoading = true;
    this.http.get<any>(this.tongHopUrl).subscribe(res => {
      this.chiTietSanPhamTiepNhanCTL = res;
      for (let i = 0; i < this.chiTietSanPhamTiepNhanCTL.length; ++i) {
        this.chiTietSanPhamTiepNhanCTL[i].index = i;
      }
      // this.getTongHopUrl()
    })
  }

  ngOnInit(): void{
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
        minWidth: 100,
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
        id: 'soLuongTheoTungLoi',
        field: 'soLuongTheoTungLoi',
        name: 'Số lượng lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 100,
        // formatter: (row, cell, value, columnDef, dataContext) => {
        //   dataContext.sumByDonBaoHanhId;
        // }
      },

    ];
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
