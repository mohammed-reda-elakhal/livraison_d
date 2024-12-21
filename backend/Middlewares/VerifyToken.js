const jwt = require("jsonwebtoken");


// verify token
function verifyToken(req, res, next) {
    const authToken = req.headers.authorization;  // Check for 'authorization' header
    if (authToken) {
        const token = authToken.split(" ")[1];  // Split to get the token part

        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedPayload;
            next();
        } catch (error) {
            console.error("Invalid token:", error);  // Log the error
            return res.status(401).json({ message: "Invalid token, access denied" });
        }
    } else {
        console.warn("No token provided");
        return res.status(401).json({ message: "No token provided, access denied" });
    }
}


// verify token and admin 
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "admin") {
            next();
        } else {
            return res.status(401).json({ message: "not allowed only admin" });
        }
    });
}

// verify token admin team
function verifyTokenAdminTeam(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "admin" || req.user.role === "team") {
            next();
        } else {
            return res.status(401).json({ message: "not allowed only admin or team" });
        }
    });
}

// verify token client store or team or admin
// les traitement de client admin team 
function verifyTokenStoreTeamAdminClient(req, res, next) {
    verifyToken(req, res, () => {
        if (
            (req.user.store && req.user.store === req.params.id_user) ||
            (req.user.role === "team" && req.user.id === req.params.id_user) ||
            (req.user.role === "admin" && req.user.id === req.params.id_user) ||
            (req.user.role === "client" && req.user.id === req.params.id_user)
        ) {
            next();
        } else {
            return res.status(401).json({ message: "You are not allowed to this operation" });
            console.log('you not alowded');
        }
    });
}

function verifyTokenStoreTeamAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (
            (req.user.store && req.user.store === req.params.id_user) ||
            (req.user.role === "team" && req.user.id === req.params.id_user) ||
            (req.user.role === "admin" && req.user.id === req.params.id_user)
        ) {
            next();
        } else {
            return res.status(401).json({ message: "You are not allowed to this operation" });
        }
    });
}

// verify token and client 
function verifyTokenAndClient(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "client" && req.user.id === req.params.id_user) {
            next();
        } else {
            return res.status(401).json({ message: "not allowed to this operation" });
        }
    });
}

// verify token and livreur
function verifyTokenAndLivreur(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "livreur" && req.user.id === req.params.id_user) {
            next();
        } else {
            return res.status(401).json({ message: "not allowed to access" });
        }
    });
}

// verify token and livreur or admin
function verifyTokenAndLivreurOrAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "admin" || req.user.role === "livreur") {
            next();
        } else {
            return res.status(401).json({ message: "You don't have permission to this operation" });
        }
    });
}

// verify token and store
const verifyTokenAndStore = async (req, res, next) => {
    verifyToken(req, res, async () => {
        if (req.user.role === "client" && req.user.store === req.params.id) {
            next();
        } else {
            return res.status(401).json({ message: "Not allowed to access" });
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenStoreTeamAdmin,
    verifyTokenAdminTeam,
    verifyTokenAndClient,
    verifyTokenAndLivreur,
    verifyTokenAndLivreurOrAdmin,
    verifyTokenAndStore,
    verifyTokenStoreTeamAdminClient
};
