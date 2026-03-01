// import apiClient from "../../services/apiClient";
// import { endpoints } from "../../services/endpoints";

// /**
//  * Ingestion service - handles document ingestion API calls
//  */
// export const ingestionService = {
//   /**
//    * Upload and ingest a file
//    * @param {File} file - File to upload
//    * @returns {Promise<Object>} - Ingestion result
//    */
//   ingestFile: async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await apiClient.post(endpoints.ingestion.file, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   },

//   /**
//    * Ingest documents from a folder path
//    * @param {string} folderPath - Path to folder
//    * @returns {Promise<Object>} - Ingestion result
//    */
//   ingestFolder: async (folderPath) => {
//     const response = await apiClient.post(endpoints.ingestion.folder, {
//       folder_path: folderPath,
//     });
//     return response.data;
//   },

//   /**
//    * Ingest document from URL
//    * @param {string} url - URL to ingest
//    * @returns {Promise<Object>} - Ingestion result
//    */
//   ingestUrl: async (url) => {
//     const response = await apiClient.post(endpoints.ingestion.url, {
//       url,
//     });
//     return response.data;
//   },

//   /**
//    * Get ingestion status
//    * @returns {Promise<Object>} - Status information
//    */
//   getStatus: async () => {
//     const response = await apiClient.get(endpoints.ingestion.status);
//     return response.data;
//   },
// };
import apiClient from "../../services/apiClient";
import { endpoints } from "../../services/endpoints";

// ✅ Set to FALSE to use real backend
const USE_MOCK = false;

/**
 * Ingestion service - handles document ingestion API calls
 */
export const ingestionService = {
  /**
   * Upload and ingest a file
   * @param {File} file - File to upload
   * @param {string} dataset - Dataset name (default: "default")
   * @returns {Promise<Object>} - Ingestion result
   */
  ingestFile: async (file, dataset = "default") => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        message: `File "${file.name}" ingested successfully`,
        chunks_created: Math.floor(Math.random() * 50) + 10,
      };
    }

    // ✅ Real API call with file upload
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      `${endpoints.ingestion.file}?dataset=${dataset}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  /**
   * Ingest documents from a folder path
   * @param {string} folderPath - Path to folder
   * @param {string} dataset - Dataset name
   * @returns {Promise<Object>} - Ingestion result
   */
  ingestFolder: async (folderPath, dataset = "default") => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        success: true,
        message: `Folder "${folderPath}" ingested successfully`,
        chunks_created: Math.floor(Math.random() * 100) + 20,
      };
    }

    // ✅ Real API call
    const response = await apiClient.post(endpoints.ingestion.folder, {
      folder_path: folderPath,
      dataset: dataset,
    });

    return response.data;
  },

  /**
   * Ingest document from URL
   * @param {string} url - URL to ingest
   * @param {string} dataset - Dataset name
   * @returns {Promise<Object>} - Ingestion result
   */
  ingestUrl: async (url, dataset = "default") => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        message: `URL "${url}" ingested successfully`,
        chunks_created: Math.floor(Math.random() * 30) + 5,
      };
    }

    // ✅ Real API call
    const response = await apiClient.post(endpoints.ingestion.url, {
      url: url,
      dataset: dataset,
    });

    return response.data;
  },
};
