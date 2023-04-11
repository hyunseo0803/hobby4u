import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";

function Footer(props) {
	return (
		<div className="footer_wrap">
			<Link to="testinfo">
				<p>이곳은 footer 입니다. 관리자 정보 보고싶으면 누르세요</p>
			</Link>
		</div>
	);
}

export default Footer;
