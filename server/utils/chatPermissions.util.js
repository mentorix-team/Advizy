// Reusable chat permission helpers

const toIdString = (val) => {
  if (!val) return null;
  try {
    return typeof val === 'string' ? val : val.toString();
  } catch (_) {
    return null;
  }
};

// Returns true if userId matches chatRoom.userId or chatRoom.expertId
export function isParticipant(chatRoom, userId) {
  if (!chatRoom || !userId) return false;
  const uid = toIdString(userId);
  const userMatch = toIdString(chatRoom.userId) === uid;
  const expertMatch = toIdString(chatRoom.expertId) === uid;
  return Boolean(userMatch || expertMatch);
}

// Throws 403 error if user is not a participant
export function throwForbiddenIfUnauthorized(chatRoom, userId) {
  const allowed = isParticipant(chatRoom, userId);
  if (!allowed) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
}

export default {
  isParticipant,
  throwForbiddenIfUnauthorized,
};
