package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Kho;
import com.mycompany.myapp.repository.KhoRepository;
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
 * Integration tests for the {@link KhoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KhoResourceIT {

    private static final String DEFAULT_MA_KHO = "AAAAAAAAAA";
    private static final String UPDATED_MA_KHO = "BBBBBBBBBB";

    private static final String DEFAULT_TEN_KHO = "AAAAAAAAAA";
    private static final String UPDATED_TEN_KHO = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NGAY_TAO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_TAO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/khos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KhoRepository khoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKhoMockMvc;

    private Kho kho;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Kho createEntity(EntityManager em) {
        Kho kho = new Kho().maKho(DEFAULT_MA_KHO).tenKho(DEFAULT_TEN_KHO).ngayTao(DEFAULT_NGAY_TAO).username(DEFAULT_USERNAME);
        return kho;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Kho createUpdatedEntity(EntityManager em) {
        Kho kho = new Kho().maKho(UPDATED_MA_KHO).tenKho(UPDATED_TEN_KHO).ngayTao(UPDATED_NGAY_TAO).username(UPDATED_USERNAME);
        return kho;
    }

    @BeforeEach
    public void initTest() {
        kho = createEntity(em);
    }

    @Test
    @Transactional
    void createKho() throws Exception {
        int databaseSizeBeforeCreate = khoRepository.findAll().size();
        // Create the Kho
        restKhoMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kho))
            )
            .andExpect(status().isCreated());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeCreate + 1);
        Kho testKho = khoList.get(khoList.size() - 1);
        assertThat(testKho.getMaKho()).isEqualTo(DEFAULT_MA_KHO);
        assertThat(testKho.getTenKho()).isEqualTo(DEFAULT_TEN_KHO);
        assertThat(testKho.getNgayTao()).isEqualTo(DEFAULT_NGAY_TAO);
        assertThat(testKho.getUsername()).isEqualTo(DEFAULT_USERNAME);
    }

    @Test
    @Transactional
    void createKhoWithExistingId() throws Exception {
        // Create the Kho with an existing ID
        kho.setId(1L);

        int databaseSizeBeforeCreate = khoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKhoMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kho))
            )
            .andExpect(status().isBadRequest());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKhos() throws Exception {
        // Initialize the database
        khoRepository.saveAndFlush(kho);

        // Get all the khoList
        restKhoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kho.getId().intValue())))
            .andExpect(jsonPath("$.[*].maKho").value(hasItem(DEFAULT_MA_KHO)))
            .andExpect(jsonPath("$.[*].tenKho").value(hasItem(DEFAULT_TEN_KHO)))
            .andExpect(jsonPath("$.[*].ngayTao").value(hasItem(sameInstant(DEFAULT_NGAY_TAO))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)));
    }

    @Test
    @Transactional
    void getKho() throws Exception {
        // Initialize the database
        khoRepository.saveAndFlush(kho);

        // Get the kho
        restKhoMockMvc
            .perform(get(ENTITY_API_URL_ID, kho.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kho.getId().intValue()))
            .andExpect(jsonPath("$.maKho").value(DEFAULT_MA_KHO))
            .andExpect(jsonPath("$.tenKho").value(DEFAULT_TEN_KHO))
            .andExpect(jsonPath("$.ngayTao").value(sameInstant(DEFAULT_NGAY_TAO)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME));
    }

    @Test
    @Transactional
    void getNonExistingKho() throws Exception {
        // Get the kho
        restKhoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewKho() throws Exception {
        // Initialize the database
        khoRepository.saveAndFlush(kho);

        int databaseSizeBeforeUpdate = khoRepository.findAll().size();

        // Update the kho
        Kho updatedKho = khoRepository.findById(kho.getId()).get();
        // Disconnect from session so that the updates on updatedKho are not directly saved in db
        em.detach(updatedKho);
        updatedKho.maKho(UPDATED_MA_KHO).tenKho(UPDATED_TEN_KHO).ngayTao(UPDATED_NGAY_TAO).username(UPDATED_USERNAME);

        restKhoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKho.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKho))
            )
            .andExpect(status().isOk());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeUpdate);
        Kho testKho = khoList.get(khoList.size() - 1);
        assertThat(testKho.getMaKho()).isEqualTo(UPDATED_MA_KHO);
        assertThat(testKho.getTenKho()).isEqualTo(UPDATED_TEN_KHO);
        assertThat(testKho.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testKho.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void putNonExistingKho() throws Exception {
        int databaseSizeBeforeUpdate = khoRepository.findAll().size();
        kho.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKhoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, kho.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kho))
            )
            .andExpect(status().isBadRequest());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKho() throws Exception {
        int databaseSizeBeforeUpdate = khoRepository.findAll().size();
        kho.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKhoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kho))
            )
            .andExpect(status().isBadRequest());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKho() throws Exception {
        int databaseSizeBeforeUpdate = khoRepository.findAll().size();
        kho.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKhoMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kho))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKhoWithPatch() throws Exception {
        // Initialize the database
        khoRepository.saveAndFlush(kho);

        int databaseSizeBeforeUpdate = khoRepository.findAll().size();

        // Update the kho using partial update
        Kho partialUpdatedKho = new Kho();
        partialUpdatedKho.setId(kho.getId());

        partialUpdatedKho.tenKho(UPDATED_TEN_KHO).ngayTao(UPDATED_NGAY_TAO);

        restKhoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKho.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKho))
            )
            .andExpect(status().isOk());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeUpdate);
        Kho testKho = khoList.get(khoList.size() - 1);
        assertThat(testKho.getMaKho()).isEqualTo(DEFAULT_MA_KHO);
        assertThat(testKho.getTenKho()).isEqualTo(UPDATED_TEN_KHO);
        assertThat(testKho.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testKho.getUsername()).isEqualTo(DEFAULT_USERNAME);
    }

    @Test
    @Transactional
    void fullUpdateKhoWithPatch() throws Exception {
        // Initialize the database
        khoRepository.saveAndFlush(kho);

        int databaseSizeBeforeUpdate = khoRepository.findAll().size();

        // Update the kho using partial update
        Kho partialUpdatedKho = new Kho();
        partialUpdatedKho.setId(kho.getId());

        partialUpdatedKho.maKho(UPDATED_MA_KHO).tenKho(UPDATED_TEN_KHO).ngayTao(UPDATED_NGAY_TAO).username(UPDATED_USERNAME);

        restKhoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKho.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKho))
            )
            .andExpect(status().isOk());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeUpdate);
        Kho testKho = khoList.get(khoList.size() - 1);
        assertThat(testKho.getMaKho()).isEqualTo(UPDATED_MA_KHO);
        assertThat(testKho.getTenKho()).isEqualTo(UPDATED_TEN_KHO);
        assertThat(testKho.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testKho.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void patchNonExistingKho() throws Exception {
        int databaseSizeBeforeUpdate = khoRepository.findAll().size();
        kho.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKhoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, kho.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kho))
            )
            .andExpect(status().isBadRequest());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKho() throws Exception {
        int databaseSizeBeforeUpdate = khoRepository.findAll().size();
        kho.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKhoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kho))
            )
            .andExpect(status().isBadRequest());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKho() throws Exception {
        int databaseSizeBeforeUpdate = khoRepository.findAll().size();
        kho.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKhoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kho))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Kho in the database
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKho() throws Exception {
        // Initialize the database
        khoRepository.saveAndFlush(kho);

        int databaseSizeBeforeDelete = khoRepository.findAll().size();

        // Delete the kho
        restKhoMockMvc
            .perform(delete(ENTITY_API_URL_ID, kho.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Kho> khoList = khoRepository.findAll();
        assertThat(khoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
