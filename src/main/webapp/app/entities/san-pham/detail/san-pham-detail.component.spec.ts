import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SanPhamDetailComponent } from './san-pham-detail.component';

describe('SanPham Management Detail Component', () => {
  let comp: SanPhamDetailComponent;
  let fixture: ComponentFixture<SanPhamDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SanPhamDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sanPham: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SanPhamDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SanPhamDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sanPham on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sanPham).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
