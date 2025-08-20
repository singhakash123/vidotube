

const upload = multer({ dest: 'uploads/' })

const app = express()

app.post('/profile', upload.single('avatar'), function (req, res, next) {
// req.file is the `avatar` file
// req.body will hold the text fields, if there were any
})

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
// req.files is array of `photos` files
// req.body will contain the text fields, if there were any
})

const uploadMiddleware = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', uploadMiddleware, function (req, res, next) {
// req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
//
// e.g.
// req.files['avatar'][0] -> File
// req.files['gallery'] -> Array
//
// req.body will contain the text fields, if there were any
})
/\*
If you want more control over your uploads, you’ll want to use the storage option instead of dest. Multer ships with storage engines DiskStorage and MemoryStorage; More engines are available from third parties.

.single(fieldname)
Accept a single file with the name fieldname. The single file will be stored in req.file.

.array(fieldname[, maxCount])

\*/

// acces and refresh token expiry today :

/\*

1. Install jsonwebtoken.
   npm install jsonwebtoken

2.Define Secret Keys: Create strong, unique secret keys for both your access token and refresh token. These should be stored securely, ideally as environment variables.
// In your .env file or configuration
process.env.ACCESS_TOKEN_SECRET = 'your_access_token_secret_here';
process.env.REFRESH_TOKEN_SECRET = 'your_refresh_token_secret_here';

3. const jwt = require('jsonwebtoken');

// Define your secret keys (should be stored securely, e.g., in environment variables)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_secret_key';

// User data to be included in the token payload

const userData = {
userId: 'someUserId123',
email: 'user@example.com',
// ... other relevant user data
};

// Generate Access Token
const accessToken = jwt.sign(
userData,
ACCESS_TOKEN_SECRET,
{ expiresIn: '15m' } // Access tokens are typically short-lived (e.g., 15 minutes)
);

// Generate Refresh Token
const refreshToken = jwt.sign(
{ userId: userData.userId }, // Refresh tokens usually contain minimal user info
REFRESH_TOKEN_SECRET,
{ expiresIn: '7d' } // Refresh tokens are long-lived (e.g., 7 days or more)
);

console.log('Access Token:', accessToken);
console.log('Refresh Token:', refreshToken);

\*/Explanation:
jwt.sign(payload, secret, options): This function creates a new JWT.
payload: An object containing the data you want to embed in the token. For access tokens, this might include user ID, roles, permissions, etc. For refresh tokens, it often contains just the user ID.
secret: A secret key used to sign the token. This key is crucial for verifying the token's authenticity. Keep it secure and distinct for access and refresh tokens.
options: An object for configuring the token, including:
expiresIn: Specifies the token's expiration time (e.g., '15m' for 15 minutes, '7d' for 7 days). Access tokens are designed to be short-lived, while refresh tokens are long-lived.

/\*
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const generateTokens = (userId) => {
// Access Token (short-lived)
const accessToken = jwt.sign(
{ userId: userId },
process.env.ACCESS_TOKEN_SECRET,
{ expiresIn: '15m' } // Example: 15 minutes
);

// Refresh Token (long-lived)
const refreshToken = jwt.sign(
{ userId: userId },
process.env.REFRESH_TOKEN_SECRET,
{ expiresIn: '7d' } // Example: 7 days
);

return { accessToken, refreshToken };
};

\*/
// Example in an Express.js route
app.post('/login', async (req, res) => {
// ... (User authentication logic, e.g., verify username and password)

if (userAuthenticated) {
const { accessToken, refreshToken } = generateTokens(user.\_id);

    // Send tokens to the client
    // Access token usually in the response body
    // Refresh token often as an HttpOnly cookie for security
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); // secure in production
    res.json({ accessToken });

} else {
res.status(401).json({ message: 'Invalid credentials' });
}
});
