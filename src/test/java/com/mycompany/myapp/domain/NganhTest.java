package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NganhTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Nganh.class);
        Nganh nganh1 = new Nganh();
        nganh1.setId(1L);
        Nganh nganh2 = new Nganh();
        nganh2.setId(nganh1.getId());
        assertThat(nganh1).isEqualTo(nganh2);
        nganh2.setId(2L);
        assertThat(nganh1).isNotEqualTo(nganh2);
        nganh1.setId(null);
        assertThat(nganh1).isNotEqualTo(nganh2);
    }
}
