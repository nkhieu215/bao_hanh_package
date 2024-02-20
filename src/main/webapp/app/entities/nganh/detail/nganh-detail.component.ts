import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INganh } from '../nganh.model';

@Component({
  selector: 'jhi-nganh-detail',
  templateUrl: './nganh-detail.component.html',
})
export class NganhDetailComponent implements OnInit {
  nganh: INganh | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nganh }) => {
      this.nganh = nganh;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
