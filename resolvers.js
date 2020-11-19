const user = {
  _id: "1",
  name: "Shahram",
  email: "shha268@gmail.com",
  picture: "https://google.com",
};

module.exports = {
  Query: {
    me: () => user,
  },
};
