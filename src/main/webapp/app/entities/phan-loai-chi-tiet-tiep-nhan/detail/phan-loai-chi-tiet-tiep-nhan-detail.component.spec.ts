import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PhanLoaiChiTietTiepNhanDetailComponent } from './phan-loai-chi-tiet-tiep-nhan-detail.component';

describe('PhanLoaiChiTietTiepNhan Management Detail Component', () => {
  let comp: PhanLoaiChiTietTiepNhanDetailComponent;
  let fixture: ComponentFixture<PhanLoaiChiTietTiepNhanDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhanLoaiChiTietTiepNhanDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ phanLoaiChiTietTiepNhan: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PhanLoaiChiTietTiepNhanDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PhanLoaiChiTietTiepNhanDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load phanLoaiChiTietTiepNhan on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.phanLoaiChiTietTiepNhan).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
