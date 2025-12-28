import socketAuthMiddleware from '../middlewares/socketAuth.middleware.js';

// Thin wrapper to keep socket auth colocated under sockets/
export default socketAuthMiddleware;
