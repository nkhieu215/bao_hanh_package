import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhanLoaiChiTietTiepNhan, getPhanLoaiChiTietTiepNhanIdentifier } from '../phan-loai-chi-tiet-tiep-nhan.model';

export type EntityResponseType = HttpResponse<IPhanLoaiChiTietTiepNhan>;
export type EntityArrayResponseType = HttpResponse<IPhanLoaiChiTietTiepNhan[]>;

@Injectable({ providedIn: 'root' })
export class PhanLoaiChiTietTiepNhanService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/phan-loai-chi-tiet-tiep-nhans');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan): Observable<EntityResponseType> {
    return this.http.post<IPhanLoaiChiTietTiepNhan>(this.resourceUrl, phanLoaiChiTietTiepNhan, { observe: 'response' });
  }

  update(phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan): Observable<EntityResponseType> {
    return this.http.put<IPhanLoaiChiTietTiepNhan>(
      `${this.resourceUrl}/${getPhanLoaiChiTietTiepNhanIdentifier(phanLoaiChiTietTiepNhan) as number}`,
      phanLoaiChiTietTiepNhan,
      { observe: 'response' }
    );
  }

  partialUpdate(phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan): Observable<EntityResponseType> {
    return this.http.patch<IPhanLoaiChiTietTiepNhan>(
      `${this.resourceUrl}/${getPhanLoaiChiTietTiepNhanIdentifier(phanLoaiChiTietTiepNhan) as number}`,
      phanLoaiChiTietTiepNhan,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPhanLoaiChiTietTiepNhan>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPhanLoaiChiTietTiepNhan[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPhanLoaiChiTietTiepNhanToCollectionIfMissing(
    phanLoaiChiTietTiepNhanCollection: IPhanLoaiChiTietTiepNhan[],
    ...phanLoaiChiTietTiepNhansToCheck: (IPhanLoaiChiTietTiepNhan | null | undefined)[]
  ): IPhanLoaiChiTietTiepNhan[] {
    const phanLoaiChiTietTiepNhans: IPhanLoaiChiTietTiepNhan[] = phanLoaiChiTietTiepNhansToCheck.filter(isPresent);
    if (phanLoaiChiTietTiepNhans.length > 0) {
      const phanLoaiChiTietTiepNhanCollectionIdentifiers = phanLoaiChiTietTiepNhanCollection.map(
        phanLoaiChiTietTiepNhanItem => getPhanLoaiChiTietTiepNhanIdentifier(phanLoaiChiTietTiepNhanItem)!
      );
      const phanLoaiChiTietTiepNhansToAdd = phanLoaiChiTietTiepNhans.filter(phanLoaiChiTietTiepNhanItem => {
        const phanLoaiChiTietTiepNhanIdentifier = getPhanLoaiChiTietTiepNhanIdentifier(phanLoaiChiTietTiepNhanItem);
        if (
          phanLoaiChiTietTiepNhanIdentifier == null ||
          phanLoaiChiTietTiepNhanCollectionIdentifiers.includes(phanLoaiChiTietTiepNhanIdentifier)
        ) {
          return false;
        }
        phanLoaiChiTietTiepNhanCollectionIdentifiers.push(phanLoaiChiTietTiepNhanIdentifier);
        return true;
      });
      return [...phanLoaiChiTietTiepNhansToAdd, ...phanLoaiChiTietTiepNhanCollection];
    }
    return phanLoaiChiTietTiepNhanCollection;
  }
}
