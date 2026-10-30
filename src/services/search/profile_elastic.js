import { elasticClient } from "../../config/elasticsearch.js";

export async function syncProfile(profile) {
  const coordinates = profile.location?.coordinates;

  const document = {
    profileId: profile._id.toString(),
    userId: profile.userId?.toString(),
    displayName: profile.displayName,
    bio: profile.bio,
    age: profile.age,
    minAge: profile.minAge,
    maxAge: profile.maxAge,
    gender: profile.gender,
    interestedIn: profile.InterestedIn,
    isDiscoverable: profile.isDiscoverable,
    interests: (profile.interests || []).map(String),
    ...(coordinates?.length === 2
      ? {
          location: {
            lon: coordinates[0],
            lat: coordinates[1],
          },
        }
      : {}),
  };

  const createIndex =await elasticClient.index({
    index: "lov-profiles",
    id: profile._id.toString(),
    document,
  });
  console.log("index Created")
}

