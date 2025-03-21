const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const Post = require('../models/post.model');

const router = express.Router();

// Create a Post 
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({
            title, content,
            author: req.user.userId
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

// Get all posts
router.get("/", async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find().populate("author", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit);

        const totalPosts = await Post.countDocuments();
        res.status(200).json({
            page, limit, totalPosts, posts
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Get stats of the posts by user
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const stats = await Post.aggregate([{
            $group: {
                _id: "$author",
                totalPosts: { $sum: 1 },
            }
        }, {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        }, {
            $unwind: "$user"
        }, {
            $project: {
                _id: 0,
                userId: "$user._id",
                name: "$user.name",
                email: "$user.email",
                totalPosts: 1,
            }
        }
        ])
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

// Get post by Id
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate("author", "name email");

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Update post details by Id
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized to update the post" });
        }
        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Delete post by Id
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = Post.findById(postId)

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized to delete the post" });
        }

        await post.deleteOne();
        res.status(200).json({ message: "Post has been deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router;