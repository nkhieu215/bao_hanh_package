import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { INhomLoi, NhomLoi } from '../nhom-loi.model';
import { NhomLoiService } from '../service/nhom-loi.service';

@Component({
  selector: 'jhi-nhom-loi-update',
  templateUrl: './nhom-loi-update.component.html',
})
export class NhomLoiUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    maNhomLoi: [],
    tenNhomLoi: [],
    ngayTao: [],
    ngayCapNhat: [],
    username: [],
    ghiChu: [],
    trangThai: [],
  });

  constructor(protected nhomLoiService: NhomLoiService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nhomLoi }) => {
      if (nhomLoi.id === undefined) {
        const today = dayjs().startOf('day');
        nhomLoi.ngayTao = today;
        nhomLoi.ngayCapNhat = today;
      }

      this.updateForm(nhomLoi);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const nhomLoi = this.createFromForm();
    if (nhomLoi.id !== undefined) {
      this.subscribeToSaveResponse(this.nhomLoiService.update(nhomLoi));
    } else {
      this.subscribeToSaveResponse(this.nhomLoiService.create(nhomLoi));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INhomLoi>>): void {
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

  protected updateForm(nhomLoi: INhomLoi): void {
    this.editForm.patchValue({
      id: nhomLoi.id,
      maNhomLoi: nhomLoi.maNhomLoi,
      tenNhomLoi: nhomLoi.tenNhomLoi,
      ngayTao: nhomLoi.ngayTao ? nhomLoi.ngayTao.format(DATE_TIME_FORMAT) : null,
      ngayCapNhat: nhomLoi.ngayCapNhat ? nhomLoi.ngayCapNhat.format(DATE_TIME_FORMAT) : null,
      username: nhomLoi.username,
      ghiChu: nhomLoi.ghiChu,
      trangThai: nhomLoi.trangThai,
    });
  }

  protected createFromForm(): INhomLoi {
    return {
      ...new NhomLoi(),
      id: this.editForm.get(['id'])!.value,
      maNhomLoi: this.editForm.get(['maNhomLoi'])!.value,
      tenNhomLoi: this.editForm.get(['tenNhomLoi'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      ngayCapNhat: this.editForm.get(['ngayCapNhat'])!.value
        ? dayjs(this.editForm.get(['ngayCapNhat'])!.value, DATE_TIME_FORMAT)
        : undefined,
      username: this.editForm.get(['username'])!.value,
      ghiChu: this.editForm.get(['ghiChu'])!.value,
      trangThai: this.editForm.get(['trangThai'])!.value,
    };
  }
}
