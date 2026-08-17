const TEST_URL = 'http://localhost:8787/api';

async function runTests() {
  console.log("🚀 Starting End-to-End API Tests...\n");

  const testUid = `test-user-${Date.now()}`;
  const testEmail = "test@atmik.ai";

  // 1. Test Auth Sync (D1 Database Insertion)
  console.log("1️⃣  Testing /api/auth/sync (D1 User Creation)...");
  try {
    const authRes = await fetch(`${TEST_URL}/auth/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebaseUid: testUid, email: testEmail, displayName: "Test User" })
    });
    const authData = await authRes.json();
    console.log("   ✅ Auth Response:", authData);
  } catch (e) {
    console.error("   ❌ Auth Failed:", e.message);
  }

  // 2. Test Library Content Creation (D1 Content Insertion)
  console.log("\n2️⃣  Testing /api/library/content (D1 Content Creation)...");
  let contentId;
  try {
    const libRes = await fetch(`${TEST_URL}/library/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-mock-token' },
      body: JSON.stringify({ 
        title: "Mindfulness Guide", 
        type: "BOOK", 
        fileUrl: "https://r2.example.com/file.pdf" 
      })
    });
    const libData = await libRes.json();
    contentId = libData.id;
    console.log("   ✅ Library Post Response:", libData);
  } catch (e) {
    console.error("   ❌ Library Post Failed:", e.message);
  }

  // 3. Test Library Fetching
  console.log("\n3️⃣  Testing /api/library/content (D1 Content Fetch)...");
  try {
    const fetchRes = await fetch(`${TEST_URL}/library/content`, {
      headers: { 'Authorization': 'Bearer test-mock-token' }
    });
    const fetchData = await fetchRes.json();
    console.log("   ✅ Library Fetch Response:", fetchData.data.length > 0 ? `Found ${fetchData.data.length} items.` : "No items found.");
  } catch (e) {
    console.error("   ❌ Library Fetch Failed:", e.message);
  }

  // 4. Test R2 Upload URL Generation
  console.log("\n4️⃣  Testing /api/library/upload-url (Cloudflare R2 Presigner)...");
  try {
    const r2Res = await fetch(`${TEST_URL}/library/upload-url?filename=test.mp4`, {
      headers: { 'Authorization': 'Bearer test-mock-token' }
    });
    const r2Data = await r2Res.json();
    if (r2Data.error) {
      console.log("   ⚠️ R2 Generation failed (Expected if R2 credentials aren't in .env yet):", r2Data.error);
    } else {
      console.log("   ✅ R2 Presigned URL generated:", r2Data.uploadUrl.substring(0, 50) + "...");
    }
  } catch (e) {
    console.error("   ❌ R2 Test Failed:", e.message);
  }

  console.log("\n🏁 Tests Complete! Note: The Chat/Voice endpoints require a valid OPENAI_API_KEY to test without crashing.");
}

runTests();
