let mongoose = require('mongoose');
let dotenv = require('dotenv');

dotenv.config({ path: './env/config.env' });
let app = require('./app');

//console.log(app.get('env')) // development
let db = process.env.DATABASE.replace(
  '<password>', 
  process.env.DATABASE_PASSWORD
)

mongoose
  .connect(process.env.DATABASE_LOCAL, { 
  //.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
 }).then(()  => console.log('DB connect successfull'));

let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
