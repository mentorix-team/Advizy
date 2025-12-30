import jwt from 'jsonwebtoken';

// JWT secrets for user and expert tokens
const USER_SECRET = process.env.authjwt || 'R5sWL56Li7DgtjNly8CItjADuYJY6926pE9vn823eD0=';
const EXPERT_SECRET = process.env.jwtexpert || '3qdcBCZzmSE9H39Radno+8AbM6QqI6pTUD0rF7cD0ew=';

// Simple cookie parser
function parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return cookies;
    cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.trim().split('=');
        if (name) {
            cookies[name] = decodeURIComponent(rest.join('='));
        }
    });
    return cookies;
}

// Minimal Socket.IO authentication middleware
// Extracts JWT from handshake (auth or cookies), verifies, and attaches user to socket
export default function socketAuthMiddleware(socket, next) {
    try {
        // Try to get token from handshake auth first
        let token = socket?.handshake?.auth?.token;
        let isExpertToken = false;
        
        // If no token in auth, try cookies
        if (!token) {
            const cookieHeader = socket?.handshake?.headers?.cookie;
            if (cookieHeader) {
                const cookies = parseCookies(cookieHeader);
                // Prefer expertToken if available, otherwise use user token
                if (cookies.expertToken) {
                    token = cookies.expertToken;
                    isExpertToken = true;
                } else if (cookies.token) {
                    token = cookies.token;
                }
            }
        }
        
        if (!token) {
            console.error('[socketAuth] No token found in auth or cookies');
            return next(new Error('Unauthorized'));
        }

        let decoded = null;
        let role = 'user';

        // If we know it's an expert token, verify with expert secret first
        if (isExpertToken) {
            try {
                decoded = jwt.verify(token, EXPERT_SECRET);
                role = 'expert';
            } catch (expertErr) {
                console.error('[socketAuth] Expert token verification failed:', expertErr.message);
                return next(new Error('Unauthorized'));
            }
        } else {
            // Try verifying as user token first
            try {
                decoded = jwt.verify(token, USER_SECRET);
                role = decoded?.role?.toLowerCase() || 'user';
            } catch (userErr) {
                // Try verifying as expert token
                try {
                    decoded = jwt.verify(token, EXPERT_SECRET);
                    role = 'expert';
                } catch (expertErr) {
                    console.error('[socketAuth] Token verification failed for both user and expert secrets');
                    return next(new Error('Unauthorized'));
                }
            }
        }

        // Derive id defensively
        const id = decoded?.id || decoded?._id;

        if (!id) {
            return next(new Error('Unauthorized'));
        }

        socket.user = { id, role };
        console.log('[socketAuth] Authenticated socket:', { id, role });
        return next();
    } catch (err) {
        console.error('[socketAuth] Error:', err.message);
        return next(new Error('Unauthorized'));
    }
}
