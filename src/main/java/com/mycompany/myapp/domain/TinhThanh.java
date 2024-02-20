package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A TinhThanh.
 */
@Entity
@Table(name = "tinh_thanh")
public class TinhThanh implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "id_tinh_thanh")
    private Integer idTinhThanh;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "tinhThanh")
    @JsonIgnoreProperties(value = { "donBaoHanhs", "nhomKhachHang", "tinhThanh" }, allowSetters = true)
    private Set<KhachHang> khachHangs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TinhThanh id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIdTinhThanh() {
        return this.idTinhThanh;
    }

    public TinhThanh idTinhThanh(Integer idTinhThanh) {
        this.setIdTinhThanh(idTinhThanh);
        return this;
    }

    public void setIdTinhThanh(Integer idTinhThanh) {
        this.idTinhThanh = idTinhThanh;
    }

    public String getName() {
        return this.name;
    }

    public TinhThanh name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<KhachHang> getKhachHangs() {
        return this.khachHangs;
    }

    public void setKhachHangs(Set<KhachHang> khachHangs) {
        if (this.khachHangs != null) {
            this.khachHangs.forEach(i -> i.setTinhThanh(null));
        }
        if (khachHangs != null) {
            khachHangs.forEach(i -> i.setTinhThanh(this));
        }
        this.khachHangs = khachHangs;
    }

    public TinhThanh khachHangs(Set<KhachHang> khachHangs) {
        this.setKhachHangs(khachHangs);
        return this;
    }

    public TinhThanh addKhachHang(KhachHang khachHang) {
        this.khachHangs.add(khachHang);
        khachHang.setTinhThanh(this);
        return this;
    }

    public TinhThanh removeKhachHang(KhachHang khachHang) {
        this.khachHangs.remove(khachHang);
        khachHang.setTinhThanh(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TinhThanh)) {
            return false;
        }
        return id != null && id.equals(((TinhThanh) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TinhThanh{" +
            "id=" + getId() +
            ", idTinhThanh=" + getIdTinhThanh() +
            ", name='" + getName() + "'" +
            "}";
    }
}
