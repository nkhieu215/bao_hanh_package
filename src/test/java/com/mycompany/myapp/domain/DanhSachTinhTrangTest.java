package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DanhSachTinhTrangTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DanhSachTinhTrang.class);
        DanhSachTinhTrang danhSachTinhTrang1 = new DanhSachTinhTrang();
        danhSachTinhTrang1.setId(1L);
        DanhSachTinhTrang danhSachTinhTrang2 = new DanhSachTinhTrang();
        danhSachTinhTrang2.setId(danhSachTinhTrang1.getId());
        assertThat(danhSachTinhTrang1).isEqualTo(danhSachTinhTrang2);
        danhSachTinhTrang2.setId(2L);
        assertThat(danhSachTinhTrang1).isNotEqualTo(danhSachTinhTrang2);
        danhSachTinhTrang1.setId(null);
        assertThat(danhSachTinhTrang1).isNotEqualTo(danhSachTinhTrang2);
    }
}
