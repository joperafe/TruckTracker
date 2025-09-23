import { FoodTruck } from '@/types';

// NYC locations for testing
export const sampleTrucks: Partial<FoodTruck>[] = [
  {
    name: "Taco Paradise",
    cuisine: ["Mexican", "Tex-Mex"],
    description: "Authentic street tacos, burritos, and quesadillas made with fresh ingredients. Family recipes passed down for generations.",
    location: {
      type: 'Point',
      coordinates: [-74.0060, 40.7128], // [lng, lat] - NYC
      address: "123 Broadway, New York, NY 10001",
      neighborhood: "Financial District"
    },
    hours: {
      monday: { open: '11:00', close: '21:00', closed: false },
      tuesday: { open: '11:00', close: '21:00', closed: false },
      wednesday: { open: '11:00', close: '21:00', closed: false },
      thursday: { open: '11:00', close: '22:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '10:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '20:00', closed: false }
    },
    contact: {
      phone: "(555) 123-4567",
      social: {
        instagram: "@tacoparadise",
        facebook: "tacoparadisenyc"
      }
    },
    menu: {
      items: [
        { name: "Street Tacos", description: "3 soft corn tortillas with your choice of meat", price: 12.99, category: "Tacos" },
        { name: "California Burrito", description: "Carne asada, fries, cheese, sour cream", price: 14.99, category: "Burritos" },
        { name: "Veggie Quesadilla", description: "Grilled vegetables and cheese", price: 10.99, category: "Vegetarian", dietary: ["vegetarian"] }
      ],
      lastUpdated: new Date()
    },
    ratings: { average: 4.5, count: 127 },
    isActive: true
  },
  {
    name: "Brooklyn BBQ Mobile",
    cuisine: ["BBQ", "American"],
    description: "Slow-smoked meats and classic BBQ sides. Award-winning ribs and pulled pork sandwiches.",
    location: {
      type: 'Point',
      coordinates: [-73.9442, 40.6782], // Brooklyn
      address: "456 Prospect Park West, Brooklyn, NY 11215",
      neighborhood: "Park Slope"
    },
    hours: {
      monday: { open: '12:00', close: '20:00', closed: false },
      tuesday: { open: '12:00', close: '20:00', closed: false },
      wednesday: { open: '12:00', close: '20:00', closed: false },
      thursday: { open: '12:00', close: '21:00', closed: false },
      friday: { open: '12:00', close: '22:00', closed: false },
      saturday: { open: '11:00', close: '22:00', closed: false },
      sunday: { open: '11:00', close: '19:00', closed: false }
    },
    contact: {
      phone: "(555) 234-5678",
      website: "https://brooklynbbqmobile.com",
      social: {
        instagram: "@brooklynbbqmobile"
      }
    },
    menu: {
      items: [
        { name: "Pulled Pork Sandwich", description: "Slow-smoked pulled pork with coleslaw", price: 13.99, category: "Sandwiches" },
        { name: "Baby Back Ribs", description: "Half rack with BBQ sauce", price: 18.99, category: "Ribs" },
        { name: "Brisket Platter", description: "Sliced brisket with two sides", price: 22.99, category: "Platters" }
      ],
      lastUpdated: new Date()
    },
    ratings: { average: 4.7, count: 89 },
    isActive: true
  },
  {
    name: "Seoul Kitchen Truck",
    cuisine: ["Korean", "Asian"],
    description: "Modern Korean fusion cuisine. Famous for our Korean BBQ bowls and kimchi fries.",
    location: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484], // Midtown West
      address: "789 8th Avenue, New York, NY 10019",
      neighborhood: "Hell's Kitchen"
    },
    hours: {
      monday: { open: '11:30', close: '21:30', closed: false },
      tuesday: { open: '11:30', close: '21:30', closed: false },
      wednesday: { open: '11:30', close: '21:30', closed: false },
      thursday: { open: '11:30', close: '22:00', closed: false },
      friday: { open: '11:30', close: '22:30', closed: false },
      saturday: { open: '12:00', close: '22:30', closed: false },
      sunday: { open: '13:00', close: '20:00', closed: false }
    },
    contact: {
      phone: "(555) 345-6789",
      social: {
        instagram: "@seoulkitchentruck",
        twitter: "@seoulkitchen"
      }
    },
    menu: {
      items: [
        { name: "Korean BBQ Bowl", description: "Marinated beef bulgogi over rice with vegetables", price: 15.99, category: "Bowls" },
        { name: "Kimchi Fries", description: "Crispy fries topped with kimchi and Korean chili sauce", price: 8.99, category: "Sides", spicyLevel: 3 },
        { name: "Bibimbap", description: "Mixed rice bowl with vegetables and fried egg", price: 14.99, category: "Bowls", dietary: ["vegetarian"] }
      ],
      lastUpdated: new Date()
    },
    ratings: { average: 4.6, count: 156 },
    isActive: true
  },
  {
    name: "Green Garden Vegan",
    cuisine: ["Vegetarian", "Vegan", "Healthy"],
    description: "Plant-based comfort food. Fresh salads, veggie burgers, and smoothie bowls made with organic ingredients.",
    location: {
      type: 'Point',
      coordinates: [-73.9734, 40.7829], // Upper West Side
      address: "321 Columbus Avenue, New York, NY 10023",
      neighborhood: "Upper West Side"
    },
    hours: {
      monday: { open: '10:00', close: '19:00', closed: false },
      tuesday: { open: '10:00', close: '19:00', closed: false },
      wednesday: { open: '10:00', close: '19:00', closed: false },
      thursday: { open: '10:00', close: '20:00', closed: false },
      friday: { open: '10:00', close: '20:00', closed: false },
      saturday: { open: '09:00', close: '20:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false }
    },
    contact: {
      phone: "(555) 456-7890",
      website: "https://greengardenvegan.com",
      social: {
        instagram: "@greengardenvegan"
      }
    },
    menu: {
      items: [
        { name: "Beyond Burger", description: "Plant-based patty with vegan cheese and avocado", price: 13.99, category: "Burgers", dietary: ["vegan"] },
        { name: "Quinoa Power Bowl", description: "Quinoa with roasted vegetables and tahini dressing", price: 12.99, category: "Bowls", dietary: ["vegan", "gluten-free"] },
        { name: "Acai Smoothie Bowl", description: "Acai blend topped with granola and fresh fruits", price: 11.99, category: "Smoothie Bowls", dietary: ["vegan"] }
      ],
      lastUpdated: new Date()
    },
    ratings: { average: 4.3, count: 94 },
    isActive: true
  },
  {
    name: "Little Italy Express",
    cuisine: ["Italian"],
    description: "Authentic Italian street food. Wood-fired pizza, fresh pasta, and homemade gelato.",
    location: {
      type: 'Point',
      coordinates: [-73.9969, 40.7192], // Little Italy
      address: "654 Mulberry Street, New York, NY 10012",
      neighborhood: "Little Italy"
    },
    hours: {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '23:00', closed: false },
      friday: { open: '11:00', close: '24:00', closed: false },
      saturday: { open: '10:00', close: '24:00', closed: false },
      sunday: { open: '10:00', close: '22:00', closed: false }
    },
    contact: {
      phone: "(555) 567-8901",
      email: "info@littleitalyexpress.com",
      social: {
        facebook: "littleitalyexpressnyc",
        instagram: "@littleitalyexpress"
      }
    },
    menu: {
      items: [
        { name: "Margherita Pizza", description: "Fresh mozzarella, tomato, and basil", price: 16.99, category: "Pizza", dietary: ["vegetarian"] },
        { name: "Penne Arrabbiata", description: "Spicy tomato sauce with fresh herbs", price: 14.99, category: "Pasta", spicyLevel: 2, dietary: ["vegetarian"] },
        { name: "Pistachio Gelato", description: "Homemade gelato with real pistachios", price: 6.99, category: "Dessert", dietary: ["vegetarian"] }
      ],
      lastUpdated: new Date()
    },
    ratings: { average: 4.8, count: 203 },
    isActive: true
  }
];

export const seedDatabase = async () => {
  try {
    const response = await fetch('/api/trucks/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trucks: sampleTrucks }),
    });

    if (!response.ok) {
      throw new Error('Failed to seed database');
    }

    const result = await response.json();
    console.log('Database seeded successfully:', result);
    return result;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};