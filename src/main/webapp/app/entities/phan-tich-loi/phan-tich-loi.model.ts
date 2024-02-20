import dayjs from 'dayjs/esm';
import { ILoi } from 'app/entities/loi/loi.model';
import { IPhanTichSanPham } from 'app/entities/phan-tich-san-pham/phan-tich-san-pham.model';

export interface IPhanTichLoi {
  id?: number;
  soLuong?: number | null;
  ngayPhanTich?: dayjs.Dayjs | null;
  username?: string | null;
  ghiChu?: string | null;
  loi?: ILoi | null;
  phanTichSanPham?: IPhanTichSanPham | null;
}

export class PhanTichLoi implements IPhanTichLoi {
  constructor(
    public id?: number,
    public soLuong?: number | null,
    public ngayPhanTich?: dayjs.Dayjs | null,
    public username?: string | null,
    public ghiChu?: string | null,
    public loi?: ILoi | null,
    public phanTichSanPham?: IPhanTichSanPham | null
  ) {}
}

export function getPhanTichLoiIdentifier(phanTichLoi: IPhanTichLoi): number | undefined {
  return phanTichLoi.id;
}
