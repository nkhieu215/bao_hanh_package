package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * The Employee entity.
 */
@Schema(description = "The Employee entity.")
@Entity
@Table(name = "don_bao_hanh")
public class DonBaoHanh implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ma_tiep_nhan")
    private String maTiepNhan;

    @Column(name = "ngay_tiep_nhan")
    private String ngayTiepNhan;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "nhan_vien_giao_hang")
    private String nhanVienGiaoHang;

    @Column(name = "ngaykhkb")
    private ZonedDateTime ngaykhkb;

    @Column(name = "nguoi_tao_don")
    private String nguoiTaoDon;

    @Column(name = "sl_tiep_nhan")
    private Integer slTiepNhan;

    @Column(name = "sl_da_phan_tich")
    private Integer slDaPhanTich;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @Column(name = "ngay_tra_bien_ban")
    private ZonedDateTime ngayTraBienBan;

    @OneToMany(mappedBy = "donBaoHanh")
    @JsonIgnoreProperties(value = { "sanPham", "donBaoHanh", "phanLoaiChiTietTiepNhans" }, allowSetters = true)
    private Set<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhans = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "donBaoHanhs", "nhomKhachHang", "tinhThanh" }, allowSetters = true)
    private KhachHang khachHang;

    @Column(name = "trang_thai_in")
    private String trangThaiIn;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DonBaoHanh id(Long id) {
        this.setId(id);
        return this;
    }

    public String getMaTiepNhan() {
        return maTiepNhan;
    }

    public void setMaTiepNhan(String maTiepNhan) {
        this.maTiepNhan = maTiepNhan;
    }

    public String getTrangThaiIn() {
        return trangThaiIn;
    }

    public void setTrangThaiIn(String trangThaiIn) {
        this.trangThaiIn = trangThaiIn;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNgayTiepNhan() {
        return this.ngayTiepNhan;
    }

    public DonBaoHanh ngayTiepNhan(String ngayTiepNhan) {
        this.setNgayTiepNhan(ngayTiepNhan);
        return this;
    }

    public void setNgayTiepNhan(String ngayTiepNhan) {
        this.ngayTiepNhan = ngayTiepNhan;
    }

    public String getTrangThai() {
        return this.trangThai;
    }

    public DonBaoHanh trangThai(String trangThai) {
        this.setTrangThai(trangThai);
        return this;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public String getNhanVienGiaoHang() {
        return this.nhanVienGiaoHang;
    }

    public DonBaoHanh nhanVienGiaoHang(String nhanVienGiaoHang) {
        this.setNhanVienGiaoHang(nhanVienGiaoHang);
        return this;
    }

    public void setNhanVienGiaoHang(String nhanVienGiaoHang) {
        this.nhanVienGiaoHang = nhanVienGiaoHang;
    }

    public ZonedDateTime getNgaykhkb() {
        return this.ngaykhkb;
    }

    public DonBaoHanh ngaykhkb(ZonedDateTime ngaykhkb) {
        this.setNgaykhkb(ngaykhkb);
        return this;
    }

    public void setNgaykhkb(ZonedDateTime ngaykhkb) {
        this.ngaykhkb = ngaykhkb;
    }

    public String getNguoiTaoDon() {
        return this.nguoiTaoDon;
    }

    public DonBaoHanh nguoiTaoDon(String nguoiTaoDon) {
        this.setNguoiTaoDon(nguoiTaoDon);
        return this;
    }

    public void setNguoiTaoDon(String nguoiTaoDon) {
        this.nguoiTaoDon = nguoiTaoDon;
    }

    public Integer getSlTiepNhan() {
        return this.slTiepNhan;
    }

    public DonBaoHanh slTiepNhan(Integer slTiepNhan) {
        this.setSlTiepNhan(slTiepNhan);
        return this;
    }

    public void setSlTiepNhan(Integer slTiepNhan) {
        this.slTiepNhan = slTiepNhan;
    }

    public Integer getSlDaPhanTich() {
        return this.slDaPhanTich;
    }

    public DonBaoHanh slDaPhanTich(Integer slDaPhanTich) {
        this.setSlDaPhanTich(slDaPhanTich);
        return this;
    }

    public void setSlDaPhanTich(Integer slDaPhanTich) {
        this.slDaPhanTich = slDaPhanTich;
    }

    public String getGhiChu() {
        return this.ghiChu;
    }

    public DonBaoHanh ghiChu(String ghiChu) {
        this.setGhiChu(ghiChu);
        return this;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public ZonedDateTime getNgayTraBienBan() {
        return this.ngayTraBienBan;
    }

    public DonBaoHanh ngayTraBienBan(ZonedDateTime ngayTraBienBan) {
        this.setNgayTraBienBan(ngayTraBienBan);
        return this;
    }

    public void setNgayTraBienBan(ZonedDateTime ngayTraBienBan) {
        this.ngayTraBienBan = ngayTraBienBan;
    }

    public Set<ChiTietSanPhamTiepNhan> getChiTietSanPhamTiepNhans() {
        return this.chiTietSanPhamTiepNhans;
    }

    public void setChiTietSanPhamTiepNhans(Set<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhans) {
        if (this.chiTietSanPhamTiepNhans != null) {
            this.chiTietSanPhamTiepNhans.forEach(i -> i.setDonBaoHanh(null));
        }
        if (chiTietSanPhamTiepNhans != null) {
            chiTietSanPhamTiepNhans.forEach(i -> i.setDonBaoHanh(this));
        }
        this.chiTietSanPhamTiepNhans = chiTietSanPhamTiepNhans;
    }

    public DonBaoHanh chiTietSanPhamTiepNhans(Set<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhans) {
        this.setChiTietSanPhamTiepNhans(chiTietSanPhamTiepNhans);
        return this;
    }

    public DonBaoHanh addChiTietSanPhamTiepNhan(ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan) {
        this.chiTietSanPhamTiepNhans.add(chiTietSanPhamTiepNhan);
        chiTietSanPhamTiepNhan.setDonBaoHanh(this);
        return this;
    }

    public DonBaoHanh removeChiTietSanPhamTiepNhan(ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan) {
        this.chiTietSanPhamTiepNhans.remove(chiTietSanPhamTiepNhan);
        chiTietSanPhamTiepNhan.setDonBaoHanh(null);
        return this;
    }

    public KhachHang getKhachHang() {
        return this.khachHang;
    }

    public void setKhachHang(KhachHang khachHang) {
        this.khachHang = khachHang;
    }

    public DonBaoHanh khachHang(KhachHang khachHang) {
        this.setKhachHang(khachHang);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DonBaoHanh)) {
            return false;
        }
        return id != null && id.equals(((DonBaoHanh) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }
}
