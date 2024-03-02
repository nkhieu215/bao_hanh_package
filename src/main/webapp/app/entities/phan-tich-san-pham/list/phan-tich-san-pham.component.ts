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
import { IKho } from 'app/entities/kho/kho.model';
import { KhoService } from 'app/entities/kho/service/kho.service';

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
  updateTrangThaiDonBaoHanhUrl = this.applicationConfigService.getEndpointFor('api/don-bao-hanhs/update-trang-thai');
  postMaBienBanUrl = this.applicationConfigService.getEndpointFor('api/ma-bien-ban/post');
  // biến chứa danh sách cần dùng
  donBaoHanhs: any[] = [];
  isLoading = false;
  listOfPhanTichSanPhamByPLCTTN: any[] = [];
  listOfKhaiBaoLoi: any[] = [];
  catchChangeOfListKhaiBaoLoi: any[] = [];
  danhSachBienBanSanPhamTheoKho: any[] = [];
  danhSachKho: IKho[] = [];
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
  idDonBaoHanh = '';
  themMoiBienBan: any;
  phanTichChiTietSanPham?: { tenSanPham: string; tinhTrang: string; slTiepNhan: number; slTon: number };
  predicate!: string;
  ascending!: boolean;
  //-----------------------------------------------------------------------------------------------------------------------------------------
  @Input() searchKey = '';
  //Biến chứa thông tin biên bản
  year = '';
  month = '';
  date = '';
  hours = '';
  minutes = '';
  seconds = '';
  maBienBan = '';
  loaiBienBan = '';
  maKho = '';
  tenKho = '';
  bienBanTiepNhan: any;
  bienBanKiemNghiem: any;
  //--------------------------------------------------------------------------------------------------------
  title = 'Phân tích sản phẩm';
  //danh sách Thông tin chi tiết sản phẩm phân tích
  listOfChiTietSanPhamPhanTichGoc: any[] = [];
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
  // Biến lưu kết quả tách sản phẩm theo kho
  resultOfSanPhamTheoKho: { key: string; value: any[] }[] = [];
  //Biến lưu danh sách gợi ý trạng thái
  trangThais: { key: string }[] = [{ key: 'Đổi mới' }, { key: 'Sửa chữa' }];
  //Biến lưu key tìm kiếm
  @Input() tinhTrang = '';
  @Input() tenSanPham = '';
  //Biến lưu thông tin 1 phần tử của phân loại chi tiết sản phẩm
  itemOfPhanLoaiChiTietSanPham: any;
  // biến dùng để check all
  checkedAll = false;
  //Biến chứa danh sách liên
  danhSachLienBienBanTiepNhan: { name: string; value: string }[] = [
    { name: 'Liên 1', value: '(Tổ đổi)' },
    { name: 'Liên 2', value: '(Khách hàng)' },
    { name: 'Liên 3', value: '(P.KHTT)' },
    { name: 'Liên 4', value: '(P.BH 1)' },
  ];
  indexOfdanhSachLienBienBanTiepNhan = 0;
  constructor(
    protected phanTichSanPhamService: PhanTichSanPhamService,
    protected donBaoHanhService: DonBaoHanhService,
    protected sanPhamService: SanPhamService,
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient,
    protected accountService: AccountService,
    protected khoService: KhoService
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
    // this.donBaoHanhService.query().subscribe({
    //   next: (res: HttpResponse<IDonBaoHanh[]>) => {
    //     this.isLoading = false;
    //     this.donBaoHanhs = res.body ?? [];
    //     for (let i = 0; i < this.donBaoHanhs.length; i++) {
    //       this.donBaoHanhs[i].tienDo = 0;
    //     }
    //     console.log('bbbb', this.donBaoHanhs);
    //   },
    //   error: () => {
    //     this.isLoading = false;
    //   },
    // });
    this.http.get<any>('api/phan-tich-san-pham').subscribe(res => {
      this.donBaoHanhs = res;
      const localTienDoDonBaoHanhs = JSON.parse(window.localStorage.getItem('DonBaoHanhs') as string);
      for (let i = 0; i < this.donBaoHanhs.length; i++) {
        this.donBaoHanhs[i].tienDo = 0;
        //Cập nhật tiến độ
        for (let j = 0; j < localTienDoDonBaoHanhs.length; j++) {
          if (this.donBaoHanhs[i].id === localTienDoDonBaoHanhs[j].id) {
            this.donBaoHanhs[i].tienDo = localTienDoDonBaoHanhs[j].tienDo;
          }
        }
      }
      console.log('bbbb', this.donBaoHanhs);
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
          this.donBaoHanh = args.dataContext;
          console.log(args);
          this.idBBTN = args.dataContext.id;
          this.showData(args.dataContext.id);
          setTimeout(() => {
            //Loại bỏ sản phẩm có số lượng tiếp nhận = 0
            this.listOfChiTietSanPhamPhanTich = this.listOfChiTietSanPhamPhanTich.filter(item => item.slTiepNhan !== 0);
            for (let i = 0; i < this.listOfChiTietSanPhamPhanTich.length; i++) {
              this.updateTienDoSanPhamPhanTich(this.listOfChiTietSanPhamPhanTich[i].id, i);
            }
            setTimeout(() => {
              this.updateDanhSachBienBanTheoKho();
            }, 1000);
          }, 3000);
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
          setTimeout(() => {
            //Loại bỏ sản phẩm có số lượng tiếp nhận = 0
            this.listOfChiTietSanPhamPhanTich = this.listOfChiTietSanPhamPhanTich.filter(item => item.slTiepNhan !== 0);
            for (let i = 0; i < this.listOfChiTietSanPhamPhanTich.length; i++) {
              this.updateTienDoSanPhamPhanTich(this.listOfChiTietSanPhamPhanTich[i].id, i);
            }
          }, 3000);
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
        type: FieldType.number,
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
        type: FieldType.object,
        formatter: Formatters.dateTimeIso,
        filter: {
          placeholder: 'search',
          model: Filters.compoundDate,
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
        pageSize: 10,
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
    this.getDanhSachKho();
    this.getDanhSachBienBan();
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
  }
  //lấy danh sách biên bản
  getDanhSachBienBan(): void {
    this.http.get<any>('api/ma-bien-bans').subscribe(res => {
      console.log('danh sach bien ban: ', res);
      this.danhSachBienBan = res;
    });
  }
  getDanhSachKho(): void {
    this.khoService.query().subscribe({
      next: (res: HttpResponse<IKho[]>) => {
        this.danhSachKho = res.body ?? [];
        console.log('danh sách kho: ', this.danhSachKho);
      },
      error: () => {
        this.isLoading = false;
      },
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
                  donVi: this.chiTietSanPhamTiepNhans[j].sanPham?.donVi as string,
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
      this.listOfChiTietSanPhamPhanTichGoc = JSON.parse(result as string);
      //cập nhật số lượng sản phẩm cần phân tích
      setTimeout(() => {
        this.resultOfSanPhamTheoKho = [{ key: '', value: [] }];
        let check = false;
        for (let i = 0; i < this.listOfChiTietSanPhamPhanTich.length; i++) {
          this.donBaoHanh.slCanPhanTich = Number(this.donBaoHanh.slCanPhanTich) + Number(this.listOfChiTietSanPhamPhanTich[i].slTiepNhan);
          for (let j = 0; j < this.danhSachSanPhams!.length; j++) {
            //check sản phẩm trong DB xem có chưa
            if (this.listOfChiTietSanPhamPhanTich[i].sanPham.id === this.danhSachSanPhams![j].id) {
              //check danh sách kho khởi tạo
              for (let k = 0; k < this.resultOfSanPhamTheoKho.length; k++) {
                if (this.resultOfSanPhamTheoKho[k].key === this.danhSachSanPhams![j].kho!.tenKho) {
                  this.resultOfSanPhamTheoKho[k].value.push(this.listOfChiTietSanPhamPhanTich[i]);
                  check = true;
                }
              }
              if (check === false) {
                const item: { key: string; value: any[] } = {
                  key: this.danhSachSanPhams![j].kho?.tenKho as string,
                  value: [this.listOfChiTietSanPhamPhanTich[i]],
                };
                this.resultOfSanPhamTheoKho.push(item);
              }
              check = false;
              break;
            }
          }
        }
        //Lọc thông tin kho rỗng
        this.resultOfSanPhamTheoKho = this.resultOfSanPhamTheoKho.filter(item => item.key !== '');
        console.log('Danh sách phân tách sản phẩm theo kho: ', this.resultOfSanPhamTheoKho);
      }, 500);

      console.log('Danh sách chi tiết sản phẩm phân tích', this.listOfChiTietSanPhamPhanTich);
    }, 1000);
  }
  updateDanhSachBienBanTheoKho(): void {
    //Lọc sản phẩm có sl Tiếp nhận rỗng và check = false
    for (let i = 0; i < this.resultOfSanPhamTheoKho.length; i++) {
      //lọc danh sách từng kho
      this.resultOfSanPhamTheoKho[i].value = this.resultOfSanPhamTheoKho[i].value.filter(
        item => item.slTiepNhan !== 0 && item.check === true
      );
    }
    console.log('Danh sách phân tách sản phẩm theo kho: ', this.resultOfSanPhamTheoKho);
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
  openPopupBBTN(index: any): void {
    this.popupInBBTN = true;
    this.indexOfdanhSachLienBienBanTiepNhan = index;
    console.log('index', this.indexOfdanhSachLienBienBanTiepNhan);
    const result = sessionStorage.getItem(`TiepNhan ${this.idBBTN.toString()}`);
    // this.resultChiTietSanPhamTiepNhans = JSON.parse(result as string);
    if (result === null) {
      var list1: any[] = [];
      // lấy danh sách chi tiết sản phẩm tiếp nhận lấy theo id
      this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${this.idBBTN}`).subscribe(res => {
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
            sessionStorage.setItem(`TiepNhan ${this.idBBTN}`, JSON.stringify(list));
          });
        });
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
    this.maBienBan = '';
    this.loaiBienBan = 'Tiếp nhận';
    for (let i = 0; i < this.danhSachBienBan.length; i++) {
      if (this.loaiBienBan === this.danhSachBienBan[i].loaiBienBan && this.donBaoHanh.id === this.danhSachBienBan[i].donBaoHanh.id) {
        this.maBienBan = this.danhSachBienBan[i].maBienBan;
        //lưu thông tin thêm mới biên bản
        this.themMoiBienBan = this.danhSachBienBan[i];
        console.log('Cap nhat thong tin bien ban:', this.themMoiBienBan);
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
      console.log('them moi bien ban:', this.themMoiBienBan);
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

  openPopupInBBKN(index: any): void {
    this.popupInBBKN = true;
    this.maBienBan = '';
    this.loaiBienBan = 'Kiểm nghiệm';
    this.danhSachBienBanSanPhamTheoKho = this.resultOfSanPhamTheoKho[index].value;
    console.log('danh sách sản phẩm kho:', this.resultOfSanPhamTheoKho[index].value);
    //cập nhật mã kho
    for (let i = 0; i < this.danhSachKho.length; i++) {
      if (this.resultOfSanPhamTheoKho[index].key === this.danhSachKho[i].tenKho) {
        this.tenKho = this.danhSachKho[i].tenKho as string;
        this.maKho = this.danhSachKho[i].maKho as string;
      }
    }
    //Lấy thông tin biên bản tiếp nhận theo đơn bảo hành
    this.http.get<any>(`api/danh-sach-bien-ban/tiep-nhan/${this.donBaoHanh.id as number}`).subscribe(res => {
      this.bienBanTiepNhan = res;
      console.log('Biên bản tiếp nhận', this.bienBanTiepNhan);
    });
    for (let i = 0; i < this.danhSachBienBan.length; i++) {
      if (this.loaiBienBan === this.danhSachBienBan[i].loaiBienBan && this.donBaoHanh.id === this.danhSachBienBan[i].donBaoHanh.id) {
        this.maBienBan = this.danhSachBienBan[i].maBienBan;
        //lưu thông tin thêm mới biên bản
        this.themMoiBienBan = this.danhSachBienBan[i];
        console.log('Cap nhat thong tin bien ban:', this.themMoiBienBan);
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
      this.maBienBan = `KN${this.maKho}${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`;
      this.themMoiBienBan = {
        id: null,
        maBienBan: this.maBienBan,
        loaiBienBan: this.loaiBienBan,
        soLanIn: 0,
        donBaoHanh: this.donBaoHanh,
        maKho: this.maKho,
      };
      console.log('them moi bien ban kiểm nghiệm:', this.themMoiBienBan);
    }
  }

  openPopupInBBTL(index: any): void {
    this.popupInBBTL = true;
    this.maBienBan = '';
    this.loaiBienBan = 'Thanh lý';
    //Lấy thông tin biên bản tiếp nhận theo đơn bảo hành
    this.http.get<any>(`api/danh-sach-bien-ban/tiep-nhan/${this.donBaoHanh.id as number}`).subscribe(res => {
      this.bienBanTiepNhan = res;
      console.log('Biên bản tiếp nhận', this.bienBanTiepNhan);
    });
    //Lấy thông tin biên bản kiểm nghiệm theo đơn bảo hành
    this.http.get<any>(`api/danh-sach-bien-ban/kiem-nghiem/${this.donBaoHanh.id as number}`).subscribe(res => {
      this.bienBanKiemNghiem = res;
      console.log('Biên bản kiểm nghiệm', this.bienBanTiepNhan);
    });
    //cập nhật mã kho
    for (let i = 0; i < this.danhSachKho.length; i++) {
      if (this.resultOfSanPhamTheoKho[index].key === this.danhSachKho[i].tenKho) {
        this.tenKho = this.danhSachKho[i].tenKho as string;
        this.maKho = this.danhSachKho[i].maKho as string;
      }
    }
    for (let i = 0; i < this.danhSachBienBan.length; i++) {
      if (this.loaiBienBan === this.danhSachBienBan[i].loaiBienBan && this.donBaoHanh.id === this.danhSachBienBan[i].donBaoHanh.id) {
        this.maBienBan = this.danhSachBienBan[i].maBienBan;
        //lưu thông tin thêm mới biên bản
        this.themMoiBienBan = this.danhSachBienBan[i];
        console.log('Cap nhat thong tin bien ban:', this.themMoiBienBan);
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
      this.maBienBan = `TL${this.maKho}${this.date}${this.month}${this.year}${this.hours}${this.minutes}${this.seconds}`;
      this.themMoiBienBan = {
        id: null,
        maBienBan: this.maBienBan,
        loaiBienBan: this.loaiBienBan,
        soLanIn: 0,
        donBaoHanh: this.donBaoHanh,
        maKho: this.maKho,
      };
      console.log('them moi bien ban thanh lý:', this.themMoiBienBan);
    }
    this.danhSachBienBanSanPhamTheoKho = this.resultOfSanPhamTheoKho[index].value;
    console.log('danh sách sản phẩm kho:', this.resultOfSanPhamTheoKho[index].value);
  }

  //đóng popup biên bản tiếp nhận
  closePopupBBTN(): void {
    this.popupInBBTN = false;
  }

  closePopupBBKN(): void {
    this.popupInBBKN = false;
  }

  closePopupBBTL(): void {
    this.popupInBBTL = false;
  }
  xacNhanInBienBan(): void {
    this.themMoiBienBan.soLanIn++;
    this.http.post<any>(this.postMaBienBanUrl, this.themMoiBienBan).subscribe(res => {
      console.log('thành công:', res);
      window.location.reload();
    });
  }
  getLois(): void {
    this.http.get<any>(this.loisUrl).subscribe(res => {
      this.lois = res;
      console.log('loi', res);
    });
  }

  getSanPhams(): void {
    this.http.get<any>(this.sanPhamsUrl).subscribe(resSP => {
      this.danhSachSanPhams = resSP;
      console.log('san pham', resSP);
    });
  }

  //==================================================== Popup chi tiết phân tích sản phẩm và khai báo lỗi ====================================================
  openPopupChiTietLoi(id: number, index: number): void {
    this.popupChiTietLoi = true;
    this.itemOfPhanLoaiChiTietSanPham = this.listOfChiTietSanPhamPhanTich[index].phanLoaiChiTietTiepNhan;
    this.indexOfChiTietPhanTichSanPham = 0;
    this.listOfPhanTichSanPhamByPLCTTN = [];
    this.indexOfPhanTichSanPham = index;
    // lấy danh sách chi tiết sản phẩm phân tích
    this.getPhanTichSanPhamByPLCTTN(id);
    setTimeout(() => {
      if (this.listOfPhanTichSanPhamByPLCTTN.length === 0) {
        this.addItemForChiTietPhanTichSanPham();
        // them moi phan tu dau tien
        console.log('them moi danh sach khai bao loi theo san pham:', this.listOfPhanTichSanPhamByPLCTTN);
      } else {
        this.donBaoHanh.slDaPhanTich -= this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].slDaPhanTich;
        this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].slDaPhanTich = 0;
        //cập nhật tổng lỗi kĩ thuật và lỗi linh động
        for (let i = 0; i < this.listOfPhanTichSanPhamByPLCTTN.length; i++) {
          this.http.get<any>(`api/phan-tich-loi/${this.listOfPhanTichSanPhamByPLCTTN[i].id as number}`).subscribe((res: any[]) => {
            setTimeout(() => {
              this.listOfPhanTichSanPhamByPLCTTN[i].loiKyThuat = 0;
              this.listOfPhanTichSanPhamByPLCTTN[i].loiLinhDong = 0;
              this.listOfPhanTichSanPhamByPLCTTN[i].soLuong = 0;
              for (let j = 0; j < res.length; j++) {
                if (res[j].loi.chiChu === 'Lỗi linh động') {
                  this.listOfPhanTichSanPhamByPLCTTN[i].loiLinhDong += res[j].soLuong;
                }
                if (res[j].loi.chiChu === 'Lỗi kỹ thuật') {
                  this.listOfPhanTichSanPhamByPLCTTN[i].loiKyThuat += res[j].soLuong;
                }
                this.listOfPhanTichSanPhamByPLCTTN[i].soLuong =
                  Number(this.listOfPhanTichSanPhamByPLCTTN[i].loiKyThuat) + Number(this.listOfPhanTichSanPhamByPLCTTN[i].loiLinhDong);
              }
            }, 200);
            console.log(res);
          });
          if (this.listOfPhanTichSanPhamByPLCTTN[i].trangThai === 'true') {
            this.listOfPhanTichSanPhamByPLCTTN[i].trangThai = true;
            this.listOfPhanTichSanPhamByPLCTTN[i].tenSanPham = this.listOfChiTietSanPhamPhanTich[index].tenSanPham;
            //tiến đến sp tiếp theo
            this.indexOfChiTietPhanTichSanPham = i;
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
            console.log('Cập nhật tiến độ khi khai báo lỗi', this.indexOfChiTietPhanTichSanPham);
          }
          this.listOfPhanTichSanPhamByPLCTTN[i].loiKyThuat = 0;
          this.listOfPhanTichSanPhamByPLCTTN[i].loiLinhDong = 0;
        }
        this.addItemForChiTietPhanTichSanPham();
        this.indexOfChiTietPhanTichSanPham++;
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
    this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].theLoaiPhanTich = 'Lot';
    this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].tenSanPham =
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].tenSanPham;
    this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].namSanXuat = `20${
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].lotNumber.substr(0, 2) as string
    }`;
  }
  //Bắt sự kiện scan serial
  scanSerialEvent(): void {
    this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].theLoaiPhanTich = 'Serial';
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
      alert('Đã hoàn thành phân tích');
      // cập nhật check sản phẩm phân tích
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].check = true;
      // xóa tên SP đã cập nhật
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].tenSanPham = '';
    } else if (
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].tienDo >= 0 &&
      this.listOfChiTietSanPhamPhanTich[this.indexOfPhanTichSanPham].tienDo < 100
    ) {
      const input = document.getElementById(this.scanType);
      if (input) {
        input.focus();
      }
      if (
        this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].lotNumber === '' ||
        this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].soLuong === 0
      ) {
        let check = false;
        if (
          this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].soLuong === 0 &&
          this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].lotNumber !== ''
        ) {
          alert('Vui lòng khai báo lỗi');
          check = true;
        }
        if (check === false) {
          alert('Vui lòng khai báo lỗi và cập nhật mã LOT');
          if (input) {
            input.focus();
          }
        }
      } else {
        //Gán vào danh sách update khai báo lỗi
        for (let i = 0; i < this.catchChangeOfListKhaiBaoLoi.length; i++) {
          this.listOfKhaiBaoLoi.push(this.catchChangeOfListKhaiBaoLoi[i]);
        }
        //cập nhật trạng thái sản phẩm khai báo lỗi
        this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].trangThai = true;
        //chuyển đến phân tích sản phẩm tiếp theo
        this.indexOfChiTietPhanTichSanPham++;
        //thêm 1 phần tử mới
        this.addItemForChiTietPhanTichSanPham();
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
        setTimeout(() => {
          if (this.donBaoHanh.tienDo === 100) {
            this.donBaoHanh.trangThai = 'Hoàn thành phân tích';
          }
        }, 100);
        console.log('check thông tin phân tích sản phẩm: ', this.listOfPhanTichSanPhamByPLCTTN);
        console.log('Check thông tin danh sách update khai báo lỗi: ', this.listOfKhaiBaoLoi);
        console.log('index after: ', this.indexOfChiTietPhanTichSanPham);
      }
    }
  }
  //Lưu thông tin chi tiết phân tích sản phẩm và khai báo lỗi
  postChiTietPhanTichSanPham(): void {
    this.listOfPhanTichSanPhamByPLCTTN = this.listOfPhanTichSanPhamByPLCTTN.filter(item => item.tenSanPham !== '');
    console.log(this.listOfPhanTichSanPhamByPLCTTN);
    if (this.donBaoHanh.tienDo > 0) {
      console.log('Đang phân tích');
      this.donBaoHanh.trangThai = 'Đang phân tích';
      this.http.put<any>(this.updateTrangThaiDonBaoHanhUrl, this.donBaoHanh).subscribe();
    }
    if (this.donBaoHanh.tienDo === 100) {
      console.log('Hoàn thành phân tích');
      this.donBaoHanh.trangThai = 'Hoàn thành phân tích';
      this.http.put<any>(this.updateTrangThaiDonBaoHanhUrl, this.donBaoHanh).subscribe();
    }
    this.http.post<any>('api/phan-tich-san-pham', this.listOfPhanTichSanPhamByPLCTTN).subscribe(res => {
      this.listOfPhanTichSanPhamByPLCTTN = res;
      console.log('Kết quả cập nhật chi tiết phân tích sản phẩm: ', this.listOfPhanTichSanPhamByPLCTTN);
      setTimeout(() => {
        //cập nhật danh sách phân tích lỗi
        for (let i = 0; i < this.listOfKhaiBaoLoi.length; i++) {
          for (let j = 0; j < this.listOfPhanTichSanPhamByPLCTTN.length; j++) {
            if (this.listOfKhaiBaoLoi[i].phanTichSanPham.soThuTu === this.listOfPhanTichSanPhamByPLCTTN[j].soThuTu) {
              this.listOfKhaiBaoLoi[i].phanTichSanPham.id = this.listOfPhanTichSanPhamByPLCTTN[j].id;
            }
          }
        }
        //cập nhật DB phân tích lỗi
        this.http.post<any>('api/phan-tich-loi', this.listOfKhaiBaoLoi).subscribe(() => {
          alert('Cập nhật thành công');
        });
        // lưu trong localStorage
        for (let i = 0; i < this.donBaoHanhs.length; i++) {
          if (this.donBaoHanh.id === this.donBaoHanhs[i].id) {
            this.donBaoHanhs[i].tienDo = this.donBaoHanh.tienDo;
          }
        }
        window.localStorage.setItem('DonBaoHanhs', JSON.stringify(this.donBaoHanhs));
        console.log('danh sach update khai bao loi: ', this.listOfKhaiBaoLoi);
      }, 200);
    });
    // cập nhật phân tích lỗi
    // cập nhật số lượng đã phân tích ở đơn bảo hành
  }
  timKiemPhanTichSanPham(): void {
    this.listOfChiTietSanPhamPhanTich = this.listOfChiTietSanPhamPhanTichGoc.filter(
      item => item.tenSanPham.includes(this.tenSanPham) && item.tinhTrang.includes(this.tinhTrang)
    );
    console.log({ result: this.listOfChiTietSanPhamPhanTich, SP: this.tenSanPham, tt: this.tinhTrang });
  }
  addItemForChiTietPhanTichSanPham(): void {
    this.catchChangeOfListKhaiBaoLoi = [];
    const item = {
      soThuTu: this.indexOfChiTietPhanTichSanPham + 1,
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
      phanLoaiChiTietTiepNhan: this.itemOfPhanLoaiChiTietSanPham,
    };
    this.listOfPhanTichSanPhamByPLCTTN.push(item);
    // thêm mới khai báo lỗi cho từng sản phẩm
    for (let i = 0; i < this.lois!.length; i++) {
      const today = dayjs().startOf('second');
      const khaiBaoLoi = {
        soLuong: 0,
        ngayPhanTich: today,
        username: this.account?.login,
        ghiChu: this.lois![i].nhomLoi!.tenNhomLoi,
        loi: this.lois![i],
        phanTichSanPham: item,
        tenNhomLoi: this.lois![i].nhomLoi!.tenNhomLoi,
      };
      this.catchChangeOfListKhaiBaoLoi.push(khaiBaoLoi);
    }
    console.log('danh sách khai báo lỗi: ', this.catchChangeOfListKhaiBaoLoi);
    console.log('index before: ', this.indexOfChiTietPhanTichSanPham);
  }

  // hàm xử lý check all
  checkAll(): void {
    this.checkedAll = !this.checkedAll;
    // this.itemCheckedState = this.itemCheckedState.map(() => this.checkedAll)
    this.listOfChiTietSanPhamPhanTich.forEach(item => {
      item.check = this.checkedAll;
    });
    console.log('checked all', this.checkedAll);
  }

  // hàm xử lý check từng thông tin sản phẩm
  checkItem(index: number): void {
    this.listOfChiTietSanPhamPhanTich[index].check = !this.listOfChiTietSanPhamPhanTich[index].check;
    // this.checkedAll = this.itemCheckedState.every(state => state)
    console.log('check item', this.listOfChiTietSanPhamPhanTich[index]);
    this.checkedAll = this.listOfChiTietSanPhamPhanTich.every(item => item.check);
  }
  catchEventKhaiBaoLois(index: any): void {
    console.log('kiểm tra mã LOT', this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham]);
    if (
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].lotNumber === '' &&
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].detail === ''
    ) {
      alert('Chưa có thông tin LOT/SERIAL !!!');
      const input = document.getElementById(this.scanType);
      if (input) {
        input.focus();
      }
    } else {
      //reset kết quả
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiKyThuat = 0;
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiLinhDong = 0;
      //cập nhật số lượng lỗi linh động, lỗi kĩ thuật
      for (let i = 0; i < this.catchChangeOfListKhaiBaoLoi.length; i++) {
        if (this.catchChangeOfListKhaiBaoLoi[i].loi.chiChu === 'Lỗi kỹ thuật') {
          this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiKyThuat += this.catchChangeOfListKhaiBaoLoi[i].soLuong;
        }
        if (this.catchChangeOfListKhaiBaoLoi[i].loi.chiChu === 'Lỗi linh động') {
          this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiLinhDong += this.catchChangeOfListKhaiBaoLoi[i].soLuong;
        }
      }
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].soLuong =
        Number(this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiKyThuat) +
        Number(this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiLinhDong);
    }
  }
  // cập nhật số lượng lỗi trong button
  catchEventKhaiBaoLoi(index: any): void {
    console.log('kiểm tra mã LOT', this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham]);

    if (
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].lotNumber === '' &&
      this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].detail === ''
    ) {
      alert('Chưa có thông tin LOT/SERIAL !!!');
      const input = document.getElementById(this.scanType);
      if (input) {
        input.focus();
      }
    } else {
      this.catchChangeOfListKhaiBaoLoi[index].soLuong++;
      console.log(index);
      //cập nhật số lượng lỗi linh động, lỗi kĩ thuật
      if (this.catchChangeOfListKhaiBaoLoi[index].loi.chiChu === 'Lỗi kỹ thuật') {
        console.log({
          tenLoi: this.indexOfChiTietPhanTichSanPham,
          nLoi: this.catchChangeOfListKhaiBaoLoi[index].tenNhomLoi,
          sl: this.catchChangeOfListKhaiBaoLoi[index].soLuong,
        });
        this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiKyThuat++;
        this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].soLuong =
          Number(this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiKyThuat) +
          Number(this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiLinhDong);
      }
      if (this.catchChangeOfListKhaiBaoLoi[index].loi.chiChu === 'Lỗi linh động') {
        this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiLinhDong++;
        this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].soLuong =
          Number(this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiKyThuat) +
          Number(this.listOfPhanTichSanPhamByPLCTTN[this.indexOfChiTietPhanTichSanPham].loiLinhDong);
      }
    }
  }
  //Hàm cập nhật tiến độ sản phẩm phân tích
  updateTienDoSanPhamPhanTich(id: number, index: number): void {
    this.donBaoHanh.slDaPhanTich = 0;
    this.indexOfChiTietPhanTichSanPham = 0;
    this.listOfPhanTichSanPhamByPLCTTN = [];
    this.indexOfPhanTichSanPham = index;
    //reset tổng lỗi kĩ thuật và lỗi linh động
    this.listOfChiTietSanPhamPhanTich[index].loiKyThuat = 0;
    this.listOfChiTietSanPhamPhanTich[index].loiLinhDong = 0;
    //trường hợp số lượng tiếp nhận = 0
    if (this.listOfChiTietSanPhamPhanTich[index].slTiepNhan === 0) {
      // điều chỉnh tiến độ lên 100%
      this.listOfChiTietSanPhamPhanTich[index].tienDo = 100;
      this.listOfChiTietSanPhamPhanTich[index].check = true;
      // cập nhật tiến độ chung của đơn bảo hành
      this.donBaoHanh.slDaPhanTich!++;
      this.donBaoHanh.tienDo = (this.donBaoHanh.slDaPhanTich / this.donBaoHanh.slCanPhanTich) * 100;
    } else {
      // lấy danh sách chi tiết sản phẩm phân tích
      this.http.get<any>(`api/phan-tich-san-pham/${id}`).subscribe(res => {
        this.listOfPhanTichSanPhamByPLCTTN = res;
        // console.log({ PLCTTNID: id, PLCTTNINDEX: index });
        // console.log("Độ dài danh sách: ", this.listOfPhanTichSanPhamByPLCTTN)
        //cập nhật tổng lỗi kĩ thuật và lỗi linh động
        for (let i = 0; i < this.listOfPhanTichSanPhamByPLCTTN.length; i++) {
          if (this.listOfPhanTichSanPhamByPLCTTN[i].trangThai === 'true') {
            console.log({ checkIndexOfSanPhamPhanTich: this.listOfPhanTichSanPhamByPLCTTN[i] });
            // cập nhật tiến độ của phân tích sản phẩm
            // console.log("Cập nhật tiến độ khi khai báo lỗi", this.listOfChiTietSanPhamPhanTich[index]);
            this.listOfChiTietSanPhamPhanTich[index].slDaPhanTich += 1;
            this.listOfChiTietSanPhamPhanTich[index].slConLai =
              this.listOfChiTietSanPhamPhanTich[index].slTiepNhan - this.listOfChiTietSanPhamPhanTich[index].slDaPhanTich;
            this.listOfChiTietSanPhamPhanTich[index].tienDo =
              (this.listOfChiTietSanPhamPhanTich[index].slDaPhanTich / this.listOfChiTietSanPhamPhanTich[index].slTiepNhan) * 100;
            if (this.listOfChiTietSanPhamPhanTich[index].tienDo === 100) {
              // cập nhật check sản phẩm phân tích
              this.listOfChiTietSanPhamPhanTich[index].check = true;
            }
            // cập nhật tiến độ chung của đơn bảo hành
            this.donBaoHanh.slDaPhanTich!++;
            this.donBaoHanh.tienDo = (this.donBaoHanh.slDaPhanTich / this.donBaoHanh.slCanPhanTich) * 100;
            //cập nhật tổng lỗi linh động, lỗi kĩ thuật
            for (let j = 0; j < this.listOfPhanTichSanPhamByPLCTTN[i].phanTichLois.length; j++) {
              console.log({ checkIndex: this.listOfPhanTichSanPhamByPLCTTN[i].phanTichLois });
              if (this.listOfPhanTichSanPhamByPLCTTN[i].phanTichLois[j].ghiChu === 'Lỗi kỹ thuật') {
                console.log('test');
                this.listOfChiTietSanPhamPhanTich[index].loiKyThuat =
                  Number(this.listOfChiTietSanPhamPhanTich[index].loiKyThuat) +
                  Number(this.listOfPhanTichSanPhamByPLCTTN[i].phanTichLois[j].soLuong);
              }
              if (this.listOfPhanTichSanPhamByPLCTTN[i].phanTichLois[j].ghiChu === 'Lỗi linh động') {
                this.listOfChiTietSanPhamPhanTich[index].loiLinhDong =
                  Number(this.listOfChiTietSanPhamPhanTich[index].loiLinhDong) +
                  Number(this.listOfPhanTichSanPhamByPLCTTN[i].phanTichLois[j].soLuong);
              }
            }
          }
        }
        // cập nhật số lượng sản phẩm đã phân tích, số lượng còn lại, tiến độ phân tích(chưa làm)
      });
    }
  }
  chinhSuaKhaiBaoLoi(index: any): void {
    console.log(this.listOfPhanTichSanPhamByPLCTTN[index].id);
    //cập nhật index
    this.indexOfChiTietPhanTichSanPham = index;
    //cập nhật phần tử hiển thị từ api
    this.http.get<any>(`api/phan-tich-loi/${this.listOfPhanTichSanPhamByPLCTTN[index].id as number}`).subscribe(res => {
      this.catchChangeOfListKhaiBaoLoi = res;
    });
  }
  saveKhaiBaoLoi(): void {
    //Gán vào danh sách update khai báo lỗi
    for (let i = 0; i < this.catchChangeOfListKhaiBaoLoi.length; i++) {
      this.listOfKhaiBaoLoi.push(this.catchChangeOfListKhaiBaoLoi[i]);
    }
    setTimeout(() => {
      this.http.post<any>('api/phan-tich-loi', this.listOfKhaiBaoLoi).subscribe(() => {
        alert('Cập nhật thành công');
        //reset dữ liệu
        this.listOfKhaiBaoLoi = [];
      });
      // lưu trong localStorage
      for (let i = 0; i < this.donBaoHanhs.length; i++) {
        if (this.donBaoHanh.id === this.donBaoHanhs[i].id) {
          this.donBaoHanhs[i].tienDo = this.donBaoHanh.tienDo;
        }
      }
      window.localStorage.setItem('DonBaoHanhs', JSON.stringify(this.donBaoHanhs));
    }, 200);
  }
}
