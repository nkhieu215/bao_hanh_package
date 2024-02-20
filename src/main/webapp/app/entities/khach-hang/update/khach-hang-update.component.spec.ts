import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KhachHangService } from '../service/khach-hang.service';
import { IKhachHang, KhachHang } from '../khach-hang.model';
import { INhomKhachHang } from 'app/entities/nhom-khach-hang/nhom-khach-hang.model';
import { NhomKhachHangService } from 'app/entities/nhom-khach-hang/service/nhom-khach-hang.service';
import { ITinhThanh } from 'app/entities/tinh-thanh/tinh-thanh.model';
import { TinhThanhService } from 'app/entities/tinh-thanh/service/tinh-thanh.service';

import { KhachHangUpdateComponent } from './khach-hang-update.component';

describe('KhachHang Management Update Component', () => {
  let comp: KhachHangUpdateComponent;
  let fixture: ComponentFixture<KhachHangUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let khachHangService: KhachHangService;
  let nhomKhachHangService: NhomKhachHangService;
  let tinhThanhService: TinhThanhService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KhachHangUpdateComponent],
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
      .overrideTemplate(KhachHangUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KhachHangUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    khachHangService = TestBed.inject(KhachHangService);
    nhomKhachHangService = TestBed.inject(NhomKhachHangService);
    tinhThanhService = TestBed.inject(TinhThanhService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call NhomKhachHang query and add missing value', () => {
      const khachHang: IKhachHang = { id: 456 };
      const nhomKhachHang: INhomKhachHang = { id: 39675 };
      khachHang.nhomKhachHang = nhomKhachHang;

      const nhomKhachHangCollection: INhomKhachHang[] = [{ id: 33490 }];
      jest.spyOn(nhomKhachHangService, 'query').mockReturnValue(of(new HttpResponse({ body: nhomKhachHangCollection })));
      const additionalNhomKhachHangs = [nhomKhachHang];
      const expectedCollection: INhomKhachHang[] = [...additionalNhomKhachHangs, ...nhomKhachHangCollection];
      jest.spyOn(nhomKhachHangService, 'addNhomKhachHangToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ khachHang });
      comp.ngOnInit();

      expect(nhomKhachHangService.query).toHaveBeenCalled();
      expect(nhomKhachHangService.addNhomKhachHangToCollectionIfMissing).toHaveBeenCalledWith(
        nhomKhachHangCollection,
        ...additionalNhomKhachHangs
      );
      expect(comp.nhomKhachHangsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TinhThanh query and add missing value', () => {
      const khachHang: IKhachHang = { id: 456 };
      const tinhThanh: ITinhThanh = { id: 73601 };
      khachHang.tinhThanh = tinhThanh;

      const tinhThanhCollection: ITinhThanh[] = [{ id: 39002 }];
      jest.spyOn(tinhThanhService, 'query').mockReturnValue(of(new HttpResponse({ body: tinhThanhCollection })));
      const additionalTinhThanhs = [tinhThanh];
      const expectedCollection: ITinhThanh[] = [...additionalTinhThanhs, ...tinhThanhCollection];
      jest.spyOn(tinhThanhService, 'addTinhThanhToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ khachHang });
      comp.ngOnInit();

      expect(tinhThanhService.query).toHaveBeenCalled();
      expect(tinhThanhService.addTinhThanhToCollectionIfMissing).toHaveBeenCalledWith(tinhThanhCollection, ...additionalTinhThanhs);
      expect(comp.tinhThanhsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const khachHang: IKhachHang = { id: 456 };
      const nhomKhachHang: INhomKhachHang = { id: 38291 };
      khachHang.nhomKhachHang = nhomKhachHang;
      const tinhThanh: ITinhThanh = { id: 86541 };
      khachHang.tinhThanh = tinhThanh;

      activatedRoute.data = of({ khachHang });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(khachHang));
      expect(comp.nhomKhachHangsSharedCollection).toContain(nhomKhachHang);
      expect(comp.tinhThanhsSharedCollection).toContain(tinhThanh);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KhachHang>>();
      const khachHang = { id: 123 };
      jest.spyOn(khachHangService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ khachHang });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: khachHang }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(khachHangService.update).toHaveBeenCalledWith(khachHang);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KhachHang>>();
      const khachHang = new KhachHang();
      jest.spyOn(khachHangService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ khachHang });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: khachHang }));
      saveSubject.complete();

      // THEN
      expect(khachHangService.create).toHaveBeenCalledWith(khachHang);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KhachHang>>();
      const khachHang = { id: 123 };
      jest.spyOn(khachHangService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ khachHang });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(khachHangService.update).toHaveBeenCalledWith(khachHang);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackNhomKhachHangById', () => {
      it('Should return tracked NhomKhachHang primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNhomKhachHangById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTinhThanhById', () => {
      it('Should return tracked TinhThanh primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTinhThanhById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
