import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ILoi, Loi } from '../loi.model';
import { LoiService } from '../service/loi.service';
import { INhomLoi } from 'app/entities/nhom-loi/nhom-loi.model';
import { NhomLoiService } from 'app/entities/nhom-loi/service/nhom-loi.service';

@Component({
  selector: 'jhi-loi-update',
  templateUrl: './loi-update.component.html',
})
export class LoiUpdateComponent implements OnInit {
  isSaving = false;

  nhomLoisSharedCollection: INhomLoi[] = [];

  editForm = this.fb.group({
    id: [],
    errCode: [],
    tenLoi: [],
    ngayTao: [],
    ngayCapNhat: [],
    username: [],
    chiChu: [],
    trangThai: [],
    nhomLoi: [],
  });

  constructor(
    protected loiService: LoiService,
    protected nhomLoiService: NhomLoiService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loi }) => {
      if (loi.id === undefined) {
        const today = dayjs().startOf('day');
        loi.ngayTao = today;
        loi.ngayCapNhat = today;
      }

      this.updateForm(loi);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loi = this.createFromForm();
    if (loi.id !== undefined) {
      this.subscribeToSaveResponse(this.loiService.update(loi));
    } else {
      this.subscribeToSaveResponse(this.loiService.create(loi));
    }
  }

  trackNhomLoiById(_index: number, item: INhomLoi): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoi>>): void {
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

  protected updateForm(loi: ILoi): void {
    this.editForm.patchValue({
      id: loi.id,
      errCode: loi.errCode,
      tenLoi: loi.tenLoi,
      ngayTao: loi.ngayTao ? loi.ngayTao.format(DATE_TIME_FORMAT) : null,
      ngayCapNhat: loi.ngayCapNhat ? loi.ngayCapNhat.format(DATE_TIME_FORMAT) : null,
      username: loi.username,
      chiChu: loi.chiChu,
      trangThai: loi.trangThai,
      nhomLoi: loi.nhomLoi,
    });

    this.nhomLoisSharedCollection = this.nhomLoiService.addNhomLoiToCollectionIfMissing(this.nhomLoisSharedCollection, loi.nhomLoi);
  }

  protected loadRelationshipsOptions(): void {
    this.nhomLoiService
      .query()
      .pipe(map((res: HttpResponse<INhomLoi[]>) => res.body ?? []))
      .pipe(
        map((nhomLois: INhomLoi[]) => this.nhomLoiService.addNhomLoiToCollectionIfMissing(nhomLois, this.editForm.get('nhomLoi')!.value))
      )
      .subscribe((nhomLois: INhomLoi[]) => (this.nhomLoisSharedCollection = nhomLois));
  }

  protected createFromForm(): ILoi {
    return {
      ...new Loi(),
      id: this.editForm.get(['id'])!.value,
      errCode: this.editForm.get(['errCode'])!.value,
      tenLoi: this.editForm.get(['tenLoi'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      ngayCapNhat: this.editForm.get(['ngayCapNhat'])!.value
        ? dayjs(this.editForm.get(['ngayCapNhat'])!.value, DATE_TIME_FORMAT)
        : undefined,
      username: this.editForm.get(['username'])!.value,
      chiChu: this.editForm.get(['chiChu'])!.value,
      trangThai: this.editForm.get(['trangThai'])!.value,
      nhomLoi: this.editForm.get(['nhomLoi'])!.value,
    };
  }
}
