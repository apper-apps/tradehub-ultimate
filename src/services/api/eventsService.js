import eventsData from "@/services/mockData/events.json";

let events = [...eventsData];

const eventsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...events];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const event = events.find(e => e.Id === id);
    if (!event) {
      throw new Error("Event not found");
    }
    return { ...event };
  },

  async create(eventData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = events.length > 0 ? Math.max(...events.map(e => e.Id)) : 0;
    const newEvent = {
      Id: maxId + 1,
      ...eventData,
      createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    return { ...newEvent };
  },

  async update(id, eventData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = events.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    events[index] = { ...events[index], ...eventData };
    return { ...events[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = events.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    events.splice(index, 1);
    return true;
  }
};

export default eventsService;