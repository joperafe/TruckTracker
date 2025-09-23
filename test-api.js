#!/usr/bin/env node

// Simple test script to verify API functionality
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing TruckTracker API...\n');

  try {
    // Test 1: Check if API is responsive
    console.log('1. Testing API health...');
    const healthResponse = await fetch(`${baseUrl}/api/trucks`);
    if (healthResponse.ok) {
      console.log('✅ API is responsive');
    } else {
      console.log('❌ API health check failed');
      return;
    }

    // Test 2: Get trucks
    console.log('\n2. Testing GET /api/trucks...');
    const trucksResponse = await fetch(`${baseUrl}/api/trucks`);
    const trucksData = await trucksResponse.json();
    
    if (trucksData.success) {
      console.log(`✅ Successfully fetched ${trucksData.count || 0} trucks`);
      if (trucksData.data && trucksData.data.length > 0) {
        console.log(`   Sample truck: ${trucksData.data[0].name}`);
      }
    } else {
      console.log(`❌ Failed to fetch trucks: ${trucksData.error}`);
    }

    // Test 3: Search trucks
    console.log('\n3. Testing search functionality...');
    const searchResponse = await fetch(`${baseUrl}/api/trucks?search=taco`);
    const searchData = await searchResponse.json();
    
    if (searchData.success) {
      console.log(`✅ Search returned ${searchData.count || 0} results`);
    } else {
      console.log(`❌ Search failed: ${searchData.error}`);
    }

    // Test 4: Filter by cuisine
    console.log('\n4. Testing cuisine filter...');
    const cuisineResponse = await fetch(`${baseUrl}/api/trucks?cuisine=Mexican`);
    const cuisineData = await cuisineResponse.json();
    
    if (cuisineData.success) {
      console.log(`✅ Cuisine filter returned ${cuisineData.count || 0} results`);
    } else {
      console.log(`❌ Cuisine filter failed: ${cuisineData.error}`);
    }

    console.log('\n🎉 API tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };