import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KhachHangDetailComponent } from './khach-hang-detail.component';

describe('KhachHang Management Detail Component', () => {
  let comp: KhachHangDetailComponent;
  let fixture: ComponentFixture<KhachHangDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KhachHangDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ khachHang: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(KhachHangDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KhachHangDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load khachHang on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.khachHang).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
