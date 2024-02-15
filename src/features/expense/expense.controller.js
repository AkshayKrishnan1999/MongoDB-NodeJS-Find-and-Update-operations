import ExpenseRepository from "./expense.repository.js";
import ExpenseModel from "./expense.model.js";
export default class ExpenseController {
  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  // Create new expense
  add = async (req, res) => {
   const {title,amount,date,isRecurring,tags}=req.body;
   const item=new ExpenseModel(title,amount,date,isRecurring,tags);
   await this.expenseRepository.addExpense(item);
   res.status(201).send(item);
  };

  // Get a specific expense
  getOne = async (req, res) => {
    const {id}=req.params;
    const result=await this.expenseRepository.getOne(id);
    if(!result)
    {
      res.status(401).send('Not Found');
    }
    else
    res.status(200).send(result);
  };

  // Get all expenses
  getAll = async (req, res) => {
    const result=await this.expenseRepository.getAllExpenses();
    if(!result)
    {
      res.status(401).send('Not Found');
    }
    else
    res.status(200).send(result);
  };

  // Add a tag to an expense
  addTag = async (req, res) => {
      const id=req.params.id;
      const tag=req.params.tag;
      const answer=await this.expenseRepository.addTagToExpense(id,tag);
      if(answer){
      res.status(200).send(answer);}
      else{
        res.status(400).send('dnf');
      }
  };

  // Filter expenses based on given criteria
  filter = async (req, res) => {
    try {
      const { minimumAmount, maximumAmount, isRecurring } = req.query; 

      // Construct the criteria object
      const criteria = {
          minimumAmount,
          maximumAmount,
          isRecurring
      };

      // Call the filterExpenses function
      const filteredExpenses = await this.expenseRepository.filterExpenses(criteria);

      res.json(filteredExpenses); 
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error filtering expenses' });
  }
    
  };
}
