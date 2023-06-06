import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function NewPost() {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState([]);
  const [token, setToken] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      console.log("No images", images);
      newPostsAgain();
    }
  }, []);

  const newPostsAgain = async () => {
    const userData = {
      token: token ? token : "",
    };
    await axios
      .post("/limit/post", userData)
      .then((result) => {
        setLimit(result.data.response.Contents);


        setToken(result.data.token);
        const postData = result.data.response.Contents;
        postData.forEach((element) => {
          setImages((images) => [...images, element]);
        });

        // setImages((images) => [...images, result.data.response.Contents]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    await axios.post("/api/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  async function getPosts() {
    const result = await axios.get("/api/posts/get");
    setPosts(result.data);
  }
  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center App-header">
      <form
        onSubmit={submit}
        style={{ width: 650 }}
        className="flex flex-col space-y-5 px-5 py-14"
      >
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          type="text"
          placeholder="Caption"
        ></input>
        <button type="submit">Submit</button>
      </form>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {posts.map((post) => (
          // <div key={`post-${post.Key}`}>
          <div key={`post-${post.id}`}>
            <img
              // src={post.urlPath}
              src={post.imageUrl}
              alt={post.caption}
              style={{
                width: "200px",
                height: "200px",
              }}
            />
          </div>
        ))}
      </div>
      <div>
        <button onClick={newPostsAgain}>new item</button>
        {limit?.map((res) => (
          <div key={`post-${res.Key}`}>{res.Key}</div>
        ))}
        {/* {images?.map((res) => (
          <div key={`post-${res.response.Contents.Key}`}>{res}</div>
        ))} */}
      </div>
    </div>
  );
}
