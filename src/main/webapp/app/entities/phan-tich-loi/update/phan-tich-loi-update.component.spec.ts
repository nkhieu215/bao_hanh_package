import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PhanTichLoiService } from '../service/phan-tich-loi.service';
import { IPhanTichLoi, PhanTichLoi } from '../phan-tich-loi.model';
import { ILoi } from 'app/entities/loi/loi.model';
import { LoiService } from 'app/entities/loi/service/loi.service';
import { IPhanTichSanPham } from 'app/entities/phan-tich-san-pham/phan-tich-san-pham.model';
import { PhanTichSanPhamService } from 'app/entities/phan-tich-san-pham/service/phan-tich-san-pham.service';

import { PhanTichLoiUpdateComponent } from './phan-tich-loi-update.component';

describe('PhanTichLoi Management Update Component', () => {
  let comp: PhanTichLoiUpdateComponent;
  let fixture: ComponentFixture<PhanTichLoiUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let phanTichLoiService: PhanTichLoiService;
  let loiService: LoiService;
  let phanTichSanPhamService: PhanTichSanPhamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PhanTichLoiUpdateComponent],
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
      .overrideTemplate(PhanTichLoiUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhanTichLoiUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    phanTichLoiService = TestBed.inject(PhanTichLoiService);
    loiService = TestBed.inject(LoiService);
    phanTichSanPhamService = TestBed.inject(PhanTichSanPhamService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Loi query and add missing value', () => {
      const phanTichLoi: IPhanTichLoi = { id: 456 };
      const loi: ILoi = { id: 76658 };
      phanTichLoi.loi = loi;

      const loiCollection: ILoi[] = [{ id: 59862 }];
      jest.spyOn(loiService, 'query').mockReturnValue(of(new HttpResponse({ body: loiCollection })));
      const additionalLois = [loi];
      const expectedCollection: ILoi[] = [...additionalLois, ...loiCollection];
      jest.spyOn(loiService, 'addLoiToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ phanTichLoi });
      comp.ngOnInit();

      expect(loiService.query).toHaveBeenCalled();
      expect(loiService.addLoiToCollectionIfMissing).toHaveBeenCalledWith(loiCollection, ...additionalLois);
      expect(comp.loisSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PhanTichSanPham query and add missing value', () => {
      const phanTichLoi: IPhanTichLoi = { id: 456 };
      const phanTichSanPham: IPhanTichSanPham = { id: 64298 };
      phanTichLoi.phanTichSanPham = phanTichSanPham;

      const phanTichSanPhamCollection: IPhanTichSanPham[] = [{ id: 40717 }];
      jest.spyOn(phanTichSanPhamService, 'query').mockReturnValue(of(new HttpResponse({ body: phanTichSanPhamCollection })));
      const additionalPhanTichSanPhams = [phanTichSanPham];
      const expectedCollection: IPhanTichSanPham[] = [...additionalPhanTichSanPhams, ...phanTichSanPhamCollection];
      jest.spyOn(phanTichSanPhamService, 'addPhanTichSanPhamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ phanTichLoi });
      comp.ngOnInit();

      expect(phanTichSanPhamService.query).toHaveBeenCalled();
      expect(phanTichSanPhamService.addPhanTichSanPhamToCollectionIfMissing).toHaveBeenCalledWith(
        phanTichSanPhamCollection,
        ...additionalPhanTichSanPhams
      );
      expect(comp.phanTichSanPhamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const phanTichLoi: IPhanTichLoi = { id: 456 };
      const loi: ILoi = { id: 27153 };
      phanTichLoi.loi = loi;
      const phanTichSanPham: IPhanTichSanPham = { id: 77916 };
      phanTichLoi.phanTichSanPham = phanTichSanPham;

      activatedRoute.data = of({ phanTichLoi });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(phanTichLoi));
      expect(comp.loisSharedCollection).toContain(loi);
      expect(comp.phanTichSanPhamsSharedCollection).toContain(phanTichSanPham);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PhanTichLoi>>();
      const phanTichLoi = { id: 123 };
      jest.spyOn(phanTichLoiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phanTichLoi });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: phanTichLoi }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(phanTichLoiService.update).toHaveBeenCalledWith(phanTichLoi);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PhanTichLoi>>();
      const phanTichLoi = new PhanTichLoi();
      jest.spyOn(phanTichLoiService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phanTichLoi });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: phanTichLoi }));
      saveSubject.complete();

      // THEN
      expect(phanTichLoiService.create).toHaveBeenCalledWith(phanTichLoi);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PhanTichLoi>>();
      const phanTichLoi = { id: 123 };
      jest.spyOn(phanTichLoiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phanTichLoi });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(phanTichLoiService.update).toHaveBeenCalledWith(phanTichLoi);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLoiById', () => {
      it('Should return tracked Loi primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLoiById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPhanTichSanPhamById', () => {
      it('Should return tracked PhanTichSanPham primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPhanTichSanPhamById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
