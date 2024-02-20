package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.NhomSanPham;
import com.mycompany.myapp.repository.NhomSanPhamRepository;
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
 * Integration tests for the {@link NhomSanPhamResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NhomSanPhamResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TIME_CREATE = "AAAAAAAAAA";
    private static final String UPDATED_TIME_CREATE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TIME_UPDATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_UPDATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_TRANG_THAI = "AAAAAAAAAA";
    private static final String UPDATED_TRANG_THAI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/nhom-san-phams";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NhomSanPhamRepository nhomSanPhamRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNhomSanPhamMockMvc;

    private NhomSanPham nhomSanPham;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NhomSanPham createEntity(EntityManager em) {
        NhomSanPham nhomSanPham = new NhomSanPham()
            .name(DEFAULT_NAME)
            .timeCreate(DEFAULT_TIME_CREATE)
            .timeUpdate(DEFAULT_TIME_UPDATE)
            .username(DEFAULT_USERNAME)
            .trangThai(DEFAULT_TRANG_THAI);
        return nhomSanPham;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NhomSanPham createUpdatedEntity(EntityManager em) {
        NhomSanPham nhomSanPham = new NhomSanPham()
            .name(UPDATED_NAME)
            .timeCreate(UPDATED_TIME_CREATE)
            .timeUpdate(UPDATED_TIME_UPDATE)
            .username(UPDATED_USERNAME)
            .trangThai(UPDATED_TRANG_THAI);
        return nhomSanPham;
    }

    @BeforeEach
    public void initTest() {
        nhomSanPham = createEntity(em);
    }

    @Test
    @Transactional
    void createNhomSanPham() throws Exception {
        int databaseSizeBeforeCreate = nhomSanPhamRepository.findAll().size();
        // Create the NhomSanPham
        restNhomSanPhamMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomSanPham))
            )
            .andExpect(status().isCreated());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeCreate + 1);
        NhomSanPham testNhomSanPham = nhomSanPhamList.get(nhomSanPhamList.size() - 1);
        assertThat(testNhomSanPham.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testNhomSanPham.getTimeCreate()).isEqualTo(DEFAULT_TIME_CREATE);
        assertThat(testNhomSanPham.getTimeUpdate()).isEqualTo(DEFAULT_TIME_UPDATE);
        assertThat(testNhomSanPham.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testNhomSanPham.getTrangThai()).isEqualTo(DEFAULT_TRANG_THAI);
    }

    @Test
    @Transactional
    void createNhomSanPhamWithExistingId() throws Exception {
        // Create the NhomSanPham with an existing ID
        nhomSanPham.setId(1L);

        int databaseSizeBeforeCreate = nhomSanPhamRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNhomSanPhamMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNhomSanPhams() throws Exception {
        // Initialize the database
        nhomSanPhamRepository.saveAndFlush(nhomSanPham);

        // Get all the nhomSanPhamList
        restNhomSanPhamMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nhomSanPham.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].timeCreate").value(hasItem(DEFAULT_TIME_CREATE)))
            .andExpect(jsonPath("$.[*].timeUpdate").value(hasItem(sameInstant(DEFAULT_TIME_UPDATE))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].trangThai").value(hasItem(DEFAULT_TRANG_THAI)));
    }

    @Test
    @Transactional
    void getNhomSanPham() throws Exception {
        // Initialize the database
        nhomSanPhamRepository.saveAndFlush(nhomSanPham);

        // Get the nhomSanPham
        restNhomSanPhamMockMvc
            .perform(get(ENTITY_API_URL_ID, nhomSanPham.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(nhomSanPham.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.timeCreate").value(DEFAULT_TIME_CREATE))
            .andExpect(jsonPath("$.timeUpdate").value(sameInstant(DEFAULT_TIME_UPDATE)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.trangThai").value(DEFAULT_TRANG_THAI));
    }

    @Test
    @Transactional
    void getNonExistingNhomSanPham() throws Exception {
        // Get the nhomSanPham
        restNhomSanPhamMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewNhomSanPham() throws Exception {
        // Initialize the database
        nhomSanPhamRepository.saveAndFlush(nhomSanPham);

        int databaseSizeBeforeUpdate = nhomSanPhamRepository.findAll().size();

        // Update the nhomSanPham
        NhomSanPham updatedNhomSanPham = nhomSanPhamRepository.findById(nhomSanPham.getId()).get();
        // Disconnect from session so that the updates on updatedNhomSanPham are not directly saved in db
        em.detach(updatedNhomSanPham);
        updatedNhomSanPham
            .name(UPDATED_NAME)
            .timeCreate(UPDATED_TIME_CREATE)
            .timeUpdate(UPDATED_TIME_UPDATE)
            .username(UPDATED_USERNAME)
            .trangThai(UPDATED_TRANG_THAI);

        restNhomSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNhomSanPham.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNhomSanPham))
            )
            .andExpect(status().isOk());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeUpdate);
        NhomSanPham testNhomSanPham = nhomSanPhamList.get(nhomSanPhamList.size() - 1);
        assertThat(testNhomSanPham.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testNhomSanPham.getTimeCreate()).isEqualTo(UPDATED_TIME_CREATE);
        assertThat(testNhomSanPham.getTimeUpdate()).isEqualTo(UPDATED_TIME_UPDATE);
        assertThat(testNhomSanPham.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNhomSanPham.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void putNonExistingNhomSanPham() throws Exception {
        int databaseSizeBeforeUpdate = nhomSanPhamRepository.findAll().size();
        nhomSanPham.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNhomSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, nhomSanPham.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNhomSanPham() throws Exception {
        int databaseSizeBeforeUpdate = nhomSanPhamRepository.findAll().size();
        nhomSanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNhomSanPham() throws Exception {
        int databaseSizeBeforeUpdate = nhomSanPhamRepository.findAll().size();
        nhomSanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomSanPham))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNhomSanPhamWithPatch() throws Exception {
        // Initialize the database
        nhomSanPhamRepository.saveAndFlush(nhomSanPham);

        int databaseSizeBeforeUpdate = nhomSanPhamRepository.findAll().size();

        // Update the nhomSanPham using partial update
        NhomSanPham partialUpdatedNhomSanPham = new NhomSanPham();
        partialUpdatedNhomSanPham.setId(nhomSanPham.getId());

        partialUpdatedNhomSanPham.trangThai(UPDATED_TRANG_THAI);

        restNhomSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNhomSanPham.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNhomSanPham))
            )
            .andExpect(status().isOk());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeUpdate);
        NhomSanPham testNhomSanPham = nhomSanPhamList.get(nhomSanPhamList.size() - 1);
        assertThat(testNhomSanPham.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testNhomSanPham.getTimeCreate()).isEqualTo(DEFAULT_TIME_CREATE);
        assertThat(testNhomSanPham.getTimeUpdate()).isEqualTo(DEFAULT_TIME_UPDATE);
        assertThat(testNhomSanPham.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testNhomSanPham.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void fullUpdateNhomSanPhamWithPatch() throws Exception {
        // Initialize the database
        nhomSanPhamRepository.saveAndFlush(nhomSanPham);

        int databaseSizeBeforeUpdate = nhomSanPhamRepository.findAll().size();

        // Update the nhomSanPham using partial update
        NhomSanPham partialUpdatedNhomSanPham = new NhomSanPham();
        partialUpdatedNhomSanPham.setId(nhomSanPham.getId());

        partialUpdatedNhomSanPham
            .name(UPDATED_NAME)
            .timeCreate(UPDATED_TIME_CREATE)
            .timeUpdate(UPDATED_TIME_UPDATE)
            .username(UPDATED_USERNAME)
            .trangThai(UPDATED_TRANG_THAI);

        restNhomSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNhomSanPham.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNhomSanPham))
            )
            .andExpect(status().isOk());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeUpdate);
        NhomSanPham testNhomSanPham = nhomSanPhamList.get(nhomSanPhamList.size() - 1);
        assertThat(testNhomSanPham.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testNhomSanPham.getTimeCreate()).isEqualTo(UPDATED_TIME_CREATE);
        assertThat(testNhomSanPham.getTimeUpdate()).isEqualTo(UPDATED_TIME_UPDATE);
        assertThat(testNhomSanPham.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNhomSanPham.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void patchNonExistingNhomSanPham() throws Exception {
        int databaseSizeBeforeUpdate = nhomSanPhamRepository.findAll().size();
        nhomSanPham.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNhomSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, nhomSanPham.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nhomSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNhomSanPham() throws Exception {
        int databaseSizeBeforeUpdate = nhomSanPhamRepository.findAll().size();
        nhomSanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nhomSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNhomSanPham() throws Exception {
        int databaseSizeBeforeUpdate = nhomSanPhamRepository.findAll().size();
        nhomSanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nhomSanPham))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NhomSanPham in the database
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNhomSanPham() throws Exception {
        // Initialize the database
        nhomSanPhamRepository.saveAndFlush(nhomSanPham);

        int databaseSizeBeforeDelete = nhomSanPhamRepository.findAll().size();

        // Delete the nhomSanPham
        restNhomSanPhamMockMvc
            .perform(delete(ENTITY_API_URL_ID, nhomSanPham.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NhomSanPham> nhomSanPhamList = nhomSanPhamRepository.findAll();
        assertThat(nhomSanPhamList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
