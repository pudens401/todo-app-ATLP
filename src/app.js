"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb://localhost:27017/todo');
const todoSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, required: true },
    priority: { type: Boolean, required: true },
});
const Todo = mongoose_1.default.model('Todo', todoSchema);
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.get('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const text = req.query.text;
    const completed = req.query.completed;
    const priority = req.query.priority;
    try {
        let todos;
        if (id) {
            todos = yield Todo.findById(id);
        }
        else if (text) {
            todos = yield Todo.findOne({ text: text });
        }
        else if (completed) {
            todos = yield Todo.findOne({ completed: true });
        }
        else if (priority) {
            todos = yield Todo.findOne({ priority: true });
        }
        else {
            todos = yield Todo.find();
        }
        res.json(todos);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
app.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, completed, priority } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'text must not be empty' });
    }
    const todo = new Todo({
        text, completed, priority,
    });
    try {
        const newTodo = yield todo.save();
        res.status(201).json(newTodo);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
app.delete('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletedTodo = yield Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'the task doesnot exist' });
        }
        res.json({ message: 'tasks has been deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
app.patch('/todos/:id&text', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updates = req.body;
    try {
        const todo = yield Todo.findByIdAndUpdate(id, updates, { new: true });
        if (!todo) {
            return res.status(404).json({ message: 'the task des not exist' });
        }
        res.json(todo);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
