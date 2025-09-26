export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password, phone } = req.body;
    
    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Password criteria validation
    const passwordCriteria = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    if (!Object.values(passwordCriteria).every(Boolean)) {
      return res.status(400).json({ 
        error: 'Password must meet all criteria: at least 6 characters, uppercase, lowercase, number, and special character' 
      });
    }
    
    // Mock user creation
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      phone,
      wallet: { balance: 1000, currency: 'INR' },
      loyaltyPoints: 0,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}
