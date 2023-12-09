export const getConversationId = (userId, users) => {
  return users[0]._id === userId ? users[1]._id : users[0]._id;
};
export const checkOnlineStatus = (onlineUsers, userId, users) => {
  let convoId = getConversationId(userId, users);
  let check = onlineUsers.find((u) => u.userId === convoId);
  return check ? true : false;
};

export const getConversationName = (userId, users) => {
  return users[0]._id === userId ? users[1].name : users[0].name;
};
export const getConversationPicture = (userId, users) => {
  return users[0]._id === userId ? users[1].photo : users[0].photo;
};
