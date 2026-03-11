require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`⚙️ garimepi-api-rest rodando em ${PORT}`)
})