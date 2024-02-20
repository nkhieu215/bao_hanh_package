import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChungLoai } from '../chung-loai.model';

@Component({
  selector: 'jhi-chung-loai-detail',
  templateUrl: './chung-loai-detail.component.html',
})
export class ChungLoaiDetailComponent implements OnInit {
  chungLoai: IChungLoai | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chungLoai }) => {
      this.chungLoai = chungLoai;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
