package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PhanLoaiChiTietTiepNhanTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PhanLoaiChiTietTiepNhan.class);
        PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan1 = new PhanLoaiChiTietTiepNhan();
        phanLoaiChiTietTiepNhan1.setId(1L);
        PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan2 = new PhanLoaiChiTietTiepNhan();
        phanLoaiChiTietTiepNhan2.setId(phanLoaiChiTietTiepNhan1.getId());
        assertThat(phanLoaiChiTietTiepNhan1).isEqualTo(phanLoaiChiTietTiepNhan2);
        phanLoaiChiTietTiepNhan2.setId(2L);
        assertThat(phanLoaiChiTietTiepNhan1).isNotEqualTo(phanLoaiChiTietTiepNhan2);
        phanLoaiChiTietTiepNhan1.setId(null);
        assertThat(phanLoaiChiTietTiepNhan1).isNotEqualTo(phanLoaiChiTietTiepNhan2);
    }
}
