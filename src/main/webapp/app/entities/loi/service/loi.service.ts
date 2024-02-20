import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILoi, getLoiIdentifier } from '../loi.model';

export type EntityResponseType = HttpResponse<ILoi>;
export type EntityArrayResponseType = HttpResponse<ILoi[]>;

@Injectable({ providedIn: 'root' })
export class LoiService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lois');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(loi: ILoi): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loi);
    return this.http
      .post<ILoi>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(loi: ILoi): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loi);
    return this.http
      .put<ILoi>(`${this.resourceUrl}/${getLoiIdentifier(loi) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(loi: ILoi): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loi);
    return this.http
      .patch<ILoi>(`${this.resourceUrl}/${getLoiIdentifier(loi) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILoi>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILoi[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLoiToCollectionIfMissing(loiCollection: ILoi[], ...loisToCheck: (ILoi | null | undefined)[]): ILoi[] {
    const lois: ILoi[] = loisToCheck.filter(isPresent);
    if (lois.length > 0) {
      const loiCollectionIdentifiers = loiCollection.map(loiItem => getLoiIdentifier(loiItem)!);
      const loisToAdd = lois.filter(loiItem => {
        const loiIdentifier = getLoiIdentifier(loiItem);
        if (loiIdentifier == null || loiCollectionIdentifiers.includes(loiIdentifier)) {
          return false;
        }
        loiCollectionIdentifiers.push(loiIdentifier);
        return true;
      });
      return [...loisToAdd, ...loiCollection];
    }
    return loiCollection;
  }

  protected convertDateFromClient(loi: ILoi): ILoi {
    return Object.assign({}, loi, {
      ngayTao: loi.ngayTao?.isValid() ? loi.ngayTao.toJSON() : undefined,
      ngayCapNhat: loi.ngayCapNhat?.isValid() ? loi.ngayCapNhat.toJSON() : undefined,
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
      res.body.forEach((loi: ILoi) => {
        loi.ngayTao = loi.ngayTao ? dayjs(loi.ngayTao) : undefined;
        loi.ngayCapNhat = loi.ngayCapNhat ? dayjs(loi.ngayCapNhat) : undefined;
      });
    }
    return res;
  }
}
