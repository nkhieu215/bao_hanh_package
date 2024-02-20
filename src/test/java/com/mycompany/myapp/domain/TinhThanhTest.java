package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TinhThanhTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TinhThanh.class);
        TinhThanh tinhThanh1 = new TinhThanh();
        tinhThanh1.setId(1L);
        TinhThanh tinhThanh2 = new TinhThanh();
        tinhThanh2.setId(tinhThanh1.getId());
        assertThat(tinhThanh1).isEqualTo(tinhThanh2);
        tinhThanh2.setId(2L);
        assertThat(tinhThanh1).isNotEqualTo(tinhThanh2);
        tinhThanh1.setId(null);
        assertThat(tinhThanh1).isNotEqualTo(tinhThanh2);
    }
}
