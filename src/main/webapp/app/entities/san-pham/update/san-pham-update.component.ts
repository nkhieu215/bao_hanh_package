import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISanPham, SanPham } from '../san-pham.model';
import { SanPhamService } from '../service/san-pham.service';
import { INhomSanPham } from 'app/entities/nhom-san-pham/nhom-san-pham.model';
import { NhomSanPhamService } from 'app/entities/nhom-san-pham/service/nhom-san-pham.service';
import { IKho } from 'app/entities/kho/kho.model';
import { KhoService } from 'app/entities/kho/service/kho.service';
import { INganh } from 'app/entities/nganh/nganh.model';
import { NganhService } from 'app/entities/nganh/service/nganh.service';

@Component({
  selector: 'jhi-san-pham-update',
  templateUrl: './san-pham-update.component.html',
})
export class SanPhamUpdateComponent implements OnInit {
  isSaving = false;
  @Input() name = '';
  nhomSanPhamsSharedCollection: INhomSanPham[] = [];
  khosSharedCollection: IKho[] = [];
  nganhsSharedCollection: INganh[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    sapCode: [],
    rdCode: [],
    tenChungLoai: [],
    donVi: [],
    toSanXuat: [],
    phanLoai: [],
    nhomSanPham: [],
    kho: [],
    nganh: [],
  });
  constructor(
    protected sanPhamService: SanPhamService,
    protected nhomSanPhamService: NhomSanPhamService,
    protected khoService: KhoService,
    protected nganhService: NganhService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sanPham }) => {
      this.name = sanPham.nhomSanPham.name;
      this.updateForm(sanPham);
      console.log(sanPham);
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  updateTenChungLoai(): void {
    console.log(this.name);
    for (let i = 0; i < this.nhomSanPhamsSharedCollection.length; i++) {
      if (this.name === this.nhomSanPhamsSharedCollection[i].name) {
        const result: INhomSanPham = this.nhomSanPhamsSharedCollection[i];
        this.editForm.patchValue({
          tenChungLoai: this.nhomSanPhamsSharedCollection[i].chungLoai?.tenChungLoai,
          nhomSanPham: this.nhomSanPhamsSharedCollection[i],
        });
      }
    }
  }
  save(): void {
    this.isSaving = true;
    const sanPham = this.createFromForm();
    if (sanPham.id !== undefined) {
      this.subscribeToSaveResponse(this.sanPhamService.update(sanPham));
    } else {
      this.subscribeToSaveResponse(this.sanPhamService.create(sanPham));
    }
  }

  trackNhomSanPhamById(_index: number, item: INhomSanPham): number {
    return item.id!;
  }

  trackKhoById(_index: number, item: IKho): number {
    return item.id!;
  }

  trackNganhById(_index: number, item: INganh): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISanPham>>): void {
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

  protected updateForm(sanPham: ISanPham): void {
    this.editForm.patchValue({
      id: sanPham.id,
      name: sanPham.name,
      sapCode: sanPham.sapCode,
      rdCode: sanPham.rdCode,
      tenChungLoai: sanPham.tenChungLoai,
      donVi: sanPham.donVi,
      toSanXuat: sanPham.toSanXuat,
      phanLoai: sanPham.phanLoai,
      nhomSanPham: sanPham.nhomSanPham,
      kho: sanPham.kho,
      nganh: sanPham.nganh,
    });

    this.nhomSanPhamsSharedCollection = this.nhomSanPhamService.addNhomSanPhamToCollectionIfMissing(
      this.nhomSanPhamsSharedCollection,
      sanPham.nhomSanPham
    );
    this.khosSharedCollection = this.khoService.addKhoToCollectionIfMissing(this.khosSharedCollection, sanPham.kho);
    this.nganhsSharedCollection = this.nganhService.addNganhToCollectionIfMissing(this.nganhsSharedCollection, sanPham.nganh);
  }

  protected loadRelationshipsOptions(): void {
    this.nhomSanPhamService
      .query()
      .pipe(map((res: HttpResponse<INhomSanPham[]>) => res.body ?? []))
      .pipe(
        map((nhomSanPhams: INhomSanPham[]) =>
          this.nhomSanPhamService.addNhomSanPhamToCollectionIfMissing(nhomSanPhams, this.editForm.get('nhomSanPham')!.value)
        )
      )
      .subscribe((nhomSanPhams: INhomSanPham[]) => (this.nhomSanPhamsSharedCollection = nhomSanPhams));

    this.khoService
      .query()
      .pipe(map((res: HttpResponse<IKho[]>) => res.body ?? []))
      .pipe(map((khos: IKho[]) => this.khoService.addKhoToCollectionIfMissing(khos, this.editForm.get('kho')!.value)))
      .subscribe((khos: IKho[]) => (this.khosSharedCollection = khos));

    this.nganhService
      .query()
      .pipe(map((res: HttpResponse<INganh[]>) => res.body ?? []))
      .pipe(map((nganhs: INganh[]) => this.nganhService.addNganhToCollectionIfMissing(nganhs, this.editForm.get('nganh')!.value)))
      .subscribe((nganhs: INganh[]) => (this.nganhsSharedCollection = nganhs));
  }

  protected createFromForm(): ISanPham {
    return {
      ...new SanPham(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      sapCode: this.editForm.get(['sapCode'])!.value,
      rdCode: this.editForm.get(['rdCode'])!.value,
      tenChungLoai: this.editForm.get(['tenChungLoai'])!.value,
      donVi: this.editForm.get(['donVi'])!.value,
      toSanXuat: this.editForm.get(['toSanXuat'])!.value,
      phanLoai: this.editForm.get(['phanLoai'])!.value,
      nhomSanPham: this.editForm.get(['nhomSanPham'])!.value,
      kho: this.editForm.get(['kho'])!.value,
      nganh: this.editForm.get(['nganh'])!.value,
    };
  }
}
