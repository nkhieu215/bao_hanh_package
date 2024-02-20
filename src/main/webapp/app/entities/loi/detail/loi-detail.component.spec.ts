import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoiDetailComponent } from './loi-detail.component';

describe('Loi Management Detail Component', () => {
  let comp: LoiDetailComponent;
  let fixture: ComponentFixture<LoiDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoiDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ loi: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LoiDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LoiDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load loi on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.loi).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
