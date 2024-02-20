import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NhomLoiService } from '../service/nhom-loi.service';
import { INhomLoi, NhomLoi } from '../nhom-loi.model';

import { NhomLoiUpdateComponent } from './nhom-loi-update.component';

describe('NhomLoi Management Update Component', () => {
  let comp: NhomLoiUpdateComponent;
  let fixture: ComponentFixture<NhomLoiUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let nhomLoiService: NhomLoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NhomLoiUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(NhomLoiUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NhomLoiUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    nhomLoiService = TestBed.inject(NhomLoiService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const nhomLoi: INhomLoi = { id: 456 };

      activatedRoute.data = of({ nhomLoi });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(nhomLoi));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NhomLoi>>();
      const nhomLoi = { id: 123 };
      jest.spyOn(nhomLoiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nhomLoi });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nhomLoi }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(nhomLoiService.update).toHaveBeenCalledWith(nhomLoi);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NhomLoi>>();
      const nhomLoi = new NhomLoi();
      jest.spyOn(nhomLoiService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nhomLoi });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nhomLoi }));
      saveSubject.complete();

      // THEN
      expect(nhomLoiService.create).toHaveBeenCalledWith(nhomLoi);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NhomLoi>>();
      const nhomLoi = { id: 123 };
      jest.spyOn(nhomLoiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nhomLoi });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(nhomLoiService.update).toHaveBeenCalledWith(nhomLoi);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
