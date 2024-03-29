import { ApplicationConfigService } from './../../../core/config/application-config.service';
import { Subscription } from 'rxjs';
import { INhomSanPham } from './../../nhom-san-pham/nhom-san-pham.model';
import { NhomSanPhamService } from 'app/entities/nhom-san-pham/service/nhom-san-pham.service';
import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISanPham } from '../san-pham.model';
import { SanPhamService } from '../service/san-pham.service';
// import { SanPhamDeleteDialogComponent } from '../delete/san-pham-delete-dialog.component';

import {
  AngularGridInstance,
  Column,
  ContainerService,
  Editors,
  FieldType,
  Filters,
  Formatter,
  Formatters,
  GridOption,
  LongTextEditorOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';

@Component({
  selector: 'jhi-san-pham',
  templateUrl: './san-pham.component.html',
  // styleUrls: ['./san-pham.component.css'],
})
export class SanPhamComponent implements OnInit {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/san-pham/update');
  sanPhamsUrl = this.applicationConfigService.getEndpointFor('api/san-pham');
  listSanPhamUrl = this.applicationConfigService.getEndpointFor('api/san-phams/update');

  sanPhams: any[] = [];
  nhomSanPhams?: INhomSanPham[];
  angularGrid?: AngularGridInstance;
  exportBeforeSub?: Subscription;
  exportAfterSub?: Subscription;
  dataViewObj: any;
  gridObj: any;
  dataset: any[] = [];
  columnDefinitions?: ISanPham[];
  sanPhamEditor: ISanPham[] = [];

  isLoading = false;
  popupChinhSuaThongTin = false;

  title = 'Danh sách sản phẩm';

  columnDefinitions1: Column[] = [];
  gridOptions1!: GridOption;
  alertWarning: any;

  constructor(
    protected sanPhamService: SanPhamService,
    protected nhomSanPhamService: NhomSanPhamService,
    protected modalService: NgbModal,
    protected containerService: ContainerService,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected navBarComponent: NavbarComponent
  ) {}

  buttonEdit: Formatter<any> = (_row, _cell, value) =>
    value
      ? `<button class="btn btn-warning fa fa-pencil" style="height: 28px; line-height: 14px; width: 2.5rem"></button>`
      : { text: '<button class="btn btn-warning fa fa-pencil" style="height: 28px; line-height: 14px" title="Chỉnh sửa"></button>' };

  loadAll(): void {
    this.navBarComponent.toggleSidebar2();
    this.isLoading = true;
    this.sanPhamService.query().subscribe({
      next: (res1: HttpResponse<ISanPham[]>) => {
        this.isLoading = false;
        this.sanPhams = res1.body ?? [];
        // console.log(this.sanPhams);

        this.nhomSanPhamService.query().subscribe({
          next: (res: HttpResponse<INhomSanPham[]>) => {
            this.isLoading = false;
            this.nhomSanPhams = res.body ?? [];
            // lay danh sach san pham
            // if (this.sanPhams !== undefined) {
            for (let i = 0; i < this.nhomSanPhams.length; i++) {
              for (let j = 0; j < this.sanPhams.length; j++) {
                if (
                  this.nhomSanPhams[i].chungLoai &&
                  this.sanPhams[j].nhomSanPham &&
                  this.sanPhams[j].nhomSanPham?.name === this.nhomSanPhams[i].name
                ) {
                  this.sanPhams[j].tenChungLoai = this.nhomSanPhams[i].chungLoai?.tenChungLoai;
                }
              }
            }
            // }
          },
          error: () => {
            this.isLoading = false;
          },
        });
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
        id: 'edit',
        field: 'id',
        name: 'Options',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: this.buttonEdit,
        minWidth: 60,
        maxWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(args);
          const items = args.dataContext;
          // this.alertWarning = `Editing: ${args.dataContext.title}`
          this.angularGrid?.gridService.highlightRow(args.row, 1500);
          this.angularGrid?.gridService.setSelectedRow(args.row);
          this.http.post<any>(`${this.resourceUrl}/${items.id as number}`, items).subscribe(() => {
            console.log('aaaa', items);
          });
        },
      },
      {
        id: 'stt',
        name: 'STT',
        field: 'id',
        sortable: true,
        // filterable: true,
        minWidth: 60,
        maxWidth: 60,
        // type: FieldType.string,
      },
      {
        id: 'tenSanPham',
        name: 'Tên sản phẩm',
        field: 'tenSanPham',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        formatter: Formatters.complexObject,
        minWidth: 300,
        maxWidth: 350,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.autoComplete,
          required: true,
          maxLength: 100,
          editorOptions: {
            minLength: 1,
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'nhomSanPham',
        name: 'Nhóm sản phẩm',
        field: 'tenNhomSanPham',
        formatter: Formatters.complexObject,
        sortable: true,
        filterable: true,
        minWidth: 150,
        maxWidth: 200,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.longText,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
            // collectionAsync: this.http.put(`${this.resourceUrl}/${id}`, this.sanPhams).subscribe(() => {
            //   console.log('cap nhat', this.sanPhams)
            // })
          } as LongTextEditorOption,
        },
      },
      {
        id: 'sapCode',
        name: 'SAP Code',
        field: 'sapCode',
        filterable: true,
        formatter: Formatters.dateIso,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,

          // collection: [
          //   { value: '', label: '' },
          //   { value: true, label: 'Thành phẩm' },
          //   { value: false, label: 'Bán thành phẩm' },
          // ],
          // model: Filters.singleSelect,
        },
        editor: {
          model: Editors.longText,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'rdCode',
        name: 'RD Code',
        field: 'rdCode',
        filterable: true,
        formatter: Formatters.complexObject,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.longText,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'chungLoai',
        name: 'Chủng loại',
        field: 'tenChungLoai',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.longText,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'nganh',
        name: 'Ngành',
        field: 'tenNganh',
        formatter: Formatters.complexObject,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.longText,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'donVi',
        name: 'DV',
        field: 'donVi',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.longText,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'kho',
        name: 'Kho',
        field: 'tenKho',
        formatter: Formatters.complexObject,
        sortable: true,
        filterable: true,
        minWidth: 60,
        maxWidth: 80,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.longText,
          required: true,
          maxLength: 100,
          editorOptions: {
            cols: 42,
            rows: 5,
          } as LongTextEditorOption,
        },
      },
      {
        id: 'phanLoai',
        name: 'Phân loại',
        field: 'phanLoai',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        filter: {
          placeholder: 'search',
          model: Filters.compoundInputText,
        },
        editor: {
          model: Editors.longText,
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
      // asyncEditorLoadDelay: 3000,
      dataView: {
        syncGridSelection: true,
      },
      pagination: {
        pageSizes: [20, 50, this.sanPhams.length],
        pageSize: 10,
      },
      columnPicker: {
        hideForceFitButton: true,
        hideSyncResizeButton: true,
        onColumnsChanged(e, args) {
          console.log('Column selection changed from Column Picker, visible columns: ', args.visibleColumns);
        },
      },
      editable: true,
      enableCellNavigation: true,
      gridHeight: 500,
      gridWidth: '100%',
    };
    this.http.get<any[]>('api/san-phams/list').subscribe((res: any) => {
      this.sanPhams = res;
    });
  }

  addItem(): void {
    console.log(this.sanPhams.length + 1);
    this.sanPhams = [
      ...this.sanPhams,
      {
        id: this.sanPhams.length + 1,
        tenSanPham: this.sanPhams[this.sanPhams.length]?.name,
        nhomSanPhams: this.sanPhams[this.sanPhams.length]?.nhomSanPham?.name,
        sapCode: this.sanPhams[this.sanPhams.length]?.sapCode,
        rdCode: this.sanPhams[this.sanPhams.length]?.rdCode,
        chungLoai: this.sanPhams[this.sanPhams.length]?.tenChungLoai,
        nganh: this.sanPhams[this.sanPhams.length]?.nganh?.tenNganh,
        donVi: this.sanPhams[this.sanPhams.length]?.donVi,
        kho: this.sanPhams[this.sanPhams.length]?.kho?.tenKho,
        phanLoai: this.sanPhams[this.sanPhams.length]?.phanLoai,
      },
    ];
    this.sanPhams.sort((a, b) => b.id - a.id);
  }
  angularGridReady(angularGrid: any): void {
    this.angularGrid = angularGrid;

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }
  // popup edit
  openPopupEditSP(id: number, items: any): void {
    this.popupChinhSuaThongTin = true;
    this.http.post<any>(`${this.resourceUrl}/${items.id as number}`, items).subscribe(() => {
      console.log('aaaa', items);
    });
  }
}
