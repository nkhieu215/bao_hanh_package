package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A NhomSanPham.
 */
@Entity
@Table(name = "nhom_san_pham")
public class NhomSanPham implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "time_create")
    private String timeCreate;

    @Column(name = "time_update")
    private ZonedDateTime timeUpdate;

    @Column(name = "username")
    private String username;

    @Column(name = "trang_thai")
    private String trangThai;

    @OneToMany(mappedBy = "nhomSanPham")
    @JsonIgnoreProperties(value = { "chiTietSanPhamTiepNhans", "nhomSanPham", "kho", "nganh" }, allowSetters = true)
    private Set<SanPham> sanPhams = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "nhomSanPhams" }, allowSetters = true)
    private ChungLoai chungLoai;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NhomSanPham id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public NhomSanPham name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTimeCreate() {
        return this.timeCreate;
    }

    public NhomSanPham timeCreate(String timeCreate) {
        this.setTimeCreate(timeCreate);
        return this;
    }

    public void setTimeCreate(String timeCreate) {
        this.timeCreate = timeCreate;
    }

    public ZonedDateTime getTimeUpdate() {
        return this.timeUpdate;
    }

    public NhomSanPham timeUpdate(ZonedDateTime timeUpdate) {
        this.setTimeUpdate(timeUpdate);
        return this;
    }

    public void setTimeUpdate(ZonedDateTime timeUpdate) {
        this.timeUpdate = timeUpdate;
    }

    public String getUsername() {
        return this.username;
    }

    public NhomSanPham username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTrangThai() {
        return this.trangThai;
    }

    public NhomSanPham trangThai(String trangThai) {
        this.setTrangThai(trangThai);
        return this;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public Set<SanPham> getSanPhams() {
        return this.sanPhams;
    }

    public void setSanPhams(Set<SanPham> sanPhams) {
        if (this.sanPhams != null) {
            this.sanPhams.forEach(i -> i.setNhomSanPham(null));
        }
        if (sanPhams != null) {
            sanPhams.forEach(i -> i.setNhomSanPham(this));
        }
        this.sanPhams = sanPhams;
    }

    public NhomSanPham sanPhams(Set<SanPham> sanPhams) {
        this.setSanPhams(sanPhams);
        return this;
    }

    public NhomSanPham addSanPham(SanPham sanPham) {
        this.sanPhams.add(sanPham);
        sanPham.setNhomSanPham(this);
        return this;
    }

    public NhomSanPham removeSanPham(SanPham sanPham) {
        this.sanPhams.remove(sanPham);
        sanPham.setNhomSanPham(null);
        return this;
    }

    public ChungLoai getChungLoai() {
        return this.chungLoai;
    }

    public void setChungLoai(ChungLoai chungLoai) {
        this.chungLoai = chungLoai;
    }

    public NhomSanPham chungLoai(ChungLoai chungLoai) {
        this.setChungLoai(chungLoai);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NhomSanPham)) {
            return false;
        }
        return id != null && id.equals(((NhomSanPham) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NhomSanPham{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", timeCreate='" + getTimeCreate() + "'" +
            ", timeUpdate='" + getTimeUpdate() + "'" +
            ", username='" + getUsername() + "'" +
            ", trangThai='" + getTrangThai() + "'" +
            "}";
    }
}
