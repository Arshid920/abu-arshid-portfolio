
fetch("http://localhost:3005/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Have you worked at Google?"
  })
})
  .then(async (response) => {
    console.log("Status:", response.status);
    console.log("Response:", await response.text());
  })
  .catch((error) => console.error(error));