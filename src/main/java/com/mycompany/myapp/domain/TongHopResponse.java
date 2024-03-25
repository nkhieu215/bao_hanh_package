package com.mycompany.myapp.domain;

import java.util.PrimitiveIterator;
import javax.persistence.EntityResult;
import javax.persistence.FieldResult;
import javax.persistence.SqlResultSetMapping;

public interface TongHopResponse {
    Long getChiTietId();
    Long getSanPhamId();
    Long getDonBaoHanhId();
    String getTenSanPham();
    String getTenChungLoai();
    String getTenNhomSanPham();
    String getTenNganh();
    String getMaTiepNhan();
    String getNgayTiepNhan();
    String getNhanVienGiaoHang();
    Long getSlTiepNhan();
    String getTenKhachHang();
    String getNhomKhachHang();
    String getTinhThanh();
    Long getSoLuongTheoTinhTrang();
    String getTenTinhTrangPhanLoai();
    String getTheLoaiPhanTich();
    String getNamSanXuat();
    Long getSoLuongKhachGiao();
    String getTenNhanVienPhanTich();
    String getLotNumber();
    String getSerial();
    String getNgayPhanTich();
    Long getSoLuongTheoTungLoi();
    String getTenLoi();
    String getTenNhomLoi();
}
