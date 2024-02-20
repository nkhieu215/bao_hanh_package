import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INhomKhachHang, getNhomKhachHangIdentifier } from '../nhom-khach-hang.model';

export type EntityResponseType = HttpResponse<INhomKhachHang>;
export type EntityArrayResponseType = HttpResponse<INhomKhachHang[]>;

@Injectable({ providedIn: 'root' })
export class NhomKhachHangService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/nhom-khach-hangs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(nhomKhachHang: INhomKhachHang): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nhomKhachHang);
    return this.http
      .post<INhomKhachHang>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(nhomKhachHang: INhomKhachHang): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nhomKhachHang);
    return this.http
      .put<INhomKhachHang>(`${this.resourceUrl}/${getNhomKhachHangIdentifier(nhomKhachHang) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(nhomKhachHang: INhomKhachHang): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nhomKhachHang);
    return this.http
      .patch<INhomKhachHang>(`${this.resourceUrl}/${getNhomKhachHangIdentifier(nhomKhachHang) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INhomKhachHang>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INhomKhachHang[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNhomKhachHangToCollectionIfMissing(
    nhomKhachHangCollection: INhomKhachHang[],
    ...nhomKhachHangsToCheck: (INhomKhachHang | null | undefined)[]
  ): INhomKhachHang[] {
    const nhomKhachHangs: INhomKhachHang[] = nhomKhachHangsToCheck.filter(isPresent);
    if (nhomKhachHangs.length > 0) {
      const nhomKhachHangCollectionIdentifiers = nhomKhachHangCollection.map(
        nhomKhachHangItem => getNhomKhachHangIdentifier(nhomKhachHangItem)!
      );
      const nhomKhachHangsToAdd = nhomKhachHangs.filter(nhomKhachHangItem => {
        const nhomKhachHangIdentifier = getNhomKhachHangIdentifier(nhomKhachHangItem);
        if (nhomKhachHangIdentifier == null || nhomKhachHangCollectionIdentifiers.includes(nhomKhachHangIdentifier)) {
          return false;
        }
        nhomKhachHangCollectionIdentifiers.push(nhomKhachHangIdentifier);
        return true;
      });
      return [...nhomKhachHangsToAdd, ...nhomKhachHangCollection];
    }
    return nhomKhachHangCollection;
  }

  protected convertDateFromClient(nhomKhachHang: INhomKhachHang): INhomKhachHang {
    return Object.assign({}, nhomKhachHang, {
      ngayTao: nhomKhachHang.ngayTao?.isValid() ? nhomKhachHang.ngayTao.toJSON() : undefined,
      ngayCapNhat: nhomKhachHang.ngayCapNhat?.isValid() ? nhomKhachHang.ngayCapNhat.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.ngayTao = res.body.ngayTao ? dayjs(res.body.ngayTao) : undefined;
      res.body.ngayCapNhat = res.body.ngayCapNhat ? dayjs(res.body.ngayCapNhat) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((nhomKhachHang: INhomKhachHang) => {
        nhomKhachHang.ngayTao = nhomKhachHang.ngayTao ? dayjs(nhomKhachHang.ngayTao) : undefined;
        nhomKhachHang.ngayCapNhat = nhomKhachHang.ngayCapNhat ? dayjs(nhomKhachHang.ngayCapNhat) : undefined;
      });
    }
    return res;
  }
}
