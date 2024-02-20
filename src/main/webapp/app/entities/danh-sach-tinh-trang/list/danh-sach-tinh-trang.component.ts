import { DonBaoHanhService } from './../../don-bao-hanh/service/don-bao-hanh.service';
import { Column, GridOption, AngularGridInstance, ContainerService, Formatters, FieldType, Filters, Editors } from 'angular-slickgrid';
import { IDonBaoHanh } from './../../don-bao-hanh/don-bao-hanh.model';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDanhSachTinhTrang } from '../danh-sach-tinh-trang.model';
import { DanhSachTinhTrangService } from '../service/danh-sach-tinh-trang.service';
import { DanhSachTinhTrangDeleteDialogComponent } from '../delete/danh-sach-tinh-trang-delete-dialog.component';
const NB_ITEMS = 995;
@Component({
  selector: 'jhi-danh-sach-tinh-trang',
  templateUrl: './danh-sach-tinh-trang.component.html',
})
export class DanhSachTinhTrangComponent implements OnInit {
  donBaoHanhs: any[] = [];
  sanPhams: any[] = [];
  danhSachTinhTrangs?: IDanhSachTinhTrang[];
  isLoading = false;

  columnDefinitions?: IDonBaoHanh[];
  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions1: GridOption = {};
  gridOptions2: GridOption = {};
  angularGrid?: AngularGridInstance;

  title = 'Phân tích mã tiếp nhận';
  title2 = 'Phân tích sản phẩm';

  constructor(
    protected danhSachTinhTrangService: DanhSachTinhTrangService,
    protected donBaoHanhService: DonBaoHanhService,
    protected modalService: NgbModal,
    protected containerService: ContainerService
  ) {}

  loadAll(): void {
    this.isLoading = true;
    this.donBaoHanhService.query().subscribe({
      next: (res: HttpResponse<IDonBaoHanh[]>) => {
        this.isLoading = false;
        this.danhSachTinhTrangs = res.body ?? [];
        console.log('a', this.donBaoHanhs);
        this.donBaoHanhs = this.mockData(NB_ITEMS);
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
        id: 'id',
        name: 'Mã tiếp nhận',
        field: 'id',
      },
      {
        id: 'khacHang',
        name: 'Khách hàng',
        field: 'tenKhachHang',
      },
      {
        id: 'ngaykhkb',
        name: 'Ngày tiếp nhận',
        field: 'ngaykhkb',
      },
    ];

    this.gridOptions1 = {
      gridHeight: 100,
    };

    this.columnDefinitions2 = [
      {
        id: 'stt',
        name: 'STT',
        field: 'id',
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: 'tenSanPham',
        name: 'Tên sản phẩm',
        field: 'name',
      },
      {
        id: 'tinhTrangBaoHanh',
        name: 'Tình trạng bảo hành',
        field: 'tinhTrangBaoHanh',
      },
      {
        id: 'slTiepNhan',
        name: 'Số lượng đã nhận',
        field: 'chiTietSanPham.slTiepNhan',
      },
      {
        id: 'slTon',
        name: 'Số lượng tồn',
        field: 'chiTietSanPhamTiepNhan.slTon',
      },
      {
        id: 'checked',
        name: 'Checked',
        field: 'checked',
        type: FieldType.boolean,
        filter: {
          model: Filters.singleSelect,
          collection: [
            { value: '', label: '' },
            { value: true, label: 'True' },
            { value: false, label: 'False' },
          ],
        },
        formatter: Formatters.checkmark,
        editor: {
          model: Editors.checkbox,
        },
      },
      {
        id: 'edit',
        field: 'id',
        name: 'Options',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        params: { iconCssClass: 'fa fa-pencil pointer' },
        minWidth: 60,
        maxWidth: 60,
        // onCellClick: (e: Event, args: OnEventArgs) => {
        //   console.log(args);
        //   // this.alertWarning = `Editing: ${args.dataContext.title}`
        //   this.angularGrid?.gridService.highlightRow(args.row, 1500);
        //   this.angularGrid?.gridService.setSelectedRow(args.row);
        // },
      },
    ];
    this.gridOptions2 = {
      enableAutoResize: false,
      enableSorting: true,
      enableFiltering: true,
      enablePagination: true,
      pagination: {
        pageSizes: [5, 10, 15],
        pageSize: 10,
      },
    };
    this.loadAll();
  }
  mockData(count: number): any {
    const mockDataset = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor(Math.random() * 29);
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        tenKhachHang: 'Task ' + i.toString(),
        name: Math.round(Math.random() * 100),
        tinhTrangBaoHanh: randomPercent,
        ngaykhkb: new Date(randomYear, randomMonth + 1, randomDay),
        slTiepNhan: Math.round(Math.random() * 100),
        slDaPhanTich: Math.round(Math.random() * 100),
      };
    }
    return mockDataset;
  }
}
