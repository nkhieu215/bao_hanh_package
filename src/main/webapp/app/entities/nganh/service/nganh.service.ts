import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INganh, getNganhIdentifier } from '../nganh.model';

export type EntityResponseType = HttpResponse<INganh>;
export type EntityArrayResponseType = HttpResponse<INganh[]>;

@Injectable({ providedIn: 'root' })
export class NganhService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/nganhs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(nganh: INganh): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nganh);
    return this.http
      .post<INganh>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(nganh: INganh): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nganh);
    return this.http
      .put<INganh>(`${this.resourceUrl}/${getNganhIdentifier(nganh) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(nganh: INganh): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nganh);
    return this.http
      .patch<INganh>(`${this.resourceUrl}/${getNganhIdentifier(nganh) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INganh>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INganh[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNganhToCollectionIfMissing(nganhCollection: INganh[], ...nganhsToCheck: (INganh | null | undefined)[]): INganh[] {
    const nganhs: INganh[] = nganhsToCheck.filter(isPresent);
    if (nganhs.length > 0) {
      const nganhCollectionIdentifiers = nganhCollection.map(nganhItem => getNganhIdentifier(nganhItem)!);
      const nganhsToAdd = nganhs.filter(nganhItem => {
        const nganhIdentifier = getNganhIdentifier(nganhItem);
        if (nganhIdentifier == null || nganhCollectionIdentifiers.includes(nganhIdentifier)) {
          return false;
        }
        nganhCollectionIdentifiers.push(nganhIdentifier);
        return true;
      });
      return [...nganhsToAdd, ...nganhCollection];
    }
    return nganhCollection;
  }

  protected convertDateFromClient(nganh: INganh): INganh {
    return Object.assign({}, nganh, {
      ngayTao: nganh.ngayTao?.isValid() ? nganh.ngayTao.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.ngayTao = res.body.ngayTao ? dayjs(res.body.ngayTao) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((nganh: INganh) => {
        nganh.ngayTao = nganh.ngayTao ? dayjs(nganh.ngayTao) : undefined;
      });
    }
    return res;
  }
}
