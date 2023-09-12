const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/gevorg") {
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading data.json", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        try {
          const jsonData = JSON.parse(data);

          const capitalizedData = {};
          for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
              const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
              capitalizedData[capitalizedKey] = jsonData[key];
            }
          }

          // Generate the updated JSON string
          const responseJson = JSON.stringify(capitalizedData, null, 2);

          // Read the contents of the HTML file from the public folder
          fs.readFile(
            path.join(__dirname, "public/index.html"),
            "utf8",
            (htmlErr, htmlContent) => {
              if (htmlErr) {
                console.error("Error reading HTML file", htmlErr);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
              } else {
                // Replace the placeholder in the HTML content with the formatted JSON
                const finalHtml = htmlContent.replace(
                  "<!-- JSON data will be inserted here dynamically -->",
                  `<pre>${responseJson}</pre>`
                );

                // Send the HTML response with the centered content
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(finalHtml);
              }
            }
          );
        } catch (error) {
          console.error("Error parsing JSON data", error);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
