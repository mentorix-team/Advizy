import jwt from 'jsonwebtoken';

// Minimal Socket.IO authentication middleware
// Extracts JWT from handshake, verifies, and attaches user to socket
export default function socketAuthMiddleware(socket, next) {
  try {
    const token = socket?.handshake?.auth?.token;
    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set in environment');
      return next(new Error('Unauthorized'));
    }

    const decoded = jwt.verify(token, secret);

    // Derive id and role defensively
    const id = decoded?.id || decoded?._id;
    const role = decoded?.role || (decoded?.admin_approved_expert ? 'expert' : 'user');

    if (!id || !role) {
      return next(new Error('Unauthorized'));
    }

    socket.user = { id, role };
    return next();
  } catch (err) {
    return next(new Error('Unauthorized'));
  }
}
