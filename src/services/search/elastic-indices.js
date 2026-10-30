import {elasticClient} from "../../config/elasticsearch.js"

const INDEX = "lov-profiles"

export async function createProfileIndex(){
   

   const exist = await elasticClient.indices.exists({
    index:INDEX
   })
   if(exist){
    console.log("Indice allready exist");
   }
   await elasticClient.indices.create({
    index:INDEX,
    mappings:{
        properties:{
            profileId:{type:"keyword"},
            displayName:{type:"keyword"},
              bio: { type: "text" },
        profilePic: { type: "keyword", index: false },
        age: { type: "integer" },
        minAge: { type: "integer" },
        maxAge: { type: "integer" },
        gender: { type: "keyword" },
        interestedIn: { type: "keyword" },
        isDiscoverable: { type: "boolean" },
        interests: { type: "keyword" },
        location: { type: "geo_point" },
        }

    }
   })

     console.log("Created lov-profiles index");
}

createProfileIndex()
  .catch(console.error)
  .finally(() => elasticClient.close());