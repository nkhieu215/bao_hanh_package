package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Kho.
 */
@Entity
@Table(name = "kho")
public class Kho implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ma_kho")
    private String maKho;

    @Column(name = "ten_kho")
    private String tenKho;

    @Column(name = "ngay_tao")
    private ZonedDateTime ngayTao;

    @Column(name = "username")
    private String username;

    @OneToMany(mappedBy = "kho")
    @JsonIgnoreProperties(value = { "chiTietSanPhamTiepNhans", "nhomSanPham", "kho", "nganh" }, allowSetters = true)
    private Set<SanPham> sanPhams = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Kho id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaKho() {
        return this.maKho;
    }

    public Kho maKho(String maKho) {
        this.setMaKho(maKho);
        return this;
    }

    public void setMaKho(String maKho) {
        this.maKho = maKho;
    }

    public String getTenKho() {
        return this.tenKho;
    }

    public Kho tenKho(String tenKho) {
        this.setTenKho(tenKho);
        return this;
    }

    public void setTenKho(String tenKho) {
        this.tenKho = tenKho;
    }

    public ZonedDateTime getNgayTao() {
        return this.ngayTao;
    }

    public Kho ngayTao(ZonedDateTime ngayTao) {
        this.setNgayTao(ngayTao);
        return this;
    }

    public void setNgayTao(ZonedDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getUsername() {
        return this.username;
    }

    public Kho username(String username) {
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
            this.sanPhams.forEach(i -> i.setKho(null));
        }
        if (sanPhams != null) {
            sanPhams.forEach(i -> i.setKho(this));
        }
        this.sanPhams = sanPhams;
    }

    public Kho sanPhams(Set<SanPham> sanPhams) {
        this.setSanPhams(sanPhams);
        return this;
    }

    public Kho addSanPham(SanPham sanPham) {
        this.sanPhams.add(sanPham);
        sanPham.setKho(this);
        return this;
    }

    public Kho removeSanPham(SanPham sanPham) {
        this.sanPhams.remove(sanPham);
        sanPham.setKho(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Kho)) {
            return false;
        }
        return id != null && id.equals(((Kho) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Kho{" +
            "id=" + getId() +
            ", maKho='" + getMaKho() + "'" +
            ", tenKho='" + getTenKho() + "'" +
            ", ngayTao='" + getNgayTao() + "'" +
            ", username='" + getUsername() + "'" +
            "}";
    }
}
