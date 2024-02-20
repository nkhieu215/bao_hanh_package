import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { INganh, Nganh } from '../nganh.model';
import { NganhService } from '../service/nganh.service';

@Component({
  selector: 'jhi-nganh-update',
  templateUrl: './nganh-update.component.html',
})
export class NganhUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    maNganh: [],
    tenNganh: [],
    ngayTao: [],
    username: [],
  });

  constructor(protected nganhService: NganhService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nganh }) => {
      if (nganh.id === undefined) {
        const today = dayjs().startOf('day');
        nganh.ngayTao = today;
      }

      this.updateForm(nganh);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const nganh = this.createFromForm();
    if (nganh.id !== undefined) {
      this.subscribeToSaveResponse(this.nganhService.update(nganh));
    } else {
      this.subscribeToSaveResponse(this.nganhService.create(nganh));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INganh>>): void {
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

  protected updateForm(nganh: INganh): void {
    this.editForm.patchValue({
      id: nganh.id,
      maNganh: nganh.maNganh,
      tenNganh: nganh.tenNganh,
      ngayTao: nganh.ngayTao ? nganh.ngayTao.format(DATE_TIME_FORMAT) : null,
      username: nganh.username,
    });
  }

  protected createFromForm(): INganh {
    return {
      ...new Nganh(),
      id: this.editForm.get(['id'])!.value,
      maNganh: this.editForm.get(['maNganh'])!.value,
      tenNganh: this.editForm.get(['tenNganh'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      username: this.editForm.get(['username'])!.value,
    };
  }
}
