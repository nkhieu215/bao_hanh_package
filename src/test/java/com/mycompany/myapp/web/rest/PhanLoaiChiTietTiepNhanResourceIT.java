package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.PhanLoaiChiTietTiepNhan;
import com.mycompany.myapp.repository.PhanLoaiChiTietTiepNhanRepository;
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
 * Integration tests for the {@link PhanLoaiChiTietTiepNhanResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PhanLoaiChiTietTiepNhanResourceIT {

    private static final Integer DEFAULT_SO_LUONG = 1;
    private static final Integer UPDATED_SO_LUONG = 2;

    private static final String ENTITY_API_URL = "/api/phan-loai-chi-tiet-tiep-nhans";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PhanLoaiChiTietTiepNhanRepository phanLoaiChiTietTiepNhanRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPhanLoaiChiTietTiepNhanMockMvc;

    private PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PhanLoaiChiTietTiepNhan createEntity(EntityManager em) {
        PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan = new PhanLoaiChiTietTiepNhan().soLuong(DEFAULT_SO_LUONG);
        return phanLoaiChiTietTiepNhan;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PhanLoaiChiTietTiepNhan createUpdatedEntity(EntityManager em) {
        PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan = new PhanLoaiChiTietTiepNhan().soLuong(UPDATED_SO_LUONG);
        return phanLoaiChiTietTiepNhan;
    }

    @BeforeEach
    public void initTest() {
        phanLoaiChiTietTiepNhan = createEntity(em);
    }

    @Test
    @Transactional
    void createPhanLoaiChiTietTiepNhan() throws Exception {
        int databaseSizeBeforeCreate = phanLoaiChiTietTiepNhanRepository.findAll().size();
        // Create the PhanLoaiChiTietTiepNhan
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isCreated());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeCreate + 1);
        PhanLoaiChiTietTiepNhan testPhanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhanList.get(phanLoaiChiTietTiepNhanList.size() - 1);
        assertThat(testPhanLoaiChiTietTiepNhan.getSoLuong()).isEqualTo(DEFAULT_SO_LUONG);
    }

    @Test
    @Transactional
    void createPhanLoaiChiTietTiepNhanWithExistingId() throws Exception {
        // Create the PhanLoaiChiTietTiepNhan with an existing ID
        phanLoaiChiTietTiepNhan.setId(1L);

        int databaseSizeBeforeCreate = phanLoaiChiTietTiepNhanRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPhanLoaiChiTietTiepNhans() throws Exception {
        // Initialize the database
        phanLoaiChiTietTiepNhanRepository.saveAndFlush(phanLoaiChiTietTiepNhan);

        // Get all the phanLoaiChiTietTiepNhanList
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(phanLoaiChiTietTiepNhan.getId().intValue())))
            .andExpect(jsonPath("$.[*].soLuong").value(hasItem(DEFAULT_SO_LUONG)));
    }

    @Test
    @Transactional
    void getPhanLoaiChiTietTiepNhan() throws Exception {
        // Initialize the database
        phanLoaiChiTietTiepNhanRepository.saveAndFlush(phanLoaiChiTietTiepNhan);

        // Get the phanLoaiChiTietTiepNhan
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(get(ENTITY_API_URL_ID, phanLoaiChiTietTiepNhan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(phanLoaiChiTietTiepNhan.getId().intValue()))
            .andExpect(jsonPath("$.soLuong").value(DEFAULT_SO_LUONG));
    }

    @Test
    @Transactional
    void getNonExistingPhanLoaiChiTietTiepNhan() throws Exception {
        // Get the phanLoaiChiTietTiepNhan
        restPhanLoaiChiTietTiepNhanMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPhanLoaiChiTietTiepNhan() throws Exception {
        // Initialize the database
        phanLoaiChiTietTiepNhanRepository.saveAndFlush(phanLoaiChiTietTiepNhan);

        int databaseSizeBeforeUpdate = phanLoaiChiTietTiepNhanRepository.findAll().size();

        // Update the phanLoaiChiTietTiepNhan
        PhanLoaiChiTietTiepNhan updatedPhanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhanRepository
            .findById(phanLoaiChiTietTiepNhan.getId())
            .get();
        // Disconnect from session so that the updates on updatedPhanLoaiChiTietTiepNhan are not directly saved in db
        em.detach(updatedPhanLoaiChiTietTiepNhan);
        updatedPhanLoaiChiTietTiepNhan.soLuong(UPDATED_SO_LUONG);

        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPhanLoaiChiTietTiepNhan.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPhanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isOk());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeUpdate);
        PhanLoaiChiTietTiepNhan testPhanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhanList.get(phanLoaiChiTietTiepNhanList.size() - 1);
        assertThat(testPhanLoaiChiTietTiepNhan.getSoLuong()).isEqualTo(UPDATED_SO_LUONG);
    }

    @Test
    @Transactional
    void putNonExistingPhanLoaiChiTietTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = phanLoaiChiTietTiepNhanRepository.findAll().size();
        phanLoaiChiTietTiepNhan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, phanLoaiChiTietTiepNhan.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPhanLoaiChiTietTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = phanLoaiChiTietTiepNhanRepository.findAll().size();
        phanLoaiChiTietTiepNhan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPhanLoaiChiTietTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = phanLoaiChiTietTiepNhanRepository.findAll().size();
        phanLoaiChiTietTiepNhan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePhanLoaiChiTietTiepNhanWithPatch() throws Exception {
        // Initialize the database
        phanLoaiChiTietTiepNhanRepository.saveAndFlush(phanLoaiChiTietTiepNhan);

        int databaseSizeBeforeUpdate = phanLoaiChiTietTiepNhanRepository.findAll().size();

        // Update the phanLoaiChiTietTiepNhan using partial update
        PhanLoaiChiTietTiepNhan partialUpdatedPhanLoaiChiTietTiepNhan = new PhanLoaiChiTietTiepNhan();
        partialUpdatedPhanLoaiChiTietTiepNhan.setId(phanLoaiChiTietTiepNhan.getId());

        partialUpdatedPhanLoaiChiTietTiepNhan.soLuong(UPDATED_SO_LUONG);

        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhanLoaiChiTietTiepNhan.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isOk());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeUpdate);
        PhanLoaiChiTietTiepNhan testPhanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhanList.get(phanLoaiChiTietTiepNhanList.size() - 1);
        assertThat(testPhanLoaiChiTietTiepNhan.getSoLuong()).isEqualTo(UPDATED_SO_LUONG);
    }

    @Test
    @Transactional
    void fullUpdatePhanLoaiChiTietTiepNhanWithPatch() throws Exception {
        // Initialize the database
        phanLoaiChiTietTiepNhanRepository.saveAndFlush(phanLoaiChiTietTiepNhan);

        int databaseSizeBeforeUpdate = phanLoaiChiTietTiepNhanRepository.findAll().size();

        // Update the phanLoaiChiTietTiepNhan using partial update
        PhanLoaiChiTietTiepNhan partialUpdatedPhanLoaiChiTietTiepNhan = new PhanLoaiChiTietTiepNhan();
        partialUpdatedPhanLoaiChiTietTiepNhan.setId(phanLoaiChiTietTiepNhan.getId());

        partialUpdatedPhanLoaiChiTietTiepNhan.soLuong(UPDATED_SO_LUONG);

        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhanLoaiChiTietTiepNhan.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isOk());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeUpdate);
        PhanLoaiChiTietTiepNhan testPhanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhanList.get(phanLoaiChiTietTiepNhanList.size() - 1);
        assertThat(testPhanLoaiChiTietTiepNhan.getSoLuong()).isEqualTo(UPDATED_SO_LUONG);
    }

    @Test
    @Transactional
    void patchNonExistingPhanLoaiChiTietTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = phanLoaiChiTietTiepNhanRepository.findAll().size();
        phanLoaiChiTietTiepNhan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, phanLoaiChiTietTiepNhan.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPhanLoaiChiTietTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = phanLoaiChiTietTiepNhanRepository.findAll().size();
        phanLoaiChiTietTiepNhan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPhanLoaiChiTietTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = phanLoaiChiTietTiepNhanRepository.findAll().size();
        phanLoaiChiTietTiepNhan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phanLoaiChiTietTiepNhan))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PhanLoaiChiTietTiepNhan in the database
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePhanLoaiChiTietTiepNhan() throws Exception {
        // Initialize the database
        phanLoaiChiTietTiepNhanRepository.saveAndFlush(phanLoaiChiTietTiepNhan);

        int databaseSizeBeforeDelete = phanLoaiChiTietTiepNhanRepository.findAll().size();

        // Delete the phanLoaiChiTietTiepNhan
        restPhanLoaiChiTietTiepNhanMockMvc
            .perform(delete(ENTITY_API_URL_ID, phanLoaiChiTietTiepNhan.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhanList = phanLoaiChiTietTiepNhanRepository.findAll();
        assertThat(phanLoaiChiTietTiepNhanList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
