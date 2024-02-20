import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NganhDetailComponent } from './nganh-detail.component';

describe('Nganh Management Detail Component', () => {
  let comp: NganhDetailComponent;
  let fixture: ComponentFixture<NganhDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NganhDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ nganh: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NganhDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NganhDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load nganh on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.nganh).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
