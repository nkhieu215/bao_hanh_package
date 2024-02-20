import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPhanLoaiChiTietTiepNhan, PhanLoaiChiTietTiepNhan } from '../phan-loai-chi-tiet-tiep-nhan.model';
import { PhanLoaiChiTietTiepNhanService } from '../service/phan-loai-chi-tiet-tiep-nhan.service';
import { IChiTietSanPhamTiepNhan } from 'app/entities/chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.model';
import { ChiTietSanPhamTiepNhanService } from 'app/entities/chi-tiet-san-pham-tiep-nhan/service/chi-tiet-san-pham-tiep-nhan.service';
import { IDanhSachTinhTrang } from 'app/entities/danh-sach-tinh-trang/danh-sach-tinh-trang.model';
import { DanhSachTinhTrangService } from 'app/entities/danh-sach-tinh-trang/service/danh-sach-tinh-trang.service';

@Component({
  selector: 'jhi-phan-loai-chi-tiet-tiep-nhan-update',
  templateUrl: './phan-loai-chi-tiet-tiep-nhan-update.component.html',
})
export class PhanLoaiChiTietTiepNhanUpdateComponent implements OnInit {
  isSaving = false;

  chiTietSanPhamTiepNhansSharedCollection: IChiTietSanPhamTiepNhan[] = [];
  danhSachTinhTrangsSharedCollection: IDanhSachTinhTrang[] = [];

  editForm = this.fb.group({
    id: [],
    soLuong: [],
    chiTietSanPhamTiepNhan: [],
    danhSachTinhTrang: [],
  });

  constructor(
    protected phanLoaiChiTietTiepNhanService: PhanLoaiChiTietTiepNhanService,
    protected chiTietSanPhamTiepNhanService: ChiTietSanPhamTiepNhanService,
    protected danhSachTinhTrangService: DanhSachTinhTrangService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ phanLoaiChiTietTiepNhan }) => {
      this.updateForm(phanLoaiChiTietTiepNhan);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const phanLoaiChiTietTiepNhan = this.createFromForm();
    if (phanLoaiChiTietTiepNhan.id !== undefined) {
      this.subscribeToSaveResponse(this.phanLoaiChiTietTiepNhanService.update(phanLoaiChiTietTiepNhan));
    } else {
      this.subscribeToSaveResponse(this.phanLoaiChiTietTiepNhanService.create(phanLoaiChiTietTiepNhan));
    }
  }

  trackChiTietSanPhamTiepNhanById(_index: number, item: IChiTietSanPhamTiepNhan): number {
    return item.id!;
  }

  trackDanhSachTinhTrangById(_index: number, item: IDanhSachTinhTrang): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhanLoaiChiTietTiepNhan>>): void {
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

  protected updateForm(phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan): void {
    this.editForm.patchValue({
      id: phanLoaiChiTietTiepNhan.id,
      soLuong: phanLoaiChiTietTiepNhan.soLuong,
      chiTietSanPhamTiepNhan: phanLoaiChiTietTiepNhan.chiTietSanPhamTiepNhan,
      danhSachTinhTrang: phanLoaiChiTietTiepNhan.danhSachTinhTrang,
    });

    this.chiTietSanPhamTiepNhansSharedCollection = this.chiTietSanPhamTiepNhanService.addChiTietSanPhamTiepNhanToCollectionIfMissing(
      this.chiTietSanPhamTiepNhansSharedCollection,
      phanLoaiChiTietTiepNhan.chiTietSanPhamTiepNhan
    );
    this.danhSachTinhTrangsSharedCollection = this.danhSachTinhTrangService.addDanhSachTinhTrangToCollectionIfMissing(
      this.danhSachTinhTrangsSharedCollection,
      phanLoaiChiTietTiepNhan.danhSachTinhTrang
    );
  }

  protected loadRelationshipsOptions(): void {
    this.chiTietSanPhamTiepNhanService
      .query()
      .pipe(map((res: HttpResponse<IChiTietSanPhamTiepNhan[]>) => res.body ?? []))
      .pipe(
        map((chiTietSanPhamTiepNhans: IChiTietSanPhamTiepNhan[]) =>
          this.chiTietSanPhamTiepNhanService.addChiTietSanPhamTiepNhanToCollectionIfMissing(
            chiTietSanPhamTiepNhans,
            this.editForm.get('chiTietSanPhamTiepNhan')!.value
          )
        )
      )
      .subscribe(
        (chiTietSanPhamTiepNhans: IChiTietSanPhamTiepNhan[]) => (this.chiTietSanPhamTiepNhansSharedCollection = chiTietSanPhamTiepNhans)
      );

    this.danhSachTinhTrangService
      .query()
      .pipe(map((res: HttpResponse<IDanhSachTinhTrang[]>) => res.body ?? []))
      .pipe(
        map((danhSachTinhTrangs: IDanhSachTinhTrang[]) =>
          this.danhSachTinhTrangService.addDanhSachTinhTrangToCollectionIfMissing(
            danhSachTinhTrangs,
            this.editForm.get('danhSachTinhTrang')!.value
          )
        )
      )
      .subscribe((danhSachTinhTrangs: IDanhSachTinhTrang[]) => (this.danhSachTinhTrangsSharedCollection = danhSachTinhTrangs));
  }

  protected createFromForm(): IPhanLoaiChiTietTiepNhan {
    return {
      ...new PhanLoaiChiTietTiepNhan(),
      id: this.editForm.get(['id'])!.value,
      soLuong: this.editForm.get(['soLuong'])!.value,
      chiTietSanPhamTiepNhan: this.editForm.get(['chiTietSanPhamTiepNhan'])!.value,
      danhSachTinhTrang: this.editForm.get(['danhSachTinhTrang'])!.value,
    };
  }
}
