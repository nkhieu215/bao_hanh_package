import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PhanTichSanPhamDetailComponent } from './phan-tich-san-pham-detail.component';

describe('PhanTichSanPham Management Detail Component', () => {
  let comp: PhanTichSanPhamDetailComponent;
  let fixture: ComponentFixture<PhanTichSanPhamDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhanTichSanPhamDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ phanTichSanPham: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PhanTichSanPhamDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PhanTichSanPhamDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load phanTichSanPham on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.phanTichSanPham).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
