import { IPhanTichLoi } from 'app/entities/phan-tich-loi/phan-tich-loi.model';
import { IPhanLoaiChiTietTiepNhan } from './../../phan-loai-chi-tiet-tiep-nhan/phan-loai-chi-tiet-tiep-nhan.model';
import { IDanhSachTinhTrang } from './../../danh-sach-tinh-trang/danh-sach-tinh-trang.model';
import { IChiTietSanPhamTiepNhan } from 'app/entities/chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.model';
import { SanPhamService } from './../../san-pham/service/san-pham.service';
import { ISanPham } from './../../san-pham/san-pham.model';
import { ILoi } from './../../loi/loi.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DonBaoHanhService } from 'app/entities/don-bao-hanh/service/don-bao-hanh.service';
import { FormBuilder } from '@angular/forms';
import {
  Column,
  GridOption,
  Formatters,
  OnEventArgs,
  AngularGridInstance,
  FieldType,
  Filters,
  Editors,
  LongTextEditorOption,
  Formatter,
} from 'angular-slickgrid';
import { IDonBaoHanh } from './../../don-bao-hanh/don-bao-hanh.model';
import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhanTichSanPham } from '../phan-tich-san-pham.model';
import { PhanTichSanPhamService } from '../service/phan-tich-san-pham.service';
import { PhanTichSanPhamReLoadComponent } from './phan-tich-san-pham-reload.component';
import { PhanTichMaTiepNhanComponent } from './phan-tich-ma-tiep-nhan.component';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-phan-tich-san-pham',
  templateUrl: './phan-tich-san-pham.component.html',
  styleUrls: ['../../../slickgrid-theme-booststrap.css'],
})
export class PhanTichSanPhamComponent implements OnInit {
  // danh sách url
  loisUrl = this.applicationConfigService.getEndpointFor('api/lois');
  sanPhamsUrl = this.applicationConfigService.getEndpointFor('api/san-phams');
  phanLoaiChiTietTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/phan-loai-chi-tiet-tiep-nhans');
  chiTietSanPhamTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/chi-tiet-don-bao-hanhs');
  danhSachTinhTrangUrl = this.applicationConfigService.getEndpointFor('api/danh-sach-tinh-trangs');
  loiUrl = this.applicationConfigService.getEndpointFor('api/lois');
  // biến chứa danh sách cần dùng
  donBaoHanhs: any[] = [];
  isLoading = false;
  listOfPhanTichSanPhamByPLCTTN: any[] = [];
  //---------------------------------------------------------------set up khung hien thi loi-----------------------------------------
  columnOne = 0;
  columnTwo = 0;
  columnThree = 0;
  columnDefinitions?: IDonBaoHanh[];
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  dataset1: any[] = [];
  angularGrid?: AngularGridInstance;
  lois?: ILoi[];
  danhSachSanPhams?: ISanPham[];
  resultChiTietSanPhamTiepNhans: any[] = [];
  chiTietSanPhamTiepNhans: IChiTietSanPhamTiepNhan[] = [];
  danhSachTinhTrang?: IDanhSachTinhTrang[];
  phanLoaiChiTietTiepNhans: IPhanLoaiChiTietTiepNhan[] = [];
  phanTichMaTiepNhans?: IPhanTichSanPham[];
  phanTichLoi?: IPhanTichLoi[];
  donBaoHanh1: any;
  danhSachBienBan: any[] = [];
  loaiBienBan = '';
  idDonBaoHanh = '';
  themMoiBienBan: any;
  phanTichChiTietSanPham?: { tenSanPham: string; tinhTrang: string; slTiepNhan: number; slTon: number };
  predicate!: string;
  ascending!: boolean;
  //-----------------------------------------------------------------------------------------------------------------------------------------
  @Input() searchKey = '';

  year = '';
  month = '';
  date = '';
  hours = '';
  minutes = '';
  seconds = '';
  maBienBan = '';

  //--------------------------------------------------------------------------------------------------------
  title = 'Phân tích sản phẩm';
  //danh sách Thông tin chi tiết sản phẩm phân tích
  listOfChiTietSanPhamPhanTich: any[] = [];
  // biến chứa thông tin đơn bảo hành
  donBaoHanh: any = {};

  scanLot = true;
  scanSerial = true;
  // lưu thông tin account
  account: Account | null = null;
  // biến bật tắt popup
  popupPTMTN = false;
  popupChiTietLoi = false;
  popupShowChiTietLoi = false;

  type = '';
  //biến đóng mở popup
  popupInBBTN = false;
  popupInBBTN1 = false;
  popupInBBTN2 = false;
  popupInBBTN3 = false;
  popupInBBTN4 = false;
  groupOptionsTN = false;
  groupOptionsKN = false;
  groupOptionsTL = false;

  popupInBBKN = false;
  popupInBBTL = false;
  idBBTN = 0;
  popupSelectButton = false;
  // biến chứa index của danh sách sản phẩm cần phân tích
  indexOfPhanTichSanPham = 0;
  // Biến chứa vị trí index của phần tử cần khai báo lỗi
  indexOfChiTietPhanTichSanPham = 0;
  //Biến chứa thông tin scan
  lotNumber = '';
  //Biến chứa thể loại scan
  scanType = '';
  constructor(
    protected phanTichSanPhamService: PhanTichSanPhamService,
    protected donBaoHanhService: DonBaoHanhService,
    protected sanPhamService: SanPhamService,
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient,
    protected accountService: AccountService
  ) {}

  buttonIn: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-primary fa fa-print" style="height: 28px; line-height: 14px"></button>`
      : { text: '<i class="fa fa-print" aria-hidden="true"></i>' };

  buttonPT: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-warning fa fa-pencil" style="height: 28px; line-height: 14px; width: 15px"></button>`
      : { text: '<button class="btn btn-warning fa fa-pencil" style="height: 28px; line-height: 14px"></button>' };

  buttonCTL: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-success fa fa-exclamation-triangle" style="height: 28px; line-height: 14px; "></button>`
      : { text: '<button class="btn btn-success fa fa-exclamation-triangle" style="height: 28px; line-height: 14px; "></button>' };

  loadAll(): void {
    this.isLoading = true;
    this.donBaoHanhService.query().subscribe({
      next: (res: HttpResponse<IDonBaoHanh[]>) => {
        this.isLoading = false;
        this.donBaoHanhs = res.body ?? [];
        for (let i = 0; i < this.donBaoHanhs.length; i++) {
          this.donBaoHanhs[i].tienDo = 0;
        }
        console.log('bbbb', this.donBaoHanhs);
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
        id: 'popup',
        field: 'id',
        name: 'In',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonIn,
        maxWidth: 60,
        minWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openPopupBtn();
          console.log(args);
          this.idBBTN = args.dataContext.id;
          this.showData(args.dataContext.id);
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },

      {
        id: 'popupPT',
        field: 'idPT',
        name: 'Options',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonPT,
        maxWidth: 60,
        minWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openPopupPTMTN();
          this.donBaoHanh = args.dataContext;
          // khởi tạo giá trị để lưu vào trong session
          sessionStorage.setItem('DonBaoHanh', JSON.stringify(args.dataContext));
          console.log('don bao hanh: ', this.donBaoHanh);
          this.showData(args.dataContext.id);
        },
      },

      {
        id: 'popupCTL',
        field: 'idCTL',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonCTL,
        maxWidth: 60,
        minWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openPopupShowChiTietLoi();
        },
      },
      {
        id: 'id',
        name: 'Mã tiếp nhận',
        field: 'maTiepNhan',
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
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'tenKhachHang',
        name: 'Khách hàng',
        field: 'khachHang.tenKhachHang',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,
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
        formatter: Formatters.complexObject,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },

      {
        id: 'slDaPhanTich',
        name: 'Đã xử lý',
        field: 'slDaPhanTich',
        sortable: true,
        filterable: true,
        formatter: Formatters.complexObject,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },

      {
        id: 'tienDo',
        name: 'Tiến độ',
        field: 'tienDo',
        sortable: true,
        filterable: true,
        formatter: Formatters.progressBar,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
      },

      {
        id: 'ngayTiepNhan',
        name: 'Ngày tiếp nhận',
        field: 'ngayTiepNhan',
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
          placeholder: 'search',
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
    ];
    this.gridOptions1 = {
      enableAutoResize: true,
      enableSorting: true,
      enableFiltering: true,
      enablePagination: true,
      // enableColumnPicker: true,
      // enableRowDetailView: true,
      // rowDetailView: {
      //   // đặt button ở vị trí mong muốn
      //   columnIndexPosition: 1,
      //   // hàm thực thi
      //   process: item => this.simulateServerAsyncCall(item),
      //   // chạy lệnh 1 lần , những lần sau sẽ hiển thị dữ liệu của lần chạy đầu tiên
      //   loadOnce: true,
      //   // mở rộng hàng
      //   singleRowExpand: true,
      //   // sử dụng chức năng click trên 1 hàng
      //   useRowClick: true,
      //   // số lượng hàng dùng để hiển thị thông tin của row detail
      //   panelRows: 10,
      //   // component loading
      //   preloadComponent: PhanTichSanPhamReLoadComponent,
      //   // component hiển thị row detail
      //   viewComponent: PhanTichMaTiepNhanComponent,
      //   // chức năng xác định parent
      //   parent: true,
      // },
      pagination: {
        pageSizes: [5, 10, this.donBaoHanhs.length],
        pageSize: this.donBaoHanhs.length,
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
      gridWidth: 1750,
    };
    this.loadAll();
    this.getLois();
    this.getSanPhams();
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
  }
  getPhanTichSanPhamByPLCTTN(id: number): void {
    this.http.get<any>(`api/phan-tich-san-pham/${id}`).subscribe(res => {
      this.listOfPhanTichSanPhamByPLCTTN = res;
      console.log('Danh sach phan tich san pham:', this.listOfPhanTichSanPhamByPLCTTN);
    });
  }
  //=========================================================== popup chi tiết sản phẩm phân tích ======================================================
  // hàm xử lý thông tin chi tiết sản phẩm phân tích
  showData(id: number | undefined): void {
    // lấy danh sách chi tiết sản phẩm tiếp nhận lấy theo id
    this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${id as number}`).subscribe(res => {
      this.chiTietSanPhamTiepNhans = res;
      console.log('b', res);
      // lấy danh sách tình trạng
      this.http.get<any>(this.danhSachTinhTrangUrl).subscribe(resTT => {
        this.danhSachTinhTrang = resTT;
        // sessionStorage.setItem('danhSachTinhTrang', JSON.stringify(resTT));
        // console.log('danh sách tình trạng', resTT);
        // lấy danh sách phân loại chi tiết tiếp nhận
        this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res1 => {
          this.phanLoaiChiTietTiepNhans = res1;
          // sessionStorage.setItem('phan loai chi tiet tiep nhan', JSON.stringify(res1));
          console.log('phan loai chi tiet tiep nhan', res1);
          // Khởi tạo danh sacsah result hiển thị trên giao diện
          // => gán dataset = resutl
          // khởi tạo danh sách rỗng
          const list: any[] = [];
          var count = 0;
          for (let i = 0; i < this.phanLoaiChiTietTiepNhans.length; i++) {
            for (let j = 0; j < this.chiTietSanPhamTiepNhans.length; j++) {
              if (
                this.phanLoaiChiTietTiepNhans[i].danhSachTinhTrang?.id !== 3 &&
                this.phanLoaiChiTietTiepNhans[i].chiTietSanPhamTiepNhan?.id === this.chiTietSanPhamTiepNhans[j].id
              ) {
                const item = {
                  stt: count,
                  phanLoaiChiTietTiepNhan: this.phanLoaiChiTietTiepNhans[i],
                  id: this.phanLoaiChiTietTiepNhans[i].id,
                  maTiepNhan: this.donBaoHanh.maTiepNhan,
                  sanPham: this.chiTietSanPhamTiepNhans[j].sanPham,
                  tenSanPham: this.chiTietSanPhamTiepNhans[j].sanPham?.name as string,
                  tinhTrang: this.phanLoaiChiTietTiepNhans[i].danhSachTinhTrang?.tenTinhTrangPhanLoai as string,
                  slTiepNhan: this.phanLoaiChiTietTiepNhans[i].soLuong as number,
                  slDaPhanTich: 0,
                  slConLai: 0,
                  tienDo: 0,
                  check: false,
                };
                list.push(item); // list đã có dữ liệu
                count++;
              }
            }
          }
          sessionStorage.setItem(`PhanTich ${id as number}`, JSON.stringify(list));
        });
      });
    });
    setTimeout(() => {
      this.donBaoHanh.slCanPhanTich = 0;
      // lấy dữ liệu từ sessision
      var result = sessionStorage.getItem(`PhanTich ${id as number}`);
      // dữ liệu lưu trong sessison(dạng string) -> chuyển về dạng JSON (giống arr,obj)
      this.listOfChiTietSanPhamPhanTich = JSON.parse(result as string);
      //cập nhật số lượng sản phẩm cần phân tích
      for (let i = 0; i < this.listOfChiTietSanPhamPhanTich.length; i++) {
        this.donBaoHanh.slCanPhanTich = Number(this.donBaoHanh.slCanPhanTich) + Number(this.listOfChiTietSanPhamPhanTich[i].slTiepNhan);
      }
      console.log('Danh sách chi tiết sản phẩm phân tích', this.listOfChiTietSanPhamPhanTich);
    }, 1000);
  }
  testCheck(test: any): void {
    console.log(test);
  }
  simulateServerAsyncCall(item: any): Promise<unknown> {
    // random set of names to use for more item detail
    console.log('tessst:0', item);
    // khởi tạo giá trị để lưu vào trong session
    sessionStorage.setItem('sessionStorage', JSON.stringify(item));
    // fill the template on async delay
    return new Promise(resolve => {
      setTimeout(() => {
        const itemDetail = item;
        console.log(item);
        // resolve the data after delay specified
        resolve(itemDetail);
      }, 1000);
    });
  }

  resultPopup(a: boolean, type: string): void {
    this.popupChiTietLoi = a;
    // cach 1:
    switch (type) {
      case 'lot':
        this.type = 'lot';
        break;
      case 'serial':
        this.type = 'serial';
        break;
      default:
        alert('Khoong co type nao phu hop');
    }
    // cach 2:
    // this.type = type;
  }

  resultPopupBtn(a: boolean): void {
    this.popupSelectButton = a;
  }

  resultPopupPrintBBTN(type: string): void {
    this.popupInBBTN = true;
    this.type = type;
  }

  openPopupShowChiTietLoi(): void {
    this.popupShowChiTietLoi = true;
  }

  closePopupShowChiTietLoi(): void {
    // đóng popup
    this.popupShowChiTietLoi = false;
  }

  closePopup(): void {
    this.popupChiTietLoi = false;
    this.scanLot = true;
    this.scanSerial = true;
  }

  closePopupPTMTN(): void {
    this.popupPTMTN = false;
  }

  // mở popup chọn loại biên bản
  openPopupBtn(): void {
    this.popupSelectButton = true;
  }

  openPopupPTMTN(): void {
    this.popupPTMTN = true;
  }

  // đóng popup chọn loại biên bản
  closePopupBtn(): void {
    this.popupSelectButton = false;
  }

  // mở popup biên bản tiếp nhận
  openPopupBBTN(): void {
    this.popupInBBTN = true;
    const result = sessionStorage.getItem(`TiepNhan ${this.idBBTN.toString()}`);
    // this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
    if (result === null) {
      var list1: any[] = [];
      this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${this.idBBTN}`).subscribe(res => {
        this.chiTietSanPhamTiepNhans = res;
        console.log('b', res);
        this.http.get<any>(this.danhSachTinhTrangUrl).subscribe(resTT => {
          this.danhSachTinhTrang = resTT;
          this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res1 => {
            this.phanLoaiChiTietTiepNhans = res1;
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
              };
              for (let j = 0; j < this.phanLoaiChiTietTiepNhans.length; j++) {
                if (item.id === this.phanLoaiChiTietTiepNhans[j].chiTietSanPhamTiepNhan?.id) {
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 1) {
                    item.slDoiMoi = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 2) {
                    item.slSuaChua = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 3) {
                    item.slKhongBaoHanh = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                }
              }
              list.push(item);
            }
            sessionStorage.setItem(`TiepNhan ${this.idBBTN}`, JSON.stringify(list));
          });
        });
        console.log('trường hợp 1');
      });
      // lấy dữ liệu từ sessision
      setTimeout(() => {
        var resultBBTN = sessionStorage.getItem(`TiepNhan ${this.idBBTN}`);
        // dữ liệu lưu trong sessison(dạng string) -> chuyển về dạng JSON (giống arr,obj)
        list1 = JSON.parse(resultBBTN as string);
        console.log('hien trang', JSON.parse(resultBBTN as string));
        this.resultChiTietSanPhamTiepNhans = JSON.parse(resultBBTN as string);
      }, 1000);
    } else {
      this.resultChiTietSanPhamTiepNhans = JSON.parse(result);
      console.log('trường hợp 2');
    }
  }

  openPopupInBBTN1(): void {
    this.popupInBBTN1 = true;
    const result = sessionStorage.getItem(`TiepNhan ${this.idBBTN.toString()}`);
    // this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
    if (result === null) {
      var list1: any[] = [];
      this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${this.idBBTN}`).subscribe(res => {
        this.chiTietSanPhamTiepNhans = res;
        console.log('b', res);
        this.http.get<any>(this.danhSachTinhTrangUrl).subscribe(resTT => {
          this.danhSachTinhTrang = resTT;
          this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res1 => {
            this.phanLoaiChiTietTiepNhans = res1;
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
              };
              for (let j = 0; j < this.phanLoaiChiTietTiepNhans.length; j++) {
                if (item.id === this.phanLoaiChiTietTiepNhans[j].chiTietSanPhamTiepNhan?.id) {
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 1) {
                    item.slDoiMoi = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 2) {
                    item.slSuaChua = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 3) {
                    item.slKhongBaoHanh = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                }
              }
              list.push(item);
            }
            sessionStorage.setItem(`TiepNhan ${this.idBBTN}`, JSON.stringify(list));
          });
        });
        console.log('trường hợp 1');
      });
      // lấy dữ liệu từ sessision
      setTimeout(() => {
        var resultBBTN = sessionStorage.getItem(`TiepNhan ${this.idBBTN}`);
        // dữ liệu lưu trong sessison(dạng string) -> chuyển về dạng JSON (giống arr,obj)
        list1 = JSON.parse(resultBBTN as string);
        console.log('hien trang', JSON.parse(resultBBTN as string));
        this.resultChiTietSanPhamTiepNhans = JSON.parse(resultBBTN as string);
      }, 1000);
    } else {
      this.resultChiTietSanPhamTiepNhans = JSON.parse(result);
      console.log('trường hợp 2');
    }
  }

  openPopupInBBTN2(): void {
    this.popupInBBTN2 = true;
    const result = sessionStorage.getItem(`TiepNhan ${this.idBBTN.toString()}`);
    // this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
    if (result === null) {
      var list1: any[] = [];
      this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${this.idBBTN}`).subscribe(res => {
        this.chiTietSanPhamTiepNhans = res;
        console.log('b', res);
        this.http.get<any>(this.danhSachTinhTrangUrl).subscribe(resTT => {
          this.danhSachTinhTrang = resTT;
          this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res1 => {
            this.phanLoaiChiTietTiepNhans = res1;
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
              };
              for (let j = 0; j < this.phanLoaiChiTietTiepNhans.length; j++) {
                if (item.id === this.phanLoaiChiTietTiepNhans[j].chiTietSanPhamTiepNhan?.id) {
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 1) {
                    item.slDoiMoi = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 2) {
                    item.slSuaChua = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 3) {
                    item.slKhongBaoHanh = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                }
              }
              list.push(item);
            }
            sessionStorage.setItem(`TiepNhan ${this.idBBTN}`, JSON.stringify(list));
          });
        });
        console.log('trường hợp 1');
      });
      // lấy dữ liệu từ sessision
      setTimeout(() => {
        var resultBBTN = sessionStorage.getItem(`TiepNhan ${this.idBBTN}`);
        // dữ liệu lưu trong sessison(dạng string) -> chuyển về dạng JSON (giống arr,obj)
        list1 = JSON.parse(resultBBTN as string);
        console.log('hien trang', JSON.parse(resultBBTN as string));
        this.resultChiTietSanPhamTiepNhans = JSON.parse(resultBBTN as string);
      }, 1000);
    } else {
      this.resultChiTietSanPhamTiepNhans = JSON.parse(result);
      console.log('trường hợp 2');
    }
  }

  openPopupInBBTN3(): void {
    this.popupInBBTN3 = true;
    const result = sessionStorage.getItem(`TiepNhan ${this.idBBTN.toString()}`);
    // this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
    if (result === null) {
      var list1: any[] = [];
      this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${this.idBBTN}`).subscribe(res => {
        this.chiTietSanPhamTiepNhans = res;
        console.log('b', res);
        this.http.get<any>(this.danhSachTinhTrangUrl).subscribe(resTT => {
          this.danhSachTinhTrang = resTT;
          this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res1 => {
            this.phanLoaiChiTietTiepNhans = res1;
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
              };
              for (let j = 0; j < this.phanLoaiChiTietTiepNhans.length; j++) {
                if (item.id === this.phanLoaiChiTietTiepNhans[j].chiTietSanPhamTiepNhan?.id) {
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 1) {
                    item.slDoiMoi = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 2) {
                    item.slSuaChua = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 3) {
                    item.slKhongBaoHanh = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                }
              }
              list.push(item);
            }
            sessionStorage.setItem(`TiepNhan ${this.idBBTN}`, JSON.stringify(list));
          });
        });
        console.log('trường hợp 1');
      });
      // lấy dữ liệu từ sessision
      setTimeout(() => {
        var resultBBTN = sessionStorage.getItem(`TiepNhan ${this.idBBTN}`);
        // dữ liệu lưu trong sessison(dạng string) -> chuyển về dạng JSON (giống arr,obj)
        list1 = JSON.parse(resultBBTN as string);
        console.log('hien trang', JSON.parse(resultBBTN as string));
        this.resultChiTietSanPhamTiepNhans = JSON.parse(resultBBTN as string);
      }, 1000);
    } else {
      this.resultChiTietSanPhamTiepNhans = JSON.parse(result);
      console.log('trường hợp 2');
    }
  }

  openPopupInBBTN4(): void {
    this.popupInBBTN4 = true;
    const result = sessionStorage.getItem(`TiepNhan ${this.idBBTN.toString()}`);
    // this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
    if (result === null) {
      var list1: any[] = [];
      this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${this.idBBTN}`).subscribe(res => {
        this.chiTietSanPhamTiepNhans = res;
        console.log('b', res);
        this.http.get<any>(this.danhSachTinhTrangUrl).subscribe(resTT => {
          this.danhSachTinhTrang = resTT;
          this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res1 => {
            this.phanLoaiChiTietTiepNhans = res1;
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
              };
              for (let j = 0; j < this.phanLoaiChiTietTiepNhans.length; j++) {
                if (item.id === this.phanLoaiChiTietTiepNhans[j].chiTietSanPhamTiepNhan?.id) {
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 1) {
                    item.slDoiMoi = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 2) {
                    item.slSuaChua = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                  if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 3) {
                    item.slKhongBaoHanh = this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                    item.slTiepNhan += this.phanLoaiChiTietTiepNhans[j].soLuong as number;
                  }
                }
              }
              list.push(item);
            }
            sessionStorage.setItem(`TiepNhan ${this.idBBTN}`, JSON.stringify(list));
          });
        });
        console.log('trường hợp 1');
      });
      // lấy dữ liệu từ sessision
      setTimeout(() => {
        var resultBBTN = sessionStorage.getItem(`TiepNhan ${this.idBBTN}`);
        // dữ liệu lưu trong sessison(dạng string) -> chuyển về dạng JSON (giống arr,obj)
        list1 = JSON.parse(resultBBTN as string);
        console.log('hien trang', JSON.parse(resultBBTN as string));
        this.resultChiTietSanPhamTiepNhans = JSON.parse(resultBBTN as string);
      }, 1000);
    } else {
      this.resultChiTietSanPhamTiepNhans = JSON.parse(result);
      console.log('trường hợp 2');
    }
  }

  showGroupOptionsTN(): void {
    this.groupOptionsTN = true;
  }

  showGroupOptionsKN(): void {
    this.groupOptionsKN = true;
  }

  showGroupOptionsTL(): void {
    this.groupOptionsTL = true;
  }

  openPopupInBBKN(): void {
    this.popupInBBKN = true
  }

  openPopupInBBTL(): void {
    this.popupInBBTL = true
  }

  //đóng popup biên bản tiếp nhận
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

  closePopupBBKN(): void {
    this.popupInBBKN = false;
  }

  closePopupBBTL(): void {
    this.popupInBBTL = false;
  }

  getLois(): void {
    this.http.get<any>(this.loisUrl).subscribe(res => {
      this.lois = res;
      sessionStorage.setItem('lois', JSON.stringify(res));
      console.log('loi', res);
    });
  }

  getSanPhams(): void {
    this.http.get<any>(this.sanPhamsUrl).subscribe(resSP => {
      this.danhSachSanPhams = resSP;
      console.log('san pham', resSP);
    });
  }

  // viết hàm tăng 1 giá trị khi click vào btn cộng lỗi ()
  addOne(count: number): void {
    count++;
  }

  // openPopupChiTietLoi(idChiTiet: number, idDBH: number): void {
  //   this.popupChiTietLoi = true;
  //   console.log({ 1: idChiTiet, 2: idDBH });
  //   const result: any[] = JSON.parse(sessionStorage.getItem(`PhanTich ${idDBH.toString()}`) as string);
  //   for (let i = 0; i < result.length; i++) {
  //     if (idChiTiet === result[i].id) {
  //       this.phanTichChiTietSanPham = result[i];
  //     }
  //   }
  //   console.log('khai bao loi', this.phanTichChiTietSanPham);
  // }
  //==================================================== Popup chi tiết phân tích sản phẩm và khai báo lỗi ====================================================
  openPopupChiTietLoi(id: number, index: number): void {
    this.indexOfChiTietPhanTichSanPham = 0;
    this.popupChiTietLoi = true;
    this.listOfPhanTichSanPhamByPLCTTN = [];
    this.indexOfPhanTichSanPham = index;
    // lấy danh sách chi tiết sản phẩm phân tích
    this.getPhanTichSanPhamByPLCTTN(id);
    setTimeout(() => {
      if (this.listOfPhanTichSanPhamByPLCTTN.length === 0) {
        for (let i = 0; i < this.listOfChiTietSanPhamPhanTich[index].slTiepNhan; i++) {
          const item = {
            tenSanPham: '',
            tenNhanVienPhanTich: `${this.account?.firstName as string} ${this.account?.lastName as string}`,
            theLoaiPhanTich: '',
            lotNumber: '',
            detail: '',
            soLuong: 0,
            ngayKiemTra: null,
            username: this.account?.login,
            namSanXuat: '',
            trangThai: false,
            loiKyThuat: 0,
            loiLinhDong: 0,
            phanLoaiChiTietTiepNhan: this.listOfChiTietSanPhamPhanTich[index].phanLoaiChiTietTiepNhan,
          };
          this.listOfPhanTichSanPhamByPLCTTN.push(item);
        }
        // them moi danh sach khai bao loi theo san pham
        console.log('them moi danh sach khai bao loi theo san pham:', this.listOfPhanTichSanPhamByPLCTTN);
      } else {
        //cập nhật tổng lỗi kĩ thuật và lỗi linh động
        for (let i = 0; i < this.listOfPhanTichSanPhamByPLCTTN.length; i++) {
          if (this.listOfPhanTichSanPhamByPLCTTN[i].trangThai === 'false') {
            this.listOfPhanTichSanPhamByPLCTTN[i].trangThai = false;
          }
          if (this.listOfPhanTichSanPhamByPLCTTN[i].trangThai === 'true') {
            this.listOfPhanTichSanPhamByPLCTTN[i].trangThai = true;
          }
          this.listOfPhanTichSanPhamByPLCTTN[i].loiKyThuat = 0;
          this.listOfPhanTichSanPhamByPLCTTN[i].loiLinhDong = 0;
        }
        // cập nhật số lượng sản phẩm đã phân tích, số lượng còn lại, tiến độ phân tích(chưa làm)
      }
    }, 500);
  }
  //focus con trỏ chuột vào ô input Lot
  buttonScanLot(): void {
    this.scanSerial = !this.scanSerial;
    this.scanType = 'lot';
    const input = document.getElementById(this.scanType);
    if (input) {
      input.focus();
    }
  }
  //focus con trỏ chuột vào ô input Serial
  buttonScanSerial(): void {
    this.scanLot = !this.scanLot;
    this.scanType = 'serial';
    const input = document.getElementById(this.scanType);
    if (input) {
      input.focus();
    }
  }
  // Bắt sự kiện scan LOT
  scanLotEvent(): void {
    this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].tenSanPham =
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].tenSanPham;
    this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].namSanXuat = `20${
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].lotNumber.substr(0, 2) as string
    }`;
  }
  //Bắt sự kiện scan serial
  scanSerialEvent(): void {
    this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].lotNumber =
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].detail.substr(13);
    this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].tenSanPham =
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].tenSanPham;
    this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].namSanXuat = `20${
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].detail.substr(0, 2) as string
    }`;
  }
  //Cập nhật thông tin sau khi khai báo lỗi
  updatePhanTichSanPham(): void {
    if (this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].tienDo === 100) {
      alert('Hoàn thành phân tích');
      // cập nhật check sản phẩm phân tích
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].check = true;
    }
    const input = document.getElementById(this.scanType);
    if (input) {
      input.focus();
    }
    if (this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].lotNumber === '') {
      alert('Vui lòng cập nhật mã LOT');
    } else {
      //cập nhật trạng thái sản phẩm khai báo lỗi
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].trangThai = true;
      //chuyển đến phân tích sản phẩm tiếp theo
      this.indexOfChiTietPhanTichSanPham++;
      // cập nhật tiến độ của phân tích sản phẩm
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].slDaPhanTich += 1;
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].slConLai =
        this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].slTiepNhan -
        this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].slDaPhanTich;
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].tienDo =
        (this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].slDaPhanTich /
          this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].slTiepNhan) *
        100;
      // cập nhật tiến độ chung của đơn bảo hành
      this.donBaoHanh.slDaPhanTich! += 1;
      this.donBaoHanh.tienDo = (this.donBaoHanh.slDaPhanTich / this.donBaoHanh.slCanPhanTich) * 100;
      console.log('check thông tin trạng thái: ', this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham]);
    }
  }
  //Lưu thông tin chi tiết phân tích sản phẩm và khai báo lỗi
  postChiTietPhanTichSanPham(): void {
    this.http.post<any>('api/phan-tich-san-pham', this.listOfPhanTichSanPhamByPLCTTN).subscribe(res => {
      alert('Cập nhật thành công');
      console.log('Kết quả cập nhật chi tiết phân tích sản phẩm: ', res);
    });
    // cập nhật phân tích lỗi
    // cập nhật số lượng đã phân tích ở đơn bảo hành
  }
}
