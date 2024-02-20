package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;

/**
 * A PhanTichLoi.
 */
@Entity
@Table(name = "phan_tich_loi")
public class PhanTichLoi implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "ngay_phan_tich")
    private ZonedDateTime ngayPhanTich;

    @Column(name = "username")
    private String username;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @ManyToOne
    @JsonIgnoreProperties(value = { "phanTichLois", "nhomLoi" }, allowSetters = true)
    private Loi loi;

    @ManyToOne
    @JsonIgnoreProperties(value = { "phanTichLois", "phanLoaiChiTietTiepNhan" }, allowSetters = true)
    private PhanTichSanPham phanTichSanPham;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PhanTichLoi id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSoLuong() {
        return this.soLuong;
    }

    public PhanTichLoi soLuong(Integer soLuong) {
        this.setSoLuong(soLuong);
        return this;
    }

    public void setSoLuong(Integer soLuong) {
        this.soLuong = soLuong;
    }

    public ZonedDateTime getNgayPhanTich() {
        return this.ngayPhanTich;
    }

    public PhanTichLoi ngayPhanTich(ZonedDateTime ngayPhanTich) {
        this.setNgayPhanTich(ngayPhanTich);
        return this;
    }

    public void setNgayPhanTich(ZonedDateTime ngayPhanTich) {
        this.ngayPhanTich = ngayPhanTich;
    }

    public String getUsername() {
        return this.username;
    }

    public PhanTichLoi username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getGhiChu() {
        return this.ghiChu;
    }

    public PhanTichLoi ghiChu(String ghiChu) {
        this.setGhiChu(ghiChu);
        return this;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public Loi getLoi() {
        return this.loi;
    }

    public void setLoi(Loi loi) {
        this.loi = loi;
    }

    public PhanTichLoi loi(Loi loi) {
        this.setLoi(loi);
        return this;
    }

    public PhanTichSanPham getPhanTichSanPham() {
        return this.phanTichSanPham;
    }

    public void setPhanTichSanPham(PhanTichSanPham phanTichSanPham) {
        this.phanTichSanPham = phanTichSanPham;
    }

    public PhanTichLoi phanTichSanPham(PhanTichSanPham phanTichSanPham) {
        this.setPhanTichSanPham(phanTichSanPham);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PhanTichLoi)) {
            return false;
        }
        return id != null && id.equals(((PhanTichLoi) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PhanTichLoi{" +
            "id=" + getId() +
            ", soLuong=" + getSoLuong() +
            ", ngayPhanTich='" + getNgayPhanTich() + "'" +
            ", username='" + getUsername() + "'" +
            ", ghiChu='" + getGhiChu() + "'" +
            "}";
    }
}
