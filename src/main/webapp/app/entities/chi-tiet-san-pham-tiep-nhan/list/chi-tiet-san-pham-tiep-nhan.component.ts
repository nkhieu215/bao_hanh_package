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
  chiTietSanPhamTiepNhans?: IChiTietSanPhamTiepNhan[];
  popupViewCTL = false;
  isLoading = false;
  columnDefinitions: Column[] = [];
  conlumDefinitionCTL: Column[] = [];
  gridOptions: GridOption = {};
  chiTietSanPhamTiepNhan: ITongHop[] = [];
  chiTietSanPhamTiepNhanExport: IChiTietSanPhamTiepNhan[] = [];
  excelExportService: ExcelExportService;

  fileName = 'bao-cao-doi-tra';

  chiTietSanPhamTiepNhanVD: any[] = [
    {
      id: 1,
      maTiepNhan: 'DBH23032024',
      tenSanPham: 'Bóng LED Bulb TR70N1/12W E27 6500K (12-24VDC) SS',
      maNam: '2024',
      ngayTaoDon: '2023-12-14 14:27:55.000000',
      ngayTiepNhan: '2023-12-14 14:27:55.000000',
      ngayPhanTich: '2023-12-14 14:27:55.000000',
      tenNhanVien: 'Dung',
      tenKhachHang: 'Công ty Cổ phần Gia Lộc Phát',
      nhomKhachHang: 'Operations',
      tinhThanh: 'Hà Nội',
      nganh: 'LR LED',
      chungLoai: 'Wooden Borders',
      nhomSanPham: 'Corners Future',
      soLuongKhachGiao: 10,
      soLuongThucNhan: 10,
      soLuongDoiMoi: 5,
      loiKyThuat: 3,
      loiLinhDong: 5,
      trangThai: 'Đã phân tích',
      LOT: 15156469819,
      serial: 485434384,
      tenLoi: ['Cầu chì', 'Transistor', 'Lỗi nguồn', 'Nước vào', 'Điện áp cao', 'Cháy nổ nguồn', 'Om nhiệt'],
      soLuongLoi: 8,
    },
    {
      id: 2,
      maTiepNhan: 'DBH22032024',
      tenSanPham: 'Bóng LED Bulb trang trí A45W/1W (White)',
      maNam: '2024',
      ngayTaoDon: '2023-12-14 15:38:57.000000',
      ngayTiepNhan: '2023-12-14 14:27:55.000000',
      ngayPhanTich: '2023-12-14 14:27:55.000000',
      tenNhanVien: 'Dung',
      tenKhachHang: 'Công ty TNHH Bảo Giới',
      nhomKhachHang: 'Operations',
      tinhThanh: 'Hà Nội',
      nganh: 'LR LED',
      chungLoai: 'Wooden Borders',
      nhomSanPham: 'Corners Future',
      soLuongKhachGiao: 10,
      soLuongThucNhan: 10,
      soLuongDoiMoi: 5,
      loiKyThuat: 3,
      loiLinhDong: 5,
      trangThai: 'Đã phân tích',
      LOT: 15156469819,
      serial: 485434384,
      tenLoi: ['Cầu chì', 'Transistor', 'Lỗi nguồn', 'Nước vào', 'Điện áp cao', 'Cháy nổ nguồn', 'Om nhiệt'],
      soLuongLoi: 8,
    },
    {
      id: 3,
      maTiepNhan: 'DBH23032024',
      tenSanPham: 'Bóng LED Bulb trang trí A45B/1W (Blue)',
      maNam: '2024',
      ngayTaoDon: '2023-12-14 14:27:55.000000',
      ngayTiepNhan: '2023-12-14 14:27:55.000000',
      ngayPhanTich: '2023-12-14 14:27:55.000000',
      tenNhanVien: 'Dung',
      tenKhachHang: 'Trung tâm Điện máy Tuấn Thủy',
      nhomKhachHang: 'Operations',
      tinhThanh: 'Hà Nội',
      nganh: 'LR LED',
      chungLoai: 'Wooden Borders',
      nhomSanPham: 'Corners Future',
      soLuongKhachGiao: 10,
      soLuongThucNhan: 10,
      soLuongDoiMoi: 5,
      loiKyThuat: 3,
      loiLinhDong: 5,
      trangThai: 'Đã phân tích',
      LOT: 15156469819,
      serial: 485434384,
      tenLoi: ['Cầu chì', 'Transistor', 'Lỗi nguồn', 'Nước vào', 'Điện áp cao', 'Cháy nổ nguồn', 'Om nhiệt'],
      soLuongLoi: 8,
    },
    {
      id: 4,
      maTiepNhan: 'DBH23032024',
      tenSanPham: 'Bóng LED Bulb A55N4/3W E27 6500K',
      maNam: '2024',
      ngayTaoDon: '2023-12-14 15:38:57.000000',
      ngayTiepNhan: '2023-12-14 15:38:57.000000',
      ngayPhanTich: '2023-12-14 14:27:55.000000',
      tenNhanVien: 'Dung',
      tenKhachHang: 'Doanh nghiệp tư nhân Đức Thụy tỉnh Điện Biên',
      nhomKhachHang: 'Operations',
      tinhThanh: 'Hà Nội',
      nganh: 'LR LED',
      chungLoai: 'Wooden Borders',
      nhomSanPham: 'Corners Future',
      soLuongKhachGiao: 10,
      soLuongThucNhan: 10,
      soLuongDoiMoi: 5,
      loiKyThuat: 3,
      loiLinhDong: 5,
      trangThai: 'Đã phân tích',
      LOT: 15156469819,
      serial: 485434384,
      tenLoi: ['Cầu chì', 'Transistor', 'Lỗi nguồn', 'Nước vào', 'Điện áp cao', 'Cháy nổ nguồn', 'Om nhiệt'],
      soLuongLoi: 8,
    },
    {
      id: 5,
      maTiepNhan: 'DBH23032024',
      tenSanPham: 'Bóng LED Bulb A65N2/9W E27 6500K SS',
      maNam: '2024',
      ngayTaoDon: '2023-12-14 14:27:55.000000',
      ngayTiepNhan: '2023-12-14 14:27:55.000000',
      ngayPhanTich: '2023-12-14 14:27:55.000000',
      tenNhanVien: 'Dung',
      tenKhachHang: 'Công ty TNHH thương mại dịch vụ Lâm Hoa Điện Biên',
      nhomKhachHang: 'Operations',
      tinhThanh: 'Hà Nội',
      nganh: 'LR LED',
      chungLoai: 'Wooden Borders',
      nhomSanPham: 'Corners Future',
      soLuongKhachGiao: 10,
      soLuongThucNhan: 10,
      soLuongDoiMoi: 5,
      loiKyThuat: 3,
      loiLinhDong: 5,
      trangThai: 'Đã phân tích',
      LOT: 15156469819,
      serial: 485434384,
      tenLoi: ['Cầu chì', 'Transistor', 'Lỗi nguồn', 'Nước vào', 'Điện áp cao', 'Cháy nổ nguồn', 'Om nhiệt'],
      soLuongLoi: 8,
    },
    {
      id: 6,
      maTiepNhan: 'DBH23032024',
      tenSanPham: 'Bóng LED Bulb TR80N1/20W E27 6500K SS',
      maNam: '2024',
      ngayTaoDon: '2023-12-14 14:27:55.000000',
      ngayTiepNhan: '2023-12-14 14:27:55.000000',
      ngayPhanTich: '2023-12-14 14:27:55.000000',
      tenNhanVien: 'Dung',
      tenKhachHang: 'Trần Ánh Cương',
      nhomKhachHang: 'Operations',
      tinhThanh: 'Hà Nội',
      nganh: 'LR LED',
      chungLoai: 'Wooden Borders',
      nhomSanPham: 'Corners Future',
      soLuongKhachGiao: 10,
      soLuongThucNhan: 10,
      soLuongDoiMoi: 5,
      loiKyThuat: 3,
      loiLinhDong: 5,
      trangThai: 'Đã phân tích',
      LOT: 15156469819,
      serial: 485434384,
      tenLoi: ['Cầu chì', 'Transistor', 'Lỗi nguồn', 'Nước vào', 'Điện áp cao', 'Cháy nổ nguồn', 'Om nhiệt'],
      soLuongLoi: 8,
    },
    {
      id: 7,
      maTiepNhan: 'DBH23032024',
      tenSanPham: 'Bóng LED Bulb TR140N1/50W E27 6500K SS',
      maNam: '2024',
      ngayTaoDon: '2023-12-14 14:27:55.000000',
      ngayTiepNhan: '2023-12-14 14:27:55.000000',
      ngayPhanTich: '2023-12-14 14:27:55.000000',
      tenNhanVien: 'Dung',
      tenKhachHang: 'Công ty Cổ phần Gia Lộc Phát',
      nhomKhachHang: 'Operations',
      tinhThanh: 'Hà Nội',
      nganh: 'LR LED',
      chungLoai: 'Wooden Borders',
      nhomSanPham: 'Corners Future',
      soLuongKhachGiao: 10,
      soLuongThucNhan: 10,
      soLuongDoiMoi: 5,
      loiKyThuat: 3,
      loiLinhDong: 5,
      trangThai: 'Đã phân tích',
      LOT: 15156469819,
      serial: 485434384,
      tenLoi: ['Cầu chì', 'Transistor', 'Lỗi nguồn', 'Nước vào', 'Điện áp cao', 'Cháy nổ nguồn', 'Om nhiệt'],
      soLuongLoi: 8,
    },
  ];

  data: {
    donbaoHanhId?: number;
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
    soLuongDoiMoi?: number;
    loiKT?: number;
    loiLinhDong?: number;
    trangThai?: string;
  }[] = [];

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
    // this.columnDefinitions = [
    //   {
    //     id: 'id',
    //     field: 'id',
    //     name: 'STT',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'maTiepNhan',
    //     field: 'maTiepNhan',
    //     name: 'Mã tiếp nhận',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'maNam',
    //     field: 'maNam',
    //     name: 'Mã năm',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'ngayTaoDon',
    //     field: 'ngayTaoDon',
    //     name: 'Ngày tạo đơn',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'ngayTiepNhan',
    //     field: 'ngayTiepNhan',
    //     name: 'Ngày tiếp nhận',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'ngayPhanTich',
    //     field: 'ngayPhanTich',
    //     name: 'Ngày phân tích',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'tenNhanVien',
    //     field: 'tenNhanVien',
    //     name: 'Tên nhân viên',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'tenKhachHang',
    //     field: 'tenKhachHang',
    //     name: 'Tên Khách hàng',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'nhomKhachHang',
    //     field: 'nhomKhachHang',
    //     name: 'Nhóm khách hàng',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'tinhThanh',
    //     field: 'tinhThanh',
    //     name: 'Tỉnh thành',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'tenSanPham',
    //     field: 'tenSanPham',
    //     name: 'Tên sản phẩm',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'nganh',
    //     field: 'nganh',
    //     name: 'Ngành',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'chungLoai',
    //     field: 'chungLoai',
    //     name: 'Chủng loại',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'nhomSanPham',
    //     field: 'nhomSanPham',
    //     name: 'Nhóm sản phẩm',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'soLuongKhachGiao',
    //     field: 'soLuongKhachGiao',
    //     name: 'Số lượng khách giao',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'soLuongThucNhan',
    //     field: 'soLuongThucNhan',
    //     name: 'Số lượng thực nhận',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'soLuongDoiMoi',
    //     field: 'soLuongDoiMoi',
    //     name: 'Số lượng đổi mới',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'loiKT',
    //     field: 'loiKT',
    //     name: 'Lỗi kĩ thuật',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'loiLinhDong',
    //     field: 'loiLinhDong',
    //     name: 'Lỗi linh động',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'trangThai',
    //     field: 'trangThai',
    //     name: 'Trạng thái',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //   }
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Cầu diode Silijino',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Tụ hoá L.H',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Tụ hoá Aishi',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Tụ film cctc',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Tụ film Hulysol',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Transistor',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Điện trở',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Chặn (Biến áp)',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Cuộn lọc',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Hỏng IC vcc',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Hỏng IC fes',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Lỗi nguồn',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Chập mạch',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Bong mạch',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Công tắc',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Long keo',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Đômino, rắc cắm',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Dây nối LED',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Mất lò xo, tai cài',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Dây DC',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Dây AC',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Bong, nứt mối hàn',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Pin, tiếp xúc lò xo',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Tiếp xúc cọc tiếp điện, đầu đèn',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Hỏng LED',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Nứt vỡ nhựa, cover',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Móp, nứt vỡ đui',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Gãy cổ + cơ khớp, tai cài',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Nước vào',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Điện áp cao',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Cháy nổ nguồn',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Cũ, ẩm mốc, ố rỉ',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Om nhiệt',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Vỡ ống, kính',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Lỗi khác',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    //   // {
    //   //   id: 'lois',
    //   //   field: 'lois',
    //   //   name: 'Sáng bình thường',
    //   //   excludeFromColumnPicker: true,
    //   //   excludeFromGridMenu: true,
    //   //   excludeFromHeaderMenu: true,
    //   //   maxWidth: 60,
    //   //   minWidth: 60,
    //   // },
    // ];

    // this.conlumDefinitionCTL = [
    //   {
    //     id: 'maTiepNhan',
    //     field: 'maTiepNhan',
    //     name: 'Mã tiếp nhận',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'maNam',
    //     field: 'maNam',
    //     name: 'Mã năm',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'ngayTaoDon',
    //     field: 'ngayTaoDon',
    //     name: 'Ngày tạo đơn',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'ngayTiepNhan',
    //     field: 'ngayTiepNhan',
    //     name: 'Ngày tiếp nhận',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'tenNhanVien',
    //     field: 'tenNhanVien',
    //     name: 'Tên nhân viên',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'tenKhachHang',
    //     field: 'tenKhachHang',
    //     name: 'Tên Khách hàng',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'nhomKhachHang',
    //     field: 'nhomKhachHang',
    //     name: 'Nhóm khách hàng',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'tinhThanh',
    //     field: 'tinhThanh',
    //     name: 'Tỉnh thành',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'tenSanPham',
    //     field: 'tenSanPham',
    //     name: 'Tên sản phẩm',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'soLuongThucNhan',
    //     field: 'soLuongThucNhan',
    //     name: 'Số lượng thực nhận',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'nganh',
    //     field: 'nganh',
    //     name: 'Ngành',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'chungLoai',
    //     field: 'chungLoai',
    //     name: 'Chủng loại',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'nhomSanPham',
    //     field: 'nhomSanPham',
    //     name: 'Nhóm sản phẩm',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'LOT',
    //     field: 'LOT',
    //     name: 'LOT',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'serial',
    //     field: 'serial',
    //     name: 'Serial',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    //   {
    //     id: 'tenLoi',
    //     field: 'tenLoi',
    //     name: 'Tên lỗi',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 200,
    //   },
    //   {
    //     id: 'soLuongLoi',
    //     field: 'soLuongLoi',
    //     name: 'Số lượng lỗi',
    //     excludeFromColumnPicker: true,
    //     excludeFromGridMenu: true,
    //     excludeFromHeaderMenu: true,
    //     // maxWidth: 60,
    //     minWidth: 60,
    //   },
    // ]
    // this.gridOptions = {
    //   enableAutoResize: true,
    //   enableSorting: true,
    //   enableFiltering: true,
    //   enablePagination: true,
    //   pagination: {
    //     pageSizes: [30, 50, 100],
    //     pageSize: this.chiTietSanPhamTiepNhan.length,
    //   },
    //   editable: true,
    //   enableCellNavigation: true,
    //   gridHeight: 620,
    //   gridWidth: '100%',
    //   enableExcelExport: true,
    //   // enableExcelCopyBuffer: true,
    //   excelExportOptions: {
    //     sanitizeDataExport: true
    //   },
    //   // registerExternalResources: [this.excelExportService()],
    // };
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
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'maTiepNhan',
        field: 'maTiepNhan',
        name: 'Mã tiếp nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
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
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
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
        minWidth: 60,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      // {
      //   id: 'ngayPhanTich',
      //   field: 'ngayPhanTich',
      //   name: 'Ngày phân tích',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   // maxWidth: 60,
      //   minWidth: 60,

      // },
      {
        id: 'nhanVienGiaoHang',
        field: 'nhanVienGiaoHang',
        name: 'Tên nhân viên',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
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
        minWidth: 60,
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
        minWidth: 60,
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
        minWidth: 60,
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
        minWidth: 60,
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
        minWidth: 60,
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
        minWidth: 60,
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
        minWidth: 60,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      // {
      //   id: 'soLuongKhachGiao',
      //   field: 'soLuongKhachGiao',
      //   name: 'Số lượng khách giao',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   // maxWidth: 60,
      //   minWidth: 60,

      // },
      {
        id: 'slTiepNhan',
        field: 'slTiepNhan',
        name: 'Số lượng thực nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
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
        id: 'soLuongTheoTungLoi',
        field: 'soLuongTheoTungLoi',
        name: 'Số lượng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        //maxWidth: 60,
        minWidth: 60,
      },
      // {
      //   id: 'loiLinhDong',
      //   field: 'loiLinhDong',
      //   name: 'Lỗi linh động',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   // maxWidth: 60,
      //   minWidth: 60,

      // },
      {
        id: 'trangThai',
        field: 'trangThai',
        name: 'Trạng thái',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
      },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Cầu diode Silijino',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Tụ hoá L.H',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Tụ hoá Aishi',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Tụ film cctc',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Tụ film Hulysol',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Transistor',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Điện trở',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Chặn (Biến áp)',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Cuộn lọc',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Hỏng IC vcc',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Hỏng IC fes',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Lỗi nguồn',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Chập mạch',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Bong mạch',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Công tắc',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Long keo',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Đômino, rắc cắm',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Dây nối LED',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Mất lò xo, tai cài',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Dây DC',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Dây AC',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Bong, nứt mối hàn',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Pin, tiếp xúc lò xo',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Tiếp xúc cọc tiếp điện, đầu đèn',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Hỏng LED',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Nứt vỡ nhựa, cover',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Móp, nứt vỡ đui',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Gãy cổ + cơ khớp, tai cài',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Nước vào',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Điện áp cao',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Cháy nổ nguồn',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Cũ, ẩm mốc, ố rỉ',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Om nhiệt',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Vỡ ống, kính',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Lỗi khác',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
      // {
      //   id: 'lois',
      //   field: 'lois',
      //   name: 'Sáng bình thường',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   maxWidth: 60,
      //   minWidth: 60,

      // },
    ];

    this.conlumDefinitionCTL = [
      {
        id: 'maTiepNhan',
        field: 'maTiepNhan',
        name: 'Mã tiếp nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        minWidth: 60,
      },
      {
        id: 'maNam',
        field: 'maNam',
        name: 'Mã năm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'ngayTaoDon',
        field: 'ngayTaoDon',
        name: 'Ngày tạo đơn',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'ngayTiepNhan',
        field: 'ngayTiepNhan',
        name: 'Ngày tiếp nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'tenNhanVien',
        field: 'tenNhanVien',
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
        minWidth: 60,
      },
      {
        id: 'nhomKhachHang',
        field: 'nhomKhachHang',
        name: 'Nhóm khách hàng',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'tinhThanh',
        field: 'tinhThanh',
        name: 'Tỉnh thành',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'tenSanPham',
        field: 'tenSanPham',
        name: 'Tên sản phẩm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'soLuongThucNhan',
        field: 'soLuongThucNhan',
        name: 'Số lượng thực nhận',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'nganh',
        field: 'nganh',
        name: 'Ngành',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'chungLoai',
        field: 'chungLoai',
        name: 'Chủng loại',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'nhomSanPham',
        field: 'nhomSanPham',
        name: 'Nhóm sản phẩm',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'LOT',
        field: 'LOT',
        name: 'LOT',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
      },
      {
        id: 'serial',
        field: 'serial',
        name: 'Serial',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
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
        id: 'soLuongLoi',
        field: 'soLuongLoi',
        name: 'Số lượng lỗi',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        // maxWidth: 60,
        minWidth: 60,
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
        pageSizes: [5, 10, this.chiTietSanPhamTiepNhan.length],
        pageSize: 10,
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
  }

  getTongHopUrl(): void {
    this.http.get<any>(this.tongHopUrl).subscribe((res: ITongHop[]) => {
      console.log('res', res);
      const calculated = res.reduce((acc: ITongHop[], item: ITongHop) => {
        const accItem = acc.find(
          (ai: ITongHop) =>
            ai.donbaoHanhId === item.donbaoHanhId &&
            ai.chiTietId === item.chiTietId &&
            ai.phanTichSanPhamId === item.phanTichSanPhamId &&
            ai.tenNhomLoi === item.tenNhomLoi
        );
        if (accItem) {
          accItem.soLuongTheoTungLoi += item.soLuongTheoTungLoi;
        } else {
          acc.push(item);
        }

        return acc;
      }, []);
      this.data = res.sort((a: any, b: any) => b.donBaoHanhId - a.donBaoHanhId);
    });
  }

  changeDate(): void {
    document.getElementById('dateForm')?.addEventListener('submit', function (event) {
      event.preventDefault();

      const date1Inp = document.getElementById('date1') as HTMLInputElement;
      const date2Inp = document.getElementById('date2') as HTMLInputElement;

      const date1Value = date1Inp.value;
      const date2Value = date2Inp.value;

      console.log('Date 1:', date1Value);
      console.log('Date 2:', date2Value);
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

  exportToExcel(): void {
    // const data = document.getElementById("table-data");
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    // create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'bao-cao-tong-hop');
    XLSX.utils.book_append_sheet(wb, ws, 'bao-cao-chi-tiet');
    XLSX.writeFile(wb, `${this.fileName}.xlsx`);
  }

  openPopupViewCTL(): void {
    this.popupViewCTL = true;
  }

  closePopupViewCTL(): void {
    this.popupViewCTL = false;
  }
}
export interface ITongHop {
  index: number;
  chiTietId: number;
  donbaoHanhId: number;
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
  loiNumBer: string;
  serial: string;
  soLuongTheoTungLoi: number;
  tenLoi: string;
  tenNhomLoi: string;
  phanTichSanPhamId: number;
}
