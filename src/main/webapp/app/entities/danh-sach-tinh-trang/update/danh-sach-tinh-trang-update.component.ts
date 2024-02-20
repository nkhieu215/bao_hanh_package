import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IDanhSachTinhTrang, DanhSachTinhTrang } from '../danh-sach-tinh-trang.model';
import { DanhSachTinhTrangService } from '../service/danh-sach-tinh-trang.service';

@Component({
  selector: 'jhi-danh-sach-tinh-trang-update',
  templateUrl: './danh-sach-tinh-trang-update.component.html',
})
export class DanhSachTinhTrangUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    tenTinhTrangPhanLoai: [],
    ngayTao: [],
    ngayCapNhat: [],
    username: [],
    trangThai: [],
  });

  constructor(
    protected danhSachTinhTrangService: DanhSachTinhTrangService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ danhSachTinhTrang }) => {
      if (danhSachTinhTrang.id === undefined) {
        const today = dayjs().startOf('day');
        danhSachTinhTrang.ngayTao = today;
        danhSachTinhTrang.ngayCapNhat = today;
      }

      this.updateForm(danhSachTinhTrang);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const danhSachTinhTrang = this.createFromForm();
    if (danhSachTinhTrang.id !== undefined) {
      this.subscribeToSaveResponse(this.danhSachTinhTrangService.update(danhSachTinhTrang));
    } else {
      this.subscribeToSaveResponse(this.danhSachTinhTrangService.create(danhSachTinhTrang));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDanhSachTinhTrang>>): void {
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

  protected updateForm(danhSachTinhTrang: IDanhSachTinhTrang): void {
    this.editForm.patchValue({
      id: danhSachTinhTrang.id,
      tenTinhTrangPhanLoai: danhSachTinhTrang.tenTinhTrangPhanLoai,
      ngayTao: danhSachTinhTrang.ngayTao ? danhSachTinhTrang.ngayTao.format(DATE_TIME_FORMAT) : null,
      ngayCapNhat: danhSachTinhTrang.ngayCapNhat ? danhSachTinhTrang.ngayCapNhat.format(DATE_TIME_FORMAT) : null,
      username: danhSachTinhTrang.username,
      trangThai: danhSachTinhTrang.trangThai,
    });
  }

  protected createFromForm(): IDanhSachTinhTrang {
    return {
      ...new DanhSachTinhTrang(),
      id: this.editForm.get(['id'])!.value,
      tenTinhTrangPhanLoai: this.editForm.get(['tenTinhTrangPhanLoai'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      ngayCapNhat: this.editForm.get(['ngayCapNhat'])!.value
        ? dayjs(this.editForm.get(['ngayCapNhat'])!.value, DATE_TIME_FORMAT)
        : undefined,
      username: this.editForm.get(['username'])!.value,
      trangThai: this.editForm.get(['trangThai'])!.value,
    };
  }
}
