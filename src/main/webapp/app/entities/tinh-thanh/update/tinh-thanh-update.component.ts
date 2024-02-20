import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITinhThanh, TinhThanh } from '../tinh-thanh.model';
import { TinhThanhService } from '../service/tinh-thanh.service';

@Component({
  selector: 'jhi-tinh-thanh-update',
  templateUrl: './tinh-thanh-update.component.html',
})
export class TinhThanhUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idTinhThanh: [],
    name: [],
  });

  constructor(protected tinhThanhService: TinhThanhService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tinhThanh }) => {
      this.updateForm(tinhThanh);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tinhThanh = this.createFromForm();
    if (tinhThanh.id !== undefined) {
      this.subscribeToSaveResponse(this.tinhThanhService.update(tinhThanh));
    } else {
      this.subscribeToSaveResponse(this.tinhThanhService.create(tinhThanh));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITinhThanh>>): void {
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

  protected updateForm(tinhThanh: ITinhThanh): void {
    this.editForm.patchValue({
      id: tinhThanh.id,
      idTinhThanh: tinhThanh.idTinhThanh,
      name: tinhThanh.name,
    });
  }

  protected createFromForm(): ITinhThanh {
    return {
      ...new TinhThanh(),
      id: this.editForm.get(['id'])!.value,
      idTinhThanh: this.editForm.get(['idTinhThanh'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
