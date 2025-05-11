const mongoose = require('mongoose');
const app = require('./app');

console.log('enter server');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connection);
    console.log('DB conection successful ✅');
  });
// .catch((err) => {
//   console.log(`Fail conection ❌ becouse ${err}`);
// });

const port = process.env.PORT || 3000;
const server = app.listen(port, (err) => {
  console.log(`App running on port ${port}...`);
  const now = new Date();
  console.log(
    'Current local date and time:',
    now.toLocaleString(),
  );
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION 💥 Shutting down!');
  server.close(() => {
    process.exit(1);
  });
});

console.log(x);
