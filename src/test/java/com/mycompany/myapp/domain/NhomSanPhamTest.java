package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NhomSanPhamTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NhomSanPham.class);
        NhomSanPham nhomSanPham1 = new NhomSanPham();
        nhomSanPham1.setId(1L);
        NhomSanPham nhomSanPham2 = new NhomSanPham();
        nhomSanPham2.setId(nhomSanPham1.getId());
        assertThat(nhomSanPham1).isEqualTo(nhomSanPham2);
        nhomSanPham2.setId(2L);
        assertThat(nhomSanPham1).isNotEqualTo(nhomSanPham2);
        nhomSanPham1.setId(null);
        assertThat(nhomSanPham1).isNotEqualTo(nhomSanPham2);
    }
}
