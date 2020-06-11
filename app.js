let express = require('express');

let app = express();

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Welcome to e-Luminous from server-side')
})

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});