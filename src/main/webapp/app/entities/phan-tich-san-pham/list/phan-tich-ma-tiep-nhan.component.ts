import { IDanhSachTinhTrang } from 'app/entities/danh-sach-tinh-trang/danh-sach-tinh-trang.model';
import { IPhanLoaiChiTietTiepNhan } from './../../phan-loai-chi-tiet-tiep-nhan/phan-loai-chi-tiet-tiep-nhan.model';
import { FormBuilder } from '@angular/forms';
import { PhanTichThongTinSanPhamComponent } from './phan-tich-thong-tin-san-pham.component';
import { PhanTichSanPhamReLoadComponent } from './phan-tich-san-pham-reload.component';
import { IPhanTichSanPham } from 'app/entities/phan-tich-san-pham/phan-tich-san-pham.model';
import { IChiTietSanPhamTiepNhan } from 'app/entities/chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.model';
import { ApplicationConfigService } from './../../../core/config/application-config.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PhanTichSanPhamService } from './../service/phan-tich-san-pham.service';
import { ChiTietSanPhamTiepNhanService } from './../../chi-tiet-san-pham-tiep-nhan/service/chi-tiet-san-pham-tiep-nhan.service';
import {
  Column,
  GridOption,
  AngularGridInstance,
  Formatters,
  OnEventArgs,
  FieldType,
  Filters,
  Formatter,
  LongTextEditorOption,
} from 'angular-slickgrid';
import { Component } from '@angular/core';
import { PhanTichSanPhamComponent } from './phan-tich-san-pham.component';

@Component({
  template: `<div id="demo-container" class="container-fluid">
    <angular-slickgrid
      gridId="phanTichMaTiepNhans"
      [columnDefinitions]="columnDefinitions1"
      [gridOptions]="gridOptions1"
      [dataset]="resultChiTietSanPhamTiepNhans"
    ></angular-slickgrid>
  </div>`,
})
export class PhanTichMaTiepNhanComponent {
  phanLoaiChiTietTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/phan-loai-chi-tiet-tiep-nhans');
  chiTietSanPhamTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/chi-tiet-don-bao-hanhs');
  danhSachTinhTrangUrl = this.applicationConfigService.getEndpointFor('api/danh-sach-tinh-trangs');

  danhSachTinhTrangs: any[] = [];
  phanTichMaTiepNhans: any[] = [];

  columnDefinitions?: IPhanTichSanPham[];
  phanTichChiTietSanPham?: IPhanLoaiChiTietTiepNhan[];
  chiTietSanPhamTiepNhans: IChiTietSanPhamTiepNhan[] = [];
  danhSachTinhTrang?: IDanhSachTinhTrang[];
  resultChiTietSanPhamTiepNhans: any[] = [];
  phanLoaiChiTietTiepNhans: IPhanLoaiChiTietTiepNhan[] = [];

  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions1!: GridOption;
  gridOptions2!: GridOption;
  dataset1!: any[];
  dataset2!: any[];
  angularGrid?: AngularGridInstance;

  isLoading = false;

  popupChiTietLoi = false;
  type = '';
  idBBTN = 0;
  idDBH = 0;

  constructor(
    protected chiTietSanPhamTiepNhanService: ChiTietSanPhamTiepNhanService,
    protected phanTichSanPhamService: PhanTichSanPhamService,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected aaaa: PhanTichSanPhamComponent,
    protected component: PhanTichSanPhamComponent
  ) {}

  buttonTongHop: Formatter<any> = (_row, _cell, value) =>
    value ? `<button class="btn btn-primary">G</button>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };

  // buttonSerial: Formatter<any> = (_row, _cell, value) =>
  //   value ? `<button class="btn btn-primary">S</button>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };

  // buttonLot: Formatter<any> = (_row, _cell, value) =>
  //   value ? `<button class="btn btn-primary">L</button>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>' };

  loadAll(): void {
    this.chiTietSanPhamTiepNhanService.query().subscribe({
      next: (res: HttpResponse<IPhanTichSanPham[]>) => {
        this.isLoading = false;
        this.phanTichMaTiepNhans = res.body ?? [];
        // console.log('b', this.phanTichMaTiepNhans);
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.isLoading = true;
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    const result = sessionStorage.getItem('sessionStorage');
    // console.log('Test dữ liệu từ session', JSON.parse(result as string));
    const item: any = JSON.parse(result as string);
    this.idDBH = item.id;
    // this.http.get<any>(`${this.phan}`)
    this.columnDefinitions = [];
    this.columnDefinitions1 = [
      {
        id: 'popup',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonTongHop,
        maxWidth: 60,
        minWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          // console.log(args);
          this.idBBTN = args.dataContext.id;
          // this.openPopupChiTietLoi();
          // this.resultPopup('lot');
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },
      // {
      //   id: 'popup',
      //   field: 'id',
      //   name: 'Option',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   formatter: this.buttonSerial,
      //   maxWidth: 60,
      //   minWidth: 60,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     console.log(args);
      //     this.resultPopup('lot');
      //     this.angularGrid?.gridService.highlightRow(args.row, 1500);
      //     this.angularGrid?.gridService.setSelectedRow(args.row);
      //   },
      // },
      // {
      //   id: 'popup',
      //   field: 'id',
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,
      //   formatter: this.buttonLot,
      //   maxWidth: 60,
      //   minWidth: 60,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     console.log(args);
      //     this.resultPopup('lot');
      //     this.angularGrid?.gridService.highlightRow(args.row, 1500);
      //     this.angularGrid?.gridService.setSelectedRow(args.row);
      //   },
      // },
      {
        id: 'edit',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        params: { iconCssClass: 'fa fa-pencil pointer' },
        maxWidth: 60,
        minWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          sessionStorage.setItem('sessionStorage', JSON.stringify(args));
          // console.log('agrs', args);
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },

      {
        id: 'id',
        name: 'STT',
        field: 'id',
        sortable: true,
        filterable: true,
        type: FieldType.number,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'name',
        name: 'Tên sản phẩm',
        field: 'tenSanPham',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInput,
        },
      },
      {
        id: 'tinhTrangBaoHanh',
        name: 'Tình trạng bảo hành',
        field: 'tinhTrang',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'slTiepNhan',
        name: 'Số lượng đã nhận',
        field: 'slTiepNhan',
        sortable: true,
        filterable: true,
        type: FieldType.number,

        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'slTon',
        name: 'Số lượng còn lại',
        field: 'slTon',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        formatter: Formatters.complexObject,

        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
      {
        id: 'checked',
        name: 'Checked',
        field: 'checked',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        formatter: Formatters.complexObject,

        filter: {
          placeholder: 'Search',
          model: Filters.compoundInputText,
        },
      },
    ];
    this.gridOptions1 = {
      enableAutoResize: true,
      enableFiltering: true,
      enableSorting: true,
      gridHeight: 225,
      gridWidth: 1780,
      enablePagination: true,
      enableColumnPicker: true,
      // enableRowDetailView: true,
      // rowDetailView: {
      //   columnIndexPosition: 4,
      //   process: item => this.simulateServerAsyncCall(item),
      //   loadOnce: true,
      //   singleRowExpand: true,
      //   useRowClick: true,
      //   panelRows: 10,
      //   preloadComponent: PhanTichSanPhamReLoadComponent,
      //   viewComponent: PhanTichThongTinSanPhamComponent,
      //   parent: true,
      // },
      pagination: {
        pageSize: 10,
        pageSizes: [5, 10, 20],
      },
      editable: true,
      enableCellNavigation: true,
    };
    this.loadAll();
    this.getTinhTrangBaoHanh();
    this.resultChiTietSanPhamTiepNhans = this.showData(item.id);
  }
  // lấy dữ liệu chi tiết phân tích
  showData(id: number | undefined): any[] {
    var list1: any[] = [];
    // lấy danh sách chi tiết sản phẩm tiếp nhận lấy theo id
    this.http.get<any>(`${this.chiTietSanPhamTiepNhanUrl}/${id as number}`).subscribe(res => {
      this.chiTietSanPhamTiepNhans = res;
      // console.log('b', res);
      // lấy danh sách tình trạng
      this.http.get<any>(this.danhSachTinhTrangUrl).subscribe(resTT => {
        this.danhSachTinhTrang = resTT;
        // sessionStorage.setItem('danhSachTinhTrang', JSON.stringify(resTT));
        // console.log('danh sách tình trạng', resTT);
        // lấy danh sách phân loại chi tiết tiếp nhận
        this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res1 => {
          this.phanLoaiChiTietTiepNhans = res1;
          // sessionStorage.setItem('phan loai chi tiet tiep nhan', JSON.stringify(res1));
          // console.log('phan loai chi tiet tiep nhan', res1);
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
                  id: this.phanLoaiChiTietTiepNhans[i].id,
                  tenSanPham: this.chiTietSanPhamTiepNhans[j].sanPham?.name as string,
                  tinhTrang: this.phanLoaiChiTietTiepNhans[i].danhSachTinhTrang?.tenTinhTrangPhanLoai as string,
                  slTiepNhan: this.phanLoaiChiTietTiepNhans[i].soLuong as number,
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
    // lấy dữ liệu từ sessision
    var result = sessionStorage.getItem(`PhanTich ${id as number}`);
    // dữ liệu lưu trong sessison(dạng string) -> chuyển về dạng JSON (giống arr,obj)
    list1 = JSON.parse(result as string);
    // console.log('hien trang', JSON.parse(result as string));
    return list1;
  }

  //--------------------------
  // openPopupChiTietLoi(): void {
  //   this.aaaa.openPopupChiTietLoi();
  // }

  simulateServerAsyncCall(item: any): Promise<unknown> {
    return new Promise(resolve => {
      setTimeout(() => {
        const itemDetail = item;
        // console.log(item);

        // resolve the data after delay specified
        resolve(itemDetail);
      }, 1000);
    });
  }

  getTinhTrangBaoHanh(): void {
    this.http.get<any>(this.phanLoaiChiTietTiepNhanUrl).subscribe(res => {
      this.phanTichChiTietSanPham = res;
      sessionStorage.setItem('tinh trang bao hanh', JSON.stringify(res));
      // console.log('res', res);
    });
  }

  // resultPopup(type: string): void {
  //   this.popupChiTietLoi = true;
  //   this.aaaa.resultPopup(this.popupChiTietLoi, type);
  // }
}
