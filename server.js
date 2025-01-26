const express = require('express');
const app = express();

app.use(express.json());

const db = {
  schedule: [
    {
      day: 'monday',
      bookedTime: [12, 18],
    },
    {
      day: 'tuesday',
      bookedTime: [12, 18],
    },
    {
      day: 'wednesday',
      bookedTime: [12, 18],
    },
    {
      day: 'thursday',
      bookedTime: [12, 18],
    },
    {
      day: 'friday',
      bookedTime: [],
    },
    {
      day: 'saturday',
      bookedTime: [],
    },
    {
      day: 'sunday',
      bookedTime: [],
    },
  ],
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'user1@example.com',
      password: 'user1@example.com',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'user2@example.com',
      password: 'user2@example.com',
      role: 'user'
    }
  ]
}

// Handling CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, userId');
  res.header('Access-Control-Allow-Methods', 'GET, PATCH, POST, OPTIONS');
  next();
});

// Check authentication
const isAuthenticated = (req, res, next) => {
  const { userid } = req.headers;
  const user = db.users.find(u => u.id === Number(userid));

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

// Check admin role
const isAdmin = (req, res, next) => {
  const { userid } = req.headers;
  const user = db.users.find(u => u.id === Number(userid));

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  next();
};

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email
    }
  });
});

// Get schedule
app.get('/api/schedule', isAuthenticated, (req, res) => {
  res.json({ schedule: db.schedule });
});

// Update schedule
app.patch('/api/schedule', isAuthenticated, isAdmin, (req, res) => {
  const { day, time } = req.body;
  const currentDay = db.schedule.find(item => item.day === day);
  currentDay.bookedTime.includes(time)
    ? currentDay.bookedTime = [...currentDay.bookedTime.filter(t => t !== time)]
    : currentDay.bookedTime.push(time);

  res.json({ success: true });
});

// Check if time is booked
app.get('/api/schedule/:day/:time', (req, res) => {
  const { day, time } = req.params;
  const currentDay = db.schedule.find(item => item.day === day);
  const isBooked = currentDay.bookedTime.includes(Number(time));

  res.json({ isBooked });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
