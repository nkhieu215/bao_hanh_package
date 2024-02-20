import dayjs from 'dayjs/esm';
import { ILoi } from 'app/entities/loi/loi.model';

export interface INhomLoi {
  id?: number;
  maNhomLoi?: string | null;
  tenNhomLoi?: string | null;
  ngayTao?: dayjs.Dayjs | null;
  ngayCapNhat?: dayjs.Dayjs | null;
  username?: string | null;
  ghiChu?: string | null;
  trangThai?: string | null;
  lois?: ILoi[] | null;
}

export class NhomLoi implements INhomLoi {
  constructor(
    public id?: number,
    public maNhomLoi?: string | null,
    public tenNhomLoi?: string | null,
    public ngayTao?: dayjs.Dayjs | null,
    public ngayCapNhat?: dayjs.Dayjs | null,
    public username?: string | null,
    public ghiChu?: string | null,
    public trangThai?: string | null,
    public lois?: ILoi[] | null
  ) {}
}

export function getNhomLoiIdentifier(nhomLoi: INhomLoi): number | undefined {
  return nhomLoi.id;
}
