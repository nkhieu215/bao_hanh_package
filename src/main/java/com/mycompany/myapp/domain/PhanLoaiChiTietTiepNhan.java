package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A PhanLoaiChiTietTiepNhan.
 */
@Entity
@Table(name = "phan_loai_chi_tiet_tiep_nhan")
public class PhanLoaiChiTietTiepNhan implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "so_luong")
    private Integer soLuong;

    @OneToMany(mappedBy = "phanLoaiChiTietTiepNhan")
    @JsonIgnoreProperties(value = { "phanTichLois", "phanLoaiChiTietTiepNhan" }, allowSetters = true)
    private Set<PhanTichSanPham> phanTichSanPhams = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "sanPham", "donBaoHanh", "phanLoaiChiTietTiepNhans" }, allowSetters = true)
    private ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan;

    @ManyToOne
    @JsonIgnoreProperties(value = { "phanLoaiChiTietTiepNhans" }, allowSetters = true)
    private DanhSachTinhTrang danhSachTinhTrang;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PhanLoaiChiTietTiepNhan id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSoLuong() {
        return this.soLuong;
    }

    public PhanLoaiChiTietTiepNhan soLuong(Integer soLuong) {
        this.setSoLuong(soLuong);
        return this;
    }

    public void setSoLuong(Integer soLuong) {
        this.soLuong = soLuong;
    }

    public Set<PhanTichSanPham> getPhanTichSanPhams() {
        return this.phanTichSanPhams;
    }

    public void setPhanTichSanPhams(Set<PhanTichSanPham> phanTichSanPhams) {
        if (this.phanTichSanPhams != null) {
            this.phanTichSanPhams.forEach(i -> i.setPhanLoaiChiTietTiepNhan(null));
        }
        if (phanTichSanPhams != null) {
            phanTichSanPhams.forEach(i -> i.setPhanLoaiChiTietTiepNhan(this));
        }
        this.phanTichSanPhams = phanTichSanPhams;
    }

    public PhanLoaiChiTietTiepNhan phanTichSanPhams(Set<PhanTichSanPham> phanTichSanPhams) {
        this.setPhanTichSanPhams(phanTichSanPhams);
        return this;
    }

    public PhanLoaiChiTietTiepNhan addPhanTichSanPham(PhanTichSanPham phanTichSanPham) {
        this.phanTichSanPhams.add(phanTichSanPham);
        phanTichSanPham.setPhanLoaiChiTietTiepNhan(this);
        return this;
    }

    public PhanLoaiChiTietTiepNhan removePhanTichSanPham(PhanTichSanPham phanTichSanPham) {
        this.phanTichSanPhams.remove(phanTichSanPham);
        phanTichSanPham.setPhanLoaiChiTietTiepNhan(null);
        return this;
    }

    public ChiTietSanPhamTiepNhan getChiTietSanPhamTiepNhan() {
        return this.chiTietSanPhamTiepNhan;
    }

    public void setChiTietSanPhamTiepNhan(ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan) {
        this.chiTietSanPhamTiepNhan = chiTietSanPhamTiepNhan;
    }

    public PhanLoaiChiTietTiepNhan chiTietSanPhamTiepNhan(ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan) {
        this.setChiTietSanPhamTiepNhan(chiTietSanPhamTiepNhan);
        return this;
    }

    public DanhSachTinhTrang getDanhSachTinhTrang() {
        return this.danhSachTinhTrang;
    }

    public void setDanhSachTinhTrang(DanhSachTinhTrang danhSachTinhTrang) {
        this.danhSachTinhTrang = danhSachTinhTrang;
    }

    public PhanLoaiChiTietTiepNhan danhSachTinhTrang(DanhSachTinhTrang danhSachTinhTrang) {
        this.setDanhSachTinhTrang(danhSachTinhTrang);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PhanLoaiChiTietTiepNhan)) {
            return false;
        }
        return id != null && id.equals(((PhanLoaiChiTietTiepNhan) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PhanLoaiChiTietTiepNhan{" +
            "id=" + getId() +
            ", soLuong=" + getSoLuong() +
            "}";
    }
}
