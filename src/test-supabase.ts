import { supabase } from '@/lib/supabase';

// Function to test the Supabase connection and RLS policies
async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection test
    const { data: version, error: versionError } = await supabase.rpc('version');
    if (versionError) {
      console.error('Connection error:', versionError);
    } else {
      console.log('✅ Connection successful');
    }
    
    // Test 2: Try to sign up a test user
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (signUpError) {
      console.error('Sign up error:', signUpError);
    } else {
      console.log('✅ Sign up successful:', signUpData.user?.id);
      
      // Test 3: Create a user profile in the database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: signUpData.user?.id,
            name: 'Test User',
            email: testEmail,
            avatar_url: null,
          }
        ])
        .select();
      
      if (userError) {
        console.error('User creation error:', userError);
      } else {
        console.log('✅ User profile created:', userData?.[0]?.id);
      }
      
      // Test 4: Try to sign in with the created user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError) {
        console.error('Sign in error:', signInError);
      } else {
        console.log('✅ Sign in successful:', signInData.user?.id);
        
        // Test 5: Check if RLS is working (try to get the user profile)
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', signUpData.user?.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
        } else {
          console.log('✅ Profile fetch successful:', userProfile?.id);
        }
        
        // Test 6: Sign out
        const { error: signOutError } = await supabase.auth.signOut();
        
        if (signOutError) {
          console.error('Sign out error:', signOutError);
        } else {
          console.log('✅ Sign out successful');
        }
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testSupabaseConnection(); 