package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.PhanTichLoi;
import com.mycompany.myapp.repository.PhanTichLoiRepository;
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
 * Integration tests for the {@link PhanTichLoiResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PhanTichLoiResourceIT {

    private static final Integer DEFAULT_SO_LUONG = 1;
    private static final Integer UPDATED_SO_LUONG = 2;

    private static final ZonedDateTime DEFAULT_NGAY_PHAN_TICH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_PHAN_TICH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_GHI_CHU = "AAAAAAAAAA";
    private static final String UPDATED_GHI_CHU = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/phan-tich-lois";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PhanTichLoiRepository phanTichLoiRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPhanTichLoiMockMvc;

    private PhanTichLoi phanTichLoi;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PhanTichLoi createEntity(EntityManager em) {
        PhanTichLoi phanTichLoi = new PhanTichLoi()
            .soLuong(DEFAULT_SO_LUONG)
            .ngayPhanTich(DEFAULT_NGAY_PHAN_TICH)
            .username(DEFAULT_USERNAME)
            .ghiChu(DEFAULT_GHI_CHU);
        return phanTichLoi;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PhanTichLoi createUpdatedEntity(EntityManager em) {
        PhanTichLoi phanTichLoi = new PhanTichLoi()
            .soLuong(UPDATED_SO_LUONG)
            .ngayPhanTich(UPDATED_NGAY_PHAN_TICH)
            .username(UPDATED_USERNAME)
            .ghiChu(UPDATED_GHI_CHU);
        return phanTichLoi;
    }

    @BeforeEach
    public void initTest() {
        phanTichLoi = createEntity(em);
    }

    @Test
    @Transactional
    void createPhanTichLoi() throws Exception {
        int databaseSizeBeforeCreate = phanTichLoiRepository.findAll().size();
        // Create the PhanTichLoi
        restPhanTichLoiMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichLoi))
            )
            .andExpect(status().isCreated());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeCreate + 1);
        PhanTichLoi testPhanTichLoi = phanTichLoiList.get(phanTichLoiList.size() - 1);
        assertThat(testPhanTichLoi.getSoLuong()).isEqualTo(DEFAULT_SO_LUONG);
        assertThat(testPhanTichLoi.getNgayPhanTich()).isEqualTo(DEFAULT_NGAY_PHAN_TICH);
        assertThat(testPhanTichLoi.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testPhanTichLoi.getGhiChu()).isEqualTo(DEFAULT_GHI_CHU);
    }

    @Test
    @Transactional
    void createPhanTichLoiWithExistingId() throws Exception {
        // Create the PhanTichLoi with an existing ID
        phanTichLoi.setId(1L);

        int databaseSizeBeforeCreate = phanTichLoiRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPhanTichLoiMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPhanTichLois() throws Exception {
        // Initialize the database
        phanTichLoiRepository.saveAndFlush(phanTichLoi);

        // Get all the phanTichLoiList
        restPhanTichLoiMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(phanTichLoi.getId().intValue())))
            .andExpect(jsonPath("$.[*].soLuong").value(hasItem(DEFAULT_SO_LUONG)))
            .andExpect(jsonPath("$.[*].ngayPhanTich").value(hasItem(sameInstant(DEFAULT_NGAY_PHAN_TICH))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].ghiChu").value(hasItem(DEFAULT_GHI_CHU)));
    }

    @Test
    @Transactional
    void getPhanTichLoi() throws Exception {
        // Initialize the database
        phanTichLoiRepository.saveAndFlush(phanTichLoi);

        // Get the phanTichLoi
        restPhanTichLoiMockMvc
            .perform(get(ENTITY_API_URL_ID, phanTichLoi.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(phanTichLoi.getId().intValue()))
            .andExpect(jsonPath("$.soLuong").value(DEFAULT_SO_LUONG))
            .andExpect(jsonPath("$.ngayPhanTich").value(sameInstant(DEFAULT_NGAY_PHAN_TICH)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.ghiChu").value(DEFAULT_GHI_CHU));
    }

    @Test
    @Transactional
    void getNonExistingPhanTichLoi() throws Exception {
        // Get the phanTichLoi
        restPhanTichLoiMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPhanTichLoi() throws Exception {
        // Initialize the database
        phanTichLoiRepository.saveAndFlush(phanTichLoi);

        int databaseSizeBeforeUpdate = phanTichLoiRepository.findAll().size();

        // Update the phanTichLoi
        PhanTichLoi updatedPhanTichLoi = phanTichLoiRepository.findById(phanTichLoi.getId()).get();
        // Disconnect from session so that the updates on updatedPhanTichLoi are not directly saved in db
        em.detach(updatedPhanTichLoi);
        updatedPhanTichLoi
            .soLuong(UPDATED_SO_LUONG)
            .ngayPhanTich(UPDATED_NGAY_PHAN_TICH)
            .username(UPDATED_USERNAME)
            .ghiChu(UPDATED_GHI_CHU);

        restPhanTichLoiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPhanTichLoi.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPhanTichLoi))
            )
            .andExpect(status().isOk());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeUpdate);
        PhanTichLoi testPhanTichLoi = phanTichLoiList.get(phanTichLoiList.size() - 1);
        assertThat(testPhanTichLoi.getSoLuong()).isEqualTo(UPDATED_SO_LUONG);
        assertThat(testPhanTichLoi.getNgayPhanTich()).isEqualTo(UPDATED_NGAY_PHAN_TICH);
        assertThat(testPhanTichLoi.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testPhanTichLoi.getGhiChu()).isEqualTo(UPDATED_GHI_CHU);
    }

    @Test
    @Transactional
    void putNonExistingPhanTichLoi() throws Exception {
        int databaseSizeBeforeUpdate = phanTichLoiRepository.findAll().size();
        phanTichLoi.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhanTichLoiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, phanTichLoi.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPhanTichLoi() throws Exception {
        int databaseSizeBeforeUpdate = phanTichLoiRepository.findAll().size();
        phanTichLoi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanTichLoiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPhanTichLoi() throws Exception {
        int databaseSizeBeforeUpdate = phanTichLoiRepository.findAll().size();
        phanTichLoi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanTichLoiMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichLoi))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePhanTichLoiWithPatch() throws Exception {
        // Initialize the database
        phanTichLoiRepository.saveAndFlush(phanTichLoi);

        int databaseSizeBeforeUpdate = phanTichLoiRepository.findAll().size();

        // Update the phanTichLoi using partial update
        PhanTichLoi partialUpdatedPhanTichLoi = new PhanTichLoi();
        partialUpdatedPhanTichLoi.setId(phanTichLoi.getId());

        restPhanTichLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhanTichLoi.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhanTichLoi))
            )
            .andExpect(status().isOk());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeUpdate);
        PhanTichLoi testPhanTichLoi = phanTichLoiList.get(phanTichLoiList.size() - 1);
        assertThat(testPhanTichLoi.getSoLuong()).isEqualTo(DEFAULT_SO_LUONG);
        assertThat(testPhanTichLoi.getNgayPhanTich()).isEqualTo(DEFAULT_NGAY_PHAN_TICH);
        assertThat(testPhanTichLoi.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testPhanTichLoi.getGhiChu()).isEqualTo(DEFAULT_GHI_CHU);
    }

    @Test
    @Transactional
    void fullUpdatePhanTichLoiWithPatch() throws Exception {
        // Initialize the database
        phanTichLoiRepository.saveAndFlush(phanTichLoi);

        int databaseSizeBeforeUpdate = phanTichLoiRepository.findAll().size();

        // Update the phanTichLoi using partial update
        PhanTichLoi partialUpdatedPhanTichLoi = new PhanTichLoi();
        partialUpdatedPhanTichLoi.setId(phanTichLoi.getId());

        partialUpdatedPhanTichLoi
            .soLuong(UPDATED_SO_LUONG)
            .ngayPhanTich(UPDATED_NGAY_PHAN_TICH)
            .username(UPDATED_USERNAME)
            .ghiChu(UPDATED_GHI_CHU);

        restPhanTichLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhanTichLoi.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhanTichLoi))
            )
            .andExpect(status().isOk());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeUpdate);
        PhanTichLoi testPhanTichLoi = phanTichLoiList.get(phanTichLoiList.size() - 1);
        assertThat(testPhanTichLoi.getSoLuong()).isEqualTo(UPDATED_SO_LUONG);
        assertThat(testPhanTichLoi.getNgayPhanTich()).isEqualTo(UPDATED_NGAY_PHAN_TICH);
        assertThat(testPhanTichLoi.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testPhanTichLoi.getGhiChu()).isEqualTo(UPDATED_GHI_CHU);
    }

    @Test
    @Transactional
    void patchNonExistingPhanTichLoi() throws Exception {
        int databaseSizeBeforeUpdate = phanTichLoiRepository.findAll().size();
        phanTichLoi.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhanTichLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, phanTichLoi.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phanTichLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPhanTichLoi() throws Exception {
        int databaseSizeBeforeUpdate = phanTichLoiRepository.findAll().size();
        phanTichLoi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanTichLoiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phanTichLoi))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPhanTichLoi() throws Exception {
        int databaseSizeBeforeUpdate = phanTichLoiRepository.findAll().size();
        phanTichLoi.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanTichLoiMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phanTichLoi))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PhanTichLoi in the database
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePhanTichLoi() throws Exception {
        // Initialize the database
        phanTichLoiRepository.saveAndFlush(phanTichLoi);

        int databaseSizeBeforeDelete = phanTichLoiRepository.findAll().size();

        // Delete the phanTichLoi
        restPhanTichLoiMockMvc
            .perform(delete(ENTITY_API_URL_ID, phanTichLoi.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PhanTichLoi> phanTichLoiList = phanTichLoiRepository.findAll();
        assertThat(phanTichLoiList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
