import updatesData from "@/services/mockData/updates.json";

let updates = [...updatesData];

const updatesService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...updates];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const update = updates.find(u => u.Id === id);
    if (!update) {
      throw new Error("Update not found");
    }
    return { ...update };
  },

  async create(updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = updates.length > 0 ? Math.max(...updates.map(u => u.Id)) : 0;
    const newUpdate = {
      Id: maxId + 1,
      ...updateData,
      createdAt: new Date().toISOString()
    };
    updates.push(newUpdate);
    return { ...newUpdate };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = updates.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("Update not found");
    }
    updates[index] = { ...updates[index], ...updateData };
    return { ...updates[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = updates.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("Update not found");
    }
    updates.splice(index, 1);
    return true;
  }
};

export default updatesService;