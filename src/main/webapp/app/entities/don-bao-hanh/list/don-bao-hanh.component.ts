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
  CompositeEditorModalType,
  SlickCompositeEditor,
  Formatter,
} from 'angular-slickgrid';
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
  putPhanLoaiChiTietTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/don-bao-hanh/phan-loai/update-phan-loai-chi-tiet-tiep-nhan');
  putChiTietSanPhamTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/don-bao-hanh/phan-loai/update-chi-tiet-san-pham-tiep-nhan');
  hoanThanhPhanLoaiUrl = this.applicationConfigService.getEndpointFor('api/don-bao-hanh/hoan-thanh-phan-loai');
  // biến lưu danh sách dữ liệu
  donBaoHanhs: any[] = [];
  khachHangs?: IKhachHang[];
  isLoading = false;
  danhSachTinhTrangs: IDanhSachTinhTrang[] = [];
  danhSachSanPham: ISanPham[] = [];
  danhSachPhanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan[] = [];
  danhSachGocPopupPhanLoai:any[] = [];
  danhSachBienBan: any[]=[];
  // biến lưu thông tin thêm mới
  themMoiDonBaoHanh: any;
  donBaoHanh: any;
  chiTietDonBaoHanh: IChiTietSanPhamTiepNhan[] = [];
  themMoiPhanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan[] = [];
  //------------------------------------------------
  message = '';
  flashAlertType = 'info';
  columnDefinitions?: IDonBaoHanh[];
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  angularGrid?: AngularGridInstance;
  detailViewRowCount = 9;
  isCompositeDisabled = false;
  compositeEditorInstance!: SlickCompositeEditor;
  danhSachSanPhams?: ISanPham[];
  phanLoaiChiTietTiepNhans?: IPhanLoaiChiTietTiepNhan[];
  phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan[] = [];
  chiTietSanPhamTiepNhans: IChiTietSanPhamTiepNhan[] = [];
  danhSachTinhTrang?: IDanhSachTinhTrang[];
  resultChiTietSanPhamTiepNhans: any[] = [];

  formSearch = this.formBuilder.group({});
  // biến lưu thông tin từng đơn bảo hành 
  thongTinDonBaoHanh: any;
  title = 'Quản lý mã tiếp nhận';

  predicate!: string;
  ascending!: boolean;

  idPhanTich: number | null | undefined;
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
  hours='';
  minutes = '';
  seconds='';
  maBienBan='';
  loaiBienBan='';
  idDonBaoHanh='';
  //lưu thông tin import
  ExcelData: any;
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

  constructor(
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
    protected sanPhamService: SanPhamService
  ) { }

  buttonBBTN: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-primary" style="height: 30px">TN</button>`
      : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };

  // buttonBBKN: Formatter<any> = (_row, _cell, value) =>
  //   value ? `<button class="btn btn-primary">KN</button>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };

  // buttonBBTL: Formatter<any> = (_row, _cell, value) =>
  //   value ? `<button class="btn btn-primary">TL</button>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };
  buttonPL: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-primary" style="height: 30px">PL</button>`
      : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };

  loadAll(): void {
    this.isLoading = true;
    this.donBaoHanhService.query().subscribe({
      next: (res1: HttpResponse<IDonBaoHanh[]>) => {
        this.isLoading = false;
        this.donBaoHanhs = res1.body ?? [];
        // console.log('don bao hanh', this.donBaoHanhs);
        // lấy danh sách phân loại
        this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res => {
          this.phanLoaiChiTietTiepNhans = res;
          for (let i = 0; i < this.donBaoHanhs.length; i++) {
            for (let k = 0; k < this.donBaoHanhs[i].chiTietSanPhamTiepNhans?.length; k++) {
              for (let j = 0; j < this.phanLoaiChiTietTiepNhans!.length; j++) {
                if (this.donBaoHanhs[i].chiTietSanPhamTiepNhans![k].id === this.phanLoaiChiTietTiepNhans![j].chiTietSanPhamTiepNhan?.id) {
                  // console.log({
                  //   a: this.donBaoHanhs[i].chiTietSanPhamTiepNhans![k].id,
                  //   b: this.phanLoaiChiTietTiepNhans![j].chiTietSanPhamTiepNhan?.id,
                  // });
                  // console.log({ soLuong: this.donBaoHanhs[i].slTiepNhan, phanLoai: this.phanLoaiChiTietTiepNhans![j].soLuong });
                  this.donBaoHanhs[i].slTiepNhan += this.phanLoaiChiTietTiepNhans![j].soLuong;
                }
              }
            }
          }
          sessionStorage.setItem('phan loai chi tiet tiep nhan', JSON.stringify(res));
          console.log('phan loai chi tiet tiep nhan', res);
        });
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  ngOnInit(): void {
    const result = sessionStorage.getItem('sessionStorage');
    console.log('Test dữ liệu từ session', JSON.parse(result as string));
    const item: any = JSON.parse(result as string);
    // console.log(item.id);

    this.columnDefinitions = [];
    this.columnDefinitions1 = [
      {
        id: 'bbtn',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonBBTN,
        maxWidth: 50,
        minWidth: 50,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.idDonBaoHanh = args.dataContext.id;
          this.openPopupBBTN(args.dataContext.id);
          console.log('id? ', args.dataContext.id);
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },
      {
        id: 'phanLoai',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonPL,
        maxWidth: 50,
        minWidth: 50,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openPopupPhanLoai(args.dataContext.id);
          console.log('idPL? ', args.dataContext);
          this.donBaoHanh = args.dataContext
          this.donBaoHanh.nguoiTaoDon = this.account?.login
          // this.dataPL = args.dataContext;
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
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
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openPopupEdit(args.dataContext.id);
          console.log('edit', args.dataContext.id);
          sessionStorage.setItem('sessionStorage', JSON.stringify(args));
          // this.alertWarning = `Editing: ${args.dataContext.title}`
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },

      {
        id: 'delete',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        // params: { iconCssClass: 'fa fa-trash pointer' },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(args);
          if (confirm('Are u sure?')) {
            this.angularGrid?.gridService.deleteItemById(args.dataContext.id);
          }
        },
      },

      {
        id: 'id',
        name: 'Mã tiếp nhận',
        field: 'id',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },

      {
        id: 'khachHang',
        name: 'Khách hàng',
        field: 'khachHang.tenKhachHang',
        formatter: Formatters.complexObject,
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
        name: 'Ngày tạo đơn',
        field: 'ngayTiepNhan',
        dataKey: 'ngayTiepNhan',
        sortable: true,
        filterable: true,
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
        id: 'ngaykhkb',
        name: 'Ngày tiếp nhận',
        field: 'ngaykhkb',
        dataKey: 'ngaykhkb',
        sortable: true,
        filterable: true,
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
        id: 'trangThaiIn',
        name: 'Trạng thái in',
        field: 'trangThaiIn',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
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
    ];
    this.gridOptions1 = {
      enableAutoResize: true,
      enableSorting: true,
      enableFiltering: true,
      enablePagination: true,
      enableColumnPicker: true,
      enableRowDetailView: true,
      rowDetailView: {
        columnIndexPosition: 3,
        process: items => this.simulateServerAsyncCall(items),
        loadOnce: false,
        singleRowExpand: true,
        useRowClick: true,
        panelRows: 10,
        // Preload View Component
        preloadComponent: RowDetailPreloadComponent,
        viewComponent: RowDetailViewComponent,
        parent: true,
      },
      pagination: {
        pageSizes: [30, 50, 100],
        pageSize: 30,
      },
      columnPicker: {
        hideForceFitButton: true,
        hideSyncResizeButton: true,
        onColumnsChanged(e, args) {
          console.log(args.visibleColumns);
        },
      },
      editable: true,
      enableCellNavigation: true,
      gridHeight: 600,
      gridWidth: 1800,
    };
    this.loadAll();
    this.getKhachHangs();
    this.getPhanLoaiChiTietTiepNhan();
    this.getDanhSachTinhTrang();
    this.getSanPhams();
    this.getDanhSachBienBan();
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
  }

  simulateServerAsyncCall(item: any): Promise<unknown> {
    sessionStorage.setItem('sessionStorage', JSON.stringify(item));
    return new Promise(resolve => {
      setTimeout(() => {
        const itemDetail = item;
        console.log(item);

        // resolve the data after delay specified
        resolve(itemDetail);
      }, 1000);
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
  getDanhSachBienBan():void{
    this.http.get<any>('api/ma-bien-bans').subscribe(res=>{
      console.log("danh sach bien ban: ",res);
    })
  }
  // lấy danh sách sản phẩm
  getSanPhams(): void {
    this.sanPhamService.query().subscribe({
      next: (res: HttpResponse<ISanPham[]>) => {
        this.danhSachSanPham = res.body ?? [];
        console.log("danh sach san pham:", this.danhSachSanPham);
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }
  getPhanLoaiChiTietTiepNhan(): void {
    this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(resPLTN => {
      this.phanLoaiChiTietTiepNhans = resPLTN;
      sessionStorage.setItem('sessionStorage', JSON.stringify(resPLTN));
      console.log('sessionStorage', resPLTN);
    });
  }
  //Lấy danh sách khách hàng
  getKhachHangs(): void {
    this.khachHangService.query().subscribe({
      next: (res: HttpResponse<IKhachHang[]>) => {
        this.khachHangs = res.body ?? [];
        console.log("danh sách khách hàng: ", this.khachHangs)
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }
  // lấy danh sách tình trạng
  getDanhSachTinhTrang(): void {
    this.danhSachTinhTrangService.query().subscribe({
      next: (res: HttpResponse<IDanhSachTinhTrang[]>) => {
        this.danhSachTinhTrangs = res.body ?? [];
        console.log("danh sach tinh trang:", this.danhSachTinhTrangs);
      }
    })
  }
  addRow(): void {
    const newRow = {
      id: 0,
      idMaTiepNhan: this.idMaTiepNhan,
      tenSanPham: this.tenSanPham,
      soLuong: this.soLuong,
      doiMoi: this.doiMoi,
      suaChua: this.suaChua,
      khongBaoHanh: this.khongBaoHanh,
      soLuongDaNhan: this.soLuongDaNhan,
    };
    this.listOfMaTiepNhan = [...this.listOfMaTiepNhan, newRow];
    console.log('them dong', this.listOfMaTiepNhan);
  }
  // ================================= popup chỉnh sửa thông tin ==================================
  openPopupEdit(id: number): void {
    this.popupChinhSuaThongTin = true;
    // lấy thông tin đơn bảo hành
    const result = sessionStorage.getItem(`TiepNhan ${id.toString()}`);
    console.log("chinh sua don bao hanh: ", this.khachHangs)
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
    console.log(tenKhachHang)
    // cập nhật lại thông tin khách hàng
    for (let i = 0; i < this.khachHangs!.length; i++) {
      if (this.khachHangs![i].tenKhachHang === tenKhachHang) {
        this.thongTinDonBaoHanh.khachHang = this.khachHangs![i];
        console.log({ goc: this.khachHangs![i], capNhat: this.thongTinDonBaoHanh.khachHang })
        console.log("cập nhật: ", this.thongTinDonBaoHanh)
      }
    }
  }
  xacNhanCapNhatDonBaoHanh(): void {
    this.http.put<any>(this.updateDonBaoHanhUrl, this.thongTinDonBaoHanh).subscribe(() => { console.log("thanh cong") });
    window.location.reload()
  }

  // ========================================= popup thêm mới đơn bảo hành và chi tiết đơn bảo hành =======================================
  openPopupThemMoi(): void {
    this.popupThemMoi = true;
    //reset dữ liệu
    this.themMoiDonBaoHanh = [];
    this.themMoiPhanLoaiChiTietTiepNhan = [];
    this.chiTietDonBaoHanh = [];
    this.donBaoHanh = { khachHang: { tenKhachHang: '' }, ngayTiepNhan: new Date, nguoiTaoDon: this.account?.login, trangThai: 'Chờ phân loại' }
  }
  checkDuLieuThemMoi(tenKhachHang: string): void {
    this.isChanged = true;
    // cập nhật lại thông tin khách hàng
    for (let i = 0; i < this.khachHangs!.length; i++) {
      if (this.khachHangs![i].tenKhachHang === tenKhachHang) {
        this.donBaoHanh.khachHang = this.khachHangs![i];
        console.log({ goc: this.khachHangs![i], capNhat: this.donBaoHanh.khachHang })
        console.log("cập nhật: ", this.donBaoHanh)
      }
    }
    console.log("check dữ liệu thêm mới: ", this.donBaoHanh)
  }
  // thêm mới đơn bảo hành và chi tiết
  postDonBaoHanh(): void {
    // thêm mới đơn bảo hành
    this.http.post<any>(this.postDonBaoHanhUrl, this.donBaoHanh).subscribe(res => {
      console.log("donbao hanh:", res)
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
          tinhTrangBaoHanh: '',
          trangThaiIn: null,
          sanPham: this.themMoiDonBaoHanh[i].sanPham,
          donBaoHanh: res,
        }
        this.chiTietDonBaoHanh.push(item);
      }
      console.log(this.chiTietDonBaoHanh)
      this.http.post<any>(this.postChiTietDonBaoHanhUrl, this.chiTietDonBaoHanh).subscribe(res1 => {
        console.log("chi tiet don bao hanh", res1)
        //Thêm mới phân loại chi tieets đơn hàng tiếp nhận theo từng trạng thái tách ra từ danh sách import
        for (let i = 0; i < res1.length; i++) {
          for (let j = 0; j < this.danhSachTinhTrangs.length; j++) {
            if (this.danhSachTinhTrangs[j].id === 1) {
              const item1: IPhanLoaiChiTietTiepNhan = {
                soLuong: this.themMoiDonBaoHanh[i].slDoiMoi,
                chiTietSanPhamTiepNhan: res1[i],
                danhSachTinhTrang: this.danhSachTinhTrangs[j]
              }
              this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
            }
            if (this.danhSachTinhTrangs[j].id === 2) {
              const item1: IPhanLoaiChiTietTiepNhan = {
                soLuong: this.themMoiDonBaoHanh[i].slSuaChua,
                chiTietSanPhamTiepNhan: res1[i],
                danhSachTinhTrang: this.danhSachTinhTrangs[j]
              }
              this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
            }
            if (this.danhSachTinhTrangs[j].id === 3) {
              const item1: IPhanLoaiChiTietTiepNhan = {
                soLuong: this.themMoiDonBaoHanh[i].slKhongBaoHanh,
                chiTietSanPhamTiepNhan: res1[i],
                danhSachTinhTrang: this.danhSachTinhTrangs[j]
              }
              this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
            }
          }
        }
        // thêm mới phân loại chi tiết tiếp nhận đơn bảo hành
        this.http.post<any>(this.postPhanLoaiChiTietTiepNhanUrl, this.themMoiPhanLoaiChiTietTiepNhan).subscribe(res2 => {
          console.log("thành công", res2);
        })
        console.log("phân loại chi tiết tiếp nhận: ", this.themMoiPhanLoaiChiTietTiepNhan)
      })
    });
    setTimeout(()=>{
      alert("thêm mới thành công")
      // window.location.reload();
    },2000)
  }
  //cập nhật thông tin sl Tổng tiếp nhận đơn bảo hành và sl tiếp nhận của chi tiết đơn bảo hành
  updateChiTietDonBaoHanhInfo(slDoiMoi: any, slSuaChua: any, slKhongBaoHanh: any, slTiepNhan: any, index: number): void {
    this.donBaoHanh.slTiepNhan = 0;
    // sl tiếp nhận của chi tiết đơn bảo hành
    slTiepNhan = Number(slDoiMoi) + Number(slSuaChua) + Number(slKhongBaoHanh);
    //cập nhật thông tin sl Tổng tiếp nhận đơn bảo hành
    for (let i = 0; i < this.themMoiDonBaoHanh.length; i++) {
      this.donBaoHanh.slTiepNhan = Number(this.donBaoHanh.slTiepNhan) + Number(this.themMoiDonBaoHanh[i].slDoiMoi) + Number(this.themMoiDonBaoHanh[i].slSuaChua) + Number(this.themMoiDonBaoHanh[i].slKhongBaoHanh);
      if (index === i) {
        this.themMoiDonBaoHanh[i].slNhan = slTiepNhan;
      }
    }
    console.log({ slTiepNhan1: slTiepNhan, danhsach: this.themMoiDonBaoHanh })
  }
  deleteRow(tenSanPham: any): void {
    if (confirm('Bạn chắc chắn muốn xóa thông số này?') === true) {
      this.donBaoHanh.slTiepNhan = 0;
      this.themMoiDonBaoHanh = this.themMoiDonBaoHanh.filter((d: any) => d.tenSanPham !== tenSanPham)
      // cập nhật lại tổng số lượng tiếp nhận
      for (let i = 0; i < this.themMoiDonBaoHanh.length; i++) {
        this.donBaoHanh.slTiepNhan = Number(this.donBaoHanh.slTiepNhan) + Number(this.themMoiDonBaoHanh[i].slDoiMoi) + Number(this.themMoiDonBaoHanh[i].slSuaChua) + Number(this.themMoiDonBaoHanh[i].slKhongBaoHanh);
      }
    }
  }
  //=============================================== Popup phân loại ================================================
  closePopupPhanLoai(): void {
    this.popupPhanLoai = false;
  }
  openPopupPhanLoai(id: number): void {
    this.popupPhanLoai = true;
    setTimeout(() => {
      const result = sessionStorage.getItem(`TiepNhan ${id.toString()}`);
      this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
      this.danhSachGocPopupPhanLoai = JSON.parse(result as string);
    }, 2000)

  }
  updateTenSanPham():void{
    this.isChanged = true;
  }
  //Cập nhật thông tin trong popup phân loại
  updatePopupPhanLoai(index: number): void {
    this.isChanged = true;
    this.donBaoHanh.slTiepNhan = 0;
    // tính toán số lượng tiếp nhận
    this.resultChiTietSanPhamTiepNhans[index].slTiepNhan = Number(this.resultChiTietSanPhamTiepNhans[index].slDoiMoi) + Number(this.resultChiTietSanPhamTiepNhans[index].slSuaChua) + Number(this.resultChiTietSanPhamTiepNhans[index].slKhongBaoHanh);
    // gán vào dữ liệu gốc
    for(let i = 0;i<this.danhSachGocPopupPhanLoai.length;i++){
      if(this.danhSachGocPopupPhanLoai[i].tenSanPham === this.resultChiTietSanPhamTiepNhans[index].tenSanPham){
        this.danhSachGocPopupPhanLoai[i].slDoiMoi = this.resultChiTietSanPhamTiepNhans[index].slDoiMoi;
        this.danhSachGocPopupPhanLoai[i].slSuaChua = this.resultChiTietSanPhamTiepNhans[index].slSuaChua;
        this.danhSachGocPopupPhanLoai[i].slKhongBaoHanh = this.resultChiTietSanPhamTiepNhans[index].slKhongBaoHanh;
        this.danhSachGocPopupPhanLoai[i].slTiepNhan = this.resultChiTietSanPhamTiepNhans[index].slTiepNhan;
      }
      //Cập nhật thông tin số lượng tổng tiếp nhận
      this.donBaoHanh.slTiepNhan = Number(this.donBaoHanh.slTiepNhan) + Number(this.danhSachGocPopupPhanLoai[i].slTiepNhan);
    }
    console.log("check: ", this.resultChiTietSanPhamTiepNhans[index]);
  }
  xacNhanPhanLoai(): void {
    const today = dayjs().startOf('second');
    this.themMoiPhanLoaiChiTietTiepNhan = [];
    this.chiTietDonBaoHanh = [];
    // xử lý dữ liệu để lưu vào DB
    //cập nhật thông tin sản phẩm trong chi tiết sản phẩm tiếp nhận
    for (let i = 0; i < this.resultChiTietSanPhamTiepNhans.length; i++) {
      for (let j = 0; j < this.danhSachSanPham.length; j++) {
        if (this.resultChiTietSanPhamTiepNhans[i].tenSanPham === this.danhSachSanPham[j].name) {
          const item: IChiTietSanPhamTiepNhan = {
            id:this.resultChiTietSanPhamTiepNhans[i].id,
            soLuongKhachHang: this.resultChiTietSanPhamTiepNhans[i].slKhachGiao,
            // idKho:'0',
            // idBienBan:'0',
            // tongLoiKiThuat:0,
            // tongLoiLinhDong:0,
            ngayPhanLoai: today,
            slTiepNhan: this.resultChiTietSanPhamTiepNhans[i].slTiepNhan,
            // slTon:0,
            // tinhTrangBaoHanh:'',
            // trangThaiIn:null,
            sanPham: this.danhSachSanPham[j],
            // donBaoHanh:this.donBaoHanh,
          }
          this.chiTietDonBaoHanh.push(item);
          break;
        }
      }
      /**           cập nhật thông tin phân loại chi tiết tiếp nhận
       * Bước 1: lấy dữ liệu danh sách phân loại chi tiết tiếp nhận
       * Bước 2: lọc thông tin theo danh sách chi tiết sản phẩm tiếp nhận (lọc theo id)
       * Bước 3: tạo 1 danh sách mới chứa thông tin theo sản phẩm đơn tiếp nhận
       */
      const results = sessionStorage.getItem('phanLoaiChiTietTiepNhan');
      this.danhSachPhanLoaiChiTietTiepNhan = JSON.parse(results!);
      for (let k = 0; k < this.danhSachPhanLoaiChiTietTiepNhan.length; k++) {
        if (this.danhSachPhanLoaiChiTietTiepNhan[k].chiTietSanPhamTiepNhan!.id === this.resultChiTietSanPhamTiepNhans[i].id && this.danhSachPhanLoaiChiTietTiepNhan[k].danhSachTinhTrang!.id === 1) {
          const item1: IPhanLoaiChiTietTiepNhan = {
            id:this.danhSachPhanLoaiChiTietTiepNhan[k].id,
            soLuong: this.resultChiTietSanPhamTiepNhans[i].slDoiMoi,
            chiTietSanPhamTiepNhan: this.danhSachPhanLoaiChiTietTiepNhan[k].chiTietSanPhamTiepNhan,
            danhSachTinhTrang:this.danhSachPhanLoaiChiTietTiepNhan[k].danhSachTinhTrang
          }
          this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
      
        }
        if (this.danhSachPhanLoaiChiTietTiepNhan[k].chiTietSanPhamTiepNhan!.id === this.resultChiTietSanPhamTiepNhans[i].id && this.danhSachPhanLoaiChiTietTiepNhan[k].danhSachTinhTrang!.id === 2) {
          const item1: IPhanLoaiChiTietTiepNhan = {
            id:this.danhSachPhanLoaiChiTietTiepNhan[k].id,
            soLuong: this.resultChiTietSanPhamTiepNhans[i].slSuaChua,
            chiTietSanPhamTiepNhan: this.danhSachPhanLoaiChiTietTiepNhan[k].chiTietSanPhamTiepNhan,
            danhSachTinhTrang:this.danhSachPhanLoaiChiTietTiepNhan[k].danhSachTinhTrang
          }
          this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
      
        }
        if (this.danhSachPhanLoaiChiTietTiepNhan[k].chiTietSanPhamTiepNhan!.id === this.resultChiTietSanPhamTiepNhans[i].id && this.danhSachPhanLoaiChiTietTiepNhan[k].danhSachTinhTrang!.id === 3) {
          const item1: IPhanLoaiChiTietTiepNhan = {
            id:this.danhSachPhanLoaiChiTietTiepNhan[k].id,
            soLuong: this.resultChiTietSanPhamTiepNhans[i].slKhongBaoHanh,
            chiTietSanPhamTiepNhan: this.danhSachPhanLoaiChiTietTiepNhan[k].chiTietSanPhamTiepNhan,
            danhSachTinhTrang:this.danhSachPhanLoaiChiTietTiepNhan[k].danhSachTinhTrang
          }
          this.themMoiPhanLoaiChiTietTiepNhan.push(item1);
      
        }
      }
    }
    console.log("Chi tiet don bao hanh: ", this.chiTietDonBaoHanh);
    console.log("Phan loai chi tiet don hang tiep nhan: ", this.themMoiPhanLoaiChiTietTiepNhan);
    this.donBaoHanh.trangThai = 'Chờ phân tích';
    // cập nhật thông tin đơn bảo hành
    if(this.isChanged === true){
      if(confirm("Xác nhận lưu sự thay đổi ?")=== true){
        this.http.put<any>(`${this.updateDonBaoHanhUrl}`, this.donBaoHanh).subscribe(() => {
          // cập nhật thông tin chi tiết sản phẩm tiếp nhận
          this.http.put<any>(this.putChiTietSanPhamTiepNhanUrl, this.chiTietDonBaoHanh).subscribe((res) => {
            // cập nhật thông tin phân loại chi tiết tiếp nhận
            this.http.put<any>(this.putPhanLoaiChiTietTiepNhanUrl, this.themMoiPhanLoaiChiTietTiepNhan).subscribe(() => {
              this.isChanged =false;
              setTimeout(()=>{
                alert('Hoàn thành phân loại');
                window.location.reload()
              },1000)
            })
          })
        });
      }
    }else{
      this.http.put<any>(`${this.updateDonBaoHanhUrl}`, this.donBaoHanh).subscribe(() => {
        setTimeout(()=>{
          alert('Hoàn thành phân loại');
          window.location.reload()
        },1000)
      })
    }
  }
  searchInPopupPhanLoai():void{
    this.resultChiTietSanPhamTiepNhans = this.danhSachGocPopupPhanLoai.filter(a=>a.tenSanPham.includes(this.searchKey))
  }
  //==================================================   Popup biên bản tiếp nhận =====================================================
  openPopupBBTN(id: number): void {
    this.popupInBBTN = true;
    // lấy dữ liệu từ sessision
    const result = sessionStorage.getItem(`TiepNhan ${id.toString()}`);
    this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
  }

  openPopupInBBTN1(): void {
    this.maBienBan = '';
    this.loaiBienBan = 'Tiếp nhận'
    for(let i =0;i<this.danhSachBienBan.length;i++){
      if(this.loaiBienBan === this.danhSachBienBan[i].loaiBienBan && this.idDonBaoHanh === this.danhSachBienBan[i].donBaoHanh.id){
        this.maBienBan = this.danhSachBienBan[i].maBienBan;
      }
    }
    if(this.maBienBan){
      const date = new Date;
      this.year = date.getFullYear().toString().slice(-2)
      const getMonth = date.getMonth() + 1;
      if(getMonth < 10){
        this.month = `0${getMonth}`;
      }else{
        this.month = getMonth.toString()
      }
      if(date.getDate() < 10){
        this.date = `0${date.getDate()}`;
      }else{
        this.date = date.getDate().toString()
      }
      if(date.getHours() < 10){
        this.hours = `0${date.getHours()}`;
      }else{
        this.hours = date.getHours().toString()
      }
      if(date.getMinutes() < 10){
        this.minutes = `0${date.getMinutes()}`;
      }else{
        this.minutes = date.getMinutes().toString()
      }
      if(date.getSeconds() < 10){
        this.seconds = `0${date.getSeconds()}`;
      }else{
        this.seconds = date.getSeconds().toString()
      }
      if(this.maBienBan === ''){
        this.maBienBan = `TN${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`
      }
    }
    this.popupInBBTN1 = true;
  }

  openPopupInBBTN2(): void {
    const date = new Date;
    this.year = date.getFullYear().toString().slice(-2)
    const getMonth = date.getMonth() + 1;
    if(getMonth < 10){
      this.month = `0${getMonth}`;
    }else{
      this.month = getMonth.toString()
    }
    if(date.getDate() < 10){
      this.date = `0${date.getDate()}`;
    }else{
      this.date = date.getDate().toString()
    }
    if(date.getHours() < 10){
      this.hours = `0${date.getHours()}`;
    }else{
      this.hours = date.getHours().toString()
    }
    if(date.getMinutes() < 10){
      this.minutes = `0${date.getMinutes()}`;
    }else{
      this.minutes = date.getMinutes().toString()
    }
    if(date.getSeconds() < 10){
      this.seconds = `0${date.getSeconds()}`;
    }else{
      this.seconds = date.getSeconds().toString()
    }
    if(this.maBienBan === ''){
      this.maBienBan = `TN${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`
    }
    this.popupInBBTN2 = true;
  }

  openPopupInBBTN3(): void {
    const date = new Date;
    this.year = date.getFullYear().toString().slice(-2)
    const getMonth = date.getMonth() + 1;
    if(getMonth < 10){
      this.month = `0${getMonth}`;
    }else{
      this.month = getMonth.toString()
    }
    if(date.getDate() < 10){
      this.date = `0${date.getDate()}`;
    }else{
      this.date = date.getDate().toString()
    }
    if(date.getHours() < 10){
      this.hours = `0${date.getHours()}`;
    }else{
      this.hours = date.getHours().toString()
    }
    if(date.getMinutes() < 10){
      this.minutes = `0${date.getMinutes()}`;
    }else{
      this.minutes = date.getMinutes().toString()
    }
    if(date.getSeconds() < 10){
      this.seconds = `0${date.getSeconds()}`;
    }else{
      this.seconds = date.getSeconds().toString()
    }
    if(this.maBienBan === ''){
      this.maBienBan = `TN${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`
    }
    this.popupInBBTN3 = true;
  }

  openPopupInBBTN4(): void {
    const date = new Date;
    this.year = date.getFullYear().toString().slice(-2)
    const getMonth = date.getMonth() + 1;
    if(getMonth < 10){
      this.month = `0${getMonth}`;
    }else{
      this.month = getMonth.toString()
    }
    if(date.getDate() < 10){
      this.date = `0${date.getDate()}`;
    }else{
      this.date = date.getDate().toString()
    }
    if(date.getHours() < 10){
      this.hours = `0${date.getHours()}`;
    }else{
      this.hours = date.getHours().toString()
    }
    if(date.getMinutes() < 10){
      this.minutes = `0${date.getMinutes()}`;
    }else{
      this.minutes = date.getMinutes().toString()
    }
    if(date.getSeconds() < 10){
      this.seconds = `0${date.getSeconds()}`;
    }else{
      this.seconds = date.getSeconds().toString()
    }
    if(this.maBienBan === ''){
      this.maBienBan = `TN${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`
    }
    this.popupInBBTN4 = true;
  }

  closePopupThemMoi(): void {
    this.popupThemMoi = false;
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
  ReadExcel(event: any): void {
    this.ExcelData = [];
    this.donBaoHanh.slTiepNhan = 0
    const file = event.target.files[0]
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file)
    fileReader.onload = (e) => {
      const workBook = XLSX.read(fileReader.result, { type: 'binary' });
      const sheetNames = workBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { header: ["maSanPham", "tenSanPham", "slKhachGiao", "slNhan", "slDoiMoi", "slSuaChua", "slKhongBaoHanh"], defval: "" });
    }
    // lọc thông tin hiển thị lên giao diện
    setTimeout(() => {
      this.ExcelData = this.ExcelData.filter((data: any) => data.slKhachGiao !== '' && data.tenSanPham !== 'Tên sản phẩm')
      for (let i = 0; i < this.ExcelData.length; i++) {
        this.ExcelData[i].sanPham = null
        for (let j = 0; j < this.danhSachSanPham.length; j++) {
          console.log(j)
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
        this.donBaoHanh.slTiepNhan = Number(this.donBaoHanh.slTiepNhan) + Number(this.ExcelData[i].slDoiMoi) + Number(this.ExcelData[i].slSuaChua) + Number(this.ExcelData[i].slKhongBaoHanh)
      }
      //lưu kết quả vào
      console.log(this.ExcelData);
      console.log('kq', this.themMoiDonBaoHanh);
      console.log(`kq tiep nhan:`, this.donBaoHanh);
    }, 1000);
  }
}
