import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INhomSanPham, NhomSanPham } from '../nhom-san-pham.model';

import { NhomSanPhamService } from './nhom-san-pham.service';

describe('NhomSanPham Service', () => {
  let service: NhomSanPhamService;
  let httpMock: HttpTestingController;
  let elemDefault: INhomSanPham;
  let expectedResult: INhomSanPham | INhomSanPham[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NhomSanPhamService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      timeCreate: 'AAAAAAA',
      timeUpdate: currentDate,
      username: 'AAAAAAA',
      trangThai: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          timeUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a NhomSanPham', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          timeUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timeUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new NhomSanPham()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NhomSanPham', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          timeCreate: 'BBBBBB',
          timeUpdate: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timeUpdate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a NhomSanPham', () => {
      const patchObject = Object.assign(
        {
          timeCreate: 'BBBBBB',
          timeUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        new NhomSanPham()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          timeUpdate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of NhomSanPham', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          timeCreate: 'BBBBBB',
          timeUpdate: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timeUpdate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a NhomSanPham', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNhomSanPhamToCollectionIfMissing', () => {
      it('should add a NhomSanPham to an empty array', () => {
        const nhomSanPham: INhomSanPham = { id: 123 };
        expectedResult = service.addNhomSanPhamToCollectionIfMissing([], nhomSanPham);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nhomSanPham);
      });

      it('should not add a NhomSanPham to an array that contains it', () => {
        const nhomSanPham: INhomSanPham = { id: 123 };
        const nhomSanPhamCollection: INhomSanPham[] = [
          {
            ...nhomSanPham,
          },
          { id: 456 },
        ];
        expectedResult = service.addNhomSanPhamToCollectionIfMissing(nhomSanPhamCollection, nhomSanPham);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NhomSanPham to an array that doesn't contain it", () => {
        const nhomSanPham: INhomSanPham = { id: 123 };
        const nhomSanPhamCollection: INhomSanPham[] = [{ id: 456 }];
        expectedResult = service.addNhomSanPhamToCollectionIfMissing(nhomSanPhamCollection, nhomSanPham);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nhomSanPham);
      });

      it('should add only unique NhomSanPham to an array', () => {
        const nhomSanPhamArray: INhomSanPham[] = [{ id: 123 }, { id: 456 }, { id: 61796 }];
        const nhomSanPhamCollection: INhomSanPham[] = [{ id: 123 }];
        expectedResult = service.addNhomSanPhamToCollectionIfMissing(nhomSanPhamCollection, ...nhomSanPhamArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const nhomSanPham: INhomSanPham = { id: 123 };
        const nhomSanPham2: INhomSanPham = { id: 456 };
        expectedResult = service.addNhomSanPhamToCollectionIfMissing([], nhomSanPham, nhomSanPham2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nhomSanPham);
        expect(expectedResult).toContain(nhomSanPham2);
      });

      it('should accept null and undefined values', () => {
        const nhomSanPham: INhomSanPham = { id: 123 };
        expectedResult = service.addNhomSanPhamToCollectionIfMissing([], null, nhomSanPham, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nhomSanPham);
      });

      it('should return initial array if no NhomSanPham is added', () => {
        const nhomSanPhamCollection: INhomSanPham[] = [{ id: 123 }];
        expectedResult = service.addNhomSanPhamToCollectionIfMissing(nhomSanPhamCollection, undefined, null);
        expect(expectedResult).toEqual(nhomSanPhamCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
