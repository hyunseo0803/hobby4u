//메뉴바

import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";

function Header(props) {
	const { userData } = props;

	// 로그아웃
	const logout = () => {
		try {
			const app_key = process.env.REACT_APP_KAKAO_APP_KEY;
			const logout_redirect_uri = "http://localhost:3000/";
			window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${app_key}&logout_redirect_uri=${logout_redirect_uri}`;
			localStorage.removeItem("token");
		} catch (error) {
			throw new Error(error.message);
		}
	};

	return (
		<div className="header_wrapper">
			<div className="logo_wrapper">
				<Link to="/">
					<img className="logo" alt="logo" src={Logo} />
				</Link>
			</div>
			<div className="menu_wrapper">
				<div className="menu_item">
					{/* Mento 및 Metee의 혜택, Mentor가 되는 방법 */}
					<Link to="myclass" className="link">
						내 클래스
					</Link>
				</div>

				<div className="menu_item">
					{/* 제목 및 소개로 검색, 태그별 검색  */}
					<Link to="judge" className="link">
						클래스 심사 현황
					</Link>
				</div>
				<div className="menu_item">
					{/* 클래스 업로드 화면, 로그인 안되어있을 경우 로그인 화면으로  */}
					<Link
						to="createclass"
						className="link"
						style={{
							backgroundColor: "black",
							color: "white",
							borderRadius: 10,
							fontSize: 14,
						}}
					>
						클래스 만들기
					</Link>
				</div>
			</div>
			<div className="login_wrapper">
				<div className="login_item">
					<Dropdown>
						<Dropdown.Toggle variant="white" id="dropdown-basic">
							반가워요! {userData.nickname} 님
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Link to="setting" className="dropdown-link ">
								<Dropdown.Item href="/intro">프로필 수정</Dropdown.Item>
							</Link>
							<Link to="my/cashback" className="dropdown-link ">
								<Dropdown.Item href="/intro">나의 환급금</Dropdown.Item>
							</Link>
							<Dropdown.Item href="#/logout" onClick={logout}>
								로그아웃
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</div>
		</div>
	);
}

export default Header;
