package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChiTietSanPhamTiepNhanTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChiTietSanPhamTiepNhan.class);
        ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan1 = new ChiTietSanPhamTiepNhan();
        chiTietSanPhamTiepNhan1.setId(1L);
        ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan2 = new ChiTietSanPhamTiepNhan();
        chiTietSanPhamTiepNhan2.setId(chiTietSanPhamTiepNhan1.getId());
        assertThat(chiTietSanPhamTiepNhan1).isEqualTo(chiTietSanPhamTiepNhan2);
        chiTietSanPhamTiepNhan2.setId(2L);
        assertThat(chiTietSanPhamTiepNhan1).isNotEqualTo(chiTietSanPhamTiepNhan2);
        chiTietSanPhamTiepNhan1.setId(null);
        assertThat(chiTietSanPhamTiepNhan1).isNotEqualTo(chiTietSanPhamTiepNhan2);
    }
}
