import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NganhService } from '../service/nganh.service';
import { INganh, Nganh } from '../nganh.model';

import { NganhUpdateComponent } from './nganh-update.component';

describe('Nganh Management Update Component', () => {
  let comp: NganhUpdateComponent;
  let fixture: ComponentFixture<NganhUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let nganhService: NganhService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NganhUpdateComponent],
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
      .overrideTemplate(NganhUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NganhUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    nganhService = TestBed.inject(NganhService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const nganh: INganh = { id: 456 };

      activatedRoute.data = of({ nganh });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(nganh));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Nganh>>();
      const nganh = { id: 123 };
      jest.spyOn(nganhService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nganh });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nganh }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(nganhService.update).toHaveBeenCalledWith(nganh);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Nganh>>();
      const nganh = new Nganh();
      jest.spyOn(nganhService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nganh });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nganh }));
      saveSubject.complete();

      // THEN
      expect(nganhService.create).toHaveBeenCalledWith(nganh);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Nganh>>();
      const nganh = { id: 123 };
      jest.spyOn(nganhService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nganh });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(nganhService.update).toHaveBeenCalledWith(nganh);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
