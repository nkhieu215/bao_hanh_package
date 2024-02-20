package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NhomKhachHangTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NhomKhachHang.class);
        NhomKhachHang nhomKhachHang1 = new NhomKhachHang();
        nhomKhachHang1.setId(1L);
        NhomKhachHang nhomKhachHang2 = new NhomKhachHang();
        nhomKhachHang2.setId(nhomKhachHang1.getId());
        assertThat(nhomKhachHang1).isEqualTo(nhomKhachHang2);
        nhomKhachHang2.setId(2L);
        assertThat(nhomKhachHang1).isNotEqualTo(nhomKhachHang2);
        nhomKhachHang1.setId(null);
        assertThat(nhomKhachHang1).isNotEqualTo(nhomKhachHang2);
    }
}
