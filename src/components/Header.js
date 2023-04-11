import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";

function Header(props) {
	return (
		<div className="header_wrap">
			<Link to="/">
				<p>헤더 이고, 맨 처음 화면으로 감 </p>
			</Link>
			<Link to="test">
				<p>헤더 이고, 헤더로 인해 바뀐 화면으로 감 </p>
			</Link>
		</div>
	);
}

export default Header;
