import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DonBaoHanhService } from '../service/don-bao-hanh.service';
import { IDonBaoHanh, DonBaoHanh } from '../don-bao-hanh.model';
import { IKhachHang } from 'app/entities/khach-hang/khach-hang.model';
import { KhachHangService } from 'app/entities/khach-hang/service/khach-hang.service';

import { DonBaoHanhUpdateComponent } from './don-bao-hanh-update.component';

describe('DonBaoHanh Management Update Component', () => {
  let comp: DonBaoHanhUpdateComponent;
  let fixture: ComponentFixture<DonBaoHanhUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let donBaoHanhService: DonBaoHanhService;
  let khachHangService: KhachHangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DonBaoHanhUpdateComponent],
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
      .overrideTemplate(DonBaoHanhUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DonBaoHanhUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    donBaoHanhService = TestBed.inject(DonBaoHanhService);
    khachHangService = TestBed.inject(KhachHangService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call KhachHang query and add missing value', () => {
      const donBaoHanh: IDonBaoHanh = { id: 456 };
      const khachHang: IKhachHang = { id: 33787 };
      donBaoHanh.khachHang = khachHang;

      const khachHangCollection: IKhachHang[] = [{ id: 53116 }];
      jest.spyOn(khachHangService, 'query').mockReturnValue(of(new HttpResponse({ body: khachHangCollection })));
      const additionalKhachHangs = [khachHang];
      const expectedCollection: IKhachHang[] = [...additionalKhachHangs, ...khachHangCollection];
      jest.spyOn(khachHangService, 'addKhachHangToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ donBaoHanh });
      comp.ngOnInit();

      expect(khachHangService.query).toHaveBeenCalled();
      expect(khachHangService.addKhachHangToCollectionIfMissing).toHaveBeenCalledWith(khachHangCollection, ...additionalKhachHangs);
      expect(comp.khachHangsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const donBaoHanh: IDonBaoHanh = { id: 456 };
      const khachHang: IKhachHang = { id: 76861 };
      donBaoHanh.khachHang = khachHang;

      activatedRoute.data = of({ donBaoHanh });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(donBaoHanh));
      expect(comp.khachHangsSharedCollection).toContain(khachHang);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DonBaoHanh>>();
      const donBaoHanh = { id: 123 };
      jest.spyOn(donBaoHanhService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donBaoHanh });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donBaoHanh }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(donBaoHanhService.update);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DonBaoHanh>>();
      const donBaoHanh = new DonBaoHanh();
      jest.spyOn(donBaoHanhService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donBaoHanh });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donBaoHanh }));
      saveSubject.complete();

      // THEN
      expect(donBaoHanhService.create);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DonBaoHanh>>();
      const donBaoHanh = { id: 123 };
      jest.spyOn(donBaoHanhService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donBaoHanh });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(donBaoHanhService.update);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackKhachHangById', () => {
      it('Should return tracked KhachHang primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackKhachHangById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
