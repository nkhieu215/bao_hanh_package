import dayjs from 'dayjs/esm';
import { IPhanTichLoi } from 'app/entities/phan-tich-loi/phan-tich-loi.model';
import { INhomLoi } from 'app/entities/nhom-loi/nhom-loi.model';

export interface ILoi {
  id?: number;
  errCode?: string | null;
  tenLoi?: string | null;
  ngayTao?: dayjs.Dayjs | null;
  ngayCapNhat?: dayjs.Dayjs | null;
  username?: string | null;
  chiChu?: string | null;
  trangThai?: string | null;
  phanTichLois?: IPhanTichLoi[] | null;
  nhomLoi?: INhomLoi | null;
}

export class Loi implements ILoi {
  constructor(
    public id?: number,
    public errCode?: string | null,
    public tenLoi?: string | null,
    public ngayTao?: dayjs.Dayjs | null,
    public ngayCapNhat?: dayjs.Dayjs | null,
    public username?: string | null,
    public chiChu?: string | null,
    public trangThai?: string | null,
    public phanTichLois?: IPhanTichLoi[] | null,
    public nhomLoi?: INhomLoi | null
  ) {}
}

export function getLoiIdentifier(loi: ILoi): number | undefined {
  return loi.id;
}
