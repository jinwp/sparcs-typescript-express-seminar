import express from "express";
import feedStore from "../modules/feedStore";
import {z} from "zod";

const router = express.Router();

const addFeedSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const deleteFeedSchema = z.object({
  id: z.number(),
});

const editFeedSchema = z.object({
  id: z.number(),
  newTitle: z.string(),
  newContent: z.string(),
});

router.get("/getFeed", (req, res) => {
  try {
    const requestCount = parseInt(req.query.count as string, 10);
    const storeRes = feedStore.selectItems(requestCount);
    if (storeRes.success) {
      res.json(storeRes.data);
    } else {
      res.status(400).json(storeRes.data);
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/addFeed", (req, res) => {
  try {
    const obj = addFeedSchema.parse(req.body);
    const { title, content } = obj;
    const storeRes = feedStore.insertItem({ title, content });
    if (storeRes) {
      res.json({ isOK: true });
    } else {
      res.status(500).json({ isOK: false });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/deleteFeed", (req, res) => {
  try {
    const obj = deleteFeedSchema.parse(req.body);
    const { id } = obj;

    const storeRes = feedStore.deleteItem(id);
    if (storeRes) {
      res.json({ isOK: true });
    } else {
      res.status(500).json({ isOK: false });
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid format", details: e.errors });
    } else {
      res.status(500).json({ error: e });
    }
  }
});

router.post("/editFeed", (req, res) => {
  try {
    const obj = editFeedSchema.parse(req.body);
    const { id, newTitle, newContent } = obj;
    const storeRes = feedStore.editItem({ id, newTitle, newContent });
    if (storeRes) {
      res.json({ isOK: true });
    } else {
      res.status(500).json({ isOK: false });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
