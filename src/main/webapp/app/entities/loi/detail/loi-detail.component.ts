import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILoi } from '../loi.model';

@Component({
  selector: 'jhi-loi-detail',
  templateUrl: './loi-detail.component.html',
})
export class LoiDetailComponent implements OnInit {
  loi: ILoi | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loi }) => {
      this.loi = loi;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
