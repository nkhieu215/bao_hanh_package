import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NhomLoiDetailComponent } from './nhom-loi-detail.component';

describe('NhomLoi Management Detail Component', () => {
  let comp: NhomLoiDetailComponent;
  let fixture: ComponentFixture<NhomLoiDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NhomLoiDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ nhomLoi: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NhomLoiDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NhomLoiDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load nhomLoi on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.nhomLoi).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
