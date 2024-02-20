import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PhanTichSanPhamService } from '../service/phan-tich-san-pham.service';
import { IPhanTichSanPham, PhanTichSanPham } from '../phan-tich-san-pham.model';
import { IPhanLoaiChiTietTiepNhan } from 'app/entities/phan-loai-chi-tiet-tiep-nhan/phan-loai-chi-tiet-tiep-nhan.model';
import { PhanLoaiChiTietTiepNhanService } from 'app/entities/phan-loai-chi-tiet-tiep-nhan/service/phan-loai-chi-tiet-tiep-nhan.service';

import { PhanTichSanPhamUpdateComponent } from './phan-tich-san-pham-update.component';

describe('PhanTichSanPham Management Update Component', () => {
  let comp: PhanTichSanPhamUpdateComponent;
  let fixture: ComponentFixture<PhanTichSanPhamUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let phanTichSanPhamService: PhanTichSanPhamService;
  let phanLoaiChiTietTiepNhanService: PhanLoaiChiTietTiepNhanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PhanTichSanPhamUpdateComponent],
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
      .overrideTemplate(PhanTichSanPhamUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhanTichSanPhamUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    phanTichSanPhamService = TestBed.inject(PhanTichSanPhamService);
    phanLoaiChiTietTiepNhanService = TestBed.inject(PhanLoaiChiTietTiepNhanService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PhanLoaiChiTietTiepNhan query and add missing value', () => {
      const phanTichSanPham: IPhanTichSanPham = { id: 456 };
      const phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan = { id: 69638 };
      phanTichSanPham.phanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhan;

      const phanLoaiChiTietTiepNhanCollection: IPhanLoaiChiTietTiepNhan[] = [{ id: 13934 }];
      jest
        .spyOn(phanLoaiChiTietTiepNhanService, 'query')
        .mockReturnValue(of(new HttpResponse({ body: phanLoaiChiTietTiepNhanCollection })));
      const additionalPhanLoaiChiTietTiepNhans = [phanLoaiChiTietTiepNhan];
      const expectedCollection: IPhanLoaiChiTietTiepNhan[] = [...additionalPhanLoaiChiTietTiepNhans, ...phanLoaiChiTietTiepNhanCollection];
      jest.spyOn(phanLoaiChiTietTiepNhanService, 'addPhanLoaiChiTietTiepNhanToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ phanTichSanPham });
      comp.ngOnInit();

      expect(phanLoaiChiTietTiepNhanService.query).toHaveBeenCalled();
      expect(phanLoaiChiTietTiepNhanService.addPhanLoaiChiTietTiepNhanToCollectionIfMissing).toHaveBeenCalledWith(
        phanLoaiChiTietTiepNhanCollection,
        ...additionalPhanLoaiChiTietTiepNhans
      );
      expect(comp.phanLoaiChiTietTiepNhansSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const phanTichSanPham: IPhanTichSanPham = { id: 456 };
      const phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan = { id: 30507 };
      phanTichSanPham.phanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhan;

      activatedRoute.data = of({ phanTichSanPham });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(phanTichSanPham));
      expect(comp.phanLoaiChiTietTiepNhansSharedCollection).toContain(phanLoaiChiTietTiepNhan);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PhanTichSanPham>>();
      const phanTichSanPham = { id: 123 };
      jest.spyOn(phanTichSanPhamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phanTichSanPham });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: phanTichSanPham }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(phanTichSanPhamService.update).toHaveBeenCalledWith(phanTichSanPham);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PhanTichSanPham>>();
      const phanTichSanPham = new PhanTichSanPham();
      jest.spyOn(phanTichSanPhamService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phanTichSanPham });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: phanTichSanPham }));
      saveSubject.complete();

      // THEN
      expect(phanTichSanPhamService.create).toHaveBeenCalledWith(phanTichSanPham);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PhanTichSanPham>>();
      const phanTichSanPham = { id: 123 };
      jest.spyOn(phanTichSanPhamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phanTichSanPham });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(phanTichSanPhamService.update).toHaveBeenCalledWith(phanTichSanPham);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPhanLoaiChiTietTiepNhanById', () => {
      it('Should return tracked PhanLoaiChiTietTiepNhan primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPhanLoaiChiTietTiepNhanById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
