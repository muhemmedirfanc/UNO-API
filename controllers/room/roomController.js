const users = [];

export const createRoom = (name, publicRoom, privateRoom, roomId, id, roomPassword) => {
  const user = { name, publicRoom, privateRoom, roomId, id, roomPassword };

  users.push(user);

  return user;
};

export const joinRoom = (name, publicRoom, privateRoom, roomId, id, roomPassword) => {
  const user = { name, publicRoom, privateRoom, roomId, id, roomPassword };

  //check if room exist and credentials match

  if (privateRoom) {
    let room = users.filter((user) => user.roomId === roomId && user?.roomPassword === roomPassword && user.privateRoom);
    if (!room.length) return { status: false, error: "Invalid Room ID Or Password." };
    if (room.length > 3) return { status: false, error: "The number of players has exceeded." };
    user.status = true;
    users.push(user);
    return user;
  } else {
    let room = users.filter((user) => user.roomId === roomId && user.publicRoom);
    if (!room.length) return { status: false, error: "Invalid Room ID or Room Type !." };
    if (room.length > 3) return { status: false, error: "The number of players has exceeded." };
    user.status = true;
    users.push(user);
    return user;
  }
};

export const getUsersByRoom = (roomId) => {
  let roomUsers = users.filter((user) => user.roomId === roomId);
  return roomUsers;
};

export const getUserById = (id) => {
  let user = users.filter((user) => user.id === id);
  return user[0];
};

export const handleUserLeave = (id) => {
  let index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//play room

const playRoom = [];

export const saveMyCards = (id) => {
  console.log(id);
  let user = getUserById(id);
  console.log(user);
};
