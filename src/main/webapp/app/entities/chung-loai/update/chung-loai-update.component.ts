import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IChungLoai, ChungLoai } from '../chung-loai.model';
import { ChungLoaiService } from '../service/chung-loai.service';

@Component({
  selector: 'jhi-chung-loai-update',
  templateUrl: './chung-loai-update.component.html',
})
export class ChungLoaiUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    maChungLoai: [],
    tenChungLoai: [],
    ngayTao: [],
    username: [],
  });

  constructor(protected chungLoaiService: ChungLoaiService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chungLoai }) => {
      if (chungLoai.id === undefined) {
        const today = dayjs().startOf('day');
        chungLoai.ngayTao = today;
      }

      this.updateForm(chungLoai);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chungLoai = this.createFromForm();
    if (chungLoai.id !== undefined) {
      this.subscribeToSaveResponse(this.chungLoaiService.update(chungLoai));
    } else {
      this.subscribeToSaveResponse(this.chungLoaiService.create(chungLoai));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChungLoai>>): void {
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

  protected updateForm(chungLoai: IChungLoai): void {
    this.editForm.patchValue({
      id: chungLoai.id,
      maChungLoai: chungLoai.maChungLoai,
      tenChungLoai: chungLoai.tenChungLoai,
      ngayTao: chungLoai.ngayTao ? chungLoai.ngayTao.format(DATE_TIME_FORMAT) : null,
      username: chungLoai.username,
    });
  }

  protected createFromForm(): IChungLoai {
    return {
      ...new ChungLoai(),
      id: this.editForm.get(['id'])!.value,
      maChungLoai: this.editForm.get(['maChungLoai'])!.value,
      tenChungLoai: this.editForm.get(['tenChungLoai'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      username: this.editForm.get(['username'])!.value,
    };
  }
}
