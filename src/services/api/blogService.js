import blogData from "@/services/mockData/blog.json";

let posts = [...blogData];

const blogService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...posts];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const post = posts.find(p => p.Id === id);
    if (!post) {
      throw new Error("Blog post not found");
    }
    return { ...post };
  },

  async create(postData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.Id)) : 0;
    const newPost = {
      Id: maxId + 1,
      ...postData,
      createdAt: new Date().toISOString()
    };
    posts.push(newPost);
    return { ...newPost };
  },

  async update(id, postData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = posts.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Blog post not found");
    }
    posts[index] = { ...posts[index], ...postData };
    return { ...posts[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = posts.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Blog post not found");
    }
    posts.splice(index, 1);
    return true;
  }
};

export default blogService;