import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPhanTichSanPham, PhanTichSanPham } from '../phan-tich-san-pham.model';

import { PhanTichSanPhamService } from './phan-tich-san-pham.service';

describe('PhanTichSanPham Service', () => {
  let service: PhanTichSanPhamService;
  let httpMock: HttpTestingController;
  let elemDefault: IPhanTichSanPham;
  let expectedResult: IPhanTichSanPham | IPhanTichSanPham[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PhanTichSanPhamService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      tenNhanVienPhanTich: 'AAAAAAA',
      theLoaiPhanTich: 'AAAAAAA',
      lotNumber: 'AAAAAAA',
      detail: 'AAAAAAA',
      soLuong: 0,
      ngayKiemTra: currentDate,
      username: 'AAAAAAA',
      namSanXuat: 'AAAAAAA',
      trangThai: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          ngayKiemTra: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PhanTichSanPham', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          ngayKiemTra: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayKiemTra: currentDate,
        },
        returnedFromService
      );

      service.create(new PhanTichSanPham()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PhanTichSanPham', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          tenNhanVienPhanTich: 'BBBBBB',
          theLoaiPhanTich: 'BBBBBB',
          lotNumber: 'BBBBBB',
          detail: 'BBBBBB',
          soLuong: 1,
          ngayKiemTra: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          namSanXuat: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayKiemTra: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PhanTichSanPham', () => {
      const patchObject = Object.assign(
        {
          tenNhanVienPhanTich: 'BBBBBB',
          soLuong: 1,
          ngayKiemTra: currentDate.format(DATE_TIME_FORMAT),
        },
        new PhanTichSanPham()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          ngayKiemTra: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PhanTichSanPham', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          tenNhanVienPhanTich: 'BBBBBB',
          theLoaiPhanTich: 'BBBBBB',
          lotNumber: 'BBBBBB',
          detail: 'BBBBBB',
          soLuong: 1,
          ngayKiemTra: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          namSanXuat: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayKiemTra: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PhanTichSanPham', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPhanTichSanPhamToCollectionIfMissing', () => {
      it('should add a PhanTichSanPham to an empty array', () => {
        const phanTichSanPham: IPhanTichSanPham = { id: 123 };
        expectedResult = service.addPhanTichSanPhamToCollectionIfMissing([], phanTichSanPham);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phanTichSanPham);
      });

      it('should not add a PhanTichSanPham to an array that contains it', () => {
        const phanTichSanPham: IPhanTichSanPham = { id: 123 };
        const phanTichSanPhamCollection: IPhanTichSanPham[] = [
          {
            ...phanTichSanPham,
          },
          { id: 456 },
        ];
        expectedResult = service.addPhanTichSanPhamToCollectionIfMissing(phanTichSanPhamCollection, phanTichSanPham);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PhanTichSanPham to an array that doesn't contain it", () => {
        const phanTichSanPham: IPhanTichSanPham = { id: 123 };
        const phanTichSanPhamCollection: IPhanTichSanPham[] = [{ id: 456 }];
        expectedResult = service.addPhanTichSanPhamToCollectionIfMissing(phanTichSanPhamCollection, phanTichSanPham);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phanTichSanPham);
      });

      it('should add only unique PhanTichSanPham to an array', () => {
        const phanTichSanPhamArray: IPhanTichSanPham[] = [{ id: 123 }, { id: 456 }, { id: 24769 }];
        const phanTichSanPhamCollection: IPhanTichSanPham[] = [{ id: 123 }];
        expectedResult = service.addPhanTichSanPhamToCollectionIfMissing(phanTichSanPhamCollection, ...phanTichSanPhamArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const phanTichSanPham: IPhanTichSanPham = { id: 123 };
        const phanTichSanPham2: IPhanTichSanPham = { id: 456 };
        expectedResult = service.addPhanTichSanPhamToCollectionIfMissing([], phanTichSanPham, phanTichSanPham2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phanTichSanPham);
        expect(expectedResult).toContain(phanTichSanPham2);
      });

      it('should accept null and undefined values', () => {
        const phanTichSanPham: IPhanTichSanPham = { id: 123 };
        expectedResult = service.addPhanTichSanPhamToCollectionIfMissing([], null, phanTichSanPham, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phanTichSanPham);
      });

      it('should return initial array if no PhanTichSanPham is added', () => {
        const phanTichSanPhamCollection: IPhanTichSanPham[] = [{ id: 123 }];
        expectedResult = service.addPhanTichSanPhamToCollectionIfMissing(phanTichSanPhamCollection, undefined, null);
        expect(expectedResult).toEqual(phanTichSanPhamCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
