import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KhoService } from '../service/kho.service';
import { IKho, Kho } from '../kho.model';

import { KhoUpdateComponent } from './kho-update.component';

describe('Kho Management Update Component', () => {
  let comp: KhoUpdateComponent;
  let fixture: ComponentFixture<KhoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let khoService: KhoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KhoUpdateComponent],
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
      .overrideTemplate(KhoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KhoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    khoService = TestBed.inject(KhoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const kho: IKho = { id: 456 };

      activatedRoute.data = of({ kho });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(kho));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Kho>>();
      const kho = { id: 123 };
      jest.spyOn(khoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kho });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kho }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(khoService.update).toHaveBeenCalledWith(kho);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Kho>>();
      const kho = new Kho();
      jest.spyOn(khoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kho });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kho }));
      saveSubject.complete();

      // THEN
      expect(khoService.create).toHaveBeenCalledWith(kho);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Kho>>();
      const kho = { id: 123 };
      jest.spyOn(khoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kho });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(khoService.update).toHaveBeenCalledWith(kho);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
