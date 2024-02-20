package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A DanhSachTinhTrang.
 */
@Entity
@Table(name = "danh_sach_tinh_trang")
public class DanhSachTinhTrang implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ten_tinh_trang_phan_loai")
    private String tenTinhTrangPhanLoai;

    @Column(name = "ngay_tao")
    private ZonedDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    private ZonedDateTime ngayCapNhat;

    @Column(name = "username")
    private String username;

    @Column(name = "trang_thai")
    private String trangThai;

    @OneToMany(mappedBy = "danhSachTinhTrang")
    @JsonIgnoreProperties(value = { "phanTichSanPhams", "chiTietSanPhamTiepNhan", "danhSachTinhTrang" }, allowSetters = true)
    private Set<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhans = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DanhSachTinhTrang id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenTinhTrangPhanLoai() {
        return this.tenTinhTrangPhanLoai;
    }

    public DanhSachTinhTrang tenTinhTrangPhanLoai(String tenTinhTrangPhanLoai) {
        this.setTenTinhTrangPhanLoai(tenTinhTrangPhanLoai);
        return this;
    }

    public void setTenTinhTrangPhanLoai(String tenTinhTrangPhanLoai) {
        this.tenTinhTrangPhanLoai = tenTinhTrangPhanLoai;
    }

    public ZonedDateTime getNgayTao() {
        return this.ngayTao;
    }

    public DanhSachTinhTrang ngayTao(ZonedDateTime ngayTao) {
        this.setNgayTao(ngayTao);
        return this;
    }

    public void setNgayTao(ZonedDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public ZonedDateTime getNgayCapNhat() {
        return this.ngayCapNhat;
    }

    public DanhSachTinhTrang ngayCapNhat(ZonedDateTime ngayCapNhat) {
        this.setNgayCapNhat(ngayCapNhat);
        return this;
    }

    public void setNgayCapNhat(ZonedDateTime ngayCapNhat) {
        this.ngayCapNhat = ngayCapNhat;
    }

    public String getUsername() {
        return this.username;
    }

    public DanhSachTinhTrang username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTrangThai() {
        return this.trangThai;
    }

    public DanhSachTinhTrang trangThai(String trangThai) {
        this.setTrangThai(trangThai);
        return this;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public Set<PhanLoaiChiTietTiepNhan> getPhanLoaiChiTietTiepNhans() {
        return this.phanLoaiChiTietTiepNhans;
    }

    public void setPhanLoaiChiTietTiepNhans(Set<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhans) {
        if (this.phanLoaiChiTietTiepNhans != null) {
            this.phanLoaiChiTietTiepNhans.forEach(i -> i.setDanhSachTinhTrang(null));
        }
        if (phanLoaiChiTietTiepNhans != null) {
            phanLoaiChiTietTiepNhans.forEach(i -> i.setDanhSachTinhTrang(this));
        }
        this.phanLoaiChiTietTiepNhans = phanLoaiChiTietTiepNhans;
    }

    public DanhSachTinhTrang phanLoaiChiTietTiepNhans(Set<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhans) {
        this.setPhanLoaiChiTietTiepNhans(phanLoaiChiTietTiepNhans);
        return this;
    }

    public DanhSachTinhTrang addPhanLoaiChiTietTiepNhan(PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan) {
        this.phanLoaiChiTietTiepNhans.add(phanLoaiChiTietTiepNhan);
        phanLoaiChiTietTiepNhan.setDanhSachTinhTrang(this);
        return this;
    }

    public DanhSachTinhTrang removePhanLoaiChiTietTiepNhan(PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan) {
        this.phanLoaiChiTietTiepNhans.remove(phanLoaiChiTietTiepNhan);
        phanLoaiChiTietTiepNhan.setDanhSachTinhTrang(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DanhSachTinhTrang)) {
            return false;
        }
        return id != null && id.equals(((DanhSachTinhTrang) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DanhSachTinhTrang{" +
            "id=" + getId() +
            ", tenTinhTrangPhanLoai='" + getTenTinhTrangPhanLoai() + "'" +
            ", ngayTao='" + getNgayTao() + "'" +
            ", ngayCapNhat='" + getNgayCapNhat() + "'" +
            ", username='" + getUsername() + "'" +
            ", trangThai='" + getTrangThai() + "'" +
            "}";
    }
}
