const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');


// route  1 ; all project fetch
// GET /api/project/fetchallproject

router.get('/fetchallproject', authorize(['SuperAdmin']), async (req, res) => {
    try {
        const project = await Project.find();
        res.json(project)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal server error occured ");


    }
}
)

// route  2 ; add project 
// POST /api/project/addproject
router.post('/addproject', authorize(['SuperAdmin', 'Admin']), [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be 5 characters').isLength({ min: 5 }),
    body('tag'),
    body('clientID', 'enter a valid clientID').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { title, description, tag, clientID } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //create new project
        const project = new Project({
            title,
            description,
            tag,
            clientID,
            
        });
        const saveProject = await project.save();
        res.json(saveProject);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal server error occured ");


    }

})
//ROUTE 3 : update a Project 


//ROUTE 3 : update a Project 
//PUT /api/project/updateproject/:id
router.put('/updateproject/:id', authorize(['SuperAdmin', 'Admin']), async (req, res) => {
    const { title, description, clientID } = req.body;
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Check if the user has permission to update the project
        if (req.user.role !== 'SuperAdmin' && project.clientID !== req.user.id) {
            return res.status(403).json({ msg: 'You are not authorized to update this project' });
        }

        // Update project fields
        project.title = title;
        project.description = description;
        project.clientID = clientID;

        // Save updated project
        await project.save();

        res.json({ msg: 'Project updated successfully', project });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occurred");
    }
});


//ROUTE 4 : delete a project 
//DELETE /api/project/deleteproject/:id
router.delete('/deleteproject/:id', authorize(['SuperAdmin']), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        await Project.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Project removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occurred");
    }
});



// route  5 ; fetch projects linked to client 

// GET /api/project/fetchclientproject
router.get('/fetchclientproject', authorize(['SuperAdmin', 'Admin' ,'Client']), async (req, res) => {
    try {
        const project = await Project.find({ clientID: req.user.id });
        res.json(project)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal server error occured ");
    }
}
)

module.exports = router