package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A NhomLoi.
 */
@Entity
@Table(name = "nhom_loi")
public class NhomLoi implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ma_nhom_loi")
    private String maNhomLoi;

    @Column(name = "ten_nhom_loi")
    private String tenNhomLoi;

    @Column(name = "ngay_tao")
    private ZonedDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    private ZonedDateTime ngayCapNhat;

    @Column(name = "username")
    private String username;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @Column(name = "trang_thai")
    private String trangThai;

    @OneToMany(mappedBy = "nhomLoi")
    @JsonIgnoreProperties(value = { "phanTichLois", "nhomLoi" }, allowSetters = true)
    private Set<Loi> lois = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NhomLoi id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaNhomLoi() {
        return this.maNhomLoi;
    }

    public NhomLoi maNhomLoi(String maNhomLoi) {
        this.setMaNhomLoi(maNhomLoi);
        return this;
    }

    public void setMaNhomLoi(String maNhomLoi) {
        this.maNhomLoi = maNhomLoi;
    }

    public String getTenNhomLoi() {
        return this.tenNhomLoi;
    }

    public NhomLoi tenNhomLoi(String tenNhomLoi) {
        this.setTenNhomLoi(tenNhomLoi);
        return this;
    }

    public void setTenNhomLoi(String tenNhomLoi) {
        this.tenNhomLoi = tenNhomLoi;
    }

    public ZonedDateTime getNgayTao() {
        return this.ngayTao;
    }

    public NhomLoi ngayTao(ZonedDateTime ngayTao) {
        this.setNgayTao(ngayTao);
        return this;
    }

    public void setNgayTao(ZonedDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public ZonedDateTime getNgayCapNhat() {
        return this.ngayCapNhat;
    }

    public NhomLoi ngayCapNhat(ZonedDateTime ngayCapNhat) {
        this.setNgayCapNhat(ngayCapNhat);
        return this;
    }

    public void setNgayCapNhat(ZonedDateTime ngayCapNhat) {
        this.ngayCapNhat = ngayCapNhat;
    }

    public String getUsername() {
        return this.username;
    }

    public NhomLoi username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getGhiChu() {
        return this.ghiChu;
    }

    public NhomLoi ghiChu(String ghiChu) {
        this.setGhiChu(ghiChu);
        return this;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public String getTrangThai() {
        return this.trangThai;
    }

    public NhomLoi trangThai(String trangThai) {
        this.setTrangThai(trangThai);
        return this;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public Set<Loi> getLois() {
        return this.lois;
    }

    public void setLois(Set<Loi> lois) {
        if (this.lois != null) {
            this.lois.forEach(i -> i.setNhomLoi(null));
        }
        if (lois != null) {
            lois.forEach(i -> i.setNhomLoi(this));
        }
        this.lois = lois;
    }

    public NhomLoi lois(Set<Loi> lois) {
        this.setLois(lois);
        return this;
    }

    public NhomLoi addLoi(Loi loi) {
        this.lois.add(loi);
        loi.setNhomLoi(this);
        return this;
    }

    public NhomLoi removeLoi(Loi loi) {
        this.lois.remove(loi);
        loi.setNhomLoi(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NhomLoi)) {
            return false;
        }
        return id != null && id.equals(((NhomLoi) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NhomLoi{" +
            "id=" + getId() +
            ", maNhomLoi='" + getMaNhomLoi() + "'" +
            ", tenNhomLoi='" + getTenNhomLoi() + "'" +
            ", ngayTao='" + getNgayTao() + "'" +
            ", ngayCapNhat='" + getNgayCapNhat() + "'" +
            ", username='" + getUsername() + "'" +
            ", ghiChu='" + getGhiChu() + "'" +
            ", trangThai='" + getTrangThai() + "'" +
            "}";
    }
}
