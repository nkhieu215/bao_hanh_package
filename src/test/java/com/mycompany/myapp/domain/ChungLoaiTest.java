package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChungLoaiTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChungLoai.class);
        ChungLoai chungLoai1 = new ChungLoai();
        chungLoai1.setId(1L);
        ChungLoai chungLoai2 = new ChungLoai();
        chungLoai2.setId(chungLoai1.getId());
        assertThat(chungLoai1).isEqualTo(chungLoai2);
        chungLoai2.setId(2L);
        assertThat(chungLoai1).isNotEqualTo(chungLoai2);
        chungLoai1.setId(null);
        assertThat(chungLoai1).isNotEqualTo(chungLoai2);
    }
}
