package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "danh_sach_bien_ban")
public class MaBienBan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma_bien_ban")
    private String maBienBan;
    @Column(name = "so_lan_in")
    private Long soLanIn;
    @Column(name="loai_bien_ban")
    private String loaiBienBan;
    @Column(name="ma_kho")
    private String maKho;
    @ManyToOne
    @JsonIgnoreProperties(value = { "chiTietSanPhamTiepNhans", "khachHang" }, allowSetters = true)
    private DonBaoHanh donBaoHanh;
    public MaBienBan() {}

    public String getLoaiBienBan() {
        return loaiBienBan;
    }

    public void setLoaiBienBan(String loaiBienBan) {
        this.loaiBienBan = loaiBienBan;
    }

    public String getMaKho() {
        return maKho;
    }

    public void setMaKho(String maKho) {
        this.maKho = maKho;
    }

    public MaBienBan(Long id, String maBienBan) {
        this.id = id;
        this.maBienBan = maBienBan;
    }

    public DonBaoHanh getDonBaoHanh() {
        return donBaoHanh;
    }

    public void setDonBaoHanh(DonBaoHanh donBaoHanh) {
        this.donBaoHanh = donBaoHanh;
    }

    public Long getSoLanIn() {
        return soLanIn;
    }

    public void setSoLanIn(Long soLanIn) {
        this.soLanIn = soLanIn;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaBienBan() {
        return maBienBan;
    }

    public void setMaBienBan(String maBienBan) {
        this.maBienBan = maBienBan;
    }
}
