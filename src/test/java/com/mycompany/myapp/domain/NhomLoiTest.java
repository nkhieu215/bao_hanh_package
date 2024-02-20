package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NhomLoiTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NhomLoi.class);
        NhomLoi nhomLoi1 = new NhomLoi();
        nhomLoi1.setId(1L);
        NhomLoi nhomLoi2 = new NhomLoi();
        nhomLoi2.setId(nhomLoi1.getId());
        assertThat(nhomLoi1).isEqualTo(nhomLoi2);
        nhomLoi2.setId(2L);
        assertThat(nhomLoi1).isNotEqualTo(nhomLoi2);
        nhomLoi1.setId(null);
        assertThat(nhomLoi1).isNotEqualTo(nhomLoi2);
    }
}
