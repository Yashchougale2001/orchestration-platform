import apiClient from "../../services/apiClient";
import { endpoints } from "../../services/endpoints";

/**
 * Ingestion service - handles document ingestion API calls
 */
export const ingestionService = {
  /**
   * Upload and ingest a file
   * @param {File} file - File to upload
   * @returns {Promise<Object>} - Ingestion result
   */
  ingestFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(endpoints.ingestion.file, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Ingest documents from a folder path
   * @param {string} folderPath - Path to folder
   * @returns {Promise<Object>} - Ingestion result
   */
  ingestFolder: async (folderPath) => {
    const response = await apiClient.post(endpoints.ingestion.folder, {
      folder_path: folderPath,
    });
    return response.data;
  },

  /**
   * Ingest document from URL
   * @param {string} url - URL to ingest
   * @returns {Promise<Object>} - Ingestion result
   */
  ingestUrl: async (url) => {
    const response = await apiClient.post(endpoints.ingestion.url, {
      url,
    });
    return response.data;
  },

  /**
   * Get ingestion status
   * @returns {Promise<Object>} - Status information
   */
  getStatus: async () => {
    const response = await apiClient.get(endpoints.ingestion.status);
    return response.data;
  },
};
