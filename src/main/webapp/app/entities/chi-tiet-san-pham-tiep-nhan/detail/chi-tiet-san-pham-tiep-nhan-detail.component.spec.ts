import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChiTietSanPhamTiepNhanDetailComponent } from './chi-tiet-san-pham-tiep-nhan-detail.component';

describe('ChiTietSanPhamTiepNhan Management Detail Component', () => {
  let comp: ChiTietSanPhamTiepNhanDetailComponent;
  let fixture: ComponentFixture<ChiTietSanPhamTiepNhanDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChiTietSanPhamTiepNhanDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chiTietSanPhamTiepNhan: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChiTietSanPhamTiepNhanDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChiTietSanPhamTiepNhanDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chiTietSanPhamTiepNhan on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chiTietSanPhamTiepNhan).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
