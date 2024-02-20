import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKhachHang, KhachHang } from '../khach-hang.model';

import { KhachHangService } from './khach-hang.service';

describe('KhachHang Service', () => {
  let service: KhachHangService;
  let httpMock: HttpTestingController;
  let elemDefault: IKhachHang;
  let expectedResult: IKhachHang | IKhachHang[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KhachHangService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      maKhachHang: 'AAAAAAA',
      tenKhachHang: 'AAAAAAA',
      soDienThoai: 'AAAAAAA',
      diaChi: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a KhachHang', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new KhachHang()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a KhachHang', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maKhachHang: 'BBBBBB',
          tenKhachHang: 'BBBBBB',
          soDienThoai: 'BBBBBB',
          diaChi: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a KhachHang', () => {
      const patchObject = Object.assign(
        {
          maKhachHang: 'BBBBBB',
          tenKhachHang: 'BBBBBB',
        },
        new KhachHang()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of KhachHang', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maKhachHang: 'BBBBBB',
          tenKhachHang: 'BBBBBB',
          soDienThoai: 'BBBBBB',
          diaChi: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a KhachHang', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addKhachHangToCollectionIfMissing', () => {
      it('should add a KhachHang to an empty array', () => {
        const khachHang: IKhachHang = { id: 123 };
        expectedResult = service.addKhachHangToCollectionIfMissing([], khachHang);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(khachHang);
      });

      it('should not add a KhachHang to an array that contains it', () => {
        const khachHang: IKhachHang = { id: 123 };
        const khachHangCollection: IKhachHang[] = [
          {
            ...khachHang,
          },
          { id: 456 },
        ];
        expectedResult = service.addKhachHangToCollectionIfMissing(khachHangCollection, khachHang);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a KhachHang to an array that doesn't contain it", () => {
        const khachHang: IKhachHang = { id: 123 };
        const khachHangCollection: IKhachHang[] = [{ id: 456 }];
        expectedResult = service.addKhachHangToCollectionIfMissing(khachHangCollection, khachHang);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(khachHang);
      });

      it('should add only unique KhachHang to an array', () => {
        const khachHangArray: IKhachHang[] = [{ id: 123 }, { id: 456 }, { id: 1426 }];
        const khachHangCollection: IKhachHang[] = [{ id: 123 }];
        expectedResult = service.addKhachHangToCollectionIfMissing(khachHangCollection, ...khachHangArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const khachHang: IKhachHang = { id: 123 };
        const khachHang2: IKhachHang = { id: 456 };
        expectedResult = service.addKhachHangToCollectionIfMissing([], khachHang, khachHang2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(khachHang);
        expect(expectedResult).toContain(khachHang2);
      });

      it('should accept null and undefined values', () => {
        const khachHang: IKhachHang = { id: 123 };
        expectedResult = service.addKhachHangToCollectionIfMissing([], null, khachHang, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(khachHang);
      });

      it('should return initial array if no KhachHang is added', () => {
        const khachHangCollection: IKhachHang[] = [{ id: 123 }];
        expectedResult = service.addKhachHangToCollectionIfMissing(khachHangCollection, undefined, null);
        expect(expectedResult).toEqual(khachHangCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
