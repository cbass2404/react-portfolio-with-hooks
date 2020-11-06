import React, { useEffect, useState } from "react";
import axios from "axios";
import DropzoneComponent from "react-dropzone-component";

import RichTextEditor from "../forms/rich-text-editor";

const BlogForm = (props) => {
  const featuredImageRef = React.createRef();
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [blog_status, setBlogStatus] = useState("");
  const [content, setContent] = useState("");
  const [featured_image, setFeaturedImage] = useState("");
  const [apiUrl, setApiUrl] = useState(
    "https://corybass.devcamp.space/portfolio/portfolio_blogs"
  );
  const [apiAction, setApiAction] = useState("post");

  const deleteImage = (imageType) => {
    axios
      .delete(
        `https://api.devcamp.space/portfolio/delete-portfolio-blog-image/${props.blog.id}?image_type=${imageType}`,
        { withCredentials: true }
      )
      .then((res) => {
        props.handleFeaturedImageDelete();
      })
      .catch((err) => {
        console.log("DELETE IMAGE ERROR:", err);
      });
  };

  useEffect(() => {
    if (props.editMode) {
      const { id, title, blog_status, content } = props.blog;
      setId(id);
      setTitle(title);
      setBlogStatus(blog_status);
      setContent(content);
      setApiUrl(
        `https://corybass.devcamp.space/portfolio/portfolio_blogs/${props.blog.id}`
      );
      setApiAction("patch");
    }
  });

  const componentConfig = () => {
    return {
      iconFiletypes: [".jpg", ".png"],
      showFiletypeIcon: true,
      postUrl: "https://httpbin.org/post",
    };
  };

  const djsConfig = () => {
    return {
      addRemoveLinks: true,
      maxFiles: 1,
    };
  };

  const handleFeaturedImageDrop = () => {
    return {
      addedfile: (file) => setFeaturedImage(file),
    };
  };

  const handleRichTextEditorChange = (content) => {
    setContent(content);
  };

  const buildForm = () => {
    let formData = new FormData();

    formData.append("portfolio_blog[title]", title);
    formData.append("portfolio_blog[blog_status]", blog_status);
    formData.append("portfolio_blog[content]", content);

    if (featured_image) {
      formData.append("portfolio_blog[featured_image]", featured_image);
    }

    return formData;
  };

  const handleSubmit = (e) => {
    axios({
      method: apiAction,
      url: apiUrl,
      data: buildForm(),
      withCredentials: true,
    })
      .then((res) => {
        if (featured_image) {
          featuredImageRef.current.dropzone.removeAllFiles();
        }
        setTitle("");
        setBlogStatus("");
        setContent("");
        setFeaturedImage("");

        if (props.editMode) {
          props.handleUpdateFormSubmission(res.data.portfolio_blog);
        } else {
          props.handleSuccessfullFormSubmission(res.data.portfolio_blog);
        }
      })
      .catch((e) => {
        console.log("handleSubmit for blog ERROR:", e);
      });

    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="blog-form-wrapper">
      <div className="two-column">
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Blog Title"
        />
        <input
          name="blog_status"
          value={blog_status}
          onChange={(e) => setBlogStatus(e.target.value)}
          type="text"
          placeholder="Blog Status"
        />
      </div>

      <div className="one-column">
        <RichTextEditor
          handleRichTextEditorChange={handleRichTextEditorChange}
          editMode={props.editMode}
          contentToEdit={
            props.editMode && props.blog.content ? props.blog.content : null
          }
        />
      </div>

      <div className="image-uploaders">
        {props.editMode && props.blog.featured_image_url ? (
          <div className="image-manager-image-wrapper">
            <img src={props.blog.featured_image_url} />

            <div className="image-removal-link">
              <a onClick={() => deleteImage("featured_image")}>Remove Image</a>
            </div>
          </div>
        ) : (
          <DropzoneComponent
            ref={featuredImageRef}
            config={componentConfig()}
            djsConfig={djsConfig()}
            eventHandlers={handleFeaturedImageDrop()}
          >
            <div className="dz-message">Featured Image</div>
          </DropzoneComponent>
        )}
      </div>

      <button className="btn">Save</button>
    </form>
  );
};

export default BlogForm;
