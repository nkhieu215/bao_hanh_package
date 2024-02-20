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
import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhanTichSanPham } from '../phan-tich-san-pham.model';
import { PhanTichSanPhamService } from '../service/phan-tich-san-pham.service';
import { PhanTichSanPhamReLoadComponent } from './phan-tich-san-pham-reload.component';
import { PhanTichMaTiepNhanComponent } from './phan-tich-ma-tiep-nhan.component';

@Component({
  selector: 'jhi-phan-tich-san-pham',
  templateUrl: './phan-tich-san-pham.component.html',
  styleUrls: ['../../../slickgrid-theme-booststrap.css'],
})
export class PhanTichSanPhamComponent implements OnInit {
  loisUrl = this.applicationConfigService.getEndpointFor('api/lois');
  sanPhamsUrl = this.applicationConfigService.getEndpointFor('api/san-phams');
  phanLoaiChiTietTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/phan-loai-chi-tiet-tiep-nhans');
  chiTietSanPhamTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/chi-tiet-don-bao-hanhs');
  danhSachTinhTrangUrl = this.applicationConfigService.getEndpointFor('api/danh-sach-tinh-trangs');
  loiUrl = this.applicationConfigService.getEndpointFor('api/lois');

  donBaoHanhs: any[] = [];
  isLoading = false;
  //set up khung hien thi loi
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
  phanTichChiTietSanPham?: { tenSanPham: string; tinhTrang: string; slTiepNhan: number; slTon: number };
  predicate!: string;
  ascending!: boolean;

  title = 'Phân tích sản phẩm';

  formSearch = this.formBuilder.group({
    id: [],
    tenSanPham: [],
    lot: [],
    partNumber: [],
    namSanXuat: [],
    userName: [],
    ngayKiemTra: [],
    user: [],
    trangThai: [],
  });

  editForm = this.formBuilder.group({});

  popupChiTietLoi = false;
  type = '';
  popupInBBTN = false;
  popupInBBTN1 = false;
  popupInBBTN2 = false;
  popupInBBTN3 = false;
  popupInBBTN4 = false;
  groupOptions = false;

  popupInBBKN = false;
  popupInBBTL = false;
  idBBTN = 0;
  popupSelectButton = false;

  constructor(
    protected phanTichSanPhamService: PhanTichSanPhamService,
    protected donBaoHanhService: DonBaoHanhService,
    protected sanPhamService: SanPhamService,
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient
  ) {}

  buttonIn: Formatter<any> = (_row, _cell, value) =>
    value ? `<button class="btn btn-primary">In</button>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };

  loadAll(): void {
    this.isLoading = true;
    this.donBaoHanhService.query().subscribe({
      next: (res: HttpResponse<IDonBaoHanh[]>) => {
        this.isLoading = false;
        this.donBaoHanhs = res.body ?? [];
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
          // gán idBBTn = id don-bao-hanh (xác định id trong key)
          this.idBBTN = args.dataContext.id;
          // this.resultPopupBtn(e,args);
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
          console.log(args);
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
        params: { iconCssClass: 'fa fa-trash pointer' },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(args);
          this.angularGrid?.gridService.deleteItemById(args.row);
          this.angularGrid?.gridService.deleteItems(args.row);
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
      enableColumnPicker: true,
      enableRowDetailView: true,
      rowDetailView: {
        // đặt button ở vị trí mong muốn
        columnIndexPosition: 1,
        // hàm thực thi
        process: item => this.simulateServerAsyncCall(item),
        // chạy lệnh 1 lần , những lần sau sẽ hiển thị dữ liệu của lần chạy đầu tiên
        loadOnce: true,
        // mở rộng hàng
        singleRowExpand: true,
        // sử dụng chức năng click trên 1 hàng
        useRowClick: true,
        // số lượng hàng dùng để hiển thị thông tin của row detail
        panelRows: 10,
        // component loading
        preloadComponent: PhanTichSanPhamReLoadComponent,
        // component hiển thị row detail
        viewComponent: PhanTichMaTiepNhanComponent,
        // chức năng xác định parent
        parent: true,
      },
      pagination: {
        pageSizes: [5, 10, 20],
        pageSize: 10,
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
      gridHeight: 650,
      gridWidth: 1800,
    };
    this.loadAll();
    this.getLois();
    this.getSanPhams();
  }

  addItem(): void {
    this.donBaoHanhs = [
      ...this.donBaoHanhs,
      {
        id: this.donBaoHanhs.length + 1,
        // id: this.donBaoHanhs[this.donBaoHanhs.length]?.id,
        username: this.donBaoHanhs[this.donBaoHanhs.length]?.username,
        ngayKiemTra: this.donBaoHanhs[this.donBaoHanhs.length]?.ngayKiemTra,
        trangThai: this.donBaoHanhs[this.donBaoHanhs.length]?.trangThai,
      },
    ];
  }

  mockData(count: number): any {
    const mockDataset = [];
    for (let i = 1; i < count; i++) {
      mockDataset[i] = {
        id: i,
      };
    }
    return mockDataset;
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

  randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  updateForm(phanTichSanPham: IPhanTichSanPham): void {
    this.editForm;
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

  closePopup(): void {
    this.popupChiTietLoi = false;
  }

  // mở popup chọn loại biên bản
  openPopupBtn(): void {
    this.popupSelectButton = true;
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

  showGroupOptions(): void {
    this.groupOptions = true;
  }

  openPopupBBKN(): void {
    this.popupInBBKN = true;
  }

  openPopupBBTL(): void {
    this.popupInBBTL = true;
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
      sessionStorage.setItem('san pham', JSON.stringify(resSP));
      console.log('san pham', resSP);
    });
  }

  // viết hàm tăng 1 giá trị khi click vào btn cộng lỗi ()
  addOne(count: number): void {
    count++;
  }

  openPopupChiTietLoi(idChiTiet: number, idDBH: number): void {
    this.popupChiTietLoi = true;
    console.log({ 1: idChiTiet, 2: idDBH });
    const result: any[] = JSON.parse(sessionStorage.getItem(`PhanTich ${idDBH.toString()}`) as string);
    for (let i = 0; i < result.length; i++) {
      if (idChiTiet === result[i].id) {
        this.phanTichChiTietSanPham = result[i];
      }
    }
    console.log('khai bao loi', this.phanTichChiTietSanPham);
  }
}
