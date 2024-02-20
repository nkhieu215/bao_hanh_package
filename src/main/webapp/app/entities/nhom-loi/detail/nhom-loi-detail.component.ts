import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INhomLoi } from '../nhom-loi.model';

@Component({
  selector: 'jhi-nhom-loi-detail',
  templateUrl: './nhom-loi-detail.component.html',
})
export class NhomLoiDetailComponent implements OnInit {
  nhomLoi: INhomLoi | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nhomLoi }) => {
      this.nhomLoi = nhomLoi;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
