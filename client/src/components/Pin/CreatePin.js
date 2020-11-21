import React, { useState, useContext } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import { useClient } from "../../client";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";

const CreatePin = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DELETE_DRAFT" });
  };

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "realtime-react");
    data.append("cloud_name", "shahram1989");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/shahram1989/image/upload",
      data,
    );
    return res.data.url;
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setSubmitting(true);
      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;
      const variables = { title, image: url, content, latitude, longitude };
      await client.request(CREATE_PIN_MUTATION, variables);
      // console.log("createPin", createPin);
      // dispatch({ type: "CREATE_PIN", payload: createPin });
      handleDeleteDraft();
    } catch (err) {
      setSubmitting(false);
      console.error("Error creating pin", err);
    }
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="primary"
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>
      <div>
        <TextField
          name="title"
          label="Title"
          aria-label="title"
          placeholder="Insert pin title"
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{
            "aria-label": "Add Title",
            label: "Add Title",
          }}
        />
        <input
          accept="image/*"
          id="image"
          type="file"
          label="image uploader"
          aria-label="image uploader"
          id="imagediv"
          className={classes.input}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <IconButton
            style={{ color: image && "green" }}
            component="span"
            size="small"
            className={classes.button}
            aria-labelledby="imagediv"
          >
            <AddAPhotoIcon />
          </IconButton>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          inputProps={{
            "aria-label": "Add Content",
            label: "Add Content",
          }}
          multiline
          rows={mobileSize ? "3" : "6"}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <IconButton
          onClick={handleDeleteDraft}
          className={classes.button}
          variant="contained"
          color="primary"
          aria-label="add an alarm"
        >
          <ClearIcon
            className={classes.leftIcon}
            id="discardlabeldiv"
            label="discard"
            aria-label="discard"
          />
          Discard
        </IconButton>
        <IconButton
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submitting}
          onClick={handleSubmit}
          title="Submit pin"
          label="Submit pin"
          aria-label="Submit pin"
          aria-labelledby="labeldiv"
        >
          Submit
          <SaveIcon
            className={classes.rightIcon}
            id="labeldiv"
            label="discard"
            aria-label="discard"
          />
        </IconButton>
      </div>
    </form>
  );
};

const styles = (theme) => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing(1),
  },
  contentField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "95%",
  },
  input: {
    display: "none",
  },
  alignCenter: {
    display: "flex",
    alignItems: "center",
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginLeft: 0,
  },
});

export default withStyles(styles)(CreatePin);
