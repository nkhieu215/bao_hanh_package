import dayjs from 'dayjs/esm';
import { INhomSanPham } from 'app/entities/nhom-san-pham/nhom-san-pham.model';

export interface IChungLoai {
  id?: number;
  maChungLoai?: string | null;
  tenChungLoai?: string | null;
  ngayTao?: dayjs.Dayjs | null;
  username?: string | null;
  nhomSanPhams?: INhomSanPham[] | null;
}

export class ChungLoai implements IChungLoai {
  constructor(
    public id?: number,
    public maChungLoai?: string | null,
    public tenChungLoai?: string | null,
    public ngayTao?: dayjs.Dayjs | null,
    public username?: string | null,
    public nhomSanPhams?: INhomSanPham[] | null
  ) {}
}

export function getChungLoaiIdentifier(chungLoai: IChungLoai): number | undefined {
  return chungLoai.id;
}
