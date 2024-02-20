import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { INhomKhachHang, NhomKhachHang } from '../nhom-khach-hang.model';
import { NhomKhachHangService } from '../service/nhom-khach-hang.service';

@Component({
  selector: 'jhi-nhom-khach-hang-update',
  templateUrl: './nhom-khach-hang-update.component.html',
})
export class NhomKhachHangUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    tenNhomKhachHang: [],
    ngayTao: [],
    ngayCapNhat: [],
    username: [],
    trangThai: [],
  });

  constructor(protected nhomKhachHangService: NhomKhachHangService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nhomKhachHang }) => {
      if (nhomKhachHang.id === undefined) {
        const today = dayjs().startOf('day');
        nhomKhachHang.ngayTao = today;
        nhomKhachHang.ngayCapNhat = today;
      }

      this.updateForm(nhomKhachHang);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const nhomKhachHang = this.createFromForm();
    if (nhomKhachHang.id !== undefined) {
      this.subscribeToSaveResponse(this.nhomKhachHangService.update(nhomKhachHang));
    } else {
      this.subscribeToSaveResponse(this.nhomKhachHangService.create(nhomKhachHang));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INhomKhachHang>>): void {
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

  protected updateForm(nhomKhachHang: INhomKhachHang): void {
    this.editForm.patchValue({
      id: nhomKhachHang.id,
      tenNhomKhachHang: nhomKhachHang.tenNhomKhachHang,
      ngayTao: nhomKhachHang.ngayTao ? nhomKhachHang.ngayTao.format(DATE_TIME_FORMAT) : null,
      ngayCapNhat: nhomKhachHang.ngayCapNhat ? nhomKhachHang.ngayCapNhat.format(DATE_TIME_FORMAT) : null,
      username: nhomKhachHang.username,
      trangThai: nhomKhachHang.trangThai,
    });
  }

  protected createFromForm(): INhomKhachHang {
    return {
      ...new NhomKhachHang(),
      id: this.editForm.get(['id'])!.value,
      tenNhomKhachHang: this.editForm.get(['tenNhomKhachHang'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      ngayCapNhat: this.editForm.get(['ngayCapNhat'])!.value
        ? dayjs(this.editForm.get(['ngayCapNhat'])!.value, DATE_TIME_FORMAT)
        : undefined,
      username: this.editForm.get(['username'])!.value,
      trangThai: this.editForm.get(['trangThai'])!.value,
    };
  }
}
