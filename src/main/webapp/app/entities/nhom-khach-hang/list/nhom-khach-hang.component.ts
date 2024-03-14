import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IDonBaoHanh } from 'app/entities/don-bao-hanh/don-bao-hanh.model';
import { Subscription } from 'rxjs';
import { AngularGridInstance, Column, GridOption, ContainerService } from 'angular-slickgrid';
import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INhomKhachHang } from '../nhom-khach-hang.model';
import { NhomKhachHangService } from '../service/nhom-khach-hang.service';
import { NhomKhachHangDeleteDialogComponent } from '../delete/nhom-khach-hang-delete-dialog.component';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@Component({
  selector: 'jhi-nhom-khach-hang',
  templateUrl: './nhom-khach-hang.component.html',
})
export class NhomKhachHangComponent implements OnInit {
  nhomKhachHangs: any[] = [];
  angularGrid?: AngularGridInstance;
  exportBeforeSub?: Subscription;
  exportAfterSub?: Subscription;
  dataviewObj: any;
  gridObj: any;
  dataset: any[] = [];
  columnDefinitions?: IDonBaoHanh[];

  isLoading = false;

  // title = 'Báo cáo tổng hợp';

  columndefinitions1: Column[] = [];
  gridOptions1!: GridOption;

  constructor(
    protected nhomKhachHangService: NhomKhachHangService,
    protected modalService: NgbModal,
    protected containerService: ContainerService,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected navBarComponent: NavbarComponent
  ) {}

  loadAll(): void {
    this.navBarComponent.toggleSidebar2();
    this.isLoading = true;

    this.nhomKhachHangService.query().subscribe({
      next: (res: HttpResponse<INhomKhachHang[]>) => {
        this.isLoading = false;
        this.nhomKhachHangs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.columnDefinitions = [];
    this.columndefinitions1 = [
      {
        id: 'stt',
        name: 'STT',
        field: 'id',
      },
      {
        id: 'maTiepNhan',
        name: 'Mã tiếp nhận',
        field: 'maTiepNhan',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'maNam',
        name: 'Mã năm',
        field: 'maNam',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'ngayTaoDon',
        name: 'Ngày tạo đơn',
        field: 'ngayTaoDon',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'ngayTiepNhan',
        name: 'Ngày tiếp nhận',
        field: 'ngayTiepNhan',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'ngayPhanTich',
        name: 'Ngày phân tích',
        field: 'ngayPhanTich',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenNhanVien',
        name: 'Tên nhân viên',
        field: 'tenNhanVien',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenKhachHang',
        name: 'Tên khách hàng',
        field: 'tenKhachHang',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'nhomKhachHang',
        name: 'Nhóm khách hàng',
        field: 'nhomKhachHang',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tinhThanh',
        name: 'Tỉnh thành',
        field: 'tinhThanh',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenSanPham',
        name: 'Tên sản phẩm',
        field: 'tenSanPham',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'nganh',
        name: 'Ngành',
        field: 'nganh',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'chungLoai',
        name: 'Chủng loại',
        field: 'chungLoai',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'nhomSanPham',
        name: 'Nhóm sản phẩm',
        field: 'nhomSanPham',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'slKhachGiao',
        name: 'Số lượng khách giao',
        field: 'slKhachGiao',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'slThucNhan',
        name: 'Số lượng thực nhận',
        field: 'slThucNhan',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'slDoimoi',
        name: 'Số lượng đổi mới',
        field: 'slDoimoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'loiKT',
        name: 'Lỗi kỹ thuật',
        field: 'loiKT',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Cầu diode Silijino',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Tụ hoá L.H',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Tụ hoá Aishi',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Tụ film Hulysol',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Transistor',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Điện trở',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Chặn (Biến áp)',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Cuộn lọc',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Hỏng IC VCC',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Hỏng IC fes',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Lỗi nguồn',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Chập mạch',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Bong mạch',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Công tắc',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Long keo',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Đôminô, rắc cắm',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Dây nối LED',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Mất lò xo, tay cài',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Dây DC',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Dây AC',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Bong, nứt mối hàn',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Pin, tiếp xúc lò xo',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Tiếp xúc cọc tiếp điện, đầu đèn',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Hỏng LED',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Lỗi LĐ',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Nứt vỡ nhựa, cover',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Móp, nứt vỡ đui',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Gãy cổ + cơ khớp, tai cài',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Nước vào',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Điện áp cao',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Cháy nổ nguồn',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Cũ, ẩm mốc, ố rỉ',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Om nhiệt',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Vỡ ống, kính',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Lỗi khác',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        id: 'tenLoi',
        name: 'Sáng BT',
        field: 'tenLoi',
        minWidth: 150,
        maxWidth: 150,
      },
    ];
    this.gridOptions1 = {
      enableAutoResize: true,
      enableSorting: true,
      enableFiltering: true,
      enablePagination: true,
      enableColumnPicker: true,
      pagination: {
        pageSizes: [5, 10, 20],
        pageSize: 10,
      },
      columnPicker: {
        hideForceFitButton: true,
        hideSyncResizeButton: true,
      },
      editable: true,
      enableCellNavigation: true,
      gridHeight: 500,
      gridWidth: 1800,
    };
    this.loadAll();
  }

  mockData(count: number): any {
    const mockDataset = [];
    for (let i = 1; i < count; i++) {
      mockDataset[i] = {
        id: i,
      };
    }
  }

  trackId(_index: number, item: INhomKhachHang): number {
    return item.id!;
  }

  delete(nhomKhachHang: INhomKhachHang): void {
    const modalRef = this.modalService.open(NhomKhachHangDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.nhomKhachHang = nhomKhachHang;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
