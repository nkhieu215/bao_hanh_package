import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INhomKhachHang, NhomKhachHang } from '../nhom-khach-hang.model';

import { NhomKhachHangService } from './nhom-khach-hang.service';

describe('NhomKhachHang Service', () => {
  let service: NhomKhachHangService;
  let httpMock: HttpTestingController;
  let elemDefault: INhomKhachHang;
  let expectedResult: INhomKhachHang | INhomKhachHang[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NhomKhachHangService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      tenNhomKhachHang: 'AAAAAAA',
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

    it('should create a NhomKhachHang', () => {
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

      service.create(new NhomKhachHang()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NhomKhachHang', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          tenNhomKhachHang: 'BBBBBB',
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

    it('should partial update a NhomKhachHang', () => {
      const patchObject = Object.assign(
        {
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        new NhomKhachHang()
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

    it('should return a list of NhomKhachHang', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          tenNhomKhachHang: 'BBBBBB',
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

    it('should delete a NhomKhachHang', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNhomKhachHangToCollectionIfMissing', () => {
      it('should add a NhomKhachHang to an empty array', () => {
        const nhomKhachHang: INhomKhachHang = { id: 123 };
        expectedResult = service.addNhomKhachHangToCollectionIfMissing([], nhomKhachHang);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nhomKhachHang);
      });

      it('should not add a NhomKhachHang to an array that contains it', () => {
        const nhomKhachHang: INhomKhachHang = { id: 123 };
        const nhomKhachHangCollection: INhomKhachHang[] = [
          {
            ...nhomKhachHang,
          },
          { id: 456 },
        ];
        expectedResult = service.addNhomKhachHangToCollectionIfMissing(nhomKhachHangCollection, nhomKhachHang);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NhomKhachHang to an array that doesn't contain it", () => {
        const nhomKhachHang: INhomKhachHang = { id: 123 };
        const nhomKhachHangCollection: INhomKhachHang[] = [{ id: 456 }];
        expectedResult = service.addNhomKhachHangToCollectionIfMissing(nhomKhachHangCollection, nhomKhachHang);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nhomKhachHang);
      });

      it('should add only unique NhomKhachHang to an array', () => {
        const nhomKhachHangArray: INhomKhachHang[] = [{ id: 123 }, { id: 456 }, { id: 7553 }];
        const nhomKhachHangCollection: INhomKhachHang[] = [{ id: 123 }];
        expectedResult = service.addNhomKhachHangToCollectionIfMissing(nhomKhachHangCollection, ...nhomKhachHangArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const nhomKhachHang: INhomKhachHang = { id: 123 };
        const nhomKhachHang2: INhomKhachHang = { id: 456 };
        expectedResult = service.addNhomKhachHangToCollectionIfMissing([], nhomKhachHang, nhomKhachHang2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nhomKhachHang);
        expect(expectedResult).toContain(nhomKhachHang2);
      });

      it('should accept null and undefined values', () => {
        const nhomKhachHang: INhomKhachHang = { id: 123 };
        expectedResult = service.addNhomKhachHangToCollectionIfMissing([], null, nhomKhachHang, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nhomKhachHang);
      });

      it('should return initial array if no NhomKhachHang is added', () => {
        const nhomKhachHangCollection: INhomKhachHang[] = [{ id: 123 }];
        expectedResult = service.addNhomKhachHangToCollectionIfMissing(nhomKhachHangCollection, undefined, null);
        expect(expectedResult).toEqual(nhomKhachHangCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
