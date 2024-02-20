import { IDonBaoHanh } from 'app/entities/don-bao-hanh/don-bao-hanh.model';
import { INhomKhachHang } from 'app/entities/nhom-khach-hang/nhom-khach-hang.model';
import { ITinhThanh } from 'app/entities/tinh-thanh/tinh-thanh.model';

export interface IKhachHang {
  id?: number;
  maKhachHang?: string | null;
  tenKhachHang?: string | null;
  soDienThoai?: string | null;
  diaChi?: string | null;
  donBaoHanhs?: IDonBaoHanh[] | null;
  nhomKhachHang?: INhomKhachHang | null;
  tinhThanh?: ITinhThanh | null;
}

export class KhachHang implements IKhachHang {
  constructor(
    public id?: number,
    public maKhachHang?: string | null,
    public tenKhachHang?: string | null,
    public soDienThoai?: string | null,
    public diaChi?: string | null,
    public donBaoHanhs?: IDonBaoHanh[] | null,
    public nhomKhachHang?: INhomKhachHang | null,
    public tinhThanh?: ITinhThanh | null
  ) {}
}

export function getKhachHangIdentifier(khachHang: IKhachHang): number | undefined {
  return khachHang.id;
}
