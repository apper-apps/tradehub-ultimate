import filesData from "@/services/mockData/files.json";

let files = [...filesData];

const filesService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...files];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const file = files.find(f => f.Id === id);
    if (!file) {
      throw new Error("File not found");
    }
    return { ...file };
  },

  async create(fileData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = files.length > 0 ? Math.max(...files.map(f => f.Id)) : 0;
    const newFile = {
      Id: maxId + 1,
      ...fileData,
      uploadedAt: new Date().toISOString()
    };
    files.push(newFile);
    return { ...newFile };
  },

  async update(id, fileData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = files.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error("File not found");
    }
    files[index] = { ...files[index], ...fileData };
    return { ...files[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = files.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error("File not found");
    }
    files.splice(index, 1);
    return true;
  }
};

export default filesService;