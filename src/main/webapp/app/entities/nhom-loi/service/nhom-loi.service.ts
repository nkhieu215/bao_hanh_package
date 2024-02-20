import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INhomLoi, getNhomLoiIdentifier } from '../nhom-loi.model';

export type EntityResponseType = HttpResponse<INhomLoi>;
export type EntityArrayResponseType = HttpResponse<INhomLoi[]>;

@Injectable({ providedIn: 'root' })
export class NhomLoiService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/nhom-lois');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(nhomLoi: INhomLoi): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nhomLoi);
    return this.http
      .post<INhomLoi>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(nhomLoi: INhomLoi): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nhomLoi);
    return this.http
      .put<INhomLoi>(`${this.resourceUrl}/${getNhomLoiIdentifier(nhomLoi) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(nhomLoi: INhomLoi): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nhomLoi);
    return this.http
      .patch<INhomLoi>(`${this.resourceUrl}/${getNhomLoiIdentifier(nhomLoi) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INhomLoi>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INhomLoi[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNhomLoiToCollectionIfMissing(nhomLoiCollection: INhomLoi[], ...nhomLoisToCheck: (INhomLoi | null | undefined)[]): INhomLoi[] {
    const nhomLois: INhomLoi[] = nhomLoisToCheck.filter(isPresent);
    if (nhomLois.length > 0) {
      const nhomLoiCollectionIdentifiers = nhomLoiCollection.map(nhomLoiItem => getNhomLoiIdentifier(nhomLoiItem)!);
      const nhomLoisToAdd = nhomLois.filter(nhomLoiItem => {
        const nhomLoiIdentifier = getNhomLoiIdentifier(nhomLoiItem);
        if (nhomLoiIdentifier == null || nhomLoiCollectionIdentifiers.includes(nhomLoiIdentifier)) {
          return false;
        }
        nhomLoiCollectionIdentifiers.push(nhomLoiIdentifier);
        return true;
      });
      return [...nhomLoisToAdd, ...nhomLoiCollection];
    }
    return nhomLoiCollection;
  }

  protected convertDateFromClient(nhomLoi: INhomLoi): INhomLoi {
    return Object.assign({}, nhomLoi, {
      ngayTao: nhomLoi.ngayTao?.isValid() ? nhomLoi.ngayTao.toJSON() : undefined,
      ngayCapNhat: nhomLoi.ngayCapNhat?.isValid() ? nhomLoi.ngayCapNhat.toJSON() : undefined,
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
      res.body.forEach((nhomLoi: INhomLoi) => {
        nhomLoi.ngayTao = nhomLoi.ngayTao ? dayjs(nhomLoi.ngayTao) : undefined;
        nhomLoi.ngayCapNhat = nhomLoi.ngayCapNhat ? dayjs(nhomLoi.ngayCapNhat) : undefined;
      });
    }
    return res;
  }
}
