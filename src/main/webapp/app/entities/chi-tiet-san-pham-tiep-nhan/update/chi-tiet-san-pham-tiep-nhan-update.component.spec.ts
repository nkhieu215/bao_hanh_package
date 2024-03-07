import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChiTietSanPhamTiepNhanService } from '../service/chi-tiet-san-pham-tiep-nhan.service';
import { IChiTietSanPhamTiepNhan, ChiTietSanPhamTiepNhan } from '../chi-tiet-san-pham-tiep-nhan.model';
import { ISanPham } from 'app/entities/san-pham/san-pham.model';
import { SanPhamService } from 'app/entities/san-pham/service/san-pham.service';
import { IDonBaoHanh } from 'app/entities/don-bao-hanh/don-bao-hanh.model';
import { DonBaoHanhService } from 'app/entities/don-bao-hanh/service/don-bao-hanh.service';

import { ChiTietSanPhamTiepNhanUpdateComponent } from './chi-tiet-san-pham-tiep-nhan-update.component';

describe('ChiTietSanPhamTiepNhan Management Update Component', () => {
  let comp: ChiTietSanPhamTiepNhanUpdateComponent;
  let fixture: ComponentFixture<ChiTietSanPhamTiepNhanUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chiTietSanPhamTiepNhanService: ChiTietSanPhamTiepNhanService;
  let sanPhamService: SanPhamService;
  let donBaoHanhService: DonBaoHanhService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChiTietSanPhamTiepNhanUpdateComponent],
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
      .overrideTemplate(ChiTietSanPhamTiepNhanUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChiTietSanPhamTiepNhanUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chiTietSanPhamTiepNhanService = TestBed.inject(ChiTietSanPhamTiepNhanService);
    sanPhamService = TestBed.inject(SanPhamService);
    donBaoHanhService = TestBed.inject(DonBaoHanhService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SanPham query and add missing value', () => {
      const chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan = { id: 456 };
      const sanPham: ISanPham = { id: 41921, name: '' };
      chiTietSanPhamTiepNhan.sanPham = sanPham;

      const sanPhamCollection: ISanPham[] = [{ id: 82740, name: '' }];
      jest.spyOn(sanPhamService, 'query').mockReturnValue(of(new HttpResponse({ body: sanPhamCollection })));
      const additionalSanPhams = [sanPham];
      const expectedCollection: ISanPham[] = [...additionalSanPhams, ...sanPhamCollection];
      jest.spyOn(sanPhamService, 'addSanPhamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chiTietSanPhamTiepNhan });
      comp.ngOnInit();

      expect(sanPhamService.query).toHaveBeenCalled();
      expect(sanPhamService.addSanPhamToCollectionIfMissing).toHaveBeenCalledWith(sanPhamCollection, ...additionalSanPhams);
      expect(comp.sanPhamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call DonBaoHanh query and add missing value', () => {
      const chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan = { id: 456 };
      const donBaoHanh: IDonBaoHanh = { id: 87706 };
      chiTietSanPhamTiepNhan.donBaoHanh = donBaoHanh;

      const donBaoHanhCollection: IDonBaoHanh[] = [{ id: 27981 }];
      jest.spyOn(donBaoHanhService, 'query').mockReturnValue(of(new HttpResponse({ body: donBaoHanhCollection })));
      const additionalDonBaoHanhs = [donBaoHanh];
      const expectedCollection: IDonBaoHanh[] = [...additionalDonBaoHanhs, ...donBaoHanhCollection];
      jest.spyOn(donBaoHanhService, 'addDonBaoHanhToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chiTietSanPhamTiepNhan });
      comp.ngOnInit();

      expect(donBaoHanhService.query).toHaveBeenCalled();
      expect(donBaoHanhService.addDonBaoHanhToCollectionIfMissing).toHaveBeenCalledWith(donBaoHanhCollection, ...additionalDonBaoHanhs);
      expect(comp.donBaoHanhsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan = { id: 456 };
      const sanPham: ISanPham = { id: 47860, name: '' };
      chiTietSanPhamTiepNhan.sanPham = sanPham;
      const donBaoHanh: IDonBaoHanh = { id: 8889 };
      chiTietSanPhamTiepNhan.donBaoHanh = donBaoHanh;

      activatedRoute.data = of({ chiTietSanPhamTiepNhan });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chiTietSanPhamTiepNhan));
      expect(comp.sanPhamsSharedCollection).toContain(sanPham);
      expect(comp.donBaoHanhsSharedCollection).toContain(donBaoHanh);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChiTietSanPhamTiepNhan>>();
      const chiTietSanPhamTiepNhan = { id: 123 };
      jest.spyOn(chiTietSanPhamTiepNhanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chiTietSanPhamTiepNhan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chiTietSanPhamTiepNhan }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chiTietSanPhamTiepNhanService.update).toHaveBeenCalledWith(chiTietSanPhamTiepNhan);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChiTietSanPhamTiepNhan>>();
      const chiTietSanPhamTiepNhan = new ChiTietSanPhamTiepNhan();
      jest.spyOn(chiTietSanPhamTiepNhanService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chiTietSanPhamTiepNhan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chiTietSanPhamTiepNhan }));
      saveSubject.complete();

      // THEN
      expect(chiTietSanPhamTiepNhanService.create).toHaveBeenCalledWith(chiTietSanPhamTiepNhan);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChiTietSanPhamTiepNhan>>();
      const chiTietSanPhamTiepNhan = { id: 123 };
      jest.spyOn(chiTietSanPhamTiepNhanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chiTietSanPhamTiepNhan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chiTietSanPhamTiepNhanService.update).toHaveBeenCalledWith(chiTietSanPhamTiepNhan);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSanPhamById', () => {
      it('Should return tracked SanPham primary key', () => {
        const entity = { id: 123, name: '' };
        const trackResult = comp.trackSanPhamById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDonBaoHanhById', () => {
      it('Should return tracked DonBaoHanh primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDonBaoHanhById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
