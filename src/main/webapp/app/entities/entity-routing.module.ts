import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'tinh-thanh',
        data: { pageTitle: 'Tỉnh thành' },
        loadChildren: () => import('./tinh-thanh/tinh-thanh.module').then(m => m.TinhThanhModule),
      },
      {
        path: 'nhom-san-pham',
        data: { pageTitle: 'Nhóm sản phẩm' },
        loadChildren: () => import('./nhom-san-pham/nhom-san-pham.module').then(m => m.NhomSanPhamModule),
      },
      {
        path: 'san-pham',
        data: { pageTitle: 'Quản lý sản phẩm' },
        loadChildren: () => import('./san-pham/san-pham.module').then(m => m.SanPhamModule),
      },
      {
        path: 'khach-hang',
        data: { pageTitle: 'Khách hàng' },
        loadChildren: () => import('./khach-hang/khach-hang.module').then(m => m.KhachHangModule),
      },
      {
        path: 'nhom-khach-hang',
        data: { pageTitle: 'Nhóm khách hàng' },
        loadChildren: () => import('./nhom-khach-hang/nhom-khach-hang.module').then(m => m.NhomKhachHangModule),
      },
      {
        path: 'don-bao-hanh',
        data: { pageTitle: 'Quản lý tiếp nhận' },
        loadChildren: () => import('./don-bao-hanh/don-bao-hanh.module').then(m => m.DonBaoHanhModule),
      },
      {
        path: 'chi-tiet-san-pham-tiep-nhan',
        data: { pageTitle: 'Tổng hợp' },
        loadChildren: () =>
          import('./chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.module').then(m => m.ChiTietSanPhamTiepNhanModule),
      },
      {
        path: 'phan-loai-chi-tiet-tiep-nhan',
        data: { pageTitle: 'Phân loại chi tiết tiếp nhận' },
        loadChildren: () =>
          import('./phan-loai-chi-tiet-tiep-nhan/phan-loai-chi-tiet-tiep-nhan.module').then(m => m.PhanLoaiChiTietTiepNhanModule),
      },
      {
        path: 'danh-sach-tinh-trang',
        data: { pageTitle: 'Phân tích mã tiếp nhận' },
        loadChildren: () => import('./danh-sach-tinh-trang/danh-sach-tinh-trang.module').then(m => m.DanhSachTinhTrangModule),
      },
      {
        path: 'phan-tich-san-pham',
        data: { pageTitle: 'Phân tích' },
        loadChildren: () => import('./phan-tich-san-pham/phan-tich-san-pham.module').then(m => m.PhanTichSanPhamModule),
      },
      {
        path: 'phan-tich-loi',
        data: { pageTitle: 'Phân tích lỗi' },
        loadChildren: () => import('./phan-tich-loi/phan-tich-loi.module').then(m => m.PhanTichLoiModule),
      },
      {
        path: 'loi',
        data: { pageTitle: 'Lỗi' },
        loadChildren: () => import('./loi/loi.module').then(m => m.LoiModule),
      },
      {
        path: 'nhom-loi',
        data: { pageTitle: 'Nhóm lỗi' },
        loadChildren: () => import('./nhom-loi/nhom-loi.module').then(m => m.NhomLoiModule),
      },
      {
        path: 'kho',
        data: { pageTitle: 'Kho' },
        loadChildren: () => import('./kho/kho.module').then(m => m.KhoModule),
      },
      {
        path: 'chung-loai',
        data: { pageTitle: 'Chủng loại' },
        loadChildren: () => import('./chung-loai/chung-loai.module').then(m => m.ChungLoaiModule),
      },
      {
        path: 'nganh',
        data: { pageTitle: 'Ngành' },
        loadChildren: () => import('./nganh/nganh.module').then(m => m.NganhModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
