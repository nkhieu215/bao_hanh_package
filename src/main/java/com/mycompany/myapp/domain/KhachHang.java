package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A KhachHang.
 */
@Entity
@Table(name = "khach_hang")
public class KhachHang implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ma_khach_hang")
    private String maKhachHang;

    @Column(name = "ten_khach_hang")
    private String tenKhachHang;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "dia_chi")
    private String diaChi;

    @OneToMany(mappedBy = "khachHang")
    @JsonIgnoreProperties(value = { "chiTietSanPhamTiepNhans", "khachHang" }, allowSetters = true)
    private Set<DonBaoHanh> donBaoHanhs = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "khachHangs" }, allowSetters = true)
    private NhomKhachHang nhomKhachHang;

    @ManyToOne
    @JsonIgnoreProperties(value = { "khachHangs" }, allowSetters = true)
    private TinhThanh tinhThanh;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public KhachHang id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaKhachHang() {
        return this.maKhachHang;
    }

    public KhachHang maKhachHang(String maKhachHang) {
        this.setMaKhachHang(maKhachHang);
        return this;
    }

    public void setMaKhachHang(String maKhachHang) {
        this.maKhachHang = maKhachHang;
    }

    public String getTenKhachHang() {
        return this.tenKhachHang;
    }

    public KhachHang tenKhachHang(String tenKhachHang) {
        this.setTenKhachHang(tenKhachHang);
        return this;
    }

    public void setTenKhachHang(String tenKhachHang) {
        this.tenKhachHang = tenKhachHang;
    }

    public String getSoDienThoai() {
        return this.soDienThoai;
    }

    public KhachHang soDienThoai(String soDienThoai) {
        this.setSoDienThoai(soDienThoai);
        return this;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getDiaChi() {
        return this.diaChi;
    }

    public KhachHang diaChi(String diaChi) {
        this.setDiaChi(diaChi);
        return this;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public Set<DonBaoHanh> getDonBaoHanhs() {
        return this.donBaoHanhs;
    }

    public void setDonBaoHanhs(Set<DonBaoHanh> donBaoHanhs) {
        if (this.donBaoHanhs != null) {
            this.donBaoHanhs.forEach(i -> i.setKhachHang(null));
        }
        if (donBaoHanhs != null) {
            donBaoHanhs.forEach(i -> i.setKhachHang(this));
        }
        this.donBaoHanhs = donBaoHanhs;
    }

    public KhachHang donBaoHanhs(Set<DonBaoHanh> donBaoHanhs) {
        this.setDonBaoHanhs(donBaoHanhs);
        return this;
    }

    public KhachHang addDonBaoHanh(DonBaoHanh donBaoHanh) {
        this.donBaoHanhs.add(donBaoHanh);
        donBaoHanh.setKhachHang(this);
        return this;
    }

    public KhachHang removeDonBaoHanh(DonBaoHanh donBaoHanh) {
        this.donBaoHanhs.remove(donBaoHanh);
        donBaoHanh.setKhachHang(null);
        return this;
    }

    public NhomKhachHang getNhomKhachHang() {
        return this.nhomKhachHang;
    }

    public void setNhomKhachHang(NhomKhachHang nhomKhachHang) {
        this.nhomKhachHang = nhomKhachHang;
    }

    public KhachHang nhomKhachHang(NhomKhachHang nhomKhachHang) {
        this.setNhomKhachHang(nhomKhachHang);
        return this;
    }

    public TinhThanh getTinhThanh() {
        return this.tinhThanh;
    }

    public void setTinhThanh(TinhThanh tinhThanh) {
        this.tinhThanh = tinhThanh;
    }

    public KhachHang tinhThanh(TinhThanh tinhThanh) {
        this.setTinhThanh(tinhThanh);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KhachHang)) {
            return false;
        }
        return id != null && id.equals(((KhachHang) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KhachHang{" +
            "id=" + getId() +
            ", maKhachHang='" + getMaKhachHang() + "'" +
            ", tenKhachHang='" + getTenKhachHang() + "'" +
            ", soDienThoai='" + getSoDienThoai() + "'" +
            ", diaChi='" + getDiaChi() + "'" +
            "}";
    }
}
