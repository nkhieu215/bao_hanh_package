package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PhanTichLoiTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PhanTichLoi.class);
        PhanTichLoi phanTichLoi1 = new PhanTichLoi();
        phanTichLoi1.setId(1L);
        PhanTichLoi phanTichLoi2 = new PhanTichLoi();
        phanTichLoi2.setId(phanTichLoi1.getId());
        assertThat(phanTichLoi1).isEqualTo(phanTichLoi2);
        phanTichLoi2.setId(2L);
        assertThat(phanTichLoi1).isNotEqualTo(phanTichLoi2);
        phanTichLoi1.setId(null);
        assertThat(phanTichLoi1).isNotEqualTo(phanTichLoi2);
    }
}
