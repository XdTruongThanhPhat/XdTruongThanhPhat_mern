// Test updating publication dates (createdAt)
async function runUpdateTests() {
  try {
    const blogId = '6a20e314b481c706f0917258';
    const projectId = '6a1e28c490a0edc5c4a007ae';
    const testDate = '2026-05-15';

    console.log("1. Updating blog date...");
    // Fetch current blog to get its title, category, content
    const getBlogRes = await fetch("http://localhost:5000/api/blogs");
    const getBlogData = await getBlogRes.json();
    const originalBlog = getBlogData.blogs.find(b => b._id === blogId);

    if (!originalBlog) {
      throw new Error("Target blog not found");
    }

    const blogForm = new FormData();
    blogForm.append('title', originalBlog.title);
    blogForm.append('category', originalBlog.category);
    blogForm.append('content', originalBlog.content);
    blogForm.append('focusKeyword', originalBlog.focusKeyword || '');
    blogForm.append('metaDescription', originalBlog.metaDescription || '');
    blogForm.append('createdAt', testDate);

    const updateBlogRes = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
      method: 'PUT',
      body: blogForm
    });
    const updateBlogData = await updateBlogRes.json();
    console.log("Update blog response success:", updateBlogData.success);

    // Verify blog date updated
    const getBlogRes2 = await fetch("http://localhost:5000/api/blogs");
    const getBlogData2 = await getBlogRes2.json();
    const updatedBlog = getBlogData2.blogs.find(b => b._id === blogId);
    console.log("Updated blog createdAt in DB:", updatedBlog.createdAt);

    console.log("\n2. Updating project date...");
    // Fetch current project to get its title, category, info
    const getProjRes = await fetch("http://localhost:5000/api/projects/list");
    const getProjData = await getProjRes.json();
    const originalProject = getProjData.projects.find(p => p._id === projectId);

    if (!originalProject) {
      throw new Error("Target project not found");
    }

    const projectForm = new FormData();
    projectForm.append('title', originalProject.title);
    projectForm.append('category', originalProject.category);
    projectForm.append('info', JSON.stringify(originalProject.info || {}));
    projectForm.append('existingMainImage', originalProject.mainImage || '');
    projectForm.append('existingImages', JSON.stringify(originalProject.projectImages || []));
    projectForm.append('createdAt', testDate);

    const updateProjRes = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
      method: 'PUT',
      body: projectForm
    });
    const updateProjData = await updateProjRes.json();
    console.log("Update project response success:", updateProjData.success);

    // Verify project date updated
    const getProjRes2 = await fetch("http://localhost:5000/api/projects/list");
    const getProjData2 = await getProjRes2.json();
    const updatedProject = getProjData2.projects.find(p => p._id === projectId);
    console.log("Updated project createdAt in DB:", updatedProject.createdAt);

  } catch (error) {
    console.error("Update test failed with error:", error);
  }
}

runUpdateTests();
