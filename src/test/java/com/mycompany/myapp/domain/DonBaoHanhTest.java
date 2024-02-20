package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DonBaoHanhTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DonBaoHanh.class);
        DonBaoHanh donBaoHanh1 = new DonBaoHanh();
        donBaoHanh1.setId(1L);
        DonBaoHanh donBaoHanh2 = new DonBaoHanh();
        donBaoHanh2.setId(donBaoHanh1.getId());
        assertThat(donBaoHanh1).isEqualTo(donBaoHanh2);
        donBaoHanh2.setId(2L);
        assertThat(donBaoHanh1).isNotEqualTo(donBaoHanh2);
        donBaoHanh1.setId(null);
        assertThat(donBaoHanh1).isNotEqualTo(donBaoHanh2);
    }
}
