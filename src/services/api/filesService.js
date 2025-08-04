import { toast } from 'react-toastify';

const filesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "size" } },
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "url" } },
          { field: { Name: "uploadedAt" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("file", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching files:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "size" } },
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "url" } },
          { field: { Name: "uploadedAt" } }
        ]
      };

      const response = await apperClient.getRecordById("file", id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching file with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(fileData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

// Validate and format URL for Website field type
      const isValidUrl = (string) => {
        try {
          new URL(string);
          return true;
        } catch (_) {
          return false;
        }
      };

      const formatUrl = (url, fileName) => {
        if (url && isValidUrl(url)) {
          return url;
        }
        // Generate fallback URL for file access
        const cleanFileName = (fileName || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
        return `https://files.app.com/${cleanFileName}`;
      };

      // Only include updateable fields
      const payload = {
        Name: fileData.name || fileData.Name,
        Tags: fileData.Tags || "",
        Owner: fileData.Owner || null,
        size: parseInt(fileData.size) || 0,
        type: fileData.type,
        category: fileData.category,
        url: formatUrl(fileData.url, fileData.name || fileData.Name),
        uploadedAt: fileData.uploadedAt || new Date().toISOString()
      };

      const params = {
        records: [payload]
      };

      const response = await apperClient.createRecord("file", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create files ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating file:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, fileData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

// Validate and format URL for Website field type
      const isValidUrl = (string) => {
        try {
          new URL(string);
          return true;
        } catch (_) {
          return false;
        }
      };

      const formatUrl = (url, fileName) => {
        if (url && isValidUrl(url)) {
          return url;
        }
        // Generate fallback URL for file access
        const cleanFileName = (fileName || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
        return `https://files.app.com/${cleanFileName}`;
      };

      // Only include updateable fields
      const payload = {
        Id: id,
        Name: fileData.name || fileData.Name,
        Tags: fileData.Tags || "",
        Owner: fileData.Owner || null,
        size: parseInt(fileData.size) || 0,
        type: fileData.type,
        category: fileData.category,
        url: formatUrl(fileData.url, fileData.name || fileData.Name)
      };

      const params = {
        records: [payload]
      };

      const response = await apperClient.updateRecord("file", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update files ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating file:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord("file", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete files ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting file:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};

export default filesService;