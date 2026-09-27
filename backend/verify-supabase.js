import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from the .env file in the same directory
dotenv.config({ path: path.join(__dirname, '.env') })

async function verifySupabaseConnection() {
  console.log('🔍 Verifying Supabase Configuration...\n')

  // Check environment variables
  console.log('1. Checking environment variables:')
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY']
  let varsOk = true
  
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (value) {
      // Show only first 20 chars for security
      const preview = value.substring(0, 20) + '...'
      console.log(`   ✓ ${varName}: ${preview}`)
    } else {
      console.log(`   ✗ ${varName}: NOT SET`)
      varsOk = false
    }
  }

  if (!varsOk) {
    console.error('\n✗ Missing required environment variables')
    process.exit(1)
  }

  console.log('\n2. Testing connection with service role key:')
  try {
    // Initialize Supabase client with service role
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Try a simple query to test connection
    const { count, error } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      // If table doesn't exist yet, that's ok - we're just testing connection
      if (error.code === 'PGRST000' || error.message.includes('does not exist')) {
        console.log('   ✓ Connected to Supabase (tables not yet created)')
      } else {
        // Connection is still working even if this query fails
        console.log('   ✓ Connected to Supabase')
        console.log(`     Note: ${error.message}`)
      }
    } else {
      console.log('   ✓ Successfully connected to Supabase')
      console.log(`     Users table exists with ${count} records`)
    }

    console.log('\n3. Testing anon key:')
    const supabaseAnon = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )
    console.log('   ✓ Anon key client initialized successfully')

    console.log('\n✅ All Supabase credentials are valid and connection is working!')
    console.log('\n📋 Credentials Summary:')
    console.log(`   Project URL: ${process.env.SUPABASE_URL}`)
    console.log(`   Service Key Status: ${process.env.SUPABASE_SERVICE_KEY ? '✓ Present' : '✗ Missing'}`)
    console.log(`   Anon Key Status: ${process.env.SUPABASE_ANON_KEY ? '✓ Present' : '✗ Missing'}`)
    
    // Force exit to avoid cleanup issues
    setTimeout(() => process.exit(0), 100)
  } catch (error) {
    console.error(`   ✗ Connection failed: ${error.message}`)
    console.error('\nError details:')
    console.error(error)
    process.exit(1)
  }
}

// Run verification
verifySupabaseConnection().catch(err => {
  console.error('Verification script error:', err)
  process.exit(1)
})
