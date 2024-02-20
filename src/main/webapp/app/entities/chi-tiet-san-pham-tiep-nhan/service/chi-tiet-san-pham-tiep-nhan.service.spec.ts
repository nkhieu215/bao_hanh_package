import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IChiTietSanPhamTiepNhan, ChiTietSanPhamTiepNhan } from '../chi-tiet-san-pham-tiep-nhan.model';

import { ChiTietSanPhamTiepNhanService } from './chi-tiet-san-pham-tiep-nhan.service';

describe('ChiTietSanPhamTiepNhan Service', () => {
  let service: ChiTietSanPhamTiepNhanService;
  let httpMock: HttpTestingController;
  let elemDefault: IChiTietSanPhamTiepNhan;
  let expectedResult: IChiTietSanPhamTiepNhan | IChiTietSanPhamTiepNhan[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChiTietSanPhamTiepNhanService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      soLuongKhachHang: 0,
      idKho: 'AAAAAAA',
      idBienBan: 'AAAAAAA',
      tongLoiKiThuat: 0,
      tongLoiLinhDong: 0,
      ngayPhanLoai: currentDate,
      slTiepNhan: 0,
      slTon: 0,
      tinhTrangBaoHanh: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          ngayPhanLoai: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ChiTietSanPhamTiepNhan', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          ngayPhanLoai: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayPhanLoai: currentDate,
        },
        returnedFromService
      );

      service.create(new ChiTietSanPhamTiepNhan()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChiTietSanPhamTiepNhan', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          soLuongKhachHang: 1,
          idKho: 'BBBBBB',
          idBienBan: 'BBBBBB',
          tongLoiKiThuat: 1,
          tongLoiLinhDong: 1,
          ngayPhanLoai: currentDate.format(DATE_TIME_FORMAT),
          slTiepNhan: 1,
          slTon: 1,
          tinhTrangBaoHanh: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayPhanLoai: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ChiTietSanPhamTiepNhan', () => {
      const patchObject = Object.assign(
        {
          idBienBan: 'BBBBBB',
          tongLoiKiThuat: 1,
          tongLoiLinhDong: 1,
          ngayPhanLoai: currentDate.format(DATE_TIME_FORMAT),
          slTiepNhan: 1,
          slTon: 1,
          tinhTrangBaoHanh: 'BBBBBB',
        },
        new ChiTietSanPhamTiepNhan()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          ngayPhanLoai: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ChiTietSanPhamTiepNhan', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          soLuongKhachHang: 1,
          idKho: 'BBBBBB',
          idBienBan: 'BBBBBB',
          tongLoiKiThuat: 1,
          tongLoiLinhDong: 1,
          ngayPhanLoai: currentDate.format(DATE_TIME_FORMAT),
          slTiepNhan: 1,
          slTon: 1,
          tinhTrangBaoHanh: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayPhanLoai: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ChiTietSanPhamTiepNhan', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChiTietSanPhamTiepNhanToCollectionIfMissing', () => {
      it('should add a ChiTietSanPhamTiepNhan to an empty array', () => {
        const chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan = { id: 123 };
        expectedResult = service.addChiTietSanPhamTiepNhanToCollectionIfMissing([], chiTietSanPhamTiepNhan);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chiTietSanPhamTiepNhan);
      });

      it('should not add a ChiTietSanPhamTiepNhan to an array that contains it', () => {
        const chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan = { id: 123 };
        const chiTietSanPhamTiepNhanCollection: IChiTietSanPhamTiepNhan[] = [
          {
            ...chiTietSanPhamTiepNhan,
          },
          { id: 456 },
        ];
        expectedResult = service.addChiTietSanPhamTiepNhanToCollectionIfMissing(chiTietSanPhamTiepNhanCollection, chiTietSanPhamTiepNhan);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChiTietSanPhamTiepNhan to an array that doesn't contain it", () => {
        const chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan = { id: 123 };
        const chiTietSanPhamTiepNhanCollection: IChiTietSanPhamTiepNhan[] = [{ id: 456 }];
        expectedResult = service.addChiTietSanPhamTiepNhanToCollectionIfMissing(chiTietSanPhamTiepNhanCollection, chiTietSanPhamTiepNhan);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chiTietSanPhamTiepNhan);
      });

      it('should add only unique ChiTietSanPhamTiepNhan to an array', () => {
        const chiTietSanPhamTiepNhanArray: IChiTietSanPhamTiepNhan[] = [{ id: 123 }, { id: 456 }, { id: 77109 }];
        const chiTietSanPhamTiepNhanCollection: IChiTietSanPhamTiepNhan[] = [{ id: 123 }];
        expectedResult = service.addChiTietSanPhamTiepNhanToCollectionIfMissing(
          chiTietSanPhamTiepNhanCollection,
          ...chiTietSanPhamTiepNhanArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan = { id: 123 };
        const chiTietSanPhamTiepNhan2: IChiTietSanPhamTiepNhan = { id: 456 };
        expectedResult = service.addChiTietSanPhamTiepNhanToCollectionIfMissing([], chiTietSanPhamTiepNhan, chiTietSanPhamTiepNhan2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chiTietSanPhamTiepNhan);
        expect(expectedResult).toContain(chiTietSanPhamTiepNhan2);
      });

      it('should accept null and undefined values', () => {
        const chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan = { id: 123 };
        expectedResult = service.addChiTietSanPhamTiepNhanToCollectionIfMissing([], null, chiTietSanPhamTiepNhan, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chiTietSanPhamTiepNhan);
      });

      it('should return initial array if no ChiTietSanPhamTiepNhan is added', () => {
        const chiTietSanPhamTiepNhanCollection: IChiTietSanPhamTiepNhan[] = [{ id: 123 }];
        expectedResult = service.addChiTietSanPhamTiepNhanToCollectionIfMissing(chiTietSanPhamTiepNhanCollection, undefined, null);
        expect(expectedResult).toEqual(chiTietSanPhamTiepNhanCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
