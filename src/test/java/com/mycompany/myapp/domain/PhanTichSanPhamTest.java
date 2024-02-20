package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PhanTichSanPhamTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PhanTichSanPham.class);
        PhanTichSanPham phanTichSanPham1 = new PhanTichSanPham();
        phanTichSanPham1.setId(1L);
        PhanTichSanPham phanTichSanPham2 = new PhanTichSanPham();
        phanTichSanPham2.setId(phanTichSanPham1.getId());
        assertThat(phanTichSanPham1).isEqualTo(phanTichSanPham2);
        phanTichSanPham2.setId(2L);
        assertThat(phanTichSanPham1).isNotEqualTo(phanTichSanPham2);
        phanTichSanPham1.setId(null);
        assertThat(phanTichSanPham1).isNotEqualTo(phanTichSanPham2);
    }
}
