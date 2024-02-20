import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DonBaoHanhDetailComponent } from './don-bao-hanh-detail.component';

describe('DonBaoHanh Management Detail Component', () => {
  let comp: DonBaoHanhDetailComponent;
  let fixture: ComponentFixture<DonBaoHanhDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonBaoHanhDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ donBaoHanh: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DonBaoHanhDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DonBaoHanhDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load donBaoHanh on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.donBaoHanh).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
