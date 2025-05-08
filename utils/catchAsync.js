module.exports = (fn) => {
  return (req, res, next) => {
    console.log('enter to catch sync');
    fn(req, res, next).catch((err) => next(err));
    // fn(req, res, next).catch(next);
  };
};
