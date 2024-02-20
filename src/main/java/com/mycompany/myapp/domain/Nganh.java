package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Nganh.
 */
@Entity
@Table(name = "nganh")
public class Nganh implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ma_nganh")
    private String maNganh;

    @Column(name = "ten_nganh")
    private String tenNganh;

    @Column(name = "ngay_tao")
    private ZonedDateTime ngayTao;

    @Column(name = "username")
    private String username;

    @OneToMany(mappedBy = "nganh")
    @JsonIgnoreProperties(value = { "chiTietSanPhamTiepNhans", "nhomSanPham", "kho", "nganh" }, allowSetters = true)
    private Set<SanPham> sanPhams = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Nganh id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaNganh() {
        return this.maNganh;
    }

    public Nganh maNganh(String maNganh) {
        this.setMaNganh(maNganh);
        return this;
    }

    public void setMaNganh(String maNganh) {
        this.maNganh = maNganh;
    }

    public String getTenNganh() {
        return this.tenNganh;
    }

    public Nganh tenNganh(String tenNganh) {
        this.setTenNganh(tenNganh);
        return this;
    }

    public void setTenNganh(String tenNganh) {
        this.tenNganh = tenNganh;
    }

    public ZonedDateTime getNgayTao() {
        return this.ngayTao;
    }

    public Nganh ngayTao(ZonedDateTime ngayTao) {
        this.setNgayTao(ngayTao);
        return this;
    }

    public void setNgayTao(ZonedDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getUsername() {
        return this.username;
    }

    public Nganh username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<SanPham> getSanPhams() {
        return this.sanPhams;
    }

    public void setSanPhams(Set<SanPham> sanPhams) {
        if (this.sanPhams != null) {
            this.sanPhams.forEach(i -> i.setNganh(null));
        }
        if (sanPhams != null) {
            sanPhams.forEach(i -> i.setNganh(this));
        }
        this.sanPhams = sanPhams;
    }

    public Nganh sanPhams(Set<SanPham> sanPhams) {
        this.setSanPhams(sanPhams);
        return this;
    }

    public Nganh addSanPham(SanPham sanPham) {
        this.sanPhams.add(sanPham);
        sanPham.setNganh(this);
        return this;
    }

    public Nganh removeSanPham(SanPham sanPham) {
        this.sanPhams.remove(sanPham);
        sanPham.setNganh(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Nganh)) {
            return false;
        }
        return id != null && id.equals(((Nganh) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Nganh{" +
            "id=" + getId() +
            ", maNganh='" + getMaNganh() + "'" +
            ", tenNganh='" + getTenNganh() + "'" +
            ", ngayTao='" + getNgayTao() + "'" +
            ", username='" + getUsername() + "'" +
            "}";
    }
}
