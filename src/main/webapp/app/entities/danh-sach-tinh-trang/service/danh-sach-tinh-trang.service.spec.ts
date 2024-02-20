import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDanhSachTinhTrang, DanhSachTinhTrang } from '../danh-sach-tinh-trang.model';

import { DanhSachTinhTrangService } from './danh-sach-tinh-trang.service';

describe('DanhSachTinhTrang Service', () => {
  let service: DanhSachTinhTrangService;
  let httpMock: HttpTestingController;
  let elemDefault: IDanhSachTinhTrang;
  let expectedResult: IDanhSachTinhTrang | IDanhSachTinhTrang[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DanhSachTinhTrangService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      tenTinhTrangPhanLoai: 'AAAAAAA',
      ngayTao: currentDate,
      ngayCapNhat: currentDate,
      username: 'AAAAAAA',
      trangThai: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a DanhSachTinhTrang', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayTao: currentDate,
          ngayCapNhat: currentDate,
        },
        returnedFromService
      );

      service.create(new DanhSachTinhTrang()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DanhSachTinhTrang', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          tenTinhTrangPhanLoai: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayTao: currentDate,
          ngayCapNhat: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DanhSachTinhTrang', () => {
      const patchObject = Object.assign(
        {
          tenTinhTrangPhanLoai: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
        },
        new DanhSachTinhTrang()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          ngayTao: currentDate,
          ngayCapNhat: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DanhSachTinhTrang', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          tenTinhTrangPhanLoai: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayTao: currentDate,
          ngayCapNhat: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a DanhSachTinhTrang', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDanhSachTinhTrangToCollectionIfMissing', () => {
      it('should add a DanhSachTinhTrang to an empty array', () => {
        const danhSachTinhTrang: IDanhSachTinhTrang = { id: 123 };
        expectedResult = service.addDanhSachTinhTrangToCollectionIfMissing([], danhSachTinhTrang);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(danhSachTinhTrang);
      });

      it('should not add a DanhSachTinhTrang to an array that contains it', () => {
        const danhSachTinhTrang: IDanhSachTinhTrang = { id: 123 };
        const danhSachTinhTrangCollection: IDanhSachTinhTrang[] = [
          {
            ...danhSachTinhTrang,
          },
          { id: 456 },
        ];
        expectedResult = service.addDanhSachTinhTrangToCollectionIfMissing(danhSachTinhTrangCollection, danhSachTinhTrang);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DanhSachTinhTrang to an array that doesn't contain it", () => {
        const danhSachTinhTrang: IDanhSachTinhTrang = { id: 123 };
        const danhSachTinhTrangCollection: IDanhSachTinhTrang[] = [{ id: 456 }];
        expectedResult = service.addDanhSachTinhTrangToCollectionIfMissing(danhSachTinhTrangCollection, danhSachTinhTrang);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(danhSachTinhTrang);
      });

      it('should add only unique DanhSachTinhTrang to an array', () => {
        const danhSachTinhTrangArray: IDanhSachTinhTrang[] = [{ id: 123 }, { id: 456 }, { id: 3068 }];
        const danhSachTinhTrangCollection: IDanhSachTinhTrang[] = [{ id: 123 }];
        expectedResult = service.addDanhSachTinhTrangToCollectionIfMissing(danhSachTinhTrangCollection, ...danhSachTinhTrangArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const danhSachTinhTrang: IDanhSachTinhTrang = { id: 123 };
        const danhSachTinhTrang2: IDanhSachTinhTrang = { id: 456 };
        expectedResult = service.addDanhSachTinhTrangToCollectionIfMissing([], danhSachTinhTrang, danhSachTinhTrang2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(danhSachTinhTrang);
        expect(expectedResult).toContain(danhSachTinhTrang2);
      });

      it('should accept null and undefined values', () => {
        const danhSachTinhTrang: IDanhSachTinhTrang = { id: 123 };
        expectedResult = service.addDanhSachTinhTrangToCollectionIfMissing([], null, danhSachTinhTrang, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(danhSachTinhTrang);
      });

      it('should return initial array if no DanhSachTinhTrang is added', () => {
        const danhSachTinhTrangCollection: IDanhSachTinhTrang[] = [{ id: 123 }];
        expectedResult = service.addDanhSachTinhTrangToCollectionIfMissing(danhSachTinhTrangCollection, undefined, null);
        expect(expectedResult).toEqual(danhSachTinhTrangCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
