import React from "react";
import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../Actions/User";
import User from "../User/User";
import { useState } from "react";
import "./Search.css";
const Search = () => {
  const [name, setName] = useState("");
  const { users, loading } = useSelector((state) => state.allUser);
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllUsers(name));
  };
  return (
    <div className="search">
      <form action="" className="searchForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>

        <input
          type="text"
          value={name}
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <Button disabled={loading} type="submit" onClick={submitHandler}>
          Search
        </Button>

        <div className="searchResults">
          {users &&
            users.map((element) => {
              return (
                <User
                  key={element._id}
                  userId={element._id}
                  name={element.name}
                  avatar={element.avatar.url}
                />
              );
            })}
        </div>
      </form>
    </div>
  );
};

export default Search;
