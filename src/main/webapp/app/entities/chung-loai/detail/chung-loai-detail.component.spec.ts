import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChungLoaiDetailComponent } from './chung-loai-detail.component';

describe('ChungLoai Management Detail Component', () => {
  let comp: ChungLoaiDetailComponent;
  let fixture: ComponentFixture<ChungLoaiDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChungLoaiDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chungLoai: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChungLoaiDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChungLoaiDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chungLoai on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chungLoai).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
