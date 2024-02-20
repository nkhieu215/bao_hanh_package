import { Subscription } from 'rxjs';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
  FieldType,
  Filters,
  Editors,
  LongTextEditorOption,
} from 'angular-slickgrid';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChungLoai } from '../chung-loai.model';
import { ChungLoaiService } from '../service/chung-loai.service';
import { ChungLoaiDeleteDialogComponent } from '../delete/chung-loai-delete-dialog.component';

@Component({
  selector: 'jhi-chung-loai',
  templateUrl: './chung-loai.component.html',
})
export class ChungLoaiComponent implements OnInit {
  chungLoais: any[] = [];
  angularGrid?: AngularGridInstance;
  exportBeforeSub?: Subscription;
  exportAfterSub?: Subscription;
  dataset: any[] = [];
  columdefinitions?: IChungLoai[];
  isLoading = false;
  columnDefinitions1: Column[] = [];
  gridOption1!: GridOption;
  title = 'Chủng loại';

  constructor(protected chungLoaiService: ChungLoaiService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.chungLoaiService.query().subscribe({
      next: (res: HttpResponse<IChungLoai[]>) => {
        this.isLoading = false;
        this.chungLoais = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.columdefinitions = [];
    this.columnDefinitions1 = [
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
          const items = args.dataContext;
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
          this.angularGrid?.gridService.deleteItemById(args.row);
          this.angularGrid?.gridService.deleteItems(args.row);
        },
      },
      {
        id: 'stt',
        name: 'STT',
        field: 'stt',
      },
      {
        id: 'maChungLoai',
        name: 'Tên chủng loại',
        field: 'maChungLoai',
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
        id: 'tenChungLoai',
        name: 'Tên chủng loại',
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
        id: 'ngayTao',
        name: 'Ngày tạo',
        field: 'ngayTao',
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
    this.loadAll();
  }

  trackId(_index: number, item: IChungLoai): number {
    return item.id!;
  }

  delete(chungLoai: IChungLoai): void {
    const modalRef = this.modalService.open(ChungLoaiDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chungLoai = chungLoai;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
