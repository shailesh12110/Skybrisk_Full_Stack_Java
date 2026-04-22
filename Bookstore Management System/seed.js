const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./backend/models/Book');
const User = require('./backend/models/User');

dotenv.config();

// Sample books data
const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0743273565",
    description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    price: 12.99,
    category: "Fiction",
    publisher: "Scribner",
    publishedDate: new Date("1925-04-10"),
    language: "English",
    pages: 180,
    stock: 50,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71FTb9X6wsL.jpg"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0061120084",
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. To Kill A Mockingbird became both an instant bestseller and a critical success when it was first published in 1960.",
    price: 14.99,
    category: "Fiction",
    publisher: "Harper Perennial Modern Classics",
    publishedDate: new Date("1960-07-11"),
    language: "English",
    pages: 324,
    stock: 45,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71FxgtFKcQL.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "978-0451524935",
    description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell's nightmare vision of a totalitarian society.",
    price: 13.99,
    category: "Fiction",
    publisher: "Signet Classic",
    publishedDate: new Date("1949-06-08"),
    language: "English",
    pages: 328,
    stock: 40,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/91SZSW8qSsL.jpg"
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "978-0062316097",
    description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be 'human.'",
    price: 18.99,
    category: "History",
    publisher: "Harper Perennial",
    publishedDate: new Date("2015-02-10"),
    language: "English",
    pages: 464,
    stock: 35,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg"
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "978-0307887894",
    description: "Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted across the globe, changing the way companies are built and new products are launched.",
    price: 16.99,
    category: "Technology",
    publisher: "Crown Business",
    publishedDate: new Date("2011-09-13"),
    language: "English",
    pages: 336,
    stock: 30,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81-QB7nDh4L.jpg"
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-0735211292",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    price: 15.99,
    category: "Self-Help",
    publisher: "Avery",
    publishedDate: new Date("2018-10-16"),
    language: "English",
    pages: 320,
    stock: 55,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81YkqyaFVEL.jpg"
  },
  {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    isbn: "978-0198788607",
    description: "The Selfish Gene is a 1976 book on evolution by Richard Dawkins, in which the author builds on the principal theory of George C. Williams's Adaptation and Natural Selection (1966). Dawkins uses the term 'selfish gene' as a way of expressing the gene-centred view of evolution.",
    price: 17.99,
    category: "Science",
    publisher: "Oxford University Press",
    publishedDate: new Date("1976-01-01"),
    language: "English",
    pages: 496,
    stock: 25,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71V8b-d-QzL.jpg"
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    isbn: "978-1451648539",
    description: "Based on more than forty interviews with Jobs conducted over two years—as well as interviews with more than a hundred family members, friends, adversaries, competitors, and colleagues—Walter Isaacson has written a riveting story of the roller-coaster life and searingly intense personality of a creative entrepreneur.",
    price: 19.99,
    category: "Biography",
    publisher: "Simon & Schuster",
    publishedDate: new Date("2011-10-24"),
    language: "English",
    pages: 656,
    stock: 20,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81VStYnDGrL.jpg"
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "978-0439708180",
    description: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle.",
    price: 11.99,
    category: "Children",
    publisher: "Scholastic",
    publishedDate: new Date("1998-09-01"),
    language: "English",
    pages: 309,
    stock: 60,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg"
  },
  {
    title: "Educated",
    author: "Tara Westover",
    isbn: "978-0399590504",
    description: "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University. Educated is an account of the struggle for self-invention.",
    price: 16.99,
    category: "Biography",
    publisher: "Random House",
    publishedDate: new Date("2018-02-20"),
    language: "English",
    pages: 352,
    stock: 38,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71-4MkLN5jL.jpg"
  }
];

// Admin user
const adminUser = {
  name: "Admin User",
  email: "admin@bookstore.com",
  password: "admin123",
  role: "admin",
  phone: "1234567890",
  address: {
    street: "123 Admin Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  }
};

// Sample user
const sampleUser = {
  name: "John Doe",
  email: "user@bookstore.com",
  password: "user123",
  role: "user",
  phone: "0987654321",
  address: {
    street: "456 User Avenue",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "USA"
  }
};

// Connect to database and seed
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected...');

    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data...');

    // Insert sample books
    await Book.insertMany(sampleBooks);
    console.log('Sample books inserted...');

    // Create admin and sample user
    await User.create(adminUser);
    await User.create(sampleUser);
    console.log('Admin and sample user created...');

    console.log('\n=================================');
    console.log('Database seeded successfully!');
    console.log('=================================');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@bookstore.com');
    console.log('Password: admin123');
    console.log('\nSample User Credentials:');
    console.log('Email: user@bookstore.com');
    console.log('Password: user123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
