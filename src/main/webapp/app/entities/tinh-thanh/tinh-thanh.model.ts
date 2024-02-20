import { IKhachHang } from 'app/entities/khach-hang/khach-hang.model';

export interface ITinhThanh {
  id?: number;
  idTinhThanh?: number | null;
  name?: string | null;
  khachHangs?: IKhachHang[] | null;
}

export class TinhThanh implements ITinhThanh {
  constructor(
    public id?: number,
    public idTinhThanh?: number | null,
    public name?: string | null,
    public khachHangs?: IKhachHang[] | null
  ) {}
}

export function getTinhThanhIdentifier(tinhThanh: ITinhThanh): number | undefined {
  return tinhThanh.id;
}
