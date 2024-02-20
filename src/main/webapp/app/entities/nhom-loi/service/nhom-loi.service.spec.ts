import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INhomLoi, NhomLoi } from '../nhom-loi.model';

import { NhomLoiService } from './nhom-loi.service';

describe('NhomLoi Service', () => {
  let service: NhomLoiService;
  let httpMock: HttpTestingController;
  let elemDefault: INhomLoi;
  let expectedResult: INhomLoi | INhomLoi[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NhomLoiService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      maNhomLoi: 'AAAAAAA',
      tenNhomLoi: 'AAAAAAA',
      ngayTao: currentDate,
      ngayCapNhat: currentDate,
      username: 'AAAAAAA',
      ghiChu: 'AAAAAAA',
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

    it('should create a NhomLoi', () => {
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

      service.create(new NhomLoi()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NhomLoi', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maNhomLoi: 'BBBBBB',
          tenNhomLoi: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          ghiChu: 'BBBBBB',
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

    it('should partial update a NhomLoi', () => {
      const patchObject = Object.assign(
        {
          maNhomLoi: 'BBBBBB',
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
          ghiChu: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        new NhomLoi()
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

    it('should return a list of NhomLoi', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maNhomLoi: 'BBBBBB',
          tenNhomLoi: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          ghiChu: 'BBBBBB',
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

    it('should delete a NhomLoi', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNhomLoiToCollectionIfMissing', () => {
      it('should add a NhomLoi to an empty array', () => {
        const nhomLoi: INhomLoi = { id: 123 };
        expectedResult = service.addNhomLoiToCollectionIfMissing([], nhomLoi);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nhomLoi);
      });

      it('should not add a NhomLoi to an array that contains it', () => {
        const nhomLoi: INhomLoi = { id: 123 };
        const nhomLoiCollection: INhomLoi[] = [
          {
            ...nhomLoi,
          },
          { id: 456 },
        ];
        expectedResult = service.addNhomLoiToCollectionIfMissing(nhomLoiCollection, nhomLoi);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NhomLoi to an array that doesn't contain it", () => {
        const nhomLoi: INhomLoi = { id: 123 };
        const nhomLoiCollection: INhomLoi[] = [{ id: 456 }];
        expectedResult = service.addNhomLoiToCollectionIfMissing(nhomLoiCollection, nhomLoi);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nhomLoi);
      });

      it('should add only unique NhomLoi to an array', () => {
        const nhomLoiArray: INhomLoi[] = [{ id: 123 }, { id: 456 }, { id: 28127 }];
        const nhomLoiCollection: INhomLoi[] = [{ id: 123 }];
        expectedResult = service.addNhomLoiToCollectionIfMissing(nhomLoiCollection, ...nhomLoiArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const nhomLoi: INhomLoi = { id: 123 };
        const nhomLoi2: INhomLoi = { id: 456 };
        expectedResult = service.addNhomLoiToCollectionIfMissing([], nhomLoi, nhomLoi2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nhomLoi);
        expect(expectedResult).toContain(nhomLoi2);
      });

      it('should accept null and undefined values', () => {
        const nhomLoi: INhomLoi = { id: 123 };
        expectedResult = service.addNhomLoiToCollectionIfMissing([], null, nhomLoi, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nhomLoi);
      });

      it('should return initial array if no NhomLoi is added', () => {
        const nhomLoiCollection: INhomLoi[] = [{ id: 123 }];
        expectedResult = service.addNhomLoiToCollectionIfMissing(nhomLoiCollection, undefined, null);
        expect(expectedResult).toEqual(nhomLoiCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
