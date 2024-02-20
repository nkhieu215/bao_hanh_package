import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LoiService } from '../service/loi.service';
import { ILoi, Loi } from '../loi.model';
import { INhomLoi } from 'app/entities/nhom-loi/nhom-loi.model';
import { NhomLoiService } from 'app/entities/nhom-loi/service/nhom-loi.service';

import { LoiUpdateComponent } from './loi-update.component';

describe('Loi Management Update Component', () => {
  let comp: LoiUpdateComponent;
  let fixture: ComponentFixture<LoiUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let loiService: LoiService;
  let nhomLoiService: NhomLoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LoiUpdateComponent],
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
      .overrideTemplate(LoiUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoiUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    loiService = TestBed.inject(LoiService);
    nhomLoiService = TestBed.inject(NhomLoiService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call NhomLoi query and add missing value', () => {
      const loi: ILoi = { id: 456 };
      const nhomLoi: INhomLoi = { id: 94030 };
      loi.nhomLoi = nhomLoi;

      const nhomLoiCollection: INhomLoi[] = [{ id: 26083 }];
      jest.spyOn(nhomLoiService, 'query').mockReturnValue(of(new HttpResponse({ body: nhomLoiCollection })));
      const additionalNhomLois = [nhomLoi];
      const expectedCollection: INhomLoi[] = [...additionalNhomLois, ...nhomLoiCollection];
      jest.spyOn(nhomLoiService, 'addNhomLoiToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loi });
      comp.ngOnInit();

      expect(nhomLoiService.query).toHaveBeenCalled();
      expect(nhomLoiService.addNhomLoiToCollectionIfMissing).toHaveBeenCalledWith(nhomLoiCollection, ...additionalNhomLois);
      expect(comp.nhomLoisSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const loi: ILoi = { id: 456 };
      const nhomLoi: INhomLoi = { id: 93971 };
      loi.nhomLoi = nhomLoi;

      activatedRoute.data = of({ loi });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(loi));
      expect(comp.nhomLoisSharedCollection).toContain(nhomLoi);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Loi>>();
      const loi = { id: 123 };
      jest.spyOn(loiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loi });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loi }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(loiService.update).toHaveBeenCalledWith(loi);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Loi>>();
      const loi = new Loi();
      jest.spyOn(loiService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loi });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loi }));
      saveSubject.complete();

      // THEN
      expect(loiService.create).toHaveBeenCalledWith(loi);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Loi>>();
      const loi = { id: 123 };
      jest.spyOn(loiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loi });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(loiService.update).toHaveBeenCalledWith(loi);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackNhomLoiById', () => {
      it('Should return tracked NhomLoi primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNhomLoiById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
