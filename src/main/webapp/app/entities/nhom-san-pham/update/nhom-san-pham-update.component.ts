import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { INhomSanPham, NhomSanPham } from '../nhom-san-pham.model';
import { NhomSanPhamService } from '../service/nhom-san-pham.service';
import { IChungLoai } from 'app/entities/chung-loai/chung-loai.model';
import { ChungLoaiService } from 'app/entities/chung-loai/service/chung-loai.service';

@Component({
  selector: 'jhi-nhom-san-pham-update',
  templateUrl: './nhom-san-pham-update.component.html',
})
export class NhomSanPhamUpdateComponent implements OnInit {
  isSaving = false;

  chungLoaisSharedCollection: IChungLoai[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    timeCreate: [],
    timeUpdate: [],
    username: [],
    trangThai: [],
    chungLoai: [],
  });

  constructor(
    protected nhomSanPhamService: NhomSanPhamService,
    protected chungLoaiService: ChungLoaiService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nhomSanPham }) => {
      if (nhomSanPham.id === undefined) {
        const today = dayjs().startOf('day');
        nhomSanPham.timeUpdate = today;
      }

      this.updateForm(nhomSanPham);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const nhomSanPham = this.createFromForm();
    if (nhomSanPham.id !== undefined) {
      this.subscribeToSaveResponse(this.nhomSanPhamService.update(nhomSanPham));
    } else {
      this.subscribeToSaveResponse(this.nhomSanPhamService.create(nhomSanPham));
    }
  }

  trackChungLoaiById(_index: number, item: IChungLoai): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INhomSanPham>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(nhomSanPham: INhomSanPham): void {
    this.editForm.patchValue({
      id: nhomSanPham.id,
      name: nhomSanPham.name,
      timeCreate: nhomSanPham.timeCreate,
      timeUpdate: nhomSanPham.timeUpdate ? nhomSanPham.timeUpdate.format(DATE_TIME_FORMAT) : null,
      username: nhomSanPham.username,
      trangThai: nhomSanPham.trangThai,
      chungLoai: nhomSanPham.chungLoai,
    });

    this.chungLoaisSharedCollection = this.chungLoaiService.addChungLoaiToCollectionIfMissing(
      this.chungLoaisSharedCollection,
      nhomSanPham.chungLoai
    );
  }

  protected loadRelationshipsOptions(): void {
    this.chungLoaiService
      .query()
      .pipe(map((res: HttpResponse<IChungLoai[]>) => res.body ?? []))
      .pipe(
        map((chungLoais: IChungLoai[]) =>
          this.chungLoaiService.addChungLoaiToCollectionIfMissing(chungLoais, this.editForm.get('chungLoai')!.value)
        )
      )
      .subscribe((chungLoais: IChungLoai[]) => (this.chungLoaisSharedCollection = chungLoais));
  }

  protected createFromForm(): INhomSanPham {
    return {
      ...new NhomSanPham(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      timeCreate: this.editForm.get(['timeCreate'])!.value,
      timeUpdate: this.editForm.get(['timeUpdate'])!.value ? dayjs(this.editForm.get(['timeUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      username: this.editForm.get(['username'])!.value,
      trangThai: this.editForm.get(['trangThai'])!.value,
      chungLoai: this.editForm.get(['chungLoai'])!.value,
    };
  }
}
