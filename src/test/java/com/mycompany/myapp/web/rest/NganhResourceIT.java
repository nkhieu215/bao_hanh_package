package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Nganh;
import com.mycompany.myapp.repository.NganhRepository;
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
 * Integration tests for the {@link NganhResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NganhResourceIT {

    private static final String DEFAULT_MA_NGANH = "AAAAAAAAAA";
    private static final String UPDATED_MA_NGANH = "BBBBBBBBBB";

    private static final String DEFAULT_TEN_NGANH = "AAAAAAAAAA";
    private static final String UPDATED_TEN_NGANH = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NGAY_TAO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_TAO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/nganhs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NganhRepository nganhRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNganhMockMvc;

    private Nganh nganh;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Nganh createEntity(EntityManager em) {
        Nganh nganh = new Nganh()
            .maNganh(DEFAULT_MA_NGANH)
            .tenNganh(DEFAULT_TEN_NGANH)
            .ngayTao(DEFAULT_NGAY_TAO)
            .username(DEFAULT_USERNAME);
        return nganh;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Nganh createUpdatedEntity(EntityManager em) {
        Nganh nganh = new Nganh()
            .maNganh(UPDATED_MA_NGANH)
            .tenNganh(UPDATED_TEN_NGANH)
            .ngayTao(UPDATED_NGAY_TAO)
            .username(UPDATED_USERNAME);
        return nganh;
    }

    @BeforeEach
    public void initTest() {
        nganh = createEntity(em);
    }

    @Test
    @Transactional
    void createNganh() throws Exception {
        int databaseSizeBeforeCreate = nganhRepository.findAll().size();
        // Create the Nganh
        restNganhMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(nganh))
            )
            .andExpect(status().isCreated());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeCreate + 1);
        Nganh testNganh = nganhList.get(nganhList.size() - 1);
        assertThat(testNganh.getMaNganh()).isEqualTo(DEFAULT_MA_NGANH);
        assertThat(testNganh.getTenNganh()).isEqualTo(DEFAULT_TEN_NGANH);
        assertThat(testNganh.getNgayTao()).isEqualTo(DEFAULT_NGAY_TAO);
        assertThat(testNganh.getUsername()).isEqualTo(DEFAULT_USERNAME);
    }

    @Test
    @Transactional
    void createNganhWithExistingId() throws Exception {
        // Create the Nganh with an existing ID
        nganh.setId(1L);

        int databaseSizeBeforeCreate = nganhRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNganhMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(nganh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNganhs() throws Exception {
        // Initialize the database
        nganhRepository.saveAndFlush(nganh);

        // Get all the nganhList
        restNganhMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nganh.getId().intValue())))
            .andExpect(jsonPath("$.[*].maNganh").value(hasItem(DEFAULT_MA_NGANH)))
            .andExpect(jsonPath("$.[*].tenNganh").value(hasItem(DEFAULT_TEN_NGANH)))
            .andExpect(jsonPath("$.[*].ngayTao").value(hasItem(sameInstant(DEFAULT_NGAY_TAO))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)));
    }

    @Test
    @Transactional
    void getNganh() throws Exception {
        // Initialize the database
        nganhRepository.saveAndFlush(nganh);

        // Get the nganh
        restNganhMockMvc
            .perform(get(ENTITY_API_URL_ID, nganh.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(nganh.getId().intValue()))
            .andExpect(jsonPath("$.maNganh").value(DEFAULT_MA_NGANH))
            .andExpect(jsonPath("$.tenNganh").value(DEFAULT_TEN_NGANH))
            .andExpect(jsonPath("$.ngayTao").value(sameInstant(DEFAULT_NGAY_TAO)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME));
    }

    @Test
    @Transactional
    void getNonExistingNganh() throws Exception {
        // Get the nganh
        restNganhMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewNganh() throws Exception {
        // Initialize the database
        nganhRepository.saveAndFlush(nganh);

        int databaseSizeBeforeUpdate = nganhRepository.findAll().size();

        // Update the nganh
        Nganh updatedNganh = nganhRepository.findById(nganh.getId()).get();
        // Disconnect from session so that the updates on updatedNganh are not directly saved in db
        em.detach(updatedNganh);
        updatedNganh.maNganh(UPDATED_MA_NGANH).tenNganh(UPDATED_TEN_NGANH).ngayTao(UPDATED_NGAY_TAO).username(UPDATED_USERNAME);

        restNganhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNganh.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNganh))
            )
            .andExpect(status().isOk());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeUpdate);
        Nganh testNganh = nganhList.get(nganhList.size() - 1);
        assertThat(testNganh.getMaNganh()).isEqualTo(UPDATED_MA_NGANH);
        assertThat(testNganh.getTenNganh()).isEqualTo(UPDATED_TEN_NGANH);
        assertThat(testNganh.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testNganh.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void putNonExistingNganh() throws Exception {
        int databaseSizeBeforeUpdate = nganhRepository.findAll().size();
        nganh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNganhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, nganh.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nganh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNganh() throws Exception {
        int databaseSizeBeforeUpdate = nganhRepository.findAll().size();
        nganh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNganhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nganh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNganh() throws Exception {
        int databaseSizeBeforeUpdate = nganhRepository.findAll().size();
        nganh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNganhMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(nganh))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNganhWithPatch() throws Exception {
        // Initialize the database
        nganhRepository.saveAndFlush(nganh);

        int databaseSizeBeforeUpdate = nganhRepository.findAll().size();

        // Update the nganh using partial update
        Nganh partialUpdatedNganh = new Nganh();
        partialUpdatedNganh.setId(nganh.getId());

        partialUpdatedNganh.maNganh(UPDATED_MA_NGANH).ngayTao(UPDATED_NGAY_TAO).username(UPDATED_USERNAME);

        restNganhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNganh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNganh))
            )
            .andExpect(status().isOk());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeUpdate);
        Nganh testNganh = nganhList.get(nganhList.size() - 1);
        assertThat(testNganh.getMaNganh()).isEqualTo(UPDATED_MA_NGANH);
        assertThat(testNganh.getTenNganh()).isEqualTo(DEFAULT_TEN_NGANH);
        assertThat(testNganh.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testNganh.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void fullUpdateNganhWithPatch() throws Exception {
        // Initialize the database
        nganhRepository.saveAndFlush(nganh);

        int databaseSizeBeforeUpdate = nganhRepository.findAll().size();

        // Update the nganh using partial update
        Nganh partialUpdatedNganh = new Nganh();
        partialUpdatedNganh.setId(nganh.getId());

        partialUpdatedNganh.maNganh(UPDATED_MA_NGANH).tenNganh(UPDATED_TEN_NGANH).ngayTao(UPDATED_NGAY_TAO).username(UPDATED_USERNAME);

        restNganhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNganh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNganh))
            )
            .andExpect(status().isOk());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeUpdate);
        Nganh testNganh = nganhList.get(nganhList.size() - 1);
        assertThat(testNganh.getMaNganh()).isEqualTo(UPDATED_MA_NGANH);
        assertThat(testNganh.getTenNganh()).isEqualTo(UPDATED_TEN_NGANH);
        assertThat(testNganh.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testNganh.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void patchNonExistingNganh() throws Exception {
        int databaseSizeBeforeUpdate = nganhRepository.findAll().size();
        nganh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNganhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, nganh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nganh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNganh() throws Exception {
        int databaseSizeBeforeUpdate = nganhRepository.findAll().size();
        nganh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNganhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nganh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNganh() throws Exception {
        int databaseSizeBeforeUpdate = nganhRepository.findAll().size();
        nganh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNganhMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nganh))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Nganh in the database
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNganh() throws Exception {
        // Initialize the database
        nganhRepository.saveAndFlush(nganh);

        int databaseSizeBeforeDelete = nganhRepository.findAll().size();

        // Delete the nganh
        restNganhMockMvc
            .perform(delete(ENTITY_API_URL_ID, nganh.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Nganh> nganhList = nganhRepository.findAll();
        assertThat(nganhList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
