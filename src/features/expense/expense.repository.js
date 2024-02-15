//import { get } from "superagent";
import { getDB } from "../../config/mongodb.js";
import {ObjectId} from 'mongodb'
export class ExpenseRepository {
  constructor() {
    this.collectionName = "expenses"; // name of the collection in mongodb
  }

  // Create a new expense
  async addExpense(expense) {
    try{
    const db=getDB();
    const collection=db.collection("ExpenZap");
    await collection.insertOne(expense);
    return expense;
    }
    catch(err)
    {
      console.log(err);
    }
  }

  // Get one expnese by its ID
  async getOne(id) {
    try
    {
      const db=getDB();
      const collection=db.collection("ExpenZap");
      console.log("called");
      const res=await collection.findOne({ "_id": new ObjectId(id)});
      return res;
    }
    catch(err)
    {
        console.log(err);
    }
  }

  // Get all expenses
  async getAllExpenses() {
    try{
      const db=getDB();
      const collection=db.collection("ExpenZap");
      const result=await collection.find({});
      const results = await result.toArray(); // Convert results to an array
        return results;
    }
    catch(err){
      console.log(err);
    }
  }

  // Add tag to an expense
  async addTagToExpense(id, tag) {
    try{
      const db=getDB();
      const collection=db.collection("ExpenZap");
      const result=await collection.updateOne({"_id": new ObjectId(id)},{"$push":{tag:tag}});
      return result;
    }
    catch(err)
    {
      console.log(err);
    }

  }

  // Filter expenses based on date, amount, and isRecurring field
  async filterExpenses(criteria) {
    try {
      const db = getDB();
      const collection = db.collection("ExpenZap");

      const filterQuery = {};

      // Handle potential filter criteria
      if (criteria.minimumAmount) {
          filterQuery.amount = { $gte: parseInt(criteria.minimumAmount) };
      }
      if (criteria.maximumAmount) {
          filterQuery.amount = { ...filterQuery.amount, $lte: parseInt(criteria.maximumAmount) }; 
      }
      if (criteria.isRecurring) {
          filterQuery.isRecurring = criteria.isRecurring;
      }
     
   

      const cursor = collection.find(filterQuery);
      const results = await cursor.toArray();

      return results;
  } catch (err) {
      console.error(err);
    
      throw new Error('Error filtering expenses'); 
  }
  }
}

export default ExpenseRepository;
