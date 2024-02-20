import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDonBaoHanh, getDonBaoHanhIdentifier } from '../don-bao-hanh.model';

export type EntityResponseType = HttpResponse<IDonBaoHanh>;
export type EntityArrayResponseType = HttpResponse<IDonBaoHanh[]>;

@Injectable({ providedIn: 'root' })
export class DonBaoHanhService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/don-bao-hanhs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(donBaoHanh: IDonBaoHanh): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(donBaoHanh);
    return this.http
      .post<IDonBaoHanh>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(donBaoHanh: IDonBaoHanh): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(donBaoHanh);
    return this.http
      .put<IDonBaoHanh>(`${this.resourceUrl}/${getDonBaoHanhIdentifier(donBaoHanh) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(donBaoHanh: IDonBaoHanh): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(donBaoHanh);
    return this.http
      .patch<IDonBaoHanh>(`${this.resourceUrl}/${getDonBaoHanhIdentifier(donBaoHanh) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDonBaoHanh>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDonBaoHanh[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDonBaoHanhToCollectionIfMissing(
    donBaoHanhCollection: IDonBaoHanh[],
    ...donBaoHanhsToCheck: (IDonBaoHanh | null | undefined)[]
  ): IDonBaoHanh[] {
    const donBaoHanhs: IDonBaoHanh[] = donBaoHanhsToCheck.filter(isPresent);
    if (donBaoHanhs.length > 0) {
      const donBaoHanhCollectionIdentifiers = donBaoHanhCollection.map(donBaoHanhItem => getDonBaoHanhIdentifier(donBaoHanhItem)!);
      const donBaoHanhsToAdd = donBaoHanhs.filter(donBaoHanhItem => {
        const donBaoHanhIdentifier = getDonBaoHanhIdentifier(donBaoHanhItem);
        if (donBaoHanhIdentifier == null || donBaoHanhCollectionIdentifiers.includes(donBaoHanhIdentifier)) {
          return false;
        }
        donBaoHanhCollectionIdentifiers.push(donBaoHanhIdentifier);
        return true;
      });
      return [...donBaoHanhsToAdd, ...donBaoHanhCollection];
    }
    return donBaoHanhCollection;
  }

  protected convertDateFromClient(donBaoHanh: IDonBaoHanh): IDonBaoHanh {
    return Object.assign({}, donBaoHanh, {
      ngaykhkb: donBaoHanh.ngaykhkb ? donBaoHanh.ngaykhkb.toJSON() : undefined,
      ngayTraBienBan: donBaoHanh.ngayTraBienBan ? donBaoHanh.ngayTraBienBan.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    // if (res.body) {
    //   res.body.ngaykhkb = res.body.ngaykhkb;
    //   res.body.ngayTraBienBan = res.body.ngayTraBienBan;
    // }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    // if (res.body) {
    //   res.body.forEach((donBaoHanh: IDonBaoHanh) => {
    //     donBaoHanh.ngaykhkb = donBaoHanh.ngaykhkb;
    //     donBaoHanh.ngayTraBienBan = donBaoHanh.ngayTraBienBan;
    //   });
    // }
    return res;
  }
}
