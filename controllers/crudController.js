import PostModel from "../models/Post.js";
import AlertModel from "../models/Alerts.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      tickers: req.body.tickers,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "cant get doc",
    });
  }
};

export const createAlert = async (req, res) => {
  try {
    const doc = new AlertModel({
      tickers: req.body.tickers,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "cant get doc",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await AlertModel.find();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "cant get doc",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findById(postId);
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "cant get doc",
    });
  }
};

export const update = async (req, res) => {
  try {
    const dataID = req.params.id;

    await PostModel.updateOne(
      {
        _id: dataID,
      },
      {
        tickers: req.body,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "cant update doc",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "cant delete doc",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "cant find doc",
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "cant get doc",
    });
  }
};
