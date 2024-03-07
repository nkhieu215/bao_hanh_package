import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDonBaoHanh, DonBaoHanh } from '../don-bao-hanh.model';

import { DonBaoHanhService } from './don-bao-hanh.service';

describe('DonBaoHanh Service', () => {
  let service: DonBaoHanhService;
  let httpMock: HttpTestingController;
  let elemDefault: IDonBaoHanh;
  let expectedResult: IDonBaoHanh | IDonBaoHanh[] | boolean | null;
  let currentDate: Date;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DonBaoHanhService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = new Date();

    elemDefault = {
      id: 0,
      ngayTiepNhan: 'AAAAAAA',
      trangThai: 'AAAAAAA',
      nhanVienGiaoHang: 'AAAAAAA',
      ngaykhkb: currentDate,
      nguoiTaoDon: 'AAAAAAA',
      slTiepNhan: 0,
      slDaPhanTich: 0,
      ghiChu: 'AAAAAAA',
      ngayTraBienBan: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          ngaykhkb: currentDate,
          ngayTraBienBan: currentDate,
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a DonBaoHanh', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          ngaykhkb: currentDate,
          ngayTraBienBan: currentDate,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngaykhkb: currentDate,
          ngayTraBienBan: currentDate,
        },
        returnedFromService
      );

      service.create(new DonBaoHanh()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DonBaoHanh', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ngayTiepNhan: 'BBBBBB',
          trangThai: 'BBBBBB',
          nhanVienGiaoHang: 'BBBBBB',
          ngaykhkb: currentDate,
          nguoiTaoDon: 'BBBBBB',
          slTiepNhan: 1,
          slDaPhanTich: 1,
          ghiChu: 'BBBBBB',
          ngayTraBienBan: currentDate,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngaykhkb: currentDate,
          ngayTraBienBan: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DonBaoHanh', () => {
      const patchObject = Object.assign(
        {
          trangThai: 'BBBBBB',
          nhanVienGiaoHang: 'BBBBBB',
          nguoiTaoDon: 'BBBBBB',
          ghiChu: 'BBBBBB',
          ngayTraBienBan: currentDate,
        },
        new DonBaoHanh()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          ngaykhkb: currentDate,
          ngayTraBienBan: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DonBaoHanh', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ngayTiepNhan: 'BBBBBB',
          trangThai: 'BBBBBB',
          nhanVienGiaoHang: 'BBBBBB',
          ngaykhkb: currentDate,
          nguoiTaoDon: 'BBBBBB',
          slTiepNhan: 1,
          slDaPhanTich: 1,
          ghiChu: 'BBBBBB',
          ngayTraBienBan: currentDate,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngaykhkb: currentDate,
          ngayTraBienBan: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a DonBaoHanh', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDonBaoHanhToCollectionIfMissing', () => {
      it('should add a DonBaoHanh to an empty array', () => {
        const donBaoHanh: IDonBaoHanh = { id: 123 };
        expectedResult = service.addDonBaoHanhToCollectionIfMissing([], donBaoHanh);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(donBaoHanh);
      });

      it('should not add a DonBaoHanh to an array that contains it', () => {
        const donBaoHanh: IDonBaoHanh = { id: 123 };
        const donBaoHanhCollection: IDonBaoHanh[] = [
          {
            ...donBaoHanh,
          },
          { id: 456 },
        ];
        expectedResult = service.addDonBaoHanhToCollectionIfMissing(donBaoHanhCollection, donBaoHanh);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DonBaoHanh to an array that doesn't contain it", () => {
        const donBaoHanh: IDonBaoHanh = { id: 123 };
        const donBaoHanhCollection: IDonBaoHanh[] = [{ id: 456 }];
        expectedResult = service.addDonBaoHanhToCollectionIfMissing(donBaoHanhCollection, donBaoHanh);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(donBaoHanh);
      });

      it('should add only unique DonBaoHanh to an array', () => {
        const donBaoHanhArray: IDonBaoHanh[] = [{ id: 123 }, { id: 456 }, { id: 89161 }];
        const donBaoHanhCollection: IDonBaoHanh[] = [{ id: 123 }];
        expectedResult = service.addDonBaoHanhToCollectionIfMissing(donBaoHanhCollection, ...donBaoHanhArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const donBaoHanh: IDonBaoHanh = { id: 123 };
        const donBaoHanh2: IDonBaoHanh = { id: 456 };
        expectedResult = service.addDonBaoHanhToCollectionIfMissing([], donBaoHanh, donBaoHanh2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(donBaoHanh);
        expect(expectedResult).toContain(donBaoHanh2);
      });

      it('should accept null and undefined values', () => {
        const donBaoHanh: IDonBaoHanh = { id: 123 };
        expectedResult = service.addDonBaoHanhToCollectionIfMissing([], null, donBaoHanh, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(donBaoHanh);
      });

      it('should return initial array if no DonBaoHanh is added', () => {
        const donBaoHanhCollection: IDonBaoHanh[] = [{ id: 123 }];
        expectedResult = service.addDonBaoHanhToCollectionIfMissing(donBaoHanhCollection, undefined, null);
        expect(expectedResult).toEqual(donBaoHanhCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
