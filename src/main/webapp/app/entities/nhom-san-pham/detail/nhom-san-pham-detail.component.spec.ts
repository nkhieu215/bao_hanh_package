import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NhomSanPhamDetailComponent } from './nhom-san-pham-detail.component';

describe('NhomSanPham Management Detail Component', () => {
  let comp: NhomSanPhamDetailComponent;
  let fixture: ComponentFixture<NhomSanPhamDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NhomSanPhamDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ nhomSanPham: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NhomSanPhamDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NhomSanPhamDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load nhomSanPham on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.nhomSanPham).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
