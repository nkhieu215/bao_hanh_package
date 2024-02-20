package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TinhThanh;
import com.mycompany.myapp.repository.TinhThanhRepository;
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
 * Integration tests for the {@link TinhThanhResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TinhThanhResourceIT {

    private static final Integer DEFAULT_ID_TINH_THANH = 1;
    private static final Integer UPDATED_ID_TINH_THANH = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tinh-thanhs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TinhThanhRepository tinhThanhRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTinhThanhMockMvc;

    private TinhThanh tinhThanh;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TinhThanh createEntity(EntityManager em) {
        TinhThanh tinhThanh = new TinhThanh().idTinhThanh(DEFAULT_ID_TINH_THANH).name(DEFAULT_NAME);
        return tinhThanh;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TinhThanh createUpdatedEntity(EntityManager em) {
        TinhThanh tinhThanh = new TinhThanh().idTinhThanh(UPDATED_ID_TINH_THANH).name(UPDATED_NAME);
        return tinhThanh;
    }

    @BeforeEach
    public void initTest() {
        tinhThanh = createEntity(em);
    }

    @Test
    @Transactional
    void createTinhThanh() throws Exception {
        int databaseSizeBeforeCreate = tinhThanhRepository.findAll().size();
        // Create the TinhThanh
        restTinhThanhMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tinhThanh))
            )
            .andExpect(status().isCreated());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeCreate + 1);
        TinhThanh testTinhThanh = tinhThanhList.get(tinhThanhList.size() - 1);
        assertThat(testTinhThanh.getIdTinhThanh()).isEqualTo(DEFAULT_ID_TINH_THANH);
        assertThat(testTinhThanh.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createTinhThanhWithExistingId() throws Exception {
        // Create the TinhThanh with an existing ID
        tinhThanh.setId(1L);

        int databaseSizeBeforeCreate = tinhThanhRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTinhThanhMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tinhThanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTinhThanhs() throws Exception {
        // Initialize the database
        tinhThanhRepository.saveAndFlush(tinhThanh);

        // Get all the tinhThanhList
        restTinhThanhMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tinhThanh.getId().intValue())))
            .andExpect(jsonPath("$.[*].idTinhThanh").value(hasItem(DEFAULT_ID_TINH_THANH)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getTinhThanh() throws Exception {
        // Initialize the database
        tinhThanhRepository.saveAndFlush(tinhThanh);

        // Get the tinhThanh
        restTinhThanhMockMvc
            .perform(get(ENTITY_API_URL_ID, tinhThanh.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tinhThanh.getId().intValue()))
            .andExpect(jsonPath("$.idTinhThanh").value(DEFAULT_ID_TINH_THANH))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingTinhThanh() throws Exception {
        // Get the tinhThanh
        restTinhThanhMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTinhThanh() throws Exception {
        // Initialize the database
        tinhThanhRepository.saveAndFlush(tinhThanh);

        int databaseSizeBeforeUpdate = tinhThanhRepository.findAll().size();

        // Update the tinhThanh
        TinhThanh updatedTinhThanh = tinhThanhRepository.findById(tinhThanh.getId()).get();
        // Disconnect from session so that the updates on updatedTinhThanh are not directly saved in db
        em.detach(updatedTinhThanh);
        updatedTinhThanh.idTinhThanh(UPDATED_ID_TINH_THANH).name(UPDATED_NAME);

        restTinhThanhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTinhThanh.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTinhThanh))
            )
            .andExpect(status().isOk());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeUpdate);
        TinhThanh testTinhThanh = tinhThanhList.get(tinhThanhList.size() - 1);
        assertThat(testTinhThanh.getIdTinhThanh()).isEqualTo(UPDATED_ID_TINH_THANH);
        assertThat(testTinhThanh.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingTinhThanh() throws Exception {
        int databaseSizeBeforeUpdate = tinhThanhRepository.findAll().size();
        tinhThanh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTinhThanhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tinhThanh.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tinhThanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTinhThanh() throws Exception {
        int databaseSizeBeforeUpdate = tinhThanhRepository.findAll().size();
        tinhThanh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTinhThanhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tinhThanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTinhThanh() throws Exception {
        int databaseSizeBeforeUpdate = tinhThanhRepository.findAll().size();
        tinhThanh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTinhThanhMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tinhThanh))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTinhThanhWithPatch() throws Exception {
        // Initialize the database
        tinhThanhRepository.saveAndFlush(tinhThanh);

        int databaseSizeBeforeUpdate = tinhThanhRepository.findAll().size();

        // Update the tinhThanh using partial update
        TinhThanh partialUpdatedTinhThanh = new TinhThanh();
        partialUpdatedTinhThanh.setId(tinhThanh.getId());

        partialUpdatedTinhThanh.name(UPDATED_NAME);

        restTinhThanhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTinhThanh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTinhThanh))
            )
            .andExpect(status().isOk());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeUpdate);
        TinhThanh testTinhThanh = tinhThanhList.get(tinhThanhList.size() - 1);
        assertThat(testTinhThanh.getIdTinhThanh()).isEqualTo(DEFAULT_ID_TINH_THANH);
        assertThat(testTinhThanh.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateTinhThanhWithPatch() throws Exception {
        // Initialize the database
        tinhThanhRepository.saveAndFlush(tinhThanh);

        int databaseSizeBeforeUpdate = tinhThanhRepository.findAll().size();

        // Update the tinhThanh using partial update
        TinhThanh partialUpdatedTinhThanh = new TinhThanh();
        partialUpdatedTinhThanh.setId(tinhThanh.getId());

        partialUpdatedTinhThanh.idTinhThanh(UPDATED_ID_TINH_THANH).name(UPDATED_NAME);

        restTinhThanhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTinhThanh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTinhThanh))
            )
            .andExpect(status().isOk());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeUpdate);
        TinhThanh testTinhThanh = tinhThanhList.get(tinhThanhList.size() - 1);
        assertThat(testTinhThanh.getIdTinhThanh()).isEqualTo(UPDATED_ID_TINH_THANH);
        assertThat(testTinhThanh.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingTinhThanh() throws Exception {
        int databaseSizeBeforeUpdate = tinhThanhRepository.findAll().size();
        tinhThanh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTinhThanhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tinhThanh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tinhThanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTinhThanh() throws Exception {
        int databaseSizeBeforeUpdate = tinhThanhRepository.findAll().size();
        tinhThanh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTinhThanhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tinhThanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTinhThanh() throws Exception {
        int databaseSizeBeforeUpdate = tinhThanhRepository.findAll().size();
        tinhThanh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTinhThanhMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tinhThanh))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TinhThanh in the database
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTinhThanh() throws Exception {
        // Initialize the database
        tinhThanhRepository.saveAndFlush(tinhThanh);

        int databaseSizeBeforeDelete = tinhThanhRepository.findAll().size();

        // Delete the tinhThanh
        restTinhThanhMockMvc
            .perform(delete(ENTITY_API_URL_ID, tinhThanh.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TinhThanh> tinhThanhList = tinhThanhRepository.findAll();
        assertThat(tinhThanhList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
