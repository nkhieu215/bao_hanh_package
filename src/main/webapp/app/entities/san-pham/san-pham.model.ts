import { IChiTietSanPhamTiepNhan } from 'app/entities/chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.model';
import { INhomSanPham } from 'app/entities/nhom-san-pham/nhom-san-pham.model';
import { IKho } from 'app/entities/kho/kho.model';
import { INganh } from 'app/entities/nganh/nganh.model';

export interface ISanPham {
  id?: number;
  name: string | null;
  sapCode?: string | null;
  rdCode?: string | null;
  tenChungLoai?: string | null;
  donVi?: string | null;
  toSanXuat?: string | null;
  phanLoai?: string | null;
  chiTietSanPhamTiepNhans?: IChiTietSanPhamTiepNhan[] | null;
  nhomSanPham?: INhomSanPham | null;
  kho?: IKho | null;
  nganh?: INganh | null;
}

export class SanPham implements ISanPham {
  constructor(
    public id?: number,
    public name: string | null = '',
    public sapCode?: string | null,
    public rdCode?: string | null,
    public tenChungLoai?: string | null,
    public donVi?: string | null,
    public toSanXuat?: string | null,
    public phanLoai?: string | null,
    public chiTietSanPhamTiepNhans?: IChiTietSanPhamTiepNhan[] | null,
    public nhomSanPham?: INhomSanPham | null,
    public kho?: IKho | null,
    public nganh?: INganh | null
  ) {}
}

export function getSanPhamIdentifier(sanPham: ISanPham): number | undefined {
  return sanPham.id;
}
