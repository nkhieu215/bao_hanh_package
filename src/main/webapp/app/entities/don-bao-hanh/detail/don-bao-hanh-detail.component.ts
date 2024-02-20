import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDonBaoHanh } from '../don-bao-hanh.model';

@Component({
  selector: 'jhi-don-bao-hanh-detail',
  templateUrl: './don-bao-hanh-detail.component.html',
})
export class DonBaoHanhDetailComponent implements OnInit {
  donBaoHanh: IDonBaoHanh | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ donBaoHanh }) => {
      this.donBaoHanh = donBaoHanh;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
