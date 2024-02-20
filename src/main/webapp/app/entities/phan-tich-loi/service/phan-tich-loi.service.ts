import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhanTichLoi, getPhanTichLoiIdentifier } from '../phan-tich-loi.model';

export type EntityResponseType = HttpResponse<IPhanTichLoi>;
export type EntityArrayResponseType = HttpResponse<IPhanTichLoi[]>;

@Injectable({ providedIn: 'root' })
export class PhanTichLoiService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/phan-tich-lois');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(phanTichLoi: IPhanTichLoi): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(phanTichLoi);
    return this.http
      .post<IPhanTichLoi>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(phanTichLoi: IPhanTichLoi): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(phanTichLoi);
    return this.http
      .put<IPhanTichLoi>(`${this.resourceUrl}/${getPhanTichLoiIdentifier(phanTichLoi) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(phanTichLoi: IPhanTichLoi): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(phanTichLoi);
    return this.http
      .patch<IPhanTichLoi>(`${this.resourceUrl}/${getPhanTichLoiIdentifier(phanTichLoi) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPhanTichLoi>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPhanTichLoi[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPhanTichLoiToCollectionIfMissing(
    phanTichLoiCollection: IPhanTichLoi[],
    ...phanTichLoisToCheck: (IPhanTichLoi | null | undefined)[]
  ): IPhanTichLoi[] {
    const phanTichLois: IPhanTichLoi[] = phanTichLoisToCheck.filter(isPresent);
    if (phanTichLois.length > 0) {
      const phanTichLoiCollectionIdentifiers = phanTichLoiCollection.map(phanTichLoiItem => getPhanTichLoiIdentifier(phanTichLoiItem)!);
      const phanTichLoisToAdd = phanTichLois.filter(phanTichLoiItem => {
        const phanTichLoiIdentifier = getPhanTichLoiIdentifier(phanTichLoiItem);
        if (phanTichLoiIdentifier == null || phanTichLoiCollectionIdentifiers.includes(phanTichLoiIdentifier)) {
          return false;
        }
        phanTichLoiCollectionIdentifiers.push(phanTichLoiIdentifier);
        return true;
      });
      return [...phanTichLoisToAdd, ...phanTichLoiCollection];
    }
    return phanTichLoiCollection;
  }

  protected convertDateFromClient(phanTichLoi: IPhanTichLoi): IPhanTichLoi {
    return Object.assign({}, phanTichLoi, {
      ngayPhanTich: phanTichLoi.ngayPhanTich?.isValid() ? phanTichLoi.ngayPhanTich.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.ngayPhanTich = res.body.ngayPhanTich ? dayjs(res.body.ngayPhanTich) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((phanTichLoi: IPhanTichLoi) => {
        phanTichLoi.ngayPhanTich = phanTichLoi.ngayPhanTich ? dayjs(phanTichLoi.ngayPhanTich) : undefined;
      });
    }
    return res;
  }
}
