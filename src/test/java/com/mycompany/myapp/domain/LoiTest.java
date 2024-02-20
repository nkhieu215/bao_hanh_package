package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LoiTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Loi.class);
        Loi loi1 = new Loi();
        loi1.setId(1L);
        Loi loi2 = new Loi();
        loi2.setId(loi1.getId());
        assertThat(loi1).isEqualTo(loi2);
        loi2.setId(2L);
        assertThat(loi1).isNotEqualTo(loi2);
        loi1.setId(null);
        assertThat(loi1).isNotEqualTo(loi2);
    }
}
