import newsData from "@/services/mockData/news.json";

let news = [...newsData];

const newsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...news];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newsItem = news.find(n => n.Id === id);
    if (!newsItem) {
      throw new Error("News item not found");
    }
    return { ...newsItem };
  },

  async create(newsData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = news.length > 0 ? Math.max(...news.map(n => n.Id)) : 0;
    const newNews = {
      Id: maxId + 1,
      ...newsData,
      createdAt: new Date().toISOString()
    };
    news.push(newNews);
    return { ...newNews };
  },

  async update(id, newsData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = news.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error("News item not found");
    }
    news[index] = { ...news[index], ...newsData };
    return { ...news[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = news.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error("News item not found");
    }
    news.splice(index, 1);
    return true;
  }
};

export default newsService;