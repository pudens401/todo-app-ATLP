import express, {Application,Request,Response} from "express";
import bodyParser from "body-parser";
import mongoose,{Error} from "mongoose";

mongoose.connect('mongodb://localhost:27017/todo');
const todoSchema = new mongoose.Schema({
    text: {type:String,required:true},
    completed:{type:Boolean,required:true},
    priority:{type:Boolean,required:true},
});
const Todo = mongoose.model('Todo',todoSchema);


const app:Application = express();
app.use(bodyParser.json());


app.get('/todos', async(req: Request,res:Response)=>{
    const id = req.query.id;
    const text = req.query.text;
    const completed = req.query.completed;
    const priority = req.query.priority;

    try{
        let todos;
        if(id){
            todos = await Todo.findById(id);
        }else if(text){
            todos = await Todo.findOne({text:text});
        }else if(completed){
            todos = await Todo.findOne({completed:true});
        }else if(priority){
            todos = await Todo.findOne({priority:true});
        }
        else{
            todos = await Todo.find();
        }
        res.json(todos);
    }
    catch(err){
        res.status(400).json({message:(err as Error).message});

    }
})


app.post('/todos', async(req: Request, res:Response)=>{
    const { text,completed,priority } = req.body;
    if(!text){
        return res.status(400).json({message:'text must not be empty'})
    }

    const todo = new Todo({
        text,completed,priority,
    });

    try{
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    }
    catch(err){
        res.status(400).json({message:(err as Error).message});
    }
});

app.delete('/todos/:id',async(req:Request, res:Response)=>{
    const id = req.params.id;

    try{
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if(!deletedTodo){
            return res.status(404).json({ message: 'the task doesnot exist' });
        }
        res.json({message:'tasks has been deleted'});
    }
    catch(err){
        res.status(500).json({message:(err as Error).message});
    }

});

app.patch('/todos/:id&text', async (req: Request, res: Response) => {
    
    const id = req.params.id;
    const updates = req.body;

    try {
        const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
        
        if (!todo) {
            return res.status(404).json({ message: 'the task des not exist' });
        }

        res.json(todo);
    } 
    catch(err){
        res.status(400).json({ message: (err as Error).message });
    }
});






const PORT = process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});