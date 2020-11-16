const checkNewUser = (id) => {
  //true if user is new
  if (Users.includes(id)) {
    return false;
  } else return true;
};

const addUser = (id, name) => {
  bot.sendMessage(
    id,
    `Hi ${name}, this is your first message! Registering you as user...`
  );
  Users.push(id);
  Data[id] = 0;
  console.log(Data);
};

const add = (id, count) => {
  Data[id] += count;
};
