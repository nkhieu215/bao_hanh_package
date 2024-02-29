package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.service.FullServices;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Transactional
public class Controller {

    @Autowired
    private final FullServices fullServices;

    public Controller(FullServices fullServices) {
        this.fullServices = fullServices;
    }

    // * ============================ Template Tiếp nhận =================================
    // * Trang chủ
    //☺ lấy danh sách tất cả các đơn bảo hành
    // * Thêm mới đơn bảo hành
    //☺ Lưu chi tiết đơn bảo hành (Btn lưu)
    // ☺ B1: tạo danh sách chi tiết đơn bảo hành
    @PostMapping("/chi-tiet-san-pham-tiep-nhan")
    public List<PhanLoaiChiTietTiepNhan> createChiTietDonBaoHanh(@RequestBody List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhans) {
        return this.fullServices.createChiTietDonBaoHanh(chiTietSanPhamTiepNhans);
    }

    //☺ B2: Cập nhật số lượng sản phẩm theo từng tình trạng
    @PutMapping("/chi-tiet-san-pham-tiep-nhan")
    public void updatePhanLoaiChiTietTiepNhan(List<PhanLoaiChiTietTiepNhan> request) {
        this.fullServices.updatePhanLoaiChiTietTiepNhan(request);
    }

    // ☺ Chuyển đổi trạng thái đơn bảo hành
    @PostMapping("don-bao-hanh/change-status")
    public void ChangeDonBaoHanhStatus(@RequestBody DonBaoHanh request) {
        this.fullServices.ChangeDonBaoHanhStatus(request);
    }

    @GetMapping("chi-tiet-don-bao-hanhs/{id}")
    public List<ChiTietSanPhamTiepNhan> getChiTietDonBaoHanh(@PathVariable Long id) {
        return this.fullServices.getChiTietDonBaoHanh(id);
    }

    //☺ cap nhat trang thai don bao hanh
    @PutMapping("/don-bao-hanhs/update-trang-thai")
    public void updateTrangThaiDonBaoHanh(@RequestBody DonBaoHanh request) {
        this.fullServices.updateTrangThaiDonBaoHanh(request);
    }

    //☺ cập nhật đơn bảo hành
    @PutMapping("/update-don-bao-hanh")
    public void updateDonBaoHanh(@RequestBody DonBaoHanh request) {
        this.fullServices.updateDonBaoHanh(request);
    }

    //☺ thêm mới đơn bảo hành
    @PostMapping("don-bao-hanh/them-moi")
    public DonBaoHanh postDonBaoHanh(@RequestBody DonBaoHanh request) {
        this.fullServices.postDonBaoHanh(request);
        return request;
    }

    //☺ Thêm mới chi Tiết đơn bảo hành
    @PostMapping("don-bao-hanh/them-moi-chi-tiet")
    public List<ChiTietSanPhamTiepNhan> postChiTietSanPhamTiepNhan(@RequestBody List<ChiTietSanPhamTiepNhan> request) {
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = this.fullServices.postChiTietSanPhamTiepNhan(request);
        return chiTietSanPhamTiepNhanList;
    }

    //☺ Thêm mới phân loại chi tiết tiếp nhận
    @PostMapping("don-bao-hanh/them-moi-phan-loai")
    public List<PhanLoaiChiTietTiepNhan> postPhanLoaiChiTietTiepNhan(
        @RequestBody List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList
    ) {
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList1 =
            this.fullServices.postPhanLoaiChiTietTiepNhan(phanLoaiChiTietTiepNhanList);
        return phanLoaiChiTietTiepNhanList1;
    }

    //☺ update phân loại chi tiết đơn hàng tiếp nhận
    @PutMapping("don-bao-hanh/phan-loai/update-phan-loai-chi-tiet-tiep-nhan")
    public void updatePhanLoaiChiTietDonHangTiepNhan(@RequestBody List<PhanLoaiChiTietTiepNhan> requestList) {
        this.fullServices.updatePhanLoaiChiTietDonHangTiepNhan(requestList);
    }

    //☺ update chi tiết sản phẩm tiếp nhận
    @PutMapping("don-bao-hanh/phan-loai/update-chi-tiet-san-pham-tiep-nhan")
    public void updateChiTietSanPhamTiepNhan(@RequestBody List<ChiTietSanPhamTiepNhan> requestList) {
        this.fullServices.updateChiTietSanPhamTiepNhan(requestList);
    }

    //☺ hoàn thành phân loại
    @PutMapping("don-bao-hanh/hoan-thanh-phan-loai")
    public void hoanThanhPhanLoai(@RequestBody DonBaoHanh request) {
        this.fullServices.hoanThanhPhanLoai(request);
    }

    //☺ lấy danh sách mã biên bản
    @GetMapping("ma-bien-bans")
    public List<MaBienBan> getAllMaBienBan() {
        List<MaBienBan> maBienBanList = this.fullServices.getAllMaBienBan();
        return maBienBanList;
    }

    //☺ cập nhật thông tin in biên bản
    @PostMapping("ma-bien-ban/post")
    public MaBienBan postMaBienBan(@RequestBody MaBienBan request) {
        MaBienBan maBienBan = this.fullServices.postMaBienBan(request);
        return maBienBan;
    }

    // ☺ lấy thông tin id lớn nhất trong chi tiết sản phẩm tiếp nhận
    @GetMapping("chi-tiet-san-pham-tiep-nhan-max-id")
    public ChiTietSanPhamTiepNhan getMaxId() {
        ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan = this.fullServices.getMaxId();
        return chiTietSanPhamTiepNhan;
    }

    // * ============================ Template Phân tích =================================
    // * Trang chủ
    //☺ lấy danh sách tất cả các đơn bảo hành ở trạng thái chờ phân tích , đang phân tích
    @GetMapping("phan-tich-san-pham")
    public List<DonBaoHanh> getDonBaoHanhByTrangThai() {
        List<DonBaoHanh> donBaoHanhList = this.fullServices.getDonBaoHanhByTrangThai();
        return donBaoHanhList;
    }

    //☺ Lấy thông tin phân tích sản phẩm theo id PLCTTN
    @GetMapping("phan-tich-san-pham/{id}")
    public List<PhanTichSanPham> getByPhanLoaiChiTietTiepNhan(@PathVariable Long id) {
        List<PhanTichSanPham> phanTichSanPhamList = this.fullServices.getByPhanLoaiChiTietTiepNhan(id);
        return phanTichSanPhamList;
    }

    //☺ cập nhật thông tin phân tích sản phẩm
    @PostMapping("phan-tich-san-pham")
    public List<PhanTichSanPham> updatePhanTichSanPham(@RequestBody List<PhanTichSanPham> phanTichSanPhamList) {
        List<PhanTichSanPham> phanTichSanPhamList1 = this.fullServices.updatePhanTichSanPham(phanTichSanPhamList);
        return phanTichSanPhamList1;
    }

    //☺ cập nhật thông tin khai báo lỗi
    @PostMapping("phan-tich-loi")
    public void updatePhanTichLoi(@RequestBody List<PhanTichLoi> phanTichLoiList) {
        this.fullServices.updatePhanTichLoi(phanTichLoiList);
    }

    //☺ Lấy danh sách phân tích lỗi theo phân tích sản phẩm id
    @GetMapping("phan-tich-loi/{id}")
    public List<PhanTichLoi> getByPhanTichSanPhamId(@PathVariable Long id) {
        List<PhanTichLoi> phanTichLoiList = this.fullServices.getByPhanTichSanPhamId(id);
        return phanTichLoiList;
    }

    // * ============================== quản lý sản phẩm ===========================
    //☺ cập nhật thông tin 1 sản phẩm
    @PostMapping("san-phams/update/{id}")
    public void PutSanPham(@RequestBody SanPham sanPham, @PathVariable Long id) {
        this.fullServices.PutSanPham(sanPham, id);
    }

    //☺ Cập nhật toàn bộ danh sách sản phẩm
    @PostMapping("san-phams/update")
    public void PostSanPham(@RequestBody List<SanPham> sanPham) {
        this.fullServices.PostSanPham(sanPham);
    }

    @GetMapping("ma-bien-ban")
    public List<MaBienBan> maBienBanList() {
        List<MaBienBan> maBienBanList = this.fullServices.maBienBanList();
        return maBienBanList;
    }
}
