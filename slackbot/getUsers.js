const { web } = require('./web');

const usersPromise = web.users
  .list()
  .then(res => res.members
    .filter(member => !member.deleted)
    .reduce((acc, cur) => (
      { ...acc, ...{ [cur.real_name.toLowerCase()]: cur.id } }
    ), {}))
  .catch(console.error);

const getUserId = async (userName) => {
  const users = await usersPromise;
  return users[userName.toLowerCase()];
};

module.exports = {
  getUserId,
};
