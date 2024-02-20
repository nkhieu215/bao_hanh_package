import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INhomSanPham, getNhomSanPhamIdentifier } from '../nhom-san-pham.model';

export type EntityResponseType = HttpResponse<INhomSanPham>;
export type EntityArrayResponseType = HttpResponse<INhomSanPham[]>;

@Injectable({ providedIn: 'root' })
export class NhomSanPhamService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/nhom-san-phams');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(nhomSanPham: INhomSanPham): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nhomSanPham);
    return this.http
      .post<INhomSanPham>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(nhomSanPham: INhomSanPham): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nhomSanPham);
    return this.http
      .put<INhomSanPham>(`${this.resourceUrl}/${getNhomSanPhamIdentifier(nhomSanPham) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(nhomSanPham: INhomSanPham): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nhomSanPham);
    return this.http
      .patch<INhomSanPham>(`${this.resourceUrl}/${getNhomSanPhamIdentifier(nhomSanPham) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INhomSanPham>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INhomSanPham[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNhomSanPhamToCollectionIfMissing(
    nhomSanPhamCollection: INhomSanPham[],
    ...nhomSanPhamsToCheck: (INhomSanPham | null | undefined)[]
  ): INhomSanPham[] {
    const nhomSanPhams: INhomSanPham[] = nhomSanPhamsToCheck.filter(isPresent);
    if (nhomSanPhams.length > 0) {
      const nhomSanPhamCollectionIdentifiers = nhomSanPhamCollection.map(nhomSanPhamItem => getNhomSanPhamIdentifier(nhomSanPhamItem)!);
      const nhomSanPhamsToAdd = nhomSanPhams.filter(nhomSanPhamItem => {
        const nhomSanPhamIdentifier = getNhomSanPhamIdentifier(nhomSanPhamItem);
        if (nhomSanPhamIdentifier == null || nhomSanPhamCollectionIdentifiers.includes(nhomSanPhamIdentifier)) {
          return false;
        }
        nhomSanPhamCollectionIdentifiers.push(nhomSanPhamIdentifier);
        return true;
      });
      return [...nhomSanPhamsToAdd, ...nhomSanPhamCollection];
    }
    return nhomSanPhamCollection;
  }

  protected convertDateFromClient(nhomSanPham: INhomSanPham): INhomSanPham {
    return Object.assign({}, nhomSanPham, {
      timeUpdate: nhomSanPham.timeUpdate?.isValid() ? nhomSanPham.timeUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timeUpdate = res.body.timeUpdate ? dayjs(res.body.timeUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((nhomSanPham: INhomSanPham) => {
        nhomSanPham.timeUpdate = nhomSanPham.timeUpdate ? dayjs(nhomSanPham.timeUpdate) : undefined;
      });
    }
    return res;
  }
}
