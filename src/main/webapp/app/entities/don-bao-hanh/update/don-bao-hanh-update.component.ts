import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IDonBaoHanh, DonBaoHanh } from '../don-bao-hanh.model';
import { DonBaoHanhService } from '../service/don-bao-hanh.service';
import { IKhachHang } from 'app/entities/khach-hang/khach-hang.model';
import { KhachHangService } from 'app/entities/khach-hang/service/khach-hang.service';

@Component({
  selector: 'jhi-don-bao-hanh-update',
  templateUrl: './don-bao-hanh-update.component.html',
})
export class DonBaoHanhUpdateComponent implements OnInit {
  isSaving = false;

  khachHangsSharedCollection: IKhachHang[] = [];

  editForm = this.fb.group({
    id: [],
    ngayTiepNhan: [],
    trangThai: [],
    nhanVienGiaoHang: [],
    ngaykhkb: [],
    nguoiTaoDon: [],
    slTiepNhan: [],
    slDaPhanTich: [],
    ghiChu: [],
    ngayTraBienBan: [],
    khachHang: [],
  });

  constructor(
    protected donBaoHanhService: DonBaoHanhService,
    protected khachHangService: KhachHangService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ donBaoHanh }) => {
      if (donBaoHanh.id === undefined) {
        const today = dayjs().startOf('day');
        donBaoHanh.ngaykhkb = today;
        donBaoHanh.ngayTraBienBan = today;
      }

      this.updateForm(donBaoHanh);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const donBaoHanh = this.createFromForm();
    if (donBaoHanh.id !== undefined) {
      this.subscribeToSaveResponse(this.donBaoHanhService.update(donBaoHanh));
    } else {
      this.subscribeToSaveResponse(this.donBaoHanhService.create(donBaoHanh));
    }
  }

  trackKhachHangById(_index: number, item: IKhachHang): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDonBaoHanh>>): void {
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

  protected updateForm(donBaoHanh: IDonBaoHanh): void {
    this.editForm.patchValue({
      id: donBaoHanh.id,
      ngayTiepNhan: donBaoHanh.ngayTiepNhan,
      trangThai: donBaoHanh.trangThai,
      nhanVienGiaoHang: donBaoHanh.nhanVienGiaoHang,
      ngaykhkb: donBaoHanh.ngaykhkb ? donBaoHanh.ngaykhkb : null,
      nguoiTaoDon: donBaoHanh.nguoiTaoDon,
      slTiepNhan: donBaoHanh.slTiepNhan,
      slDaPhanTich: donBaoHanh.slDaPhanTich,
      ghiChu: donBaoHanh.ghiChu,
      ngayTraBienBan: donBaoHanh.ngayTraBienBan ? donBaoHanh.ngayTraBienBan : null,
      khachHang: donBaoHanh.khachHang,
    });

    this.khachHangsSharedCollection = this.khachHangService.addKhachHangToCollectionIfMissing(
      this.khachHangsSharedCollection,
      donBaoHanh.khachHang
    );
  }

  protected loadRelationshipsOptions(): void {
    this.khachHangService
      .query()
      .pipe(map((res: HttpResponse<IKhachHang[]>) => res.body ?? []))
      .pipe(
        map((khachHangs: IKhachHang[]) =>
          this.khachHangService.addKhachHangToCollectionIfMissing(khachHangs, this.editForm.get('khachHang')!.value)
        )
      )
      .subscribe((khachHangs: IKhachHang[]) => (this.khachHangsSharedCollection = khachHangs));
  }

  protected createFromForm(): IDonBaoHanh {
    return {
      ...new DonBaoHanh(),
      id: this.editForm.get(['id'])!.value,
      ngayTiepNhan: this.editForm.get(['ngayTiepNhan'])!.value,
      trangThai: this.editForm.get(['trangThai'])!.value,
      nhanVienGiaoHang: this.editForm.get(['nhanVienGiaoHang'])!.value,
      ngaykhkb: this.editForm.get(['ngaykhkb'])!.value,
      nguoiTaoDon: this.editForm.get(['nguoiTaoDon'])!.value,
      slTiepNhan: this.editForm.get(['slTiepNhan'])!.value,
      slDaPhanTich: this.editForm.get(['slDaPhanTich'])!.value,
      ghiChu: this.editForm.get(['ghiChu'])!.value,
      ngayTraBienBan: this.editForm.get(['ngayTraBienBan'])!.value,
      khachHang: this.editForm.get(['khachHang'])!.value,
    };
  }
}
