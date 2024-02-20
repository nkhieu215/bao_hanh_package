package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KhoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Kho.class);
        Kho kho1 = new Kho();
        kho1.setId(1L);
        Kho kho2 = new Kho();
        kho2.setId(kho1.getId());
        assertThat(kho1).isEqualTo(kho2);
        kho2.setId(2L);
        assertThat(kho1).isNotEqualTo(kho2);
        kho1.setId(null);
        assertThat(kho1).isNotEqualTo(kho2);
    }
}
