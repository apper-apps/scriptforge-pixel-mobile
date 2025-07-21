import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import CreateScreen from "@/components/pages/CreateScreen";
import EditorScreen from "@/components/pages/EditorScreen";
import LibraryScreen from "@/components/pages/LibraryScreen";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-paper font-mono">
        <Layout>
          <Routes>
            <Route path="/" element={<CreateScreen />} />
            <Route path="/create" element={<CreateScreen />} />
            <Route path="/editor/:id?" element={<EditorScreen />} />
            <Route path="/library" element={<LibraryScreen />} />
          </Routes>
        </Layout>
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
    </Router>
  );
}

export default App;