const fs = require('fs');

async function test() {
  const formData = new FormData();
  formData.append('file', new Blob(['Hello R2 from Node'], { type: 'text/plain' }), 'test-doc.txt');

  const res = await fetch('https://atmik-ai-backend.swatantra-backend.workers.dev/api/library/upload', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer temp-admin-token'
    },
    body: formData
  });

  console.log(res.status, await res.text());
}
test();
