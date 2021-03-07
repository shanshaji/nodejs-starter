const { Router } = require("express");
const taskRouter = Router()
const multer = require('multer')
const Task = require("../../models/task")
const middlewares = require('../middleware');

module.exports = (app) => {
  	app.use("/tasks", taskRouter);
  	taskRouter.post('/', middlewares.isAuth,  async (req, res) => {
    	const task = new Task({...req.body, owner: req.userId})
    	try {
        	await task.save()
        	res.status(201).send(task)
	    } catch (e) {
	        res.status(400).send(e)
	    }
	})

	taskRouter.get('/:id', async (req, res) => {
	    const _id = req.params.id
	    try {
	        const task = await Task.findOne({ _id, owner: req.user._id})
	        if(!task){
	            return res.status(404).send()
	        }
	        res.send(task)
	    } catch(e){
	        res.status(500).send()
	    }
	})

	taskRouter.patch('/:id', middlewares.isAuth, async (req, res) => {
	    const updates = Object.keys(req.body)
	    const allowedUpdates = ["description", "completed"]
	    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

	    if (!isValidOperation) {
	        return res.status(400).send({error: "Invalid Updates"});
	    }
	    try {
	        const task = await Task.findOne({_id: req.params.id, owner: req.userId})
	        if(!task){
	            return res.status(404).send()
	        }
	        updates.forEach((update) => task[update] = req.body[update])
				
	        await task.save()
	        res.send(task)
	    } catch(e){
	        res.status(500).send()
	    }
	})

	taskRouter.get('/', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
	    const match = {}
	    const sort = {}
	    if(req.query.sortBy){
	        const parts = req.query.sortBy.split('_')
	        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
	    }
	    if(req.query.completed){
	        match.completed = req.query.completed === 'true'
	    }
	    try {
	        const tasks = await Task.find({owner: req.userId})
	        await req.user.populate({
	            path: 'tasks',
	            match,
	            options: {
	                limit: parseInt(req.query.limit),
	                skip: parseInt(req.query.skip),
	                sort
	            }
	        }).execPopulate()
	        res.send(req.user.tasks)     
	    } catch(e) {
	        res.status(500).send()
	    }
	})

	taskRouter.delete('/:id', middlewares.isAuth,  async (req, res) => {

	    try{
	        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.userId})
	        if(!task){
	            return res.status(404).send()
	        }
	        res.send(task)
	    } catch (e){
	        res.status(500).send()
	    }
	})

	const upload = multer({
	    dest: 'images',
	    limits: {
	        fileSize: 1000000
	    },
	    fileFilter(req, file, cb){
	        if(!file.originalname.match(/\.(doc|docx|pdf)$/)){
	            cb(new Error('File Must be PDF'))
	        }
	        cb(undefined, true)
	    }
	})
	
	taskRouter.post('/upload', upload.single('upload'), (req,res) => {
	    res.send("task   uploaded")
	},(error,req,res,next)=>{
	    res.status(400).send({error: error.message})
	})


};
