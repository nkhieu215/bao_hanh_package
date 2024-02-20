package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * Task entity.\n@author The JHipster team.
 */
@Schema(description = "Task entity.\n@author The JHipster team.")
@Entity
@Table(name = "nhom_khach_hang")
public class NhomKhachHang implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ten_nhom_khach_hang")
    private String tenNhomKhachHang;

    @Column(name = "ngay_tao")
    private ZonedDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    private ZonedDateTime ngayCapNhat;

    @Column(name = "username")
    private String username;

    @Column(name = "trang_thai")
    private String trangThai;

    @OneToMany(mappedBy = "nhomKhachHang")
    @JsonIgnoreProperties(value = { "donBaoHanhs", "nhomKhachHang", "tinhThanh" }, allowSetters = true)
    private Set<KhachHang> khachHangs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NhomKhachHang id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenNhomKhachHang() {
        return this.tenNhomKhachHang;
    }

    public NhomKhachHang tenNhomKhachHang(String tenNhomKhachHang) {
        this.setTenNhomKhachHang(tenNhomKhachHang);
        return this;
    }

    public void setTenNhomKhachHang(String tenNhomKhachHang) {
        this.tenNhomKhachHang = tenNhomKhachHang;
    }

    public ZonedDateTime getNgayTao() {
        return this.ngayTao;
    }

    public NhomKhachHang ngayTao(ZonedDateTime ngayTao) {
        this.setNgayTao(ngayTao);
        return this;
    }

    public void setNgayTao(ZonedDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public ZonedDateTime getNgayCapNhat() {
        return this.ngayCapNhat;
    }

    public NhomKhachHang ngayCapNhat(ZonedDateTime ngayCapNhat) {
        this.setNgayCapNhat(ngayCapNhat);
        return this;
    }

    public void setNgayCapNhat(ZonedDateTime ngayCapNhat) {
        this.ngayCapNhat = ngayCapNhat;
    }

    public String getUsername() {
        return this.username;
    }

    public NhomKhachHang username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTrangThai() {
        return this.trangThai;
    }

    public NhomKhachHang trangThai(String trangThai) {
        this.setTrangThai(trangThai);
        return this;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public Set<KhachHang> getKhachHangs() {
        return this.khachHangs;
    }

    public void setKhachHangs(Set<KhachHang> khachHangs) {
        if (this.khachHangs != null) {
            this.khachHangs.forEach(i -> i.setNhomKhachHang(null));
        }
        if (khachHangs != null) {
            khachHangs.forEach(i -> i.setNhomKhachHang(this));
        }
        this.khachHangs = khachHangs;
    }

    public NhomKhachHang khachHangs(Set<KhachHang> khachHangs) {
        this.setKhachHangs(khachHangs);
        return this;
    }

    public NhomKhachHang addKhachHang(KhachHang khachHang) {
        this.khachHangs.add(khachHang);
        khachHang.setNhomKhachHang(this);
        return this;
    }

    public NhomKhachHang removeKhachHang(KhachHang khachHang) {
        this.khachHangs.remove(khachHang);
        khachHang.setNhomKhachHang(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NhomKhachHang)) {
            return false;
        }
        return id != null && id.equals(((NhomKhachHang) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NhomKhachHang{" +
            "id=" + getId() +
            ", tenNhomKhachHang='" + getTenNhomKhachHang() + "'" +
            ", ngayTao='" + getNgayTao() + "'" +
            ", ngayCapNhat='" + getNgayCapNhat() + "'" +
            ", username='" + getUsername() + "'" +
            ", trangThai='" + getTrangThai() + "'" +
            "}";
    }
}
