package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A ChungLoai.
 */
@Entity
@Table(name = "chung_loai")
public class ChungLoai implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ma_chung_loai")
    private String maChungLoai;

    @Column(name = "ten_chung_loai")
    private String tenChungLoai;

    @Column(name = "ngay_tao")
    private ZonedDateTime ngayTao;

    @Column(name = "username")
    private String username;

    @OneToMany(mappedBy = "chungLoai")
    @JsonIgnoreProperties(value = { "sanPhams", "chungLoai" }, allowSetters = true)
    private Set<NhomSanPham> nhomSanPhams = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ChungLoai id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaChungLoai() {
        return this.maChungLoai;
    }

    public ChungLoai maChungLoai(String maChungLoai) {
        this.setMaChungLoai(maChungLoai);
        return this;
    }

    public void setMaChungLoai(String maChungLoai) {
        this.maChungLoai = maChungLoai;
    }

    public String getTenChungLoai() {
        return this.tenChungLoai;
    }

    public ChungLoai tenChungLoai(String tenChungLoai) {
        this.setTenChungLoai(tenChungLoai);
        return this;
    }

    public void setTenChungLoai(String tenChungLoai) {
        this.tenChungLoai = tenChungLoai;
    }

    public ZonedDateTime getNgayTao() {
        return this.ngayTao;
    }

    public ChungLoai ngayTao(ZonedDateTime ngayTao) {
        this.setNgayTao(ngayTao);
        return this;
    }

    public void setNgayTao(ZonedDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getUsername() {
        return this.username;
    }

    public ChungLoai username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<NhomSanPham> getNhomSanPhams() {
        return this.nhomSanPhams;
    }

    public void setNhomSanPhams(Set<NhomSanPham> nhomSanPhams) {
        if (this.nhomSanPhams != null) {
            this.nhomSanPhams.forEach(i -> i.setChungLoai(null));
        }
        if (nhomSanPhams != null) {
            nhomSanPhams.forEach(i -> i.setChungLoai(this));
        }
        this.nhomSanPhams = nhomSanPhams;
    }

    public ChungLoai nhomSanPhams(Set<NhomSanPham> nhomSanPhams) {
        this.setNhomSanPhams(nhomSanPhams);
        return this;
    }

    public ChungLoai addNhomSanPham(NhomSanPham nhomSanPham) {
        this.nhomSanPhams.add(nhomSanPham);
        nhomSanPham.setChungLoai(this);
        return this;
    }

    public ChungLoai removeNhomSanPham(NhomSanPham nhomSanPham) {
        this.nhomSanPhams.remove(nhomSanPham);
        nhomSanPham.setChungLoai(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChungLoai)) {
            return false;
        }
        return id != null && id.equals(((ChungLoai) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChungLoai{" +
            "id=" + getId() +
            ", maChungLoai='" + getMaChungLoai() + "'" +
            ", tenChungLoai='" + getTenChungLoai() + "'" +
            ", ngayTao='" + getNgayTao() + "'" +
            ", username='" + getUsername() + "'" +
            "}";
    }
}
