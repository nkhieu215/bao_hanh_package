import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TinhThanhService } from '../service/tinh-thanh.service';
import { ITinhThanh, TinhThanh } from '../tinh-thanh.model';

import { TinhThanhUpdateComponent } from './tinh-thanh-update.component';

describe('TinhThanh Management Update Component', () => {
  let comp: TinhThanhUpdateComponent;
  let fixture: ComponentFixture<TinhThanhUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tinhThanhService: TinhThanhService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TinhThanhUpdateComponent],
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
      .overrideTemplate(TinhThanhUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TinhThanhUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tinhThanhService = TestBed.inject(TinhThanhService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tinhThanh: ITinhThanh = { id: 456 };

      activatedRoute.data = of({ tinhThanh });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(tinhThanh));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TinhThanh>>();
      const tinhThanh = { id: 123 };
      jest.spyOn(tinhThanhService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tinhThanh });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tinhThanh }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(tinhThanhService.update).toHaveBeenCalledWith(tinhThanh);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TinhThanh>>();
      const tinhThanh = new TinhThanh();
      jest.spyOn(tinhThanhService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tinhThanh });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tinhThanh }));
      saveSubject.complete();

      // THEN
      expect(tinhThanhService.create).toHaveBeenCalledWith(tinhThanh);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TinhThanh>>();
      const tinhThanh = { id: 123 };
      jest.spyOn(tinhThanhService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tinhThanh });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tinhThanhService.update).toHaveBeenCalledWith(tinhThanh);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
