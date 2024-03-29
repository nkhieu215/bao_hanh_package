import { IDanhSachTinhTrang } from 'app/entities/danh-sach-tinh-trang/danh-sach-tinh-trang.model';
import { IChiTietSanPhamTiepNhan } from 'app/entities/chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.model';
import { ChiTietSanPhamTiepNhan } from './../../chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.model';
import { IPhanLoaiChiTietTiepNhan } from './../../phan-loai-chi-tiet-tiep-nhan/phan-loai-chi-tiet-tiep-nhan.model';
import { ApplicationConfigService } from './../../../core/config/application-config.service';
import { ISanPham } from './../../san-pham/san-pham.model';
import { FormBuilder } from '@angular/forms';
import { ButtonPrintComponent } from './button-print.component';
import { RowDetailPreloadComponent } from './rowdetail-preload.component';
import { IKhachHang } from './../../khach-hang/khach-hang.model';
import { KhachHangService } from './../../khach-hang/service/khach-hang.service';
import {
  Column,
  GridOption,
  ContainerService,
  Formatters,
  OnEventArgs,
  AngularGridInstance,
  FieldType,
  Filters,
  Editors,
  LongTextEditorOption,
  AngularUtilService,
  SlickCompositeEditor,
  Formatter,
  SlickEventData,
} from './../../../../../../../node_modules/angular-slickgrid';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDonBaoHanh } from '../don-bao-hanh.model';
import { DonBaoHanhService } from '../service/don-bao-hanh.service';
import { RowDetailViewComponent } from './rowdetail-view.component';
import * as XLSX from 'xlsx';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { count } from 'console';
import { DanhSachTinhTrangService } from 'app/entities/danh-sach-tinh-trang/service/danh-sach-tinh-trang.service';
import { SanPhamService } from 'app/entities/san-pham/service/san-pham.service';
import { stringify } from 'querystring';
import dayjs from 'dayjs/esm';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';
@Component({
  selector: 'jhi-don-bao-hanh',
  templateUrl: './don-bao-hanh.component.html',
  // styleUrls: ['../../../slickgrid-theme-booststrap.css'],
})
export class DonBaoHanhComponent implements OnInit {
  phanLoaiChiTietTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/phan-loai-chi-tiet-tiep-nhans');
  chiTietSanPhamTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/chi-tiet-don-bao-hanhs');
  danhSachTinhTrangUrl = this.applicationConfigService.getEndpointFor('api/danh-sach-tinh-trangs');
  updateDonBaoHanhUrl = this.applicationConfigService.getEndpointFor('api/update-don-bao-hanh');
  postDonBaoHanhUrl = this.applicationConfigService.getEndpointFor('api/don-bao-hanh/them-moi');
  postChiTietDonBaoHanhUrl = this.applicationConfigService.getEndpointFor('api/don-bao-hanh/them-moi-chi-tiet');
  postPhanLoaiChiTietTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/don-bao-hanh/them-moi-phan-loai');
  putPhanLoaiChiTietTiepNhanUrl = this.applicationConfigService.getEndpointFor(
    'api/don-bao-hanh/phan-loai/update-phan-loai-chi-tiet-tiep-nhan'
  );
  putChiTietSanPhamTiepNhanUrl = this.applicationConfigService.getEndpointFor(
    'api/don-bao-hanh/phan-loai/update-chi-tiet-san-pham-tiep-nhan'
  );
  hoanThanhPhanLoaiUrl = this.applicationConfigService.getEndpointFor('api/don-bao-hanh/hoan-thanh-phan-loai');
  postMaBienBanUrl = this.applicationConfigService.getEndpointFor('api/ma-bien-ban/post');
  getMaxIdChiTietSanPhamTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/chi-tiet-san-pham-tiep-nhan-max-id');
  deleteDetailDonBaoHanhUrl = this.applicationConfigService.getEndpointFor('api/phan-loai/delete');
  // biến lưu danh sách dữ liệu
  donBaoHanhs: any[] = [];
  khachHangs?: IKhachHang[];
  isLoading = false;
  danhSachTinhTrangs: IDanhSachTinhTrang[] = [];
  danhSachSanPham: ISanPham[] = [];
  danhSachGocPopupPhanLoai: any[] = [];
  danhSachBienBan: any[] = [];
  phanLoaiChiTietTiepNhans: IPhanLoaiChiTietTiepNhan[] = [];
  // biến lưu key session
  keySession = '';
  // biến lưu thông tin thêm mới
  themMoiDonBaoHanh: any;
  donBaoHanh: any;
  chiTietDonBaoHanh: IChiTietSanPhamTiepNhan[] = [];
  themMoiPhanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan[] = [];
  themMoiBienBan: any;
  idAddRow = 0;
  //thông tin phân loại
  listOfDetailPl: any[] = [];
  //------------------------------------------------
  columnDefinitions?: IDonBaoHanh[];
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  angularGrid?: AngularGridInstance;
  gridObj: any;
  dataViewObj: any;
  detailViewRowCount = 9;
  compositeEditorInstance!: SlickCompositeEditor;
  chiTietSanPhamTiepNhans: IChiTietSanPhamTiepNhan[] = [];
  resultChiTietSanPhamTiepNhans: any[] = [];
  title = 'Quản lý mã tiếp nhận';

  predicate!: string;
  ascending!: boolean;
  // biến lưu thông tin từng đơn bảo hành
  thongTinDonBaoHanh: any;
  // biến đóng mở popup
  popupChinhSuaThongTin = false;
  popupPhanLoai = false;
  popupThemMoi = false;
  popupSelectButton = false;
  popupInBBTN = false;
  popupInBBTN1 = false;
  popupInBBTN2 = false;
  popupInBBTN3 = false;
  popupInBBTN4 = false;
  // lưu thông tin account
  account: Account | null = null;
  //Biến check sự thay đổi thông tin trong popup phân loại
  isChanged = false;
  //biến tìm kiếm
  @Input() searchKey = '';
  //Biến lưu thông tin Date
  year = '';
  month = '';
  date = '';
  hours = '';
  minutes = '';
  seconds = '';
  maBienBan = '';
  loaiBienBan = '';
  idDonBaoHanh = '';
  //lưu thông tin import
  ExcelData: any;
  //Lưu tiến độ phân loại
  tienDo = 0;
  countItem = 0;
  //lưu thông tin check All
  checkAll = false;
  //--------------------------------------------------------------------------
  id?: number | null | undefined;
  idMaTiepNhan?: number | null | undefined;
  tenSanPham?: string | null | undefined;
  soLuong?: number | null | undefined;
  doiMoi?: number | null | undefined;
  suaChua?: number | null | undefined;
  khongBaoHanh?: number | null | undefined;
  soLuongDaNhan?: number | null | undefined;

  listOfMaTiepNhan: {
    id: number | null | undefined;
    idMaTiepNhan: number | null | undefined;
    tenSanPham: string | null | undefined;
    soLuong: number | null | undefined;
    doiMoi: number | null | undefined;
    suaChua: number | null | undefined;
    khongBaoHanh: number | null | undefined;
    soLuongDaNhan: number | null | undefined;
  }[] = [
    {
      id: this.idMaTiepNhan,
      idMaTiepNhan: this.idMaTiepNhan,
      tenSanPham: this.tenSanPham,
      soLuong: this.soLuong,
      doiMoi: this.doiMoi,
      suaChua: this.suaChua,
      khongBaoHanh: this.khongBaoHanh,
      soLuongDaNhan: this.soLuongDaNhan,
    },
  ];

  editForm = this.formBuilder.group({
    id: [],
  });

  @Input() itemPerPage = 10;
  page?: number;

  // Biến đóng mở popup thông báo
  isPopupVisible = false;
  popupMessage = '';

  // Biến đóng mở popup xoá màn hình phân loại
  isModalOpenConfirm = false;
  deleteId: any;

  // Biến đóng mở popup xoá màn hình thêm mới
  isModalOpenConfirmAdd = false;
  deleteTenSanPham: any;

  savePhanLoai: any;

  constructor(
    protected rowDetailViewComponent: RowDetailViewComponent,
    protected donBaoHanhService: DonBaoHanhService,
    protected khachHangService: KhachHangService,
    protected modalService: NgbModal,
    protected containerService: ContainerService,
    protected angularUtilService: AngularUtilService,
    protected formBuilder: FormBuilder,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient,
    protected accountService: AccountService,
    protected danhSachTinhTrangService: DanhSachTinhTrangService,
    protected sanPhamService: SanPhamService, // protected dialog: MatDialog,
    protected navBarComponent: NavbarComponent
  ) {}

  buttonBBTN: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-primary fa fa-print" style="height: 28px; line-height: 14px" title="In biên bản tiếp nhận"></button>`
      : { text: '<i class="fa fa-print" aria-hidden="true"></i>' };

  buttonPL: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-success fa fa-check-square-o" style="height: 28px; line-height: 14px; width: 15px">PL</button>`
      : {
          text: '<button class="btn btn-success fa fa-check-square-o" style="height: 28px; line-height: 14px" title="Phân loại"></button>',
        };

  buttonEdit: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-warning fa fa-pencil" style="height: 28px; line-height: 14px; width: 15px"></button>`
      : { text: '<button class="btn btn-warning fa fa-pencil" style="height: 28px; line-height: 14px" title="Chỉnh sửa"></button>' };

  buttonDelete: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-danger fa fa-pencil" style="height: 28px; line-height: 14px; width: 15px"></button>`
      : { text: '<button class="btn btn-danger fa fa-trash" style="height: 28px; line-height: 14px"></button>' };

  loadAll(): void {
    this.navBarComponent.toggleSidebar2();
    this.isLoading = true;
    this.donBaoHanhService.query().subscribe({
      next: (res1: HttpResponse<IDonBaoHanh[]>) => {
        this.isLoading = false;
        this.donBaoHanhs = res1.body!.sort((a, b) => b.id! - a.id!) ?? [];
        //Cập nhật tiến độ phân loại
        for (let i = 0; i < this.donBaoHanhs.length; i++) {
          this.donBaoHanhs[i].tienDo = 0;
          this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${this.donBaoHanhs[i].id as number}`).subscribe(res2 => {
            let count1 = 0;
            // console.log(this.donBaoHanhs[i].id);
            this.chiTietSanPhamTiepNhans = res2;
            for (let h = 0; h < this.chiTietSanPhamTiepNhans.length; h++) {
              if (
                this.chiTietSanPhamTiepNhans[h].tinhTrangBaoHanh === 'true' &&
                this.chiTietSanPhamTiepNhans[h].donBaoHanh!.id === this.donBaoHanhs[i].id
              ) {
                count1++;
                this.donBaoHanhs[i].tienDo = (count1 / this.chiTietSanPhamTiepNhans.length) * 100;
              }
            }
          });
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  ngOnInit(): void {
    this.http.get<any[]>('api/tiep-nhan').subscribe((res: any[]) => {
      this.donBaoHanhs = res.sort((a, b) => b.id! - a.id!);
      console.log('tiep-nhan:', res);
      for (let i = 0; i < this.donBaoHanhs.length; i++) {
        this.donBaoHanhs[i].tienDo = Number(this.donBaoHanhs[i].slDaPhanLoai / this.donBaoHanhs[i].slSanPham) * 100;
      }
    });
    // this.loadAll();
    this.columnDefinitions = [];
    this.columnDefinitions1 = [
      {
        id: 'bbtn',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonBBTN,
        maxWidth: 55,
        minWidth: 55,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.idDonBaoHanh = args.dataContext.id;
          this.donBaoHanh = args.dataContext;
          this.openPopupBBTN(args.dataContext.id);
          // console.log('id? ', args.dataContext.id);
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },
      {
        id: 'phanLoai',
        field: 'idPL',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonPL,

        maxWidth: 55,
        minWidth: 55,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openPopupPhanLoai(args.dataContext.id);
          // console.log('idPL? ', args.dataContext);
          this.donBaoHanh = args.dataContext;
          this.donBaoHanh.nguoiTaoDon = this.account?.login;
          // this.dataPL = args.dataContext;
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },
      {
        id: 'edit',
        field: 'idEdit',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonEdit,
        minWidth: 55,
        maxWidth: 55,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openPopupEdit(args.dataContext.id);
          // console.log('edit', args.dataContext.id);
          //lưu thông tin đơn bảo hành vào session
          sessionStorage.setItem('sessionStorage', JSON.stringify(args));
          // this.alertWarning = `Editing: ${args.dataContext.title}`
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },

      // {
      //   id: 'delete',
      //   field: 'idDelete',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   formatter: this.buttonDelete,
      //   minWidth: 60,
      //   maxWidth: 60,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     console.log(args);
      //     if (confirm('Are u sure?')) {
      //       this.angularGrid?.gridService.deleteItemById(args.dataContext.id);
      //     }
      //   },
      // },

      {
        id: 'id',
        name: 'Mã tiếp nhận',
        field: 'maTiepNhan',
        sortable: true,
        filterable: true,
        minWidth: 140,
        // maxWidth: 200,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },

      {
        id: 'khachHang',
        name: 'Khách hàng',
        field: 'tenKhachHang',

        sortable: true,
        filterable: true,
        minWidth: 350,
        // maxWidth: 400,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },

      {
        id: 'ngayTiepNhan',
        name: 'Ngày tạo đơn',
        field: 'ngayTiepNhan',
        dataKey: 'ngayTiepNhan',
        sortable: true,
        defaultSortAsc: false,
        filterable: true,
        minWidth: 140,
        // maxWidth: 160,
        type: FieldType.object,
        formatter: Formatters.dateTimeIso,
        filter: {
          placeholder: 'search',
          model: Filters.compoundDate,
        },
        editor: {
          model: Editors.date,
          required: true,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },

      {
        id: 'slTiepNhan',
        name: 'Tổng tiếp nhận',
        field: 'slTiepNhan',
        sortable: true,
        filterable: true,
        minWidth: 80,
        maxWidth: 80,
        type: FieldType.number,
        filter: {
          placeholder: 'Search...',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.text,
          required: true,
          maxLength: 100,
          editorOptions: {
            col: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },

      {
        id: 'slDaPhanTich',
        name: 'Đã xử lý',
        field: 'slDaPhanTich',
        sortable: true,
        filterable: true,
        minWidth: 70,
        maxWidth: 70,
        type: FieldType.number,
        filter: {
          placeholder: 'Search...',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.text,
          required: true,
          maxLength: 100,
          editorOptions: {
            col: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'tienDo',
        name: 'Tiến độ phân loại',
        field: 'tienDo',
        sortable: true,
        filterable: true,
        formatter: Formatters.progressBar,
        minWidth: 150,
        maxWidth: 150,
        alwaysRenderColumn: true,
        onCellChange: (e: SlickEventData, args: OnEventArgs) => console.log('tesssst: ', args),
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'ngaykhkb',
        name: 'Ngày tiếp nhận',
        field: 'ngaykhkb',
        sortable: true,
        filterable: true,
        minWidth: 140,
        // maxWidth: 140,
        type: FieldType.object,
        formatter: Formatters.dateTimeIso,
        filter: {
          placeholder: 'Search...',
          model: Filters.compoundDate,
        },
        editor: {
          model: Editors.text,
          required: true,
          maxLength: 100,
          editorOptions: {
            col: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'ngayTraBienBan',
        name: 'Ngày trả biên bản',
        field: 'ngayTraBienBan',
        dataKey: 'ngayTraBienBan',
        sortable: true,
        filterable: true,
        minWidth: 140,
        // maxWidth: 140,
        type: FieldType.object,
        formatter: Formatters.dateTimeIso,
        filter: {
          placeholder: 'Search...',
          model: Filters.compoundDate,
        },
        editor: {
          model: Editors.text,
          required: true,
          maxLength: 100,
          editorOptions: {
            col: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'nguoiTaoDon',
        name: 'Người tạo đơn',
        field: 'nguoiTaoDon',
        sortable: true,
        filterable: true,
        minWidth: 80,
        maxWidth: 80,
        type: FieldType.string,
        filter: {
          placeholder: 'Search...',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.text,
          required: true,
          maxLength: 100,
          editorOptions: {
            col: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'nhanVienGiaoHang',
        name: 'Nhân viên giao vận',
        field: 'nhanVienGiaoHang',
        sortable: true,
        filterable: true,
        minWidth: 120,
        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.text,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'trangThai',
        name: 'Trạng thái',
        field: 'trangThai',
        sortable: true,
        filterable: true,
        minWidth: 120,
        maxWidth: 120,
        type: FieldType.string,
        filter: {
          placeholder: 'Search...',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.text,
          required: true,
          maxLength: 100,
          editorOptions: {
            col: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      // {
      //   id: 'trangThaiIn',
      //   name: 'Trạng thái in',
      //   field: 'trangThaiIn',
      //   sortable: true,
      //   filterable: true,
      //   minWidth: 80,
      //   type: FieldType.string,
      //   filter: {
      //     placeholder: 'search',
      //     model: Filters.compoundInputText,
      //   },
      //   editor: {
      //     model: Editors.text,
      //     required: true,
      //     maxLength: 100,
      //     editorOptions: {
      //       col: 42,
      //       rows: 5,
      //     } as LongTextEditorOption,
      //   },
      // },
    ];
    this.gridOptions1 = {
      enableAutoResize: true,
      enableSorting: true,
      enableFiltering: true,
      enablePagination: true,
      enableAutoSizeColumns: true,
      asyncEditorLoadDelay: 2000,
      // enableColumnPicker: true,
      // enableRowDetailView: true,
      // rowDetailView: {
      //   columnIndexPosition: 3,
      //   process: items => this.simulateServerAsyncCall(items),
      //   loadOnce: false,
      //   singleRowExpand: true,
      //   useRowClick: true,
      //   panelRows: 10,
      //   // Preload View Component
      //   preloadComponent: RowDetailPreloadComponent,
      //   viewComponent: RowDetailViewComponent,
      //   parent: true,
      // },
      pagination: {
        pageSizes: [30, 50, 100],
        pageSize: 30,
      },
      // columnPicker: {
      //   hideForceFitButton: true,
      //   hideSyncResizeButton: true,
      //   onColumnsChanged(e, args) {
      //     console.log(args.visibleColumns);
      //   },
      // },
      editable: true,
      enableCellNavigation: true,
      gridHeight: 620,
      gridWidth: '100%',
      autoHeight: true,
      autoFitColumnsOnFirstLoad: true,
      asyncEditorLoading: true,
      forceFitColumns: false,
      presets: {
        columns: [
          { columnId: 'bbtn' },
          { columnId: 'phanLoai' },
          { columnId: 'edit' },
          { columnId: 'id' },
          { columnId: 'khachHang' },
          { columnId: 'ngayTiepNhan' },
          { columnId: 'slTiepNhan' },
          { columnId: 'slDaPhanTich' },
          { columnId: 'tienDo' },
          { columnId: 'ngaykhkb' },
          { columnId: 'ngayTraBienBan' },
          { columnId: 'nguoiTaoDon' },
          { columnId: 'nhanVienGiaoHang' },
          { columnId: 'trangThai' },
        ],
      },
    };
    this.getPhanLoaiChiTietTiepNhan();
    this.getKhachHangs();
    this.getDanhSachTinhTrang();
    this.getSanPhams();
    this.getDanhSachBienBan();
    this.getMaxId();
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
  }

  simulateServerAsyncCall(item: any): Promise<unknown> {
    sessionStorage.setItem('sessionStorage', JSON.stringify(item));
    return new Promise(resolve => {
      setTimeout(() => {
        const itemDetail = item;
        // console.log(item);

        // resolve the data after delay specified
        resolve(itemDetail);
      }, 1000);
    });
  }
  // lấy id lớn nhất trong ds chi tiết sản phẩm tiếp nhận
  getMaxId(): void {
    this.http.get<ChiTietSanPhamTiepNhan>(this.getMaxIdChiTietSanPhamTiepNhanUrl).subscribe(res => {
      this.idAddRow = res.id!;
      // console.log('max id', this.idAddRow);
    });
  }
  randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  addItem(): void {
    this.donBaoHanhs = [
      ...this.donBaoHanhs,
      {
        id: this.donBaoHanhs.length + 1,
        maTiepNhan: this.donBaoHanhs[this.donBaoHanhs.length]?.maTiepNhan,
        khachHang: this.donBaoHanhs[this.donBaoHanhs.length]?.tenKhachHang,
        ngayTaoDon: this.donBaoHanhs[this.donBaoHanhs.length]?.ngayTaoDon,
        tongTiepNhan: this.donBaoHanhs[this.donBaoHanhs.length]?.tongTiepNhan,
        slDaPhanTich: this.donBaoHanhs[this.donBaoHanhs.length]?.slDaPhanTich,
        ngaykhkb: this.donBaoHanhs[this.donBaoHanhs.length]?.ngaykhkb,
        createBy: this.donBaoHanhs[this.donBaoHanhs.length]?.nguoiTaoDon,
        trangThai: this.donBaoHanhs[this.donBaoHanhs.length]?.trangThai,
      },
    ];
    this.donBaoHanhs.sort((a, b) => b.id - a.id);
  }
  //lấy danh sách biên bản
  getDanhSachBienBan(): void {
    this.http.get<any>('api/ma-bien-bans').subscribe(res => {
      // console.log('danh sach bien ban: ', res);
      this.danhSachBienBan = res;
    });
  }
  // lấy danh sách sản phẩm
  getSanPhams(): void {
    this.sanPhamService.query().subscribe({
      next: (res: HttpResponse<ISanPham[]>) => {
        this.danhSachSanPham = res.body ?? [];
        // console.log('danh sach san pham:', this.danhSachSanPham);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  getPhanLoaiChiTietTiepNhan(): void {
    this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(resPLTN => {
      this.phanLoaiChiTietTiepNhans = resPLTN;
      // sessionStorage.setItem('sessionStorage', JSON.stringify(resPLTN));
      // console.log('sessionStorage', resPLTN);
    });
  }
  //Lấy danh sách khách hàng
  getKhachHangs(): void {
    this.khachHangService.query().subscribe({
      next: (res: HttpResponse<IKhachHang[]>) => {
        this.khachHangs = res.body ?? [];
        // console.log('danh sách khách hàng: ', this.khachHangs);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  // lấy danh sách tình trạng
  getDanhSachTinhTrang(): void {
    this.danhSachTinhTrangService.query().subscribe({
      next: (res: HttpResponse<IDanhSachTinhTrang[]>) => {
        this.danhSachTinhTrangs = res.body ?? [];
        // console.log('danh sach tinh trang:', this.danhSachTinhTrangs);
      },
    });
  }
  //get thông tin phân loại
  getChiTietPhanLoais(id: number): void {
    this.countItem = 0;
    this.keySession = `TiepNhan ${id.toString()}`;
    const result = sessionStorage.getItem(`TiepNhan ${id.toString()}`);
    // this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
    if (result === null) {
      var list1: any[] = [];
      // lấy danh sách chi tiết sản phẩm tiếp nhận lấy theo id
      this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${id.toString()}`).subscribe(res => {
        this.chiTietSanPhamTiepNhans = res;
        // console.log('b', res);
        // lấy danh sách tình trạng
        this.http.get<any>(this.danhSachTinhTrangUrl).subscribe(resTT => {
          this.danhSachTinhTrangs = resTT;
          // sessionStorage.setItem('danhSachTinhTrang', JSON.stringify(resTT));
          // console.log('danh sách tình trạng', resTT);
          // lấy danh sách phân loại chi tiết tiếp nhận
          this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res1 => {
            this.phanLoaiChiTietTiepNhans = res1;
            //  console.log('phan loai chi tiet tiep nhan', res1);
            // Khởi tạo danh sacsah result hiển thị trên giao diện
            // => gán dataset = resutl
            // khởi tạo danh sách rỗng
            const list: any[] = [];
            for (let i = 0; i < this.chiTietSanPhamTiepNhans.length; i++) {
              const item = {
                id: this.chiTietSanPhamTiepNhans[i].id,
                tenSanPham: this.chiTietSanPhamTiepNhans[i].sanPham?.name,
                donVi: this.chiTietSanPhamTiepNhans[i].sanPham?.donVi,
                slKhachGiao: this.chiTietSanPhamTiepNhans[i].soLuongKhachHang,
                slTiepNhanTong: 0,
                slTiepNhan: 0,
                slDoiMoi: 0,
                slSuaChua: 0,
                slKhongBaoHanh: 0,
                chiTietSanPhamTiepNhan: this.chiTietSanPhamTiepNhans[i],
                tinhTrangBaoHanh: false,
              };
              if (this.chiTietSanPhamTiepNhans[i].tinhTrangBaoHanh === 'true') {
                item.tinhTrangBaoHanh = true;
              }
              for (let j = 0; j < this.phanLoaiChiTietTiepNhans.length; j++) {
                if (item.id === this.phanLoaiChiTietTiepNhans[j].chiTietSanPhamTiepNhan?.id) {
                  // gán số lượng vào biến slDoiMoi
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 1) {
                    item.slDoiMoi = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  // gán số lượng vào biến slsuaChua
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 2) {
                    item.slSuaChua = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  // gán số lượng vào biến slKhongBaoHanh
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 3) {
                    item.slKhongBaoHanh = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                }
              }
              list.push(item); // list đã có dữ liệu
            }
            sessionStorage.setItem(`TiepNhan ${id.toString()}`, JSON.stringify(list));
          });
        });
      });
      // lấy dữ liệu từ sessision
      setTimeout(() => {
        var resultBBTN = sessionStorage.getItem(`TiepNhan ${id.toString()}`);
        // dữ liệu lưu trong sessison(dạng string) -> chuyển về dạng JSON (giống arr,obj)
        list1 = JSON.parse(resultBBTN as string);
        // console.log('hien trang', JSON.parse(resultBBTN as string));
        this.resultChiTietSanPhamTiepNhans = JSON.parse(resultBBTN as string);
        setTimeout(() => {
          //Cập nhật tiến độ
          for (let i = 0; i < this.resultChiTietSanPhamTiepNhans.length; i++) {
            if (this.resultChiTietSanPhamTiepNhans[i].tinhTrangBaoHanh === true) {
              this.countItem++;
              this.tienDo = Number(((this.countItem / this.resultChiTietSanPhamTiepNhans.length) * 100).toFixed(2));
            }
          }
        }, 100);
      }, 1000);
    } else {
      this.resultChiTietSanPhamTiepNhans = JSON.parse(result);
      setTimeout(() => {
        //Cập nhật tiến độ
        for (let i = 0; i < this.resultChiTietSanPhamTiepNhans.length; i++) {
          if (this.resultChiTietSanPhamTiepNhans[i].tinhTrangBaoHanh === true) {
            this.countItem++;
            this.tienDo = Number(((this.countItem / this.resultChiTietSanPhamTiepNhans.length) * 100).toFixed(2));
          }
        }
        this.getColor(this.tienDo, 'donBaoHanh');
      }, 100);
      // console.log('trường hợp 2');
    }
  }
  // ================================= popup chỉnh sửa thông tin ==================================
  openPopupEdit(id: number): void {
    this.popupChinhSuaThongTin = true;
    this.navBarComponent.toggleSidebar2();

    // lấy thông tin đơn bảo hành
    const result = sessionStorage.getItem(`TiepNhan ${id.toString()}`);
    // console.log('chinh sua don bao hanh: ', this.khachHangs);
    // lấy dữ liệu đối tượng cần chỉnh sửa
    for (let i = 0; i < this.donBaoHanhs.length; i++) {
      if (id === this.donBaoHanhs[i].id) {
        this.thongTinDonBaoHanh = this.donBaoHanhs[i];
      }
    }
    // console.log("ket qua thu duoc: ",this.thongTinDonBaoHanh)
    this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
  }

  closePopupEdit(): void {
    this.popupChinhSuaThongTin = false;
  }
  capNhatThongTinKhachHang(tenKhachHang: string): void {
    // console.log(tenKhachHang);
    // cập nhật lại thông tin khách hàng
    for (let i = 0; i < this.khachHangs!.length; i++) {
      if (this.khachHangs![i].tenKhachHang === tenKhachHang) {
        this.thongTinDonBaoHanh.khachHang = this.khachHangs![i];
        // console.log({ goc: this.khachHangs![i], capNhat: this.thongTinDonBaoHanh.khachHang });
        // console.log('cập nhật: ', this.thongTinDonBaoHanh);
      }
    }
  }
  xacNhanCapNhatDonBaoHanh(): void {
    this.http.put<any>(this.updateDonBaoHanhUrl, this.thongTinDonBaoHanh).subscribe(() => {
      // console.log('thanh cong');
    });
    window.location.reload();
  }

  // ========================================= popup thêm mới đơn bảo hành và chi tiết đơn bảo hành =======================================
  openPopupThemMoi(): void {
    this.popupThemMoi = true;
    this.navBarComponent.toggleSidebar2();
    //reset dữ liệu
    this.themMoiDonBaoHanh = [];
    this.themMoiPhanLoaiChiTietTiepNhan = [];
    this.chiTietDonBaoHanh = [];
    this.donBaoHanh = {
      khachHang: { tenKhachHang: '' },
      ngayTiepNhan: new Date(),
      nguoiTaoDon: this.account?.login,
      trangThai: 'Chờ phân loại',
      slDaPhanTich: 0,
    };
  }
  checkDuLieuThemMoi(tenKhachHang: string): void {
    this.isChanged = true;
    // cập nhật lại thông tin khách hàng
    for (let i = 0; i < this.khachHangs!.length; i++) {
      if (this.khachHangs![i].tenKhachHang === tenKhachHang) {
        this.donBaoHanh.khachHang = this.khachHangs![i];
        // console.log({ goc: this.khachHangs![i], capNhat: this.donBaoHanh.khachHang });
        // console.log('cập nhật: ', this.donBaoHanh);
      }
    }
    // console.log('check dữ liệu thêm mới: ', this.donBaoHanh);
  }
  // thêm mới đơn bảo hành và chi tiết
  postDonBaoHanh(): void {
    if (this.donBaoHanh.khachHang.tenKhachHang === '' || this.donBaoHanh.nhanVienGiaoHang === '') {
      let check = false;
      if (this.donBaoHanh.khachHang.tenKhachHang !== '' && this.donBaoHanh.nhanVienGiaoHang === '') {
        check = true;
        this.openPopupNoti('Chưa điền thông tin nhân viên giao vận');
      }
      if (this.donBaoHanh.khachHang.tenKhachHang === '' && this.donBaoHanh.nhanVienGiaoHang !== '') {
        check = true;
        this.openPopupNoti('Chưa điền thông tin khách hàng');
      }
      if (check === false) {
        this.openPopupNoti('Chưa điền thông tin khách hàng và nhân viên giao vận');
      }
    } else {
      //tạo mã tiếp nhận theo thời gian thực
      this.donBaoHanh.maTiepNhan = this.taoMaTiepNhan();
      // thêm mới đơn bảo hành
      this.http.post<any>(this.postDonBaoHanhUrl, this.donBaoHanh).subscribe(res => {
        // console.log('donbao hanh:', res);
        //thêm mới chi tiết sản phẩm tiếp nhận tách ra từ từ danh sách import
        for (let i = 0; i < this.themMoiDonBaoHanh.length; i++) {
          const item: IChiTietSanPhamTiepNhan = {
            soLuongKhachHang: this.themMoiDonBaoHanh[i].slKhachGiao,
            idKho: '0',
            idBienBan: '0',
            tongLoiKiThuat: 0,
            tongLoiLinhDong: 0,
            ngayPhanLoai: null,
            slTiepNhan: this.themMoiDonBaoHanh[i].slTiepNhan,
            slTon: 0,
            tinhTrangBaoHanh: 'false',
            trangThaiIn: null,
            sanPham: this.themMoiDonBaoHanh[i].sanPham,
            donBaoHanh: res,
          };
          this.chiTietDonBaoHanh.push(item);
        }
        // console.log(this.chiTietDonBaoHanh);
        this.http.post<any>(this.postChiTietDonBaoHanhUrl, this.chiTietDonBaoHanh).subscribe(res1 => {
          // console.log('chi tiet don bao hanh', res1);
          //Thêm mới phân loại chi tieets đơn hàng tiếp nhận theo từng trạng thái tách ra từ danh sách import
          for (let i = 0; i < res1.length; i++) {
            for (let j = 0; j < this.danhSachTinhTrangs.length; j++) {
              if (this.danhSachTinhTrangs[j].id === 1) {
                const item1: IPhanLoaiChiTietTiepNhan = {
                  soLuong: this.themMoiDonBaoHanh[i].slDoiMoi,
                  chiTietSanPhamTiepNhan: res1[i],
                  danhSachTinhTrang: this.danhSachTinhTrangs[j],
                };
                this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
              }
              if (this.danhSachTinhTrangs[j].id === 2) {
                const item1: IPhanLoaiChiTietTiepNhan = {
                  soLuong: this.themMoiDonBaoHanh[i].slSuaChua,
                  chiTietSanPhamTiepNhan: res1[i],
                  danhSachTinhTrang: this.danhSachTinhTrangs[j],
                };
                this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
              }
              if (this.danhSachTinhTrangs[j].id === 3) {
                const item1: IPhanLoaiChiTietTiepNhan = {
                  soLuong: this.themMoiDonBaoHanh[i].slKhongBaoHanh,
                  chiTietSanPhamTiepNhan: res1[i],
                  danhSachTinhTrang: this.danhSachTinhTrangs[j],
                };
                this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
              }
            }
          }
          // thêm mới phân loại chi tiết tiếp nhận đơn bảo hành
          this.http.post<any>(this.postPhanLoaiChiTietTiepNhanUrl, this.themMoiPhanLoaiChiTietTiepNhan).subscribe(res2 => {
            // console.log('thành công', res2);
          });
          // console.log('phân loại chi tiết tiếp nhận: ', this.themMoiPhanLoaiChiTietTiepNhan);
        });
      });
      setTimeout(() => {
        this.openPopupNoti('Thêm mới thành công');
        window.location.reload();
      }, 2000);
    }
  }
  //cập nhật thông tin sl Tổng tiếp nhận đơn bảo hành và sl tiếp nhận của chi tiết đơn bảo hành
  updateChiTietDonBaoHanhInfo(slDoiMoi: any, slSuaChua: any, slKhongBaoHanh: any, slTiepNhan: any, index: number): void {
    this.donBaoHanh.slTiepNhan = 0;
    // sl tiếp nhận của chi tiết đơn bảo hành
    slTiepNhan = Number(slDoiMoi) + Number(slSuaChua) + Number(slKhongBaoHanh);
    //cập nhật thông tin sl Tổng tiếp nhận đơn bảo hành
    for (let i = 0; i < this.themMoiDonBaoHanh.length; i++) {
      this.donBaoHanh.slTiepNhan =
        Number(this.donBaoHanh.slTiepNhan) +
        Number(this.themMoiDonBaoHanh[i].slDoiMoi) +
        Number(this.themMoiDonBaoHanh[i].slSuaChua) +
        Number(this.themMoiDonBaoHanh[i].slKhongBaoHanh);
      if (index === i) {
        this.themMoiDonBaoHanh[i].slNhan = slTiepNhan;
      }
    }
    // console.log({ slTiepNhan1: slTiepNhan, danhsach: this.themMoiDonBaoHanh });
  }

  // deleteRow(tenSanPham: any): void {
  //   if (confirm('Bạn chắc chắn muốn xóa thông số này?') === true) {
  //     console.log()
  //     this.donBaoHanh.slTiepNhan = 0;
  //     this.themMoiDonBaoHanh = this.themMoiDonBaoHanh.filter((d: any) => d.tenSanPham !== tenSanPham);
  //     // cập nhật lại tổng số lượng tiếp nhận
  //     for (let i = 0; i < this.themMoiDonBaoHanh.length; i++) {
  //       this.donBaoHanh.slTiepNhan =
  //         Number(this.donBaoHanh.slTiepNhan) +
  //         Number(this.themMoiDonBaoHanh[i].slDoiMoi) +
  //         Number(this.themMoiDonBaoHanh[i].slSuaChua) +
  //         Number(this.themMoiDonBaoHanh[i].slKhongBaoHanh);
  //     }
  //   }
  // }
  closePopupThemMoi(): void {
    this.popupThemMoi = false;
  }
  taoMaTiepNhan(): string {
    const date = new Date();
    this.year = date.getFullYear().toString().slice(-2);
    const getMonth = date.getMonth() + 1;
    if (getMonth < 10) {
      this.month = `0${getMonth}`;
    } else {
      this.month = getMonth.toString();
    }
    if (date.getDate() < 10) {
      this.date = `0${date.getDate()}`;
    } else {
      this.date = date.getDate().toString();
    }
    if (date.getHours() < 10) {
      this.hours = `0${date.getHours()}`;
    } else {
      this.hours = date.getHours().toString();
    }
    if (date.getMinutes() < 10) {
      this.minutes = `0${date.getMinutes()}`;
    } else {
      this.minutes = date.getMinutes().toString();
    }
    if (date.getSeconds() < 10) {
      this.seconds = `0${date.getSeconds()}`;
    } else {
      this.seconds = date.getSeconds().toString();
    }
    const maTiepNhan = `DBH${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`;
    // console.log('tao moi ma tiep nhan:', maTiepNhan);
    return maTiepNhan;
  }
  //=============================================== Popup phân loại ================================================
  closePopupPhanLoai(): void {
    this.popupPhanLoai = false;
  }
  openPopupPhanLoai(id: number): void {
    this.popupPhanLoai = true;
    this.navBarComponent.toggleSidebar2();

    //reset bien dem signal
    this.countItem = 0;
    this.getChiTietPhanLoais(id);
  }
  // cập nhật tên sản phẩm
  updateTenSanPham(tenSanPham: string, index: number): void {
    this.isChanged = true;
    let resultCheck = false;
    const result = sessionStorage.getItem(this.keySession);
    this.listOfDetailPl = JSON.parse(result as string);
    //tạo 1 biến lưu phần tử check
    const item = this.danhSachGocPopupPhanLoai[index];
    // kiểm tra sự tồn tại của sản phẩm trong danh sách chi tiết
    for (let i = 0; i < this.listOfDetailPl.length; i++) {
      if (tenSanPham === this.listOfDetailPl[i].tenSanPham) {
        // console.log({ tenSP: tenSanPham, tenSPtrongDS: this.listOfDetailPl[i].tenSanPham, indexs: i });
        this.openPopupNoti('Sản phẩm đã tồn tại');
        this.resultChiTietSanPhamTiepNhans[index].tenSanPham = '';
        resultCheck = true;
        break;
      }
    }
    setTimeout(() => {
      if (resultCheck === false) {
        this.listOfDetailPl.push(item);
        sessionStorage.setItem(this.keySession, JSON.stringify(this.listOfDetailPl));
        // console.log('them san pham vao session: ', this.listOfDetailPl);
      }
    }, 500);
  }
  //Cập nhật thông tin trong popup phân loại
  updatePopupPhanLoai(index: number): void {
    this.isChanged = true;
    this.donBaoHanh.slTiepNhan = 0;
    // tính toán số lượng tiếp nhận
    this.resultChiTietSanPhamTiepNhans[index].slTiepNhan =
      Number(this.resultChiTietSanPhamTiepNhans[index].slDoiMoi) +
      Number(this.resultChiTietSanPhamTiepNhans[index].slSuaChua) +
      Number(this.resultChiTietSanPhamTiepNhans[index].slKhongBaoHanh);
    // gán vào dữ liệu gốc
    for (let i = 0; i < this.danhSachGocPopupPhanLoai.length; i++) {
      if (this.danhSachGocPopupPhanLoai[i].tenSanPham === this.resultChiTietSanPhamTiepNhans[index].tenSanPham) {
        this.danhSachGocPopupPhanLoai[i].slDoiMoi = this.resultChiTietSanPhamTiepNhans[index].slDoiMoi;
        this.danhSachGocPopupPhanLoai[i].slSuaChua = this.resultChiTietSanPhamTiepNhans[index].slSuaChua;
        this.danhSachGocPopupPhanLoai[i].slKhongBaoHanh = this.resultChiTietSanPhamTiepNhans[index].slKhongBaoHanh;
        this.danhSachGocPopupPhanLoai[i].slTiepNhan = this.resultChiTietSanPhamTiepNhans[index].slTiepNhan;
      }
      //Cập nhật thông tin số lượng tổng tiếp nhận
      this.donBaoHanh.slTiepNhan = Number(this.donBaoHanh.slTiepNhan) + Number(this.danhSachGocPopupPhanLoai[i].slTiepNhan);
    }
    // console.log('check: ', index, this.resultChiTietSanPhamTiepNhans[index]);
  }

  // xacNhanPhanLoai(): void {
  //   const today = dayjs().startOf('second');
  //   this.themMoiPhanLoaiChiTietTiepNhan = [];
  //   this.chiTietDonBaoHanh = [];
  //   // xử lý dữ liệu để lưu vào DB
  //   // loại bỏ các phẩn tử không có tên sản phẩm
  //   this.resultChiTietSanPhamTiepNhans = this.resultChiTietSanPhamTiepNhans.filter(item => item.tenSanPham !== '');
  //   //cập nhật thông tin sản phẩm trong chi tiết sản phẩm tiếp nhận
  //   for (let i = 0; i < this.resultChiTietSanPhamTiepNhans.length; i++) {
  //     for (let j = 0; j < this.danhSachSanPham.length; j++) {
  //       if (this.resultChiTietSanPhamTiepNhans[i].tenSanPham === this.danhSachSanPham[j].name) {
  //         const item: IChiTietSanPhamTiepNhan = {
  //           id: this.resultChiTietSanPhamTiepNhans[i].id,
  //           soLuongKhachHang: this.resultChiTietSanPhamTiepNhans[i].slKhachGiao,
  //           idKho: '0',
  //           idBienBan: '0',
  //           tongLoiKiThuat: 0,
  //           tongLoiLinhDong: 0,
  //           ngayPhanLoai: today,
  //           slTiepNhan: this.resultChiTietSanPhamTiepNhans[i].slTiepNhan,
  //           slTon: 0,
  //           tinhTrangBaoHanh: '',
  //           trangThaiIn: null,
  //           sanPham: this.danhSachSanPham[j],
  //           donBaoHanh: this.donBaoHanh,
  //         };
  //         if (this.resultChiTietSanPhamTiepNhans[i].tinhTrangBaoHanh) {
  //           item.tinhTrangBaoHanh = 'true';
  //         } else {
  //           item.tinhTrangBaoHanh = 'false';
  //         }
  //         this.chiTietDonBaoHanh.push(item);
  //         break;
  //       }
  //     }
  //   }
  //   //cập nhật thông tin đơn bảo hành
  //   if (this.isChanged === true) {
  //     if (confirm('Xác nhận lưu sự thay đổi ?') === true) {
  //       this.http.put<any>(`${this.updateDonBaoHanhUrl}`, this.donBaoHanh).subscribe(() => {
  //         // cập nhật thông tin chi tiết sản phẩm tiếp nhận
  //         this.http.put<any>(this.putChiTietSanPhamTiepNhanUrl, this.chiTietDonBaoHanh).subscribe(res => {
  //           // console.log('check ket qua chi tiet phan loaij: ', res);
  //           // tạo danh sách phân loại sau khi cập nhật thông tin chi tiết sản phẩm tiếp nhận
  //           setTimeout(() => {
  //             for (let i = 0; i < res.length; i++) {
  //               for (let k = 0; k < this.danhSachTinhTrangs.length; k++) {
  //                 // trường hợp đổi mới
  //                 if (this.danhSachTinhTrangs[k].id === 1) {
  //                   const item1: IPhanLoaiChiTietTiepNhan = {
  //                     id: 0,
  //                     soLuong: this.resultChiTietSanPhamTiepNhans[i].slDoiMoi,
  //                     chiTietSanPhamTiepNhan: res[i],
  //                     danhSachTinhTrang: this.danhSachTinhTrangs[k],
  //                   };
  //                   this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
  //                 }
  //                 // trường hợp sửa chữa
  //                 if (this.danhSachTinhTrangs[k].id === 2) {
  //                   const item1: IPhanLoaiChiTietTiepNhan = {
  //                     id: 0,
  //                     soLuong: this.resultChiTietSanPhamTiepNhans[i].slSuaChua,
  //                     chiTietSanPhamTiepNhan: res[i],
  //                     danhSachTinhTrang: this.danhSachTinhTrangs[k],
  //                   };
  //                   this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
  //                 }
  //                 //trường hợp không bảo hành
  //                 if (this.danhSachTinhTrangs[k].id === 3) {
  //                   const item1: IPhanLoaiChiTietTiepNhan = {
  //                     id: 0,
  //                     soLuong: this.resultChiTietSanPhamTiepNhans[i].slKhongBaoHanh,
  //                     chiTietSanPhamTiepNhan: res[i],
  //                     danhSachTinhTrang: this.danhSachTinhTrangs[k],
  //                   };
  //                   this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
  //                 }
  //               }
  //             }
  //             this.http.put<any>(this.putPhanLoaiChiTietTiepNhanUrl, this.themMoiPhanLoaiChiTietTiepNhan).subscribe(() => {
  //               this.isChanged = false;
  //               setTimeout(() => {
  //                 console.log('Chi tiet don bao hanh: ', this.chiTietDonBaoHanh);
  //                 console.log('Phan loai chi tiet don hang tiep nhan: ', this.themMoiPhanLoaiChiTietTiepNhan);
  //                 this.openPopupNoti('Hoàn thành phân loại');
  //                 window.location.reload();
  //               }, 500);
  //             });
  //           }, 500);
  //         });
  //       });
  //     }
  //   } else {
  //     this.http.put<any>(`${this.updateDonBaoHanhUrl}`, this.donBaoHanh).subscribe(() => {
  //       setTimeout(() => {
  //         this.openPopupNoti('Hoàn thành phân loại');
  //         window.location.reload();
  //       }, 1000);
  //     });
  //   }
  // }
  searchInPopupPhanLoai(): void {
    this.resultChiTietSanPhamTiepNhans = this.danhSachGocPopupPhanLoai.filter(a => a.tenSanPham.includes(this.searchKey));
  }

  // // cập nhật tiến độ phân loại
  // deleteRowPopupPhanLoai(id: any): void {
  //   this.isChanged = true;
  //   if (confirm('Bạn chắc chắn muốn xóa thông số này?') === true) {
  //     this.donBaoHanh.slTiepNhan = 0;
  //     // cập nhật lại danh sách chi tiết đơn bảo hành
  //     this.resultChiTietSanPhamTiepNhans = this.resultChiTietSanPhamTiepNhans.filter((d: any) => d.id !== id);
  //     this.danhSachGocPopupPhanLoai = this.danhSachGocPopupPhanLoai.filter((d: any) => d.id !== id);
  //     this.http.delete(`${this.deleteDetailDonBaoHanhUrl}/${id as number}`).subscribe(() => {
  //       console.log('xóa thành công');
  //     });
  //     // cập nhật lại tổng số lượng tiếp nhận
  //     for (let i = 0; i < this.resultChiTietSanPhamTiepNhans.length; i++) {
  //       this.donBaoHanh.slTiepNhan =
  //         Number(this.donBaoHanh.slTiepNhan) +
  //         Number(this.resultChiTietSanPhamTiepNhans[i].slDoiMoi) +
  //         Number(this.resultChiTietSanPhamTiepNhans[i].slSuaChua) +
  //         Number(this.resultChiTietSanPhamTiepNhans[i].slKhongBaoHanh);
  //     }
  //   }
  // }

  addRow(): void {
    this.isChanged = true;
    this.idAddRow++;
    // cập nhật thông tin
    //thêm mới dòng
    const newRow = {
      id: this.idAddRow,
      tenSanPham: '',
      donVi: '',
      slKhachGiao: 0,
      slTiepNhanTong: 0,
      slTiepNhan: 0,
      slDoiMoi: 0,
      slSuaChua: 0,
      slKhongBaoHanh: 0,
      chiTietSanPhamTiepNhan: null,
    };
    this.resultChiTietSanPhamTiepNhans.push(newRow);
    this.danhSachGocPopupPhanLoai.push(newRow);
    // this.resultChiTietSanPhamTiepNhans = [...this.resultChiTietSanPhamTiepNhans, newRow];
    // this.danhSachGocPopupPhanLoai = [...this.danhSachGocPopupPhanLoai, newRow];
    // console.log('them dong', this.resultChiTietSanPhamTiepNhans);
  }
  //tích phân loại nhanh
  phanLoaiCheckAll(): void {
    this.isChanged = true;
    this.checkAll = !this.checkAll;
    for (let i = 0; i < this.resultChiTietSanPhamTiepNhans.length; i++) {
      this.resultChiTietSanPhamTiepNhans[i].tinhTrangBaoHanh = this.checkAll;
    }
    if (this.checkAll === true) {
      this.tienDo = 100;
      this.getColor(this.tienDo, 'donBaoHanh');
      this.countItem = this.resultChiTietSanPhamTiepNhans.length;
      sessionStorage.setItem(`TiepNhan ${this.donBaoHanh.id as string}`, JSON.stringify(this.resultChiTietSanPhamTiepNhans));
      this.donBaoHanh.trangThai = 'Chờ phân tích';
    }
    if (this.checkAll === false) {
      this.tienDo = 0;
      this.countItem = 0;
      this.getColor(this.tienDo, 'donBaoHanh');
      sessionStorage.setItem(`TiepNhan ${this.donBaoHanh.id as string}`, JSON.stringify(this.resultChiTietSanPhamTiepNhans));
      this.donBaoHanh.trangThai = 'Chờ phân loại';
    }
    // console.log(this.resultChiTietSanPhamTiepNhans);
  }
  updateSignalPhanLoai(index: any): void {
    this.isChanged = true;
    this.donBaoHanh.trangThai = 'Đang phân loại';
    if (this.resultChiTietSanPhamTiepNhans[index].tinhTrangBaoHanh === true) {
      this.countItem++;
      this.tienDo = Number(((this.countItem / this.resultChiTietSanPhamTiepNhans.length) * 100).toFixed(2));
      this.getColor(this.tienDo, 'donBaoHanh');
      sessionStorage.setItem(`TiepNhan ${this.donBaoHanh.id as string}`, JSON.stringify(this.resultChiTietSanPhamTiepNhans));
    }
    if (this.resultChiTietSanPhamTiepNhans[index].tinhTrangBaoHanh === false) {
      this.countItem--;
      this.tienDo = Number(((this.countItem / this.resultChiTietSanPhamTiepNhans.length) * 100).toFixed(2));
      this.getColor(this.tienDo, 'donBaoHanh');
      sessionStorage.setItem(`TiepNhan ${this.donBaoHanh.id as string}`, JSON.stringify(this.resultChiTietSanPhamTiepNhans));
    }
    if (this.tienDo === 100) {
      this.donBaoHanh.trangThai = 'Chờ phân tích';
      // console.log(this.resultChiTietSanPhamTiepNhans);
    }
    if (this.tienDo === 0) {
      this.donBaoHanh.trangThai = 'Chờ phân loại';
      // console.log(this.resultChiTietSanPhamTiepNhans);
    }
  }
  //==================================================   Popup biên bản tiếp nhận =====================================================
  openPopupBBTN(id: number): void {
    this.popupInBBTN = true;
    this.navBarComponent.toggleSidebar2();

    // lấy dữ liệu từ sessision
    this.getChiTietPhanLoais(id);
  }

  openPopupInBBTN1(): void {
    this.maBienBan = '';
    this.loaiBienBan = 'Tiếp nhận';
    for (let i = 0; i < this.danhSachBienBan.length; i++) {
      if (this.loaiBienBan === this.danhSachBienBan[i].loaiBienBan && this.idDonBaoHanh === this.danhSachBienBan[i].donBaoHanh.id) {
        this.maBienBan = this.danhSachBienBan[i].maBienBan;
        //lưu thông tin thêm mới biên bản
        this.themMoiBienBan = this.danhSachBienBan[i];
        // console.log('Cap nhat thong tin bien ban:', this.themMoiBienBan);
      }
    }
    if (this.maBienBan === '') {
      const date = new Date();
      this.year = date.getFullYear().toString().slice(-2);
      const getMonth = date.getMonth() + 1;
      if (getMonth < 10) {
        this.month = `0${getMonth}`;
      } else {
        this.month = getMonth.toString();
      }
      if (date.getDate() < 10) {
        this.date = `0${date.getDate()}`;
      } else {
        this.date = date.getDate().toString();
      }
      if (date.getHours() < 10) {
        this.hours = `0${date.getHours()}`;
      } else {
        this.hours = date.getHours().toString();
      }
      if (date.getMinutes() < 10) {
        this.minutes = `0${date.getMinutes()}`;
      } else {
        this.minutes = date.getMinutes().toString();
      }
      if (date.getSeconds() < 10) {
        this.seconds = `0${date.getSeconds()}`;
      } else {
        this.seconds = date.getSeconds().toString();
      }
      this.maBienBan = `TN${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`;
      this.themMoiBienBan = { id: null, maBienBan: this.maBienBan, loaiBienBan: this.loaiBienBan, soLanIn: 0, donBaoHanh: this.donBaoHanh };
      // console.log('them moi bien ban:', this.themMoiBienBan);
    }
    this.popupInBBTN1 = true;
  }

  openPopupInBBTN2(): void {
    this.maBienBan = '';
    this.loaiBienBan = 'Tiếp nhận';
    for (let i = 0; i < this.danhSachBienBan.length; i++) {
      if (this.loaiBienBan === this.danhSachBienBan[i].loaiBienBan && this.idDonBaoHanh === this.danhSachBienBan[i].donBaoHanh.id) {
        this.maBienBan = this.danhSachBienBan[i].maBienBan;
        //lưu thông tin thêm mới biên bản
        this.themMoiBienBan = this.danhSachBienBan[i];
        // console.log('Cap nhat thong tin bien ban:', this.themMoiBienBan);
      }
    }
    if (this.maBienBan === '') {
      const date = new Date();
      this.year = date.getFullYear().toString().slice(-2);
      const getMonth = date.getMonth() + 1;
      if (getMonth < 10) {
        this.month = `0${getMonth}`;
      } else {
        this.month = getMonth.toString();
      }
      if (date.getDate() < 10) {
        this.date = `0${date.getDate()}`;
      } else {
        this.date = date.getDate().toString();
      }
      if (date.getHours() < 10) {
        this.hours = `0${date.getHours()}`;
      } else {
        this.hours = date.getHours().toString();
      }
      if (date.getMinutes() < 10) {
        this.minutes = `0${date.getMinutes()}`;
      } else {
        this.minutes = date.getMinutes().toString();
      }
      if (date.getSeconds() < 10) {
        this.seconds = `0${date.getSeconds()}`;
      } else {
        this.seconds = date.getSeconds().toString();
      }
      this.maBienBan = `TN${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`;
      this.themMoiBienBan = { id: null, maBienBan: this.maBienBan, loaiBienBan: this.loaiBienBan, soLanIn: 0, donBaoHanh: this.donBaoHanh };
      // console.log('them moi bien ban:', this.themMoiBienBan);
    }
    this.popupInBBTN2 = true;
  }

  openPopupInBBTN3(): void {
    this.maBienBan = '';
    this.loaiBienBan = 'Tiếp nhận';
    for (let i = 0; i < this.danhSachBienBan.length; i++) {
      if (this.loaiBienBan === this.danhSachBienBan[i].loaiBienBan && this.idDonBaoHanh === this.danhSachBienBan[i].donBaoHanh.id) {
        this.maBienBan = this.danhSachBienBan[i].maBienBan;
        //lưu thông tin thêm mới biên bản
        this.themMoiBienBan = this.danhSachBienBan[i];
        // console.log('Cap nhat thong tin bien ban:', this.themMoiBienBan);
      }
    }
    if (this.maBienBan === '') {
      const date = new Date();
      this.year = date.getFullYear().toString().slice(-2);
      const getMonth = date.getMonth() + 1;
      if (getMonth < 10) {
        this.month = `0${getMonth}`;
      } else {
        this.month = getMonth.toString();
      }
      if (date.getDate() < 10) {
        this.date = `0${date.getDate()}`;
      } else {
        this.date = date.getDate().toString();
      }
      if (date.getHours() < 10) {
        this.hours = `0${date.getHours()}`;
      } else {
        this.hours = date.getHours().toString();
      }
      if (date.getMinutes() < 10) {
        this.minutes = `0${date.getMinutes()}`;
      } else {
        this.minutes = date.getMinutes().toString();
      }
      if (date.getSeconds() < 10) {
        this.seconds = `0${date.getSeconds()}`;
      } else {
        this.seconds = date.getSeconds().toString();
      }
      this.maBienBan = `TN${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`;
      this.themMoiBienBan = { id: null, maBienBan: this.maBienBan, loaiBienBan: this.loaiBienBan, soLanIn: 0, donBaoHanh: this.donBaoHanh };
      // console.log('them moi bien ban:', this.themMoiBienBan);
    }
    this.popupInBBTN3 = true;
  }

  openPopupInBBTN4(): void {
    this.maBienBan = '';
    this.loaiBienBan = 'Tiếp nhận';
    for (let i = 0; i < this.danhSachBienBan.length; i++) {
      if (this.loaiBienBan === this.danhSachBienBan[i].loaiBienBan && this.idDonBaoHanh === this.danhSachBienBan[i].donBaoHanh.id) {
        this.maBienBan = this.danhSachBienBan[i].maBienBan;
        //lưu thông tin thêm mới biên bản
        this.themMoiBienBan = this.danhSachBienBan[i];
        // console.log('Cap nhat thong tin bien ban:', this.themMoiBienBan);
      }
    }
    if (this.maBienBan === '') {
      const date = new Date();
      this.year = date.getFullYear().toString().slice(-2);
      const getMonth = date.getMonth() + 1;
      if (getMonth < 10) {
        this.month = `0${getMonth}`;
      } else {
        this.month = getMonth.toString();
      }
      if (date.getDate() < 10) {
        this.date = `0${date.getDate()}`;
      } else {
        this.date = date.getDate().toString();
      }
      if (date.getHours() < 10) {
        this.hours = `0${date.getHours()}`;
      } else {
        this.hours = date.getHours().toString();
      }
      if (date.getMinutes() < 10) {
        this.minutes = `0${date.getMinutes()}`;
      } else {
        this.minutes = date.getMinutes().toString();
      }
      if (date.getSeconds() < 10) {
        this.seconds = `0${date.getSeconds()}`;
      } else {
        this.seconds = date.getSeconds().toString();
      }
      this.maBienBan = `TN${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`;
      this.themMoiBienBan = { id: null, maBienBan: this.maBienBan, loaiBienBan: this.loaiBienBan, soLanIn: 0, donBaoHanh: this.donBaoHanh };
      // console.log('them moi bien ban:', this.themMoiBienBan);
    }
    this.popupInBBTN4 = true;
  }

  closePopupBBTN(): void {
    this.popupInBBTN = false;
  }

  closePopupBBTN1(): void {
    this.popupInBBTN1 = false;
  }

  closePopupBBTN2(): void {
    this.popupInBBTN2 = false;
  }

  closePopupBBTN3(): void {
    this.popupInBBTN3 = false;
  }

  closePopupBBTN4(): void {
    this.popupInBBTN4 = false;
  }
  xacNhanInBienBan(): void {
    this.themMoiBienBan.soLanIn++;
    this.http.post<any>(this.postMaBienBanUrl, this.themMoiBienBan).subscribe(res => {
      // console.log('thành công:', res);
      window.location.reload();
    });
  }
  //--------------------------------------------------- import file --------------------------------------------------------
  ReadExcel(event: any): void {
    this.ExcelData = [];
    this.donBaoHanh.slTiepNhan = 0;
    this.donBaoHanh.nhanVienGiaoHang = '';
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = e => {
      const workBook = XLSX.read(fileReader.result, { type: 'binary' });
      const sheetNames = workBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], {
        header: ['maSanPham', 'tenSanPham', 'slKhachGiao', 'slNhan', 'slDoiMoi', 'slSuaChua', 'slKhongBaoHanh'],
        defval: '',
      });
    };
    // lọc thông tin hiển thị lên giao diện
    setTimeout(() => {
      this.ExcelData = this.ExcelData.filter((data: any) => data.slKhachGiao !== '' && data.tenSanPham !== 'Tên sản phẩm');
      for (let i = 0; i < this.ExcelData.length; i++) {
        this.ExcelData[i].sanPham = null;
        for (let j = 0; j < this.danhSachSanPham.length; j++) {
          // console.log(j);
          if (this.ExcelData[i].tenSanPham === this.danhSachSanPham[j].name) {
            this.ExcelData[i].sanPham = this.danhSachSanPham[j];
            break;
          }
        }
        if (this.ExcelData[i].slSuaChua === '') {
          this.ExcelData[i].slSuaChua = 0;
          if (this.ExcelData[i].slKhongBaoHanh === '') {
            this.ExcelData[i].slKhongBaoHanh = 0;
          }
        } else {
          if (this.ExcelData[i].slKhongBaoHanh === '') {
            this.ExcelData[i].slKhongBaoHanh = 0;
          }
        }
        // lưu kết quả sau khi lọc vào biến mới
        this.themMoiDonBaoHanh.push(this.ExcelData[i]);
        // tính toán tổng số lượng tiếp nhận
        this.donBaoHanh.slTiepNhan =
          Number(this.donBaoHanh.slTiepNhan) +
          Number(this.ExcelData[i].slDoiMoi) +
          Number(this.ExcelData[i].slSuaChua) +
          Number(this.ExcelData[i].slKhongBaoHanh);
      }
      //lưu kết quả vào
      // console.log(this.ExcelData);
      // console.log('kq', this.themMoiDonBaoHanh);
      // console.log(`kq tiep nhan:`, this.donBaoHanh);
    }, 1000);
  }

  openPopupNoti(message: string): void {
    this.popupMessage = message;
    this.isPopupVisible = true;
    // console.log('popup thong bao', this.popupMessage);
    document.getElementById('popupNoti')!.style.display = 'block';
  }

  closePopupNoti(): void {
    this.isPopupVisible = false;
    // console.log('dong popup', this.isPopupVisible)
    document.getElementById('popupNoti')!.style.display = 'none';
  }

  deleteRowPopupPhanLoai(id: any): void {
    this.deleteId = id;
    this.isModalOpenConfirm = true;
    document.getElementById('modal-confirm')!.style.display = 'block';
  }

  confirmDelete(): void {
    this.isChanged = true;
    this.donBaoHanh.slTiepNhan = 0;
    this.resultChiTietSanPhamTiepNhans = this.resultChiTietSanPhamTiepNhans.filter((d: any) => d.id !== this.deleteId);
    this.danhSachGocPopupPhanLoai = this.danhSachGocPopupPhanLoai.filter((d: any) => d.id !== this.deleteId);
    this.http.delete(`${this.deleteDetailDonBaoHanhUrl}/${this.deleteId as number}`).subscribe(() => {
      // console.log('xóa thành công');
    });

    for (let i = 0; i < this.resultChiTietSanPhamTiepNhans.length; i++) {
      this.donBaoHanh.slTiepNhan =
        Number(this.donBaoHanh.slTiepNhan) +
        Number(this.resultChiTietSanPhamTiepNhans[i].slDoiMoi) +
        Number(this.resultChiTietSanPhamTiepNhans[i].slSuaChua) +
        Number(this.resultChiTietSanPhamTiepNhans[i].slKhongBaoHanh);
    }

    this.isModalOpenConfirm = false;
    document.getElementById('modal-confirm')!.style.display = 'none';
  }

  closeModalConfirm(): void {
    this.isModalOpenConfirm = false;
    document.getElementById('modal-confirm')!.style.display = 'none';
  }

  deleteRow(tenSanPham: any): void {
    this.deleteTenSanPham = tenSanPham;
    this.isModalOpenConfirmAdd = true;
    document.getElementById('modal-confirm-add')!.style.display = 'block';
    // console.log('open modal confirm add', this.isModalOpenConfirmAdd);
  }

  confirmDeleteRowAdd(): void {
    this.isChanged = true;
    this.donBaoHanh.slTiepNhan = 0;
    this.themMoiDonBaoHanh = this.themMoiDonBaoHanh.filter((d: any) => d.tenSanPham !== this.tenSanPham);
    for (let i = 0; i < this.themMoiDonBaoHanh.length; i++) {
      this.donBaoHanh.slTiepNhan =
        Number(this.donBaoHanh.slTiepNhan) +
        Number(this.themMoiDonBaoHanh[i].slDoiMoi) +
        Number(this.themMoiDonBaoHanh[i].slSuaChua) +
        Number(this.themMoiDonBaoHanh[i].slKhongBaoHanh);
    }
    document.getElementById('modal-confirm-add')!.style.display = 'none';
  }

  closeModalConfirmAdd(): void {
    this.isModalOpenConfirmAdd = false;
    document.getElementById('modal-confirm-add')!.style.display = 'none';
  }

  xacNhanPhanLoai(): void {
    const today = dayjs().startOf('second');
    this.themMoiPhanLoaiChiTietTiepNhan = [];
    this.chiTietDonBaoHanh = [];
    // xử lý dữ liệu để lưu vào DB
    // loại bỏ các phẩn tử không có tên sản phẩm
    this.resultChiTietSanPhamTiepNhans = this.resultChiTietSanPhamTiepNhans.filter(item => item.tenSanPham !== '');
    //cập nhật thông tin sản phẩm trong chi tiết sản phẩm tiếp nhận
    for (let i = 0; i < this.resultChiTietSanPhamTiepNhans.length; i++) {
      for (let j = 0; j < this.danhSachSanPham.length; j++) {
        if (this.resultChiTietSanPhamTiepNhans[i].tenSanPham === this.danhSachSanPham[j].name) {
          const item: IChiTietSanPhamTiepNhan = {
            id: this.resultChiTietSanPhamTiepNhans[i].id,
            soLuongKhachHang: this.resultChiTietSanPhamTiepNhans[i].slKhachGiao,
            idKho: '0',
            idBienBan: '0',
            tongLoiKiThuat: 0,
            tongLoiLinhDong: 0,
            ngayPhanLoai: today,
            slTiepNhan: this.resultChiTietSanPhamTiepNhans[i].slTiepNhan,
            slTon: 0,
            tinhTrangBaoHanh: this.resultChiTietSanPhamTiepNhans[i].tinhTrangBaoHanh,
            trangThaiIn: null,
            sanPham: this.danhSachSanPham[j],
            donBaoHanh: this.donBaoHanh,
          };
          if (this.resultChiTietSanPhamTiepNhans[i].tinhTrangBaoHanh) {
            item.tinhTrangBaoHanh = 'true';
          } else {
            item.tinhTrangBaoHanh = 'false';
          }
          this.chiTietDonBaoHanh.push(item);
          break;
        }
      }
    }
    // console.log(this.chiTietDonBaoHanh);
    if (this.isChanged === true) {
      document.getElementById('modal-confirm-save')!.style.display = 'block';
    } else {
      this.http.put<any>(`${this.updateDonBaoHanhUrl}`, this.donBaoHanh).subscribe(() => {
        setTimeout(() => {
          this.openPopupNoti('Hoàn thành phân loại');
          window.location.reload();
        }, 1000);
      });
    }
  }

  confirmSave(): void {
    document.getElementById('modal-confirm-save')!.style.display = 'none';
    this.http.put<any>(`${this.updateDonBaoHanhUrl}`, this.donBaoHanh).subscribe(() => {
      // cập nhật thông tin chi tiết sản phẩm tiếp nhận
      this.http.put<any>(this.putChiTietSanPhamTiepNhanUrl, this.chiTietDonBaoHanh).subscribe(res => {
        // console.log('check ket qua chi tiet phan loaij: ', res);
        // tạo danh sách phân loại sau khi cập nhật thông tin chi tiết sản phẩm tiếp nhận
        setTimeout(() => {
          for (let i = 0; i < res.length; i++) {
            for (let k = 0; k < this.danhSachTinhTrangs.length; k++) {
              // trường hợp đổi mới
              if (this.danhSachTinhTrangs[k].id === 1) {
                const item1: IPhanLoaiChiTietTiepNhan = {
                  id: 0,
                  soLuong: this.resultChiTietSanPhamTiepNhans[i].slDoiMoi,
                  chiTietSanPhamTiepNhan: res[i],
                  danhSachTinhTrang: this.danhSachTinhTrangs[k],
                };
                this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
              }
              // trường hợp sửa chữa
              if (this.danhSachTinhTrangs[k].id === 2) {
                const item1: IPhanLoaiChiTietTiepNhan = {
                  id: 0,
                  soLuong: this.resultChiTietSanPhamTiepNhans[i].slSuaChua,
                  chiTietSanPhamTiepNhan: res[i],
                  danhSachTinhTrang: this.danhSachTinhTrangs[k],
                };
                this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
              }
              //trường hợp không bảo hành
              if (this.danhSachTinhTrangs[k].id === 3) {
                const item1: IPhanLoaiChiTietTiepNhan = {
                  id: 0,
                  soLuong: this.resultChiTietSanPhamTiepNhans[i].slKhongBaoHanh,
                  chiTietSanPhamTiepNhan: res[i],
                  danhSachTinhTrang: this.danhSachTinhTrangs[k],
                };
                this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
              }
            }
          }
          this.http.put<any>(this.putPhanLoaiChiTietTiepNhanUrl, this.themMoiPhanLoaiChiTietTiepNhan).subscribe(() => {
            this.isChanged = false;
            setTimeout(() => {
              // console.log('Chi tiet don bao hanh: ', this.chiTietDonBaoHanh);
              // console.log('Phan loai chi tiet don hang tiep nhan: ', this.themMoiPhanLoaiChiTietTiepNhan);
              window.location.reload();
            }, 500);
          });
        }, 500);
        this.openPopupNoti('Hoàn thành phân loại');
      });
    });
  }

  closeModalConfirmSave(): void {
    document.getElementById('modal-confirm-save')!.style.display = 'none';
  }
  getColor(value: number, index: any): void {
    // console.log('value', value);
    if (value >= 0 && value < 40) {
      document.getElementById(index as string)!.style.accentColor = 'red';
    } else if (value >= 40 && value < 70) {
      document.getElementById(index as string)!.style.accentColor = 'yellow';
    } else if (value > 70) {
      document.getElementById(index as string)!.style.accentColor = 'green';
    }
  }
  angularGridReady(angularGrid: any): void {
    this.angularGrid = angularGrid;
    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    console.log('onGridMenuColumnsChanged11111', this.angularGrid);
  }
  onMenuShow(e: any): void {
    console.log('onGridMenuColumnsChanged', e);
  }
  onColumnsChanged(e: any): void {
    console.log('onGridMenuColumnsChanged', e);
  }
}
