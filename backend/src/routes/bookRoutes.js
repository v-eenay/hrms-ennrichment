import express from 'express'
import { Book } from '../models/bookModel.js'
const router = express.Router()

// Middleware to parse JSON bodies
router.use(express.json())

// Route to save a book to the database
router.post('/', async (req, res) =>{
  try{
    if(
      !req.body.title ||
      !req.body.author ||
      !req.body.publishYear
    ){
      return res.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }
    else{
      const newBook = {
        title: req.body.title,
        author: req.body.author,
        publishYear: req.body.publishYear,
      }
      const book = await Book.create(newBook);
      return res.status(201).send(book);
    }
  }
  catch(error){
    console.log(error.message);
    res.status(500).send({message: error.message});

  }
});

// Route to get all books from the database

router.get('/', async(req, res)=>{
  try{
    const books = await Book.find({});
    if(books.length === 0){
      return res.status(404).send({message: 'No books found'});
    }
    return res.status(200).json(
      {
        message: 'Books retrieved successfully',
        count: books.length,
        books: books
      }
    );
  }
  catch(error){
    console.log(error.message);
    res.status(500).send({message: error.message});
  }
});

// Route to get one book from the database by id

router.get('/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const book = await Book.findById(id);
    if(!book){
      return res.status(404).send({message: 'Book not found'});
    }
    return res.status(200).json({
      message: 'Book retrieved successfully',
      book: book
    });
  }
  catch(error){
    console.log(error.message);
    res.status(500).send({message: error.message});
  }
})

// Route to update a book by id

router.put(
    '/:id',
    async (req, res)=>{
        try{
            if(
                !req.body.title ||
                !req.body.author ||
                !req.body.publishYear
            ){
                return res.status(400).send({
                    message: 'Send all required fields: title, author, publishYear',
                });
            }
            else{
                const {id} = req.params;
                const result = await Book.findByIdAndUpdate(id, req.body);
                if(!result){
                    return res.status(404).send({message: 'Book not found'});
                }
                return res.status(200).send({message: 'Book updated successfully'});
            }
        }
        catch(error){
            console.log(error.message);
            res.status(500).send({message: error.message});
        }
    }
);

// Route to delete a book by id
router.delete(
    '/:id',
    async (req, res)=>{
        try{
            const {id} = req.params;
            const result = await Book.findByIdAndDelete(id);
            if(!result){
                return res.status(404).send({message: 'Book not found'});
            }
            return res.status(200).send({message: 'Book deleted successfully'});
        }
        catch(error){
            console.log(error.message);
            res.status(500).send({message: error.message});
        }
    }
);
export default router;