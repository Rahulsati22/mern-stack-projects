import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Header.css'
import {
  Home,
  HomeOutlined,
  Add,
  AddOutlined,
  SearchOutlined,
  Search,
  AccountCircle,
  AccountCircleOutlined,
} from "@mui/icons-material";
const Header = () => {
    const [tab, setTab] = useState(window.location.pathname);
    console.log(tab)
  return (
    <div className="header">
      <Link to="/" onClick={()=>setTab("/")}>
       { tab !== "/" ? <HomeOutlined/> : <Home style={{"color":"black"}}/>}
      </Link>

      <Link to="/newpost" onClick={()=>setTab("/newpost")}>
        {tab !== "/newpost" ? <AddOutlined/> : <Add style={{"color":"black"}}/>}
      </Link>

      <Link to="/search" onClick={()=>setTab("/search")}>
        {tab!=="/search" ? <SearchOutlined/>:<Search style={{"color":"black"}}/>}
      </Link>

      <Link to="/account" onClick={()=>setTab("/account")}>
        {tab !== "/account" ? <AccountCircleOutlined/>:<AccountCircle style={{"color":"black"}}/>}
      </Link>
    </div>
  );
};

export default Header;
