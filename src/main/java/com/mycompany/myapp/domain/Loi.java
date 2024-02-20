package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Loi.
 */
@Entity
@Table(name = "loi")
public class Loi implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "err_code")
    private String errCode;

    @Column(name = "ten_loi")
    private String tenLoi;

    @Column(name = "ngay_tao")
    private ZonedDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    private ZonedDateTime ngayCapNhat;

    @Column(name = "username")
    private String username;

    @Column(name = "chi_chu")
    private String chiChu;

    @Column(name = "trang_thai")
    private String trangThai;

    @OneToMany(mappedBy = "loi")
    @JsonIgnoreProperties(value = { "loi", "phanTichSanPham" }, allowSetters = true)
    private Set<PhanTichLoi> phanTichLois = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "lois" }, allowSetters = true)
    private NhomLoi nhomLoi;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Loi id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getErrCode() {
        return this.errCode;
    }

    public Loi errCode(String errCode) {
        this.setErrCode(errCode);
        return this;
    }

    public void setErrCode(String errCode) {
        this.errCode = errCode;
    }

    public String getTenLoi() {
        return this.tenLoi;
    }

    public Loi tenLoi(String tenLoi) {
        this.setTenLoi(tenLoi);
        return this;
    }

    public void setTenLoi(String tenLoi) {
        this.tenLoi = tenLoi;
    }

    public ZonedDateTime getNgayTao() {
        return this.ngayTao;
    }

    public Loi ngayTao(ZonedDateTime ngayTao) {
        this.setNgayTao(ngayTao);
        return this;
    }

    public void setNgayTao(ZonedDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public ZonedDateTime getNgayCapNhat() {
        return this.ngayCapNhat;
    }

    public Loi ngayCapNhat(ZonedDateTime ngayCapNhat) {
        this.setNgayCapNhat(ngayCapNhat);
        return this;
    }

    public void setNgayCapNhat(ZonedDateTime ngayCapNhat) {
        this.ngayCapNhat = ngayCapNhat;
    }

    public String getUsername() {
        return this.username;
    }

    public Loi username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getChiChu() {
        return this.chiChu;
    }

    public Loi chiChu(String chiChu) {
        this.setChiChu(chiChu);
        return this;
    }

    public void setChiChu(String chiChu) {
        this.chiChu = chiChu;
    }

    public String getTrangThai() {
        return this.trangThai;
    }

    public Loi trangThai(String trangThai) {
        this.setTrangThai(trangThai);
        return this;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public Set<PhanTichLoi> getPhanTichLois() {
        return this.phanTichLois;
    }

    public void setPhanTichLois(Set<PhanTichLoi> phanTichLois) {
        if (this.phanTichLois != null) {
            this.phanTichLois.forEach(i -> i.setLoi(null));
        }
        if (phanTichLois != null) {
            phanTichLois.forEach(i -> i.setLoi(this));
        }
        this.phanTichLois = phanTichLois;
    }

    public Loi phanTichLois(Set<PhanTichLoi> phanTichLois) {
        this.setPhanTichLois(phanTichLois);
        return this;
    }

    public Loi addPhanTichLoi(PhanTichLoi phanTichLoi) {
        this.phanTichLois.add(phanTichLoi);
        phanTichLoi.setLoi(this);
        return this;
    }

    public Loi removePhanTichLoi(PhanTichLoi phanTichLoi) {
        this.phanTichLois.remove(phanTichLoi);
        phanTichLoi.setLoi(null);
        return this;
    }

    public NhomLoi getNhomLoi() {
        return this.nhomLoi;
    }

    public void setNhomLoi(NhomLoi nhomLoi) {
        this.nhomLoi = nhomLoi;
    }

    public Loi nhomLoi(NhomLoi nhomLoi) {
        this.setNhomLoi(nhomLoi);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Loi)) {
            return false;
        }
        return id != null && id.equals(((Loi) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Loi{" +
            "id=" + getId() +
            ", errCode='" + getErrCode() + "'" +
            ", tenLoi='" + getTenLoi() + "'" +
            ", ngayTao='" + getNgayTao() + "'" +
            ", ngayCapNhat='" + getNgayCapNhat() + "'" +
            ", username='" + getUsername() + "'" +
            ", chiChu='" + getChiChu() + "'" +
            ", trangThai='" + getTrangThai() + "'" +
            "}";
    }
}
