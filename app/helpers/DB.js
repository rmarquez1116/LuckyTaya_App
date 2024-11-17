// pages/api/posts.js

import clientPromise from '../lib/mongodb';

export async function fetchData(collection, request) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const postsCollection = db.collection(collection);
        const posts = await postsCollection.find(request).project({_id : 0}).toArray();
        return posts
    } catch (error) {
        return null
    }
}

export async function saveData(collection, data) {
    try {
        const client = await clientPromise;
        const db = client.db(); // Get the database
        const postsCollection = db.collection(collection); // Get the "posts" collection
        const result = await postsCollection.insertOne(data);
        return result.insertedId
    } catch (error) {
        return false;
    }
}
export async function updateData(collection,query, data) {
    try {
        const client = await clientPromise;
        const db = client.db(); // Get the database
        const postsCollection = db.collection(collection); // Get the "posts" collection
        console.log(data,'hello')
        
        const result = await postsCollection.updateOne(query,{
            $set : data
        });
        return result.matchedCount >0
    } catch (error) {
        return false;
    }
}