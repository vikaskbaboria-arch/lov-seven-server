
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";

dotenv.config();

// Bengaluru-area coordinates: [longitude, latitude]
const bengaluruAreas = [
  { name: "Koramangala", coordinates: [77.6245, 12.9352] },
  { name: "Indiranagar", coordinates: [77.6408, 12.9784] },
  { name: "Whitefield", coordinates: [77.7499, 12.9698] },
  { name: "Electronic City", coordinates: [77.6602, 12.8452] },
  { name: "Jayanagar", coordinates: [77.5838, 12.9250] },
  { name: "HSR Layout", coordinates: [77.6476, 12.9116] },
  { name: "BTM Layout", coordinates: [77.6099, 12.9166] },
  { name: "Malleshwaram", coordinates: [77.5713, 13.0035] },
  { name: "Hebbal", coordinates: [77.5980, 13.0358] },
  { name: "Marathahalli", coordinates: [77.6974, 12.9591] },
  { name: "Rajajinagar", coordinates: [77.5550, 12.9910] },
  { name: "Banashankari", coordinates: [77.5733, 12.9255] },
];

const firstNames = [
  "Aarav", "Aditya", "Arjun", "Dev", "Ishaan",
  "Kabir", "Karan", "Krish", "Rohan", "Rahul",
  "Ananya", "Aditi", "Diya", "Isha", "Kavya",
  "Meera", "Neha", "Priya", "Riya", "Sanya",
];

const bios = [
  "Coffee, conversations, and spontaneous plans ☕",
  "Music lover with a soft spot for sunsets.",
  "Here to meet someone genuine.",
  "Weekend explorer and food enthusiast.",
  "Introvert until you mention my favorite music.",
  "Looking for good vibes and meaningful connections.",
  "Movies, memes, and late-night conversations.",
  "Gym, music, and discovering new places.",
  "Always up for an adventure.",
  "Let's start with a good conversation.",
];

const interestIds = []; // Optionally add valid Interest ObjectIds.

const randomItem = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Random offset within approximately 5 km of an area.
// Latitude and longitude offsets are not equal in distance.
function randomCoordinates([longitude, latitude]) {
  const radiusKm = 5;
  const distance = Math.sqrt(Math.random()) * radiusKm;
  const angle = Math.random() * 2 * Math.PI;

  const latOffset = (distance * Math.cos(angle)) / 111;
  const lngOffset =
    (distance * Math.sin(angle)) /
    (111 * Math.cos((latitude * Math.PI) / 180));

  return [
    longitude + lngOffset,
    latitude + latOffset,
  ];
}

async function seedProfiles() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const count = 120;
    const createdUsers = [];
    const createdProfiles = [];

    // Clean up only users and profiles created by this seed.
    await User.deleteMany({
      email: { $regex: /^lov-seed-\d+@example\.com$/ },
    });

    await Profile.deleteMany({
      displayName: { $regex: /^LOV Seed \d+$/ },
    });

    // IMPORTANT:
    // Change these fields to match your User schema.
    // Use your existing password hashing/auth utility if needed.
    for (let i = 1; i <= count; i++) {
      const user = await User.create({
        name: `lov_seed_${i}`,
        email: `lov-seed-${i}@example.com`,
        passwordHash: "TestPassword123!",
      });

      createdUsers.push(user);
    }

    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const area = randomItem(bengaluruAreas);

      const gender = Math.random() < 0.5 ? "male" : "female";
      const interestedIn =
        gender === "male" ? "female" : "male";

      const age = randomInt(18, 30);

      const profile = {
        userId: user._id,
        age,
        minAge: Math.max(18, age - randomInt(2, 5)),
        maxAge: Math.min(30, age + randomInt(2, 5)),
        displayName: `LOV Seed ${i + 1}`,
        bio: randomItem(bios),
        gender,
        InterestedIn: interestedIn,

        location: {
          type: "Point",
          coordinates: randomCoordinates(area.coordinates),
        },

        isDiscoverable: true,
        interests: interestIds,
      };

      createdProfiles.push(profile);
    }

    await Profile.insertMany(createdProfiles);

    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdProfiles.length} profiles`);
    console.log("Bengaluru discovery seed completed!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProfiles();
