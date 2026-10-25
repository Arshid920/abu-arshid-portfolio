fetch("http://localhost:3000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Where can I view Arshid's portfolio and GitHub profile?"
  })
})
  .then(async (response) => {
    console.log("Status:", response.status);
    console.log("Response:", await response.text());
  })
  .catch((error) => console.error(error));
