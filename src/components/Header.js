import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";

function Header(props) {
	return (
		<div className="header_wrapper">
			<div className="logo_wrapper">
				<Link to="/">
					<img className="logo" alt="logo" src={Logo} />
				</Link>
			</div>
			<div className="menu_wrapper">
				<div className="menu_item">
					<Link to="intro" className="link">
						소개 및 이용방법
					</Link>
				</div>
				<div className="menu_item">
					<Link to="test" className="link">
						모든 클래스
					</Link>
				</div>
				<div className="menu_item">
					<Link to="test" className="link">
						클래스 찾기
					</Link>
				</div>
				<div className="menu_item">
					<Link to="test" className="link">
						클래스 만들기
					</Link>
				</div>
			</div>
			<div className="login_wrapper">
				<div className="login_item">
					<Link to="test" className="link">
						로그인/회원가입
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Header;
