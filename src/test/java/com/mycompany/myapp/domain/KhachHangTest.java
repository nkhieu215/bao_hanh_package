package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KhachHangTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KhachHang.class);
        KhachHang khachHang1 = new KhachHang();
        khachHang1.setId(1L);
        KhachHang khachHang2 = new KhachHang();
        khachHang2.setId(khachHang1.getId());
        assertThat(khachHang1).isEqualTo(khachHang2);
        khachHang2.setId(2L);
        assertThat(khachHang1).isNotEqualTo(khachHang2);
        khachHang1.setId(null);
        assertThat(khachHang1).isNotEqualTo(khachHang2);
    }
}
