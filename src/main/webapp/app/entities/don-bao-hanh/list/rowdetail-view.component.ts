import { IPhanLoaiChiTietTiepNhan } from './../../phan-loai-chi-tiet-tiep-nhan/phan-loai-chi-tiet-tiep-nhan.model';
import { IDanhSachTinhTrang } from './../../danh-sach-tinh-trang/danh-sach-tinh-trang.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChiTietSanPhamTiepNhanService } from 'app/entities/chi-tiet-san-pham-tiep-nhan/service/chi-tiet-san-pham-tiep-nhan.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IChiTietSanPhamTiepNhan } from 'app/entities/chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.model';
import { Component } from '@angular/core';
import {
  Column,
  GridOption,
  Formatters,
  OnEventArgs,
  AngularGridInstance,
  FieldType,
  Filters,
  AngularUtilService,
  Editors,
  LongTextEditorOption,
  AutoCompleteEditor,
  AutocompleteOption,
} from 'angular-slickgrid';
import { stringify } from 'querystring';
import { SanPhamService } from 'app/entities/san-pham/service/san-pham.service';
import { ISanPham } from 'app/entities/san-pham/san-pham.model';
import { IKhachHang } from 'app/entities/khach-hang/khach-hang.model';
import { faL } from '@fortawesome/free-solid-svg-icons';

const NB_ITEMS = 10;

@Component({
  template: `<div id="demo-container" class="container-fluid">
    <!-- <h2>
      {{ title }}
    </h2>
    <h3>Grid 1</h3> -->
    <button class="btn btn-sm btn-outline-primary" (click)="addItem()">Thêm mới</button>
    <angular-slickgrid
      gridId="chi-tiet-san-pham-tiep-nhans"
      [columnDefinitions]="columnDefinitions1"
      [gridOptions]="gridOptions1"
      [dataset]="resultChiTietSanPhamTiepNhans"
    >
    </angular-slickgrid>
  </div>`,
  providers: [AngularUtilService],
})
export class RowDetailViewComponent {
  chiTietSanPhamTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/chi-tiet-don-bao-hanhs');
  danhSachTinhTrangUrl = this.applicationConfigService.getEndpointFor('api/danh-sach-tinh-trangs');
  phanLoaiChiTietTiepNhanUrl = this.applicationConfigService.getEndpointFor('api/phan-loai-chi-tiet-tiep-nhans');
  sanPhamsUrl = this.applicationConfigService.getEndpointFor('api/san-phams');
  chiTietSanPhamTiepNhans: IChiTietSanPhamTiepNhan[] = [];
  columnDefinitions?: IChiTietSanPhamTiepNhan[];

  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions1!: GridOption;
  gridOptions2!: GridOption;
  dataset1!: any[];
  dataset2!: any[];
  angularGrid?: AngularGridInstance;
  sanPhams!: ISanPham[];
  isLoading = false;
  soLuongDoiMoi = '';
  soLuongSuaChua = '';
  soLuongKhongBaoHanh = '';

  danhSachTinhTrang?: IDanhSachTinhTrang[];
  phanLoaiChiTietTiepNhans: IPhanLoaiChiTietTiepNhan[] = [];
  resultChiTietSanPhamTiepNhans: any[] = [];
  resultPhanLoaiChiTietSanPhamTiepNhans: any[] = [];

  constructor(
    protected chiTietSanPhamTiepNhanService: ChiTietSanPhamTiepNhanService,
    protected modalService: NgbModal,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected sanPhamService: SanPhamService
  ) {}

  loadAll(): void {
    this.isLoading = true;
    this.chiTietSanPhamTiepNhanService.query().subscribe({
      next: (res: HttpResponse<IChiTietSanPhamTiepNhan[]>) => {
        this.isLoading = false;
        this.chiTietSanPhamTiepNhans = res.body ?? [];
        // console.log('chi tiet san pham tiep nhan', this.chiTietSanPhamTiepNhans);
      },
      error: () => {
        this.isLoading = false;
      },
    });
    // this.getTenTinhTrangSanPham();
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    //  this.loadAll();
    const result = sessionStorage.getItem('sessionStorage');
    // console.log('Test dữ liệu từ session', JSON.parse(result as string));
    const item: any = JSON.parse(result as string);
    // this.getChiTietMaTiepNhan(item.id);
    // console.log(item.id);
    // this.getTenTinhTrangSanPham();
    // this.getDanhSachPhanLoaiChiTietTiepNhan();
    // this.showData(item.id);
    // this.showResultTinhTrang();

    this.columnDefinitions = [];
    this.columnDefinitions1 = [
      {
        id: 'delete',
        field: 'id',
        name: 'Options',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        params: { iconCssClass: 'fa fa-delete pointer' },
        minWidth: 60,
        maxWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          // console.log(args);
          // this.alertWarning = `Editing: ${args.dataContext.title}`
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
        },
      },
      {
        id: 'id',
        name: 'STT',
        field: 'id',
        sortable: true,
        type: FieldType.number,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        minWidth: 60,
        maxWidth: 60,
      },
      {
        id: 'tenSanPham',
        name: 'Tên sản phẩm',
        field: 'tenSanPham',
        sortable: true,
        filterable: true,
        type: FieldType.object,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.autoComplete,
          placeholder: '🔎︎ search city',

          // We can use the autocomplete through 3 ways "collection", "collectionAsync" or with your own autocomplete options
          // use your own autocomplete options, instead of fetch-jsonp, use http
          // here we use fetch-jsonp just because I'm not sure how to configure http with JSONP and CORS
          editorOptions: {
            forceUserInput: true,
            minLength: 3,
            fetch: (searchText: string, updateCallback: (items: false | any[]) => void) => {
              /** with Angular Http, note this demo won't work because of CORS */
              this.sanPhams = this.sanPhams.filter(item1 => item1.name?.includes(searchText));
              updateCallback(this.sanPhams);
              /** with JSONP AJAX will work locally but not on the GitHub demo because of CORS */
            },
          } as unknown as AutocompleteOption,
        },
      },
      {
        id: 'slDoiMoi',
        name: 'Đổi mới',
        field: 'slDoiMoi',
        sortable: true,
        filterable: true,
        type: FieldType.number,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputNumber,
        },
        editor: {
          model: Editors.integer,
          required: true,
          maxLength: 100,
          editorOptions: {
            onCellClick: (e: Event, args: OnEventArgs) => {
              // console.log(args);
              (args.dataContext.slTiepNhan =
                Number(args.dataContext.slDoiMoi) + Number(args.dataContext.slSuaChua) + Number(args.dataContext.slKhongBaoHanh)),
                // this.alertWarning = `Editing: ${args.dataContext.title}`
                this.angularGrid?.gridService.highlightRow(args.row, 1500);
              this.angularGrid?.gridService.setSelectedRow(args.row);
            },
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'slSuaChua',
        name: 'Sửa chữa',
        field: 'slSuaChua',
        sortable: true,
        filterable: true,
        type: FieldType.number,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputNumber,
        },
        editor: {
          model: Editors.integer,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'slKhongBaoHanh',
        name: 'Không bảo hành',
        field: 'slKhongBaoHanh',
        sortable: true,
        filterable: true,
        type: FieldType.number,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputNumber,
        },
        editor: {
          model: Editors.integer,
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
        name: 'Số lượng đã nhận',
        field: 'slTiepNhan',
        sortable: true,
        filterable: true,
        type: FieldType.number,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputNumber,
        },
        editor: {
          model: Editors.integer,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      // {
      //   id: 'sanPhamPhantich',
      //   name: 'Sản phẩm phân tích',
      //   field: 'sanPhamPhanTich',
      //   sortable: true,
      //   filterable: true,
      //   formatter: Formatters.checkmark,

      //   type: FieldType.boolean,
      //   filter: {
      //     placeholder: 'search',
      //     model: Filters.compoundInputText,
      //   },
      // },
    ];
    this.gridOptions1 = {
      enableCellNavigation: true,
      editable: true,
      autoEdit: true,
      enableAutoResize: true,
      enableSorting: true,
      enableFiltering: true,
      gridHeight: 225,
      gridWidth: 1800,
      enablePagination: true,
      enableColumnPicker: true,
      pagination: {
        pageSize: 10,
        pageSizes: [5, 10, 20],
      },
    };
    this.resultChiTietSanPhamTiepNhans = this.showData(item.id);
    this.getSanPham();
  }
  getSanPham(): void {
    this.sanPhamService.query().subscribe({
      next: (res: HttpResponse<ISanPham[]>) => {
        this.sanPhams = res.body ?? [];
        // console.log('sanPham:', this.sanPhams);
      },
    });
  }
  mockData(count: number): any {
    // mock a dataset
    const mockDataset = [];
    for (let i = 1; i < count; i++) {
      mockDataset[i] = {
        id: i,
      };
    }
    return mockDataset;
  }

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
          sessionStorage.setItem(`TiepNhan ${id as number}`, JSON.stringify(list));
        });
      });
    });
    // lấy dữ liệu từ sessision
    var result = sessionStorage.getItem(`TiepNhan ${id as number}`);
    // dữ liệu lưu trong sessison(dạng string) -> chuyển về dạng JSON (giống arr,obj)
    list1 = JSON.parse(result as string);
    // console.log('hien trang', JSON.parse(result as string));
    return list1;
  }

  //   // hàm xử lý thông tin của chi tiết sản phẩm tiếp nhận
  //   showData(): void {
  //     // khởi tạo danh sách
  //     for (let i = 0; i < this.chiTietSanPhamTiepNhans.length; i++) {
  //       let result: any;
  //       this.resultChiTietSanPhamTiepNhans[i].id = this.chiTietSanPhamTiepNhans[i].id,
  //         this.resultChiTietSanPhamTiepNhans[i].tenSanPham = this.chiTietSanPhamTiepNhans[i].sanPham.name
  //       for (let j = 0; j < this.resultChiTietSanPhamTiepNhans.length; j++) {
  //         this.resultChiTietSanPhamTiepNhans.push(result)
  //         console.log('result', this.resultChiTietSanPhamTiepNhans)
  //       }
  //     }
  //   }

  // // sắp xếp thông tin số lương đổi mới, sửa chữa, không bảo hành vào biến hiển thị trên giao diện
  //   showResultTinhTrang(): any {
  //     this.phanLoaiChiTietTiepNhans = this.getDanhSachPhanLoaiChiTietTiepNhan()
  //     console.log('danh sach phan loai', this.phanLoaiChiTietTiepNhans)
  //     // gán giá trị vào từng ptu
  //     for (let i = 0; i < this.resultChiTietSanPhamTiepNhans.length; i++) {
  //       if (this.phanLoaiChiTietTiepNhans) {
  //         for (let j = 0; j < this.phanLoaiChiTietTiepNhans.length; j++) {
  //           if (this.phanLoaiChiTietTiepNhans[j].id === this.resultChiTietSanPhamTiepNhans[i].id) {
  //               if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 1) {
  //                 this.resultChiTietSanPhamTiepNhans[i].soLuongDoiMoi = this.phanLoaiChiTietTiepNhans[j].soLuong
  //               }
  //               if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 2) {
  //                 this.resultChiTietSanPhamTiepNhans[i].soLuongSuaChua = this.phanLoaiChiTietTiepNhans[j].soLuong
  //               }
  //               if (this.phanLoaiChiTietTiepNhans[j].danhSachTinhTrang?.id === 3) {
  //                 this.resultChiTietSanPhamTiepNhans[i].soLuongDoiMoi = this.phanLoaiChiTietTiepNhans[j].soLuong
  //               }
  //           }
  //         }
  //       }
  //     }
  //   }

  // xử lý dữ liệu tên tình trạng
  // resultTenTinhTrangPhanLoai(): void {

  // }

  addItem(): void {
    this.resultChiTietSanPhamTiepNhans = [
      ...this.resultChiTietSanPhamTiepNhans,
      {
        id: this.resultChiTietSanPhamTiepNhans.length + 1,
        tenSanPham: this.resultChiTietSanPhamTiepNhans[this.resultChiTietSanPhamTiepNhans.length]?.tenSanPham,
        slDoiMoi: this.resultChiTietSanPhamTiepNhans[this.resultChiTietSanPhamTiepNhans.length]?.slDoiMoi,
        slSuaChua: this.resultChiTietSanPhamTiepNhans[this.resultChiTietSanPhamTiepNhans.length]?.slSuaChua,
        slKhongBaoHanh: this.resultChiTietSanPhamTiepNhans[this.resultChiTietSanPhamTiepNhans.length]?.slKhongBaoHanh,
        slTiepNhan: this.resultChiTietSanPhamTiepNhans[this.resultChiTietSanPhamTiepNhans.length]?.slTiepNhan,
      },
    ];
  }
}
