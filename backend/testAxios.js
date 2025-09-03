const axios = require("axios");

async function testFlask() {
  try {
    const response = await axios.post("http://127.0.0.1:5001/predict", {
      features: [1, 2, 7, 95, 92, 45, 90, 90, 20, 2, 1, 1, 1, 95, 15],
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error calling Flask API:", error.message);
  }
}

testFlask();
