package com.mycompany.myapp.domain;

import java.util.PrimitiveIterator;
import javax.persistence.EntityResult;
import javax.persistence.FieldResult;
import javax.persistence.SqlResultSetMapping;

public interface TongHopResponse {
    Long getSanPhamId();
    Long getDonBaoHanhId();
    String getTenSanPham();
    String getTenChungLoai();
    String getTenNhomSanPham();
    String getTenNganh();
    String getMaTiepNhan();
    String getNgayTiepNhan();
    String getNhanVienGiaoHang();
    String getSlTiepNhan();
    String getTenKhachHang();
    String getNhomKhachHang();
    String getTinhThanh();
    String getSoLuongTheoTinhTrang();
    String getTenTinhTrangPhanLoai();
    String getTheLoaiPhanTich();
    String getNamSanXuat();
}
