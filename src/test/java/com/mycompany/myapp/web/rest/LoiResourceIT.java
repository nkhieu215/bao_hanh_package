package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Loi;
import com.mycompany.myapp.repository.LoiRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LoiResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LoiResourceIT {

    private static final String DEFAULT_ERR_CODE = "AAAAAAAAAA";
    private static final String UPDATED_ERR_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_TEN_LOI = "AAAAAAAAAA";
    private static final String UPDATED_TEN_LOI = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NGAY_TAO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_TAO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_NGAY_CAP_NHAT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_CAP_NHAT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_CHI_CHU = "AAAAAAAAAA";
    private static final String UPDATED_CHI_CHU = "BBBBBBBBBB";

    private static final String DEFAULT_TRANG_THAI = "AAAAAAAAAA";
    private static final String UPDATED_TRANG_THAI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lois";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LoiRepository loiRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLoiMockMvc;

    private Loi loi;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Loi createEntity(EntityManager em) {
        Loi loi = new Loi()
            .errCode(DEFAULT_ERR_CODE)
            .tenLoi(DEFAULT_TEN_LOI)
            .ngayTao(DEFAULT_NGAY_TAO)
            .ngayCapNhat(DEFAULT_NGAY_CAP_NHAT)
            .username(DEFAULT_USERNAME)
            .chiChu(DEFAULT_CHI_CHU)
            .trangThai(DEFAULT_TRANG_THAI);
        return loi;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Loi createUpdatedEntity(EntityManager em) {
        Loi loi = new Loi()
            .errCode(UPDATED_ERR_CODE)
            .tenLoi(UPDATED_TEN_LOI)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .chiChu(UPDATED_CHI_CHU)
            .trangThai(UPDATED_TRANG_THAI);
        return loi;
    }

    @BeforeEach
    public void initTest() {
        loi = createEntity(em);
    }

    @Test
    @Transactional
    void createLoi() throws Exception {
        int databaseSizeBeforeCreate = loiRepository.findAll().size();
        // Create the Loi
        restLoiMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loi))
            )
            .andExpect(status().isCreated());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeCreate + 1);
        Loi testLoi = loiList.get(loiList.size() - 1);
        assertThat(testLoi.getErrCode()).isEqualTo(DEFAULT_ERR_CODE);
        assertThat(testLoi.getTenLoi()).isEqualTo(DEFAULT_TEN_LOI);
        assertThat(testLoi.getNgayTao()).isEqualTo(DEFAULT_NGAY_TAO);
        assertThat(testLoi.getNgayCapNhat()).isEqualTo(DEFAULT_NGAY_CAP_NHAT);
        assertThat(testLoi.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testLoi.getChiChu()).isEqualTo(DEFAULT_CHI_CHU);
        assertThat(testLoi.getTrangThai()).isEqualTo(DEFAULT_TRANG_THAI);
    }

    @Test
    @Transactional
    void createLoiWithExistingId() throws Exception {
        // Create the Loi with an existing ID
        loi.setId(1L);

        int databaseSizeBeforeCreate = loiRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLoiMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loi))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLois() throws Exception {
        // Initialize the database
        loiRepository.saveAndFlush(loi);

        // Get all the loiList
        restLoiMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(loi.getId().intValue())))
            .andExpect(jsonPath("$.[*].errCode").value(hasItem(DEFAULT_ERR_CODE)))
            .andExpect(jsonPath("$.[*].tenLoi").value(hasItem(DEFAULT_TEN_LOI)))
            .andExpect(jsonPath("$.[*].ngayTao").value(hasItem(sameInstant(DEFAULT_NGAY_TAO))))
            .andExpect(jsonPath("$.[*].ngayCapNhat").value(hasItem(sameInstant(DEFAULT_NGAY_CAP_NHAT))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].chiChu").value(hasItem(DEFAULT_CHI_CHU)))
            .andExpect(jsonPath("$.[*].trangThai").value(hasItem(DEFAULT_TRANG_THAI)));
    }

    @Test
    @Transactional
    void getLoi() throws Exception {
        // Initialize the database
        loiRepository.saveAndFlush(loi);

        // Get the loi
        restLoiMockMvc
            .perform(get(ENTITY_API_URL_ID, loi.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(loi.getId().intValue()))
            .andExpect(jsonPath("$.errCode").value(DEFAULT_ERR_CODE))
            .andExpect(jsonPath("$.tenLoi").value(DEFAULT_TEN_LOI))
            .andExpect(jsonPath("$.ngayTao").value(sameInstant(DEFAULT_NGAY_TAO)))
            .andExpect(jsonPath("$.ngayCapNhat").value(sameInstant(DEFAULT_NGAY_CAP_NHAT)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.chiChu").value(DEFAULT_CHI_CHU))
            .andExpect(jsonPath("$.trangThai").value(DEFAULT_TRANG_THAI));
    }

    @Test
    @Transactional
    void getNonExistingLoi() throws Exception {
        // Get the loi
        restLoiMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLoi() throws Exception {
        // Initialize the database
        loiRepository.saveAndFlush(loi);

        int databaseSizeBeforeUpdate = loiRepository.findAll().size();

        // Update the loi
        Loi updatedLoi = loiRepository.findById(loi.getId()).get();
        // Disconnect from session so that the updates on updatedLoi are not directly saved in db
        em.detach(updatedLoi);
        updatedLoi
            .errCode(UPDATED_ERR_CODE)
            .tenLoi(UPDATED_TEN_LOI)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .chiChu(UPDATED_CHI_CHU)
            .trangThai(UPDATED_TRANG_THAI);

        restLoiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLoi.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLoi))
            )
            .andExpect(status().isOk());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeUpdate);
        Loi testLoi = loiList.get(loiList.size() - 1);
        assertThat(testLoi.getErrCode()).isEqualTo(UPDATED_ERR_CODE);
        assertThat(testLoi.getTenLoi()).isEqualTo(UPDATED_TEN_LOI);
        assertThat(testLoi.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testLoi.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testLoi.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testLoi.getChiChu()).isEqualTo(UPDATED_CHI_CHU);
        assertThat(testLoi.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void putNonExistingLoi() throws Exception {
        int databaseSizeBeforeUpdate = loiRepository.findAll().size();
        loi.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, loi.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loi))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLoi() throws Exception {
        int databaseSizeBeforeUpdate = loiRepository.findAll().size();
        loi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loi))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLoi() throws Exception {
        int databaseSizeBeforeUpdate = loiRepository.findAll().size();
        loi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoiMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loi))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLoiWithPatch() throws Exception {
        // Initialize the database
        loiRepository.saveAndFlush(loi);

        int databaseSizeBeforeUpdate = loiRepository.findAll().size();

        // Update the loi using partial update
        Loi partialUpdatedLoi = new Loi();
        partialUpdatedLoi.setId(loi.getId());

        partialUpdatedLoi
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .chiChu(UPDATED_CHI_CHU)
            .trangThai(UPDATED_TRANG_THAI);

        restLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoi.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoi))
            )
            .andExpect(status().isOk());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeUpdate);
        Loi testLoi = loiList.get(loiList.size() - 1);
        assertThat(testLoi.getErrCode()).isEqualTo(DEFAULT_ERR_CODE);
        assertThat(testLoi.getTenLoi()).isEqualTo(DEFAULT_TEN_LOI);
        assertThat(testLoi.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testLoi.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testLoi.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testLoi.getChiChu()).isEqualTo(UPDATED_CHI_CHU);
        assertThat(testLoi.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void fullUpdateLoiWithPatch() throws Exception {
        // Initialize the database
        loiRepository.saveAndFlush(loi);

        int databaseSizeBeforeUpdate = loiRepository.findAll().size();

        // Update the loi using partial update
        Loi partialUpdatedLoi = new Loi();
        partialUpdatedLoi.setId(loi.getId());

        partialUpdatedLoi
            .errCode(UPDATED_ERR_CODE)
            .tenLoi(UPDATED_TEN_LOI)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .chiChu(UPDATED_CHI_CHU)
            .trangThai(UPDATED_TRANG_THAI);

        restLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoi.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoi))
            )
            .andExpect(status().isOk());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeUpdate);
        Loi testLoi = loiList.get(loiList.size() - 1);
        assertThat(testLoi.getErrCode()).isEqualTo(UPDATED_ERR_CODE);
        assertThat(testLoi.getTenLoi()).isEqualTo(UPDATED_TEN_LOI);
        assertThat(testLoi.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testLoi.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testLoi.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testLoi.getChiChu()).isEqualTo(UPDATED_CHI_CHU);
        assertThat(testLoi.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void patchNonExistingLoi() throws Exception {
        int databaseSizeBeforeUpdate = loiRepository.findAll().size();
        loi.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, loi.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loi))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLoi() throws Exception {
        int databaseSizeBeforeUpdate = loiRepository.findAll().size();
        loi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loi))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLoi() throws Exception {
        int databaseSizeBeforeUpdate = loiRepository.findAll().size();
        loi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoiMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loi))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Loi in the database
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLoi() throws Exception {
        // Initialize the database
        loiRepository.saveAndFlush(loi);

        int databaseSizeBeforeDelete = loiRepository.findAll().size();

        // Delete the loi
        restLoiMockMvc
            .perform(delete(ENTITY_API_URL_ID, loi.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Loi> loiList = loiRepository.findAll();
        assertThat(loiList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
