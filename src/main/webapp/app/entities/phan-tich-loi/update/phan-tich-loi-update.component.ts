import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPhanTichLoi, PhanTichLoi } from '../phan-tich-loi.model';
import { PhanTichLoiService } from '../service/phan-tich-loi.service';
import { ILoi } from 'app/entities/loi/loi.model';
import { LoiService } from 'app/entities/loi/service/loi.service';
import { IPhanTichSanPham } from 'app/entities/phan-tich-san-pham/phan-tich-san-pham.model';
import { PhanTichSanPhamService } from 'app/entities/phan-tich-san-pham/service/phan-tich-san-pham.service';

@Component({
  selector: 'jhi-phan-tich-loi-update',
  templateUrl: './phan-tich-loi-update.component.html',
})
export class PhanTichLoiUpdateComponent implements OnInit {
  isSaving = false;

  loisSharedCollection: ILoi[] = [];
  phanTichSanPhamsSharedCollection: IPhanTichSanPham[] = [];

  editForm = this.fb.group({
    id: [],
    soLuong: [],
    ngayPhanTich: [],
    username: [],
    ghiChu: [],
    loi: [],
    phanTichSanPham: [],
  });

  constructor(
    protected phanTichLoiService: PhanTichLoiService,
    protected loiService: LoiService,
    protected phanTichSanPhamService: PhanTichSanPhamService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ phanTichLoi }) => {
      if (phanTichLoi.id === undefined) {
        const today = dayjs().startOf('day');
        phanTichLoi.ngayPhanTich = today;
      }

      this.updateForm(phanTichLoi);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const phanTichLoi = this.createFromForm();
    if (phanTichLoi.id !== undefined) {
      this.subscribeToSaveResponse(this.phanTichLoiService.update(phanTichLoi));
    } else {
      this.subscribeToSaveResponse(this.phanTichLoiService.create(phanTichLoi));
    }
  }

  trackLoiById(_index: number, item: ILoi): number {
    return item.id!;
  }

  trackPhanTichSanPhamById(_index: number, item: IPhanTichSanPham): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhanTichLoi>>): void {
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

  protected updateForm(phanTichLoi: IPhanTichLoi): void {
    this.editForm.patchValue({
      id: phanTichLoi.id,
      soLuong: phanTichLoi.soLuong,
      ngayPhanTich: phanTichLoi.ngayPhanTich ? phanTichLoi.ngayPhanTich.format(DATE_TIME_FORMAT) : null,
      username: phanTichLoi.username,
      ghiChu: phanTichLoi.ghiChu,
      loi: phanTichLoi.loi,
      phanTichSanPham: phanTichLoi.phanTichSanPham,
    });

    this.loisSharedCollection = this.loiService.addLoiToCollectionIfMissing(this.loisSharedCollection, phanTichLoi.loi);
    this.phanTichSanPhamsSharedCollection = this.phanTichSanPhamService.addPhanTichSanPhamToCollectionIfMissing(
      this.phanTichSanPhamsSharedCollection,
      phanTichLoi.phanTichSanPham
    );
  }

  protected loadRelationshipsOptions(): void {
    this.loiService
      .query()
      .pipe(map((res: HttpResponse<ILoi[]>) => res.body ?? []))
      .pipe(map((lois: ILoi[]) => this.loiService.addLoiToCollectionIfMissing(lois, this.editForm.get('loi')!.value)))
      .subscribe((lois: ILoi[]) => (this.loisSharedCollection = lois));

    this.phanTichSanPhamService
      .query()
      .pipe(map((res: HttpResponse<IPhanTichSanPham[]>) => res.body ?? []))
      .pipe(
        map((phanTichSanPhams: IPhanTichSanPham[]) =>
          this.phanTichSanPhamService.addPhanTichSanPhamToCollectionIfMissing(phanTichSanPhams, this.editForm.get('phanTichSanPham')!.value)
        )
      )
      .subscribe((phanTichSanPhams: IPhanTichSanPham[]) => (this.phanTichSanPhamsSharedCollection = phanTichSanPhams));
  }

  protected createFromForm(): IPhanTichLoi {
    return {
      ...new PhanTichLoi(),
      id: this.editForm.get(['id'])!.value,
      soLuong: this.editForm.get(['soLuong'])!.value,
      ngayPhanTich: this.editForm.get(['ngayPhanTich'])!.value
        ? dayjs(this.editForm.get(['ngayPhanTich'])!.value, DATE_TIME_FORMAT)
        : undefined,
      username: this.editForm.get(['username'])!.value,
      ghiChu: this.editForm.get(['ghiChu'])!.value,
      loi: this.editForm.get(['loi'])!.value,
      phanTichSanPham: this.editForm.get(['phanTichSanPham'])!.value,
    };
  }
}
