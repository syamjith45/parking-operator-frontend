import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const query = `
  query GetStatsData {
    dashboardStats {
      active_vehicles
      completed_today
      base_fees_collected
      overstay_fees_collected
      total_revenue_today
    }
    activeVehicles {
      id
      vehicle_type
      is_overstay
    }
  }
`;

async function testToken(email, password) {
  console.log(`\n--- Testing with ${email} ---`);
  const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return console.error('Auth error', error.message);

  const token = session.access_token;

  const res = await fetch('https://api.keraai.in/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

async function run() {
  await testToken('admin@parking.com', 'admin@123'); // Assume this is admin
  await testToken('test1@gmail.com', 'test@123'); // The operator we just created
}

run();
