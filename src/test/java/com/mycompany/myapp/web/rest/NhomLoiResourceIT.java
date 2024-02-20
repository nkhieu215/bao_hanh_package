package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.NhomLoi;
import com.mycompany.myapp.repository.NhomLoiRepository;
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
 * Integration tests for the {@link NhomLoiResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NhomLoiResourceIT {

    private static final String DEFAULT_MA_NHOM_LOI = "AAAAAAAAAA";
    private static final String UPDATED_MA_NHOM_LOI = "BBBBBBBBBB";

    private static final String DEFAULT_TEN_NHOM_LOI = "AAAAAAAAAA";
    private static final String UPDATED_TEN_NHOM_LOI = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NGAY_TAO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_TAO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_NGAY_CAP_NHAT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_CAP_NHAT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_GHI_CHU = "AAAAAAAAAA";
    private static final String UPDATED_GHI_CHU = "BBBBBBBBBB";

    private static final String DEFAULT_TRANG_THAI = "AAAAAAAAAA";
    private static final String UPDATED_TRANG_THAI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/nhom-lois";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NhomLoiRepository nhomLoiRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNhomLoiMockMvc;

    private NhomLoi nhomLoi;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NhomLoi createEntity(EntityManager em) {
        NhomLoi nhomLoi = new NhomLoi()
            .maNhomLoi(DEFAULT_MA_NHOM_LOI)
            .tenNhomLoi(DEFAULT_TEN_NHOM_LOI)
            .ngayTao(DEFAULT_NGAY_TAO)
            .ngayCapNhat(DEFAULT_NGAY_CAP_NHAT)
            .username(DEFAULT_USERNAME)
            .ghiChu(DEFAULT_GHI_CHU)
            .trangThai(DEFAULT_TRANG_THAI);
        return nhomLoi;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NhomLoi createUpdatedEntity(EntityManager em) {
        NhomLoi nhomLoi = new NhomLoi()
            .maNhomLoi(UPDATED_MA_NHOM_LOI)
            .tenNhomLoi(UPDATED_TEN_NHOM_LOI)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .ghiChu(UPDATED_GHI_CHU)
            .trangThai(UPDATED_TRANG_THAI);
        return nhomLoi;
    }

    @BeforeEach
    public void initTest() {
        nhomLoi = createEntity(em);
    }

    @Test
    @Transactional
    void createNhomLoi() throws Exception {
        int databaseSizeBeforeCreate = nhomLoiRepository.findAll().size();
        // Create the NhomLoi
        restNhomLoiMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomLoi))
            )
            .andExpect(status().isCreated());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeCreate + 1);
        NhomLoi testNhomLoi = nhomLoiList.get(nhomLoiList.size() - 1);
        assertThat(testNhomLoi.getMaNhomLoi()).isEqualTo(DEFAULT_MA_NHOM_LOI);
        assertThat(testNhomLoi.getTenNhomLoi()).isEqualTo(DEFAULT_TEN_NHOM_LOI);
        assertThat(testNhomLoi.getNgayTao()).isEqualTo(DEFAULT_NGAY_TAO);
        assertThat(testNhomLoi.getNgayCapNhat()).isEqualTo(DEFAULT_NGAY_CAP_NHAT);
        assertThat(testNhomLoi.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testNhomLoi.getGhiChu()).isEqualTo(DEFAULT_GHI_CHU);
        assertThat(testNhomLoi.getTrangThai()).isEqualTo(DEFAULT_TRANG_THAI);
    }

    @Test
    @Transactional
    void createNhomLoiWithExistingId() throws Exception {
        // Create the NhomLoi with an existing ID
        nhomLoi.setId(1L);

        int databaseSizeBeforeCreate = nhomLoiRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNhomLoiMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNhomLois() throws Exception {
        // Initialize the database
        nhomLoiRepository.saveAndFlush(nhomLoi);

        // Get all the nhomLoiList
        restNhomLoiMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nhomLoi.getId().intValue())))
            .andExpect(jsonPath("$.[*].maNhomLoi").value(hasItem(DEFAULT_MA_NHOM_LOI)))
            .andExpect(jsonPath("$.[*].tenNhomLoi").value(hasItem(DEFAULT_TEN_NHOM_LOI)))
            .andExpect(jsonPath("$.[*].ngayTao").value(hasItem(sameInstant(DEFAULT_NGAY_TAO))))
            .andExpect(jsonPath("$.[*].ngayCapNhat").value(hasItem(sameInstant(DEFAULT_NGAY_CAP_NHAT))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].ghiChu").value(hasItem(DEFAULT_GHI_CHU)))
            .andExpect(jsonPath("$.[*].trangThai").value(hasItem(DEFAULT_TRANG_THAI)));
    }

    @Test
    @Transactional
    void getNhomLoi() throws Exception {
        // Initialize the database
        nhomLoiRepository.saveAndFlush(nhomLoi);

        // Get the nhomLoi
        restNhomLoiMockMvc
            .perform(get(ENTITY_API_URL_ID, nhomLoi.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(nhomLoi.getId().intValue()))
            .andExpect(jsonPath("$.maNhomLoi").value(DEFAULT_MA_NHOM_LOI))
            .andExpect(jsonPath("$.tenNhomLoi").value(DEFAULT_TEN_NHOM_LOI))
            .andExpect(jsonPath("$.ngayTao").value(sameInstant(DEFAULT_NGAY_TAO)))
            .andExpect(jsonPath("$.ngayCapNhat").value(sameInstant(DEFAULT_NGAY_CAP_NHAT)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.ghiChu").value(DEFAULT_GHI_CHU))
            .andExpect(jsonPath("$.trangThai").value(DEFAULT_TRANG_THAI));
    }

    @Test
    @Transactional
    void getNonExistingNhomLoi() throws Exception {
        // Get the nhomLoi
        restNhomLoiMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewNhomLoi() throws Exception {
        // Initialize the database
        nhomLoiRepository.saveAndFlush(nhomLoi);

        int databaseSizeBeforeUpdate = nhomLoiRepository.findAll().size();

        // Update the nhomLoi
        NhomLoi updatedNhomLoi = nhomLoiRepository.findById(nhomLoi.getId()).get();
        // Disconnect from session so that the updates on updatedNhomLoi are not directly saved in db
        em.detach(updatedNhomLoi);
        updatedNhomLoi
            .maNhomLoi(UPDATED_MA_NHOM_LOI)
            .tenNhomLoi(UPDATED_TEN_NHOM_LOI)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .ghiChu(UPDATED_GHI_CHU)
            .trangThai(UPDATED_TRANG_THAI);

        restNhomLoiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNhomLoi.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNhomLoi))
            )
            .andExpect(status().isOk());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeUpdate);
        NhomLoi testNhomLoi = nhomLoiList.get(nhomLoiList.size() - 1);
        assertThat(testNhomLoi.getMaNhomLoi()).isEqualTo(UPDATED_MA_NHOM_LOI);
        assertThat(testNhomLoi.getTenNhomLoi()).isEqualTo(UPDATED_TEN_NHOM_LOI);
        assertThat(testNhomLoi.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testNhomLoi.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testNhomLoi.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNhomLoi.getGhiChu()).isEqualTo(UPDATED_GHI_CHU);
        assertThat(testNhomLoi.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void putNonExistingNhomLoi() throws Exception {
        int databaseSizeBeforeUpdate = nhomLoiRepository.findAll().size();
        nhomLoi.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNhomLoiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, nhomLoi.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNhomLoi() throws Exception {
        int databaseSizeBeforeUpdate = nhomLoiRepository.findAll().size();
        nhomLoi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomLoiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNhomLoi() throws Exception {
        int databaseSizeBeforeUpdate = nhomLoiRepository.findAll().size();
        nhomLoi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomLoiMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(nhomLoi))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNhomLoiWithPatch() throws Exception {
        // Initialize the database
        nhomLoiRepository.saveAndFlush(nhomLoi);

        int databaseSizeBeforeUpdate = nhomLoiRepository.findAll().size();

        // Update the nhomLoi using partial update
        NhomLoi partialUpdatedNhomLoi = new NhomLoi();
        partialUpdatedNhomLoi.setId(nhomLoi.getId());

        partialUpdatedNhomLoi.tenNhomLoi(UPDATED_TEN_NHOM_LOI).username(UPDATED_USERNAME);

        restNhomLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNhomLoi.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNhomLoi))
            )
            .andExpect(status().isOk());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeUpdate);
        NhomLoi testNhomLoi = nhomLoiList.get(nhomLoiList.size() - 1);
        assertThat(testNhomLoi.getMaNhomLoi()).isEqualTo(DEFAULT_MA_NHOM_LOI);
        assertThat(testNhomLoi.getTenNhomLoi()).isEqualTo(UPDATED_TEN_NHOM_LOI);
        assertThat(testNhomLoi.getNgayTao()).isEqualTo(DEFAULT_NGAY_TAO);
        assertThat(testNhomLoi.getNgayCapNhat()).isEqualTo(DEFAULT_NGAY_CAP_NHAT);
        assertThat(testNhomLoi.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNhomLoi.getGhiChu()).isEqualTo(DEFAULT_GHI_CHU);
        assertThat(testNhomLoi.getTrangThai()).isEqualTo(DEFAULT_TRANG_THAI);
    }

    @Test
    @Transactional
    void fullUpdateNhomLoiWithPatch() throws Exception {
        // Initialize the database
        nhomLoiRepository.saveAndFlush(nhomLoi);

        int databaseSizeBeforeUpdate = nhomLoiRepository.findAll().size();

        // Update the nhomLoi using partial update
        NhomLoi partialUpdatedNhomLoi = new NhomLoi();
        partialUpdatedNhomLoi.setId(nhomLoi.getId());

        partialUpdatedNhomLoi
            .maNhomLoi(UPDATED_MA_NHOM_LOI)
            .tenNhomLoi(UPDATED_TEN_NHOM_LOI)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .ghiChu(UPDATED_GHI_CHU)
            .trangThai(UPDATED_TRANG_THAI);

        restNhomLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNhomLoi.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNhomLoi))
            )
            .andExpect(status().isOk());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeUpdate);
        NhomLoi testNhomLoi = nhomLoiList.get(nhomLoiList.size() - 1);
        assertThat(testNhomLoi.getMaNhomLoi()).isEqualTo(UPDATED_MA_NHOM_LOI);
        assertThat(testNhomLoi.getTenNhomLoi()).isEqualTo(UPDATED_TEN_NHOM_LOI);
        assertThat(testNhomLoi.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testNhomLoi.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testNhomLoi.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNhomLoi.getGhiChu()).isEqualTo(UPDATED_GHI_CHU);
        assertThat(testNhomLoi.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void patchNonExistingNhomLoi() throws Exception {
        int databaseSizeBeforeUpdate = nhomLoiRepository.findAll().size();
        nhomLoi.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNhomLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, nhomLoi.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nhomLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNhomLoi() throws Exception {
        int databaseSizeBeforeUpdate = nhomLoiRepository.findAll().size();
        nhomLoi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nhomLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNhomLoi() throws Exception {
        int databaseSizeBeforeUpdate = nhomLoiRepository.findAll().size();
        nhomLoi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomLoiMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nhomLoi))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NhomLoi in the database
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNhomLoi() throws Exception {
        // Initialize the database
        nhomLoiRepository.saveAndFlush(nhomLoi);

        int databaseSizeBeforeDelete = nhomLoiRepository.findAll().size();

        // Delete the nhomLoi
        restNhomLoiMockMvc
            .perform(delete(ENTITY_API_URL_ID, nhomLoi.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NhomLoi> nhomLoiList = nhomLoiRepository.findAll();
        assertThat(nhomLoiList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
