import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Events from "@/components/pages/Events";
import Blog from "@/components/pages/Blog";
import News from "@/components/pages/News";
import Updates from "@/components/pages/Updates";
import Files from "@/components/pages/Files";
import EventForm from "@/components/pages/EventForm";
import BlogForm from "@/components/pages/BlogForm";
import NewsForm from "@/components/pages/NewsForm";
import UpdateForm from "@/components/pages/UpdateForm";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-850">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/edit/:id" element={<EventForm />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/edit/:id" element={<BlogForm />} />
            <Route path="news" element={<News />} />
            <Route path="news/new" element={<NewsForm />} />
            <Route path="news/edit/:id" element={<NewsForm />} />
            <Route path="updates" element={<Updates />} />
            <Route path="updates/new" element={<UpdateForm />} />
            <Route path="updates/edit/:id" element={<UpdateForm />} />
            <Route path="files" element={<Files />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;