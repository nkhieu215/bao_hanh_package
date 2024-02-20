import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IKho, Kho } from '../kho.model';
import { KhoService } from '../service/kho.service';

@Component({
  selector: 'jhi-kho-update',
  templateUrl: './kho-update.component.html',
})
export class KhoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    maKho: [],
    tenKho: [],
    ngayTao: [],
    username: [],
  });

  constructor(protected khoService: KhoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kho }) => {
      if (kho.id === undefined) {
        const today = dayjs().startOf('day');
        kho.ngayTao = today;
      }

      this.updateForm(kho);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const kho = this.createFromForm();
    if (kho.id !== undefined) {
      this.subscribeToSaveResponse(this.khoService.update(kho));
    } else {
      this.subscribeToSaveResponse(this.khoService.create(kho));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKho>>): void {
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

  protected updateForm(kho: IKho): void {
    this.editForm.patchValue({
      id: kho.id,
      maKho: kho.maKho,
      tenKho: kho.tenKho,
      ngayTao: kho.ngayTao ? kho.ngayTao.format(DATE_TIME_FORMAT) : null,
      username: kho.username,
    });
  }

  protected createFromForm(): IKho {
    return {
      ...new Kho(),
      id: this.editForm.get(['id'])!.value,
      maKho: this.editForm.get(['maKho'])!.value,
      tenKho: this.editForm.get(['tenKho'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      username: this.editForm.get(['username'])!.value,
    };
  }
}
