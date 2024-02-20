import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KhoDetailComponent } from './kho-detail.component';

describe('Kho Management Detail Component', () => {
  let comp: KhoDetailComponent;
  let fixture: ComponentFixture<KhoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KhoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ kho: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(KhoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KhoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load kho on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.kho).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
