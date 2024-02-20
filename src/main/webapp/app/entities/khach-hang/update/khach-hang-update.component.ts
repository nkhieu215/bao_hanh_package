import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IKhachHang, KhachHang } from '../khach-hang.model';
import { KhachHangService } from '../service/khach-hang.service';
import { INhomKhachHang } from 'app/entities/nhom-khach-hang/nhom-khach-hang.model';
import { NhomKhachHangService } from 'app/entities/nhom-khach-hang/service/nhom-khach-hang.service';
import { ITinhThanh } from 'app/entities/tinh-thanh/tinh-thanh.model';
import { TinhThanhService } from 'app/entities/tinh-thanh/service/tinh-thanh.service';

@Component({
  selector: 'jhi-khach-hang-update',
  templateUrl: './khach-hang-update.component.html',
})
export class KhachHangUpdateComponent implements OnInit {
  isSaving = false;

  nhomKhachHangsSharedCollection: INhomKhachHang[] = [];
  tinhThanhsSharedCollection: ITinhThanh[] = [];

  editForm = this.fb.group({
    id: [],
    maKhachHang: [],
    tenKhachHang: [],
    soDienThoai: [],
    diaChi: [],
    nhomKhachHang: [],
    tinhThanh: [],
  });

  constructor(
    protected khachHangService: KhachHangService,
    protected nhomKhachHangService: NhomKhachHangService,
    protected tinhThanhService: TinhThanhService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ khachHang }) => {
      this.updateForm(khachHang);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const khachHang = this.createFromForm();
    if (khachHang.id !== undefined) {
      this.subscribeToSaveResponse(this.khachHangService.update(khachHang));
    } else {
      this.subscribeToSaveResponse(this.khachHangService.create(khachHang));
    }
  }

  trackNhomKhachHangById(_index: number, item: INhomKhachHang): number {
    return item.id!;
  }

  trackTinhThanhById(_index: number, item: ITinhThanh): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKhachHang>>): void {
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

  protected updateForm(khachHang: IKhachHang): void {
    this.editForm.patchValue({
      id: khachHang.id,
      maKhachHang: khachHang.maKhachHang,
      tenKhachHang: khachHang.tenKhachHang,
      soDienThoai: khachHang.soDienThoai,
      diaChi: khachHang.diaChi,
      nhomKhachHang: khachHang.nhomKhachHang,
      tinhThanh: khachHang.tinhThanh,
    });

    this.nhomKhachHangsSharedCollection = this.nhomKhachHangService.addNhomKhachHangToCollectionIfMissing(
      this.nhomKhachHangsSharedCollection,
      khachHang.nhomKhachHang
    );
    this.tinhThanhsSharedCollection = this.tinhThanhService.addTinhThanhToCollectionIfMissing(
      this.tinhThanhsSharedCollection,
      khachHang.tinhThanh
    );
  }

  protected loadRelationshipsOptions(): void {
    this.nhomKhachHangService
      .query()
      .pipe(map((res: HttpResponse<INhomKhachHang[]>) => res.body ?? []))
      .pipe(
        map((nhomKhachHangs: INhomKhachHang[]) =>
          this.nhomKhachHangService.addNhomKhachHangToCollectionIfMissing(nhomKhachHangs, this.editForm.get('nhomKhachHang')!.value)
        )
      )
      .subscribe((nhomKhachHangs: INhomKhachHang[]) => (this.nhomKhachHangsSharedCollection = nhomKhachHangs));

    this.tinhThanhService
      .query()
      .pipe(map((res: HttpResponse<ITinhThanh[]>) => res.body ?? []))
      .pipe(
        map((tinhThanhs: ITinhThanh[]) =>
          this.tinhThanhService.addTinhThanhToCollectionIfMissing(tinhThanhs, this.editForm.get('tinhThanh')!.value)
        )
      )
      .subscribe((tinhThanhs: ITinhThanh[]) => (this.tinhThanhsSharedCollection = tinhThanhs));
  }

  protected createFromForm(): IKhachHang {
    return {
      ...new KhachHang(),
      id: this.editForm.get(['id'])!.value,
      maKhachHang: this.editForm.get(['maKhachHang'])!.value,
      tenKhachHang: this.editForm.get(['tenKhachHang'])!.value,
      soDienThoai: this.editForm.get(['soDienThoai'])!.value,
      diaChi: this.editForm.get(['diaChi'])!.value,
      nhomKhachHang: this.editForm.get(['nhomKhachHang'])!.value,
      tinhThanh: this.editForm.get(['tinhThanh'])!.value,
    };
  }
}
