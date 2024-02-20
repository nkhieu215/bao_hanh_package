package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * not an ignored comment
 */
@Schema(description = "not an ignored comment")
@Entity
@Table(name = "san_pham")
public class SanPham implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "sap_code")
    private String sapCode;

    @Column(name = "rd_code")
    private String rdCode;

    @Column(name = "ten_chung_loai")
    private String tenChungLoai;

    @Column(name = "don_vi")
    private String donVi;

    @Column(name = "to_san_xuat")
    private String toSanXuat;

    @Column(name = "phan_loai")
    private String phanLoai;

    @OneToMany(mappedBy = "sanPham")
    @JsonIgnoreProperties(value = { "sanPham", "donBaoHanh", "phanLoaiChiTietTiepNhans" }, allowSetters = true)
    private Set<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhans = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "sanPhams", "chungLoai" }, allowSetters = true)
    private NhomSanPham nhomSanPham;

    @ManyToOne
    @JsonIgnoreProperties(value = { "sanPhams" }, allowSetters = true)
    private Kho kho;

    @ManyToOne
    @JsonIgnoreProperties(value = { "sanPhams" }, allowSetters = true)
    private Nganh nganh;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SanPham id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public SanPham name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSapCode() {
        return this.sapCode;
    }

    public SanPham sapCode(String sapCode) {
        this.setSapCode(sapCode);
        return this;
    }

    public void setSapCode(String sapCode) {
        this.sapCode = sapCode;
    }

    public String getRdCode() {
        return this.rdCode;
    }

    public SanPham rdCode(String rdCode) {
        this.setRdCode(rdCode);
        return this;
    }

    public void setRdCode(String rdCode) {
        this.rdCode = rdCode;
    }

    public String getTenChungLoai() {
        return this.tenChungLoai;
    }

    public SanPham tenChungLoai(String tenChungLoai) {
        this.setTenChungLoai(tenChungLoai);
        return this;
    }

    public void setTenChungLoai(String tenChungLoai) {
        this.tenChungLoai = tenChungLoai;
    }

    public String getDonVi() {
        return this.donVi;
    }

    public SanPham donVi(String donVi) {
        this.setDonVi(donVi);
        return this;
    }

    public void setDonVi(String donVi) {
        this.donVi = donVi;
    }

    public String getToSanXuat() {
        return this.toSanXuat;
    }

    public SanPham toSanXuat(String toSanXuat) {
        this.setToSanXuat(toSanXuat);
        return this;
    }

    public void setToSanXuat(String toSanXuat) {
        this.toSanXuat = toSanXuat;
    }

    public String getPhanLoai() {
        return this.phanLoai;
    }

    public SanPham phanLoai(String phanLoai) {
        this.setPhanLoai(phanLoai);
        return this;
    }

    public void setPhanLoai(String phanLoai) {
        this.phanLoai = phanLoai;
    }

    public Set<ChiTietSanPhamTiepNhan> getChiTietSanPhamTiepNhans() {
        return this.chiTietSanPhamTiepNhans;
    }

    public void setChiTietSanPhamTiepNhans(Set<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhans) {
        if (this.chiTietSanPhamTiepNhans != null) {
            this.chiTietSanPhamTiepNhans.forEach(i -> i.setSanPham(null));
        }
        if (chiTietSanPhamTiepNhans != null) {
            chiTietSanPhamTiepNhans.forEach(i -> i.setSanPham(this));
        }
        this.chiTietSanPhamTiepNhans = chiTietSanPhamTiepNhans;
    }

    public SanPham chiTietSanPhamTiepNhans(Set<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhans) {
        this.setChiTietSanPhamTiepNhans(chiTietSanPhamTiepNhans);
        return this;
    }

    public SanPham addChiTietSanPhamTiepNhan(ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan) {
        this.chiTietSanPhamTiepNhans.add(chiTietSanPhamTiepNhan);
        chiTietSanPhamTiepNhan.setSanPham(this);
        return this;
    }

    public SanPham removeChiTietSanPhamTiepNhan(ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan) {
        this.chiTietSanPhamTiepNhans.remove(chiTietSanPhamTiepNhan);
        chiTietSanPhamTiepNhan.setSanPham(null);
        return this;
    }

    public NhomSanPham getNhomSanPham() {
        return this.nhomSanPham;
    }

    public void setNhomSanPham(NhomSanPham nhomSanPham) {
        this.nhomSanPham = nhomSanPham;
    }

    public SanPham nhomSanPham(NhomSanPham nhomSanPham) {
        this.setNhomSanPham(nhomSanPham);
        return this;
    }

    public Kho getKho() {
        return this.kho;
    }

    public void setKho(Kho kho) {
        this.kho = kho;
    }

    public SanPham kho(Kho kho) {
        this.setKho(kho);
        return this;
    }

    public Nganh getNganh() {
        return this.nganh;
    }

    public void setNganh(Nganh nganh) {
        this.nganh = nganh;
    }

    public SanPham nganh(Nganh nganh) {
        this.setNganh(nganh);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SanPham)) {
            return false;
        }
        return id != null && id.equals(((SanPham) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "SanPham{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", sapCode='" + sapCode + '\'' +
            ", rdCode='" + rdCode + '\'' +
            ", tenChungLoai='" + tenChungLoai + '\'' +
            ", donVi='" + donVi + '\'' +
            ", toSanXuat='" + toSanXuat + '\'' +
            ", phanLoai='" + phanLoai + '\'' +
            ", chiTietSanPhamTiepNhans=" + chiTietSanPhamTiepNhans +
            ", nhomSanPham=" + nhomSanPham +
            ", kho=" + kho +
            ", nganh=" + nganh +
            '}';
    }
}
