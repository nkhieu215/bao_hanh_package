import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPhanTichLoi, PhanTichLoi } from '../phan-tich-loi.model';

import { PhanTichLoiService } from './phan-tich-loi.service';

describe('PhanTichLoi Service', () => {
  let service: PhanTichLoiService;
  let httpMock: HttpTestingController;
  let elemDefault: IPhanTichLoi;
  let expectedResult: IPhanTichLoi | IPhanTichLoi[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PhanTichLoiService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      soLuong: 0,
      ngayPhanTich: currentDate,
      username: 'AAAAAAA',
      ghiChu: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          ngayPhanTich: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PhanTichLoi', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          ngayPhanTich: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayPhanTich: currentDate,
        },
        returnedFromService
      );

      service.create(new PhanTichLoi()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PhanTichLoi', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          soLuong: 1,
          ngayPhanTich: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          ghiChu: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayPhanTich: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PhanTichLoi', () => {
      const patchObject = Object.assign(
        {
          soLuong: 1,
          username: 'BBBBBB',
        },
        new PhanTichLoi()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          ngayPhanTich: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PhanTichLoi', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          soLuong: 1,
          ngayPhanTich: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          ghiChu: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayPhanTich: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PhanTichLoi', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPhanTichLoiToCollectionIfMissing', () => {
      it('should add a PhanTichLoi to an empty array', () => {
        const phanTichLoi: IPhanTichLoi = { id: 123 };
        expectedResult = service.addPhanTichLoiToCollectionIfMissing([], phanTichLoi);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phanTichLoi);
      });

      it('should not add a PhanTichLoi to an array that contains it', () => {
        const phanTichLoi: IPhanTichLoi = { id: 123 };
        const phanTichLoiCollection: IPhanTichLoi[] = [
          {
            ...phanTichLoi,
          },
          { id: 456 },
        ];
        expectedResult = service.addPhanTichLoiToCollectionIfMissing(phanTichLoiCollection, phanTichLoi);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PhanTichLoi to an array that doesn't contain it", () => {
        const phanTichLoi: IPhanTichLoi = { id: 123 };
        const phanTichLoiCollection: IPhanTichLoi[] = [{ id: 456 }];
        expectedResult = service.addPhanTichLoiToCollectionIfMissing(phanTichLoiCollection, phanTichLoi);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phanTichLoi);
      });

      it('should add only unique PhanTichLoi to an array', () => {
        const phanTichLoiArray: IPhanTichLoi[] = [{ id: 123 }, { id: 456 }, { id: 15086 }];
        const phanTichLoiCollection: IPhanTichLoi[] = [{ id: 123 }];
        expectedResult = service.addPhanTichLoiToCollectionIfMissing(phanTichLoiCollection, ...phanTichLoiArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const phanTichLoi: IPhanTichLoi = { id: 123 };
        const phanTichLoi2: IPhanTichLoi = { id: 456 };
        expectedResult = service.addPhanTichLoiToCollectionIfMissing([], phanTichLoi, phanTichLoi2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phanTichLoi);
        expect(expectedResult).toContain(phanTichLoi2);
      });

      it('should accept null and undefined values', () => {
        const phanTichLoi: IPhanTichLoi = { id: 123 };
        expectedResult = service.addPhanTichLoiToCollectionIfMissing([], null, phanTichLoi, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phanTichLoi);
      });

      it('should return initial array if no PhanTichLoi is added', () => {
        const phanTichLoiCollection: IPhanTichLoi[] = [{ id: 123 }];
        expectedResult = service.addPhanTichLoiToCollectionIfMissing(phanTichLoiCollection, undefined, null);
        expect(expectedResult).toEqual(phanTichLoiCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
