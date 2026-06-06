// Test creating with custom publication dates (createdAt)
async function runCreateTests() {
  try {
    const testDate = '2026-04-20';

    console.log("1. Creating blog with custom date...");
    const blogForm = new FormData();
    blogForm.append('title', 'Test Blog with Custom Date');
    blogForm.append('category', 'Kinh nghiệm xây nhà');
    blogForm.append('content', '<p>Test content here</p>');
    blogForm.append('createdAt', testDate);

    // We need a dummy file for the cover image
    const dummyBlob = new Blob(['dummy image content'], { type: 'image/png' });
    blogForm.append('image', dummyBlob, 'test.png');

    const res = await fetch("http://localhost:5000/api/blogs", {
      method: 'POST',
      body: blogForm
    });
    const data = await res.json();
    console.log("Create blog response:", data);
    if (data.success) {
      console.log("Created blog createdAt in DB:", data.blog.createdAt);
      // Clean up by deleting it
      await fetch(`http://localhost:5000/api/blogs/${data.blog._id}`, { method: 'DELETE' });
      console.log("Cleaned up test blog.");
    }
  } catch (error) {
    console.error("Create test failed with error:", error);
  }
}

runCreateTests();
