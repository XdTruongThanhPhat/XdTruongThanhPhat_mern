// Test endpoints of MERN-TTP application
async function runTests() {
  try {
    console.log("Fetching blogs...");
    const blogRes = await fetch("http://localhost:5000/api/blogs");
    const blogData = await blogRes.json();
    console.log(`Successfully fetched ${blogData.blogs?.length} blogs.`);
    if (blogData.blogs?.length > 0) {
      console.log("Sample blog:", {
        id: blogData.blogs[0]._id,
        title: blogData.blogs[0].title,
        createdAt: blogData.blogs[0].createdAt
      });
    }

    console.log("\nFetching projects...");
    const projectRes = await fetch("http://localhost:5000/api/projects/list");
    const projectData = await projectRes.json();
    console.log(`Successfully fetched ${projectData.projects?.length} projects.`);
    if (projectData.projects?.length > 0) {
      console.log("Sample project:", {
        id: projectData.projects[0]._id,
        title: projectData.projects[0].title,
        createdAt: projectData.projects[0].createdAt
      });
    }
  } catch (error) {
    console.error("Test failed with error:", error);
  }
}

runTests();
