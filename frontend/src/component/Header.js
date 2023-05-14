//메뉴바
import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useState, useEffect } from "react";
// import LoginModal from "./Login";
// import SignUpModal from "./SignUp";

function Header(props) {
	// const [isModalOpen, setIsModalOpen] = useState(false);
	const [userData, setUserData] = useState(null);

	// const navigate = useNavigate();

	const getCode = async (code) => {
		const response = await fetch("http://localhost:8000/kakao/callback/", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({ code: code }),
		});

		const token = await response.json();
		localStorage.setItem("token", token);
	};

	const loginWithKakao = async () => {
		try {
			const response = await fetch("http://localhost:8000/kakao/login/");
			const url = await response.text();

			window.location.replace(url);

			console.log(url);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get("code");
		if (code) {
			getCode(code);
		}
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			getUserData(token);
		}
	}, []);

	const getUserData = async (token) => {
		const response = await fetch("http://localhost:8000/get_user_data/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization header에 포함시킴
			},
		});
		const user = await response.json();
		setUserData(user);
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
					<Link to="intro" className="link">
						소개 및 이용방법
					</Link>
				</div>
				<div className="menu_item">
					{/* 모든 클래스 보기_ Top 5 멘토, New 클래스, All 및 Best 클래스   */}
					<Link to="test" className="link">
						모든 클래스
					</Link>
				</div>
				<div className="menu_item">
					{/* 제목 및 소개로 검색, 태그별 검색  */}
					<Link to="test" className="link">
						클래스 찾기
					</Link>
				</div>
				<div className="menu_item">
					{/* 클래스 업로드 화면, 로그인 안되어있을 경우 로그인 화면으로  */}
					<Link to="test" className="link">
						클래스 만들기
					</Link>
				</div>
			</div>
			<div className="login_wrapper">
				<div className="login_item">
					{/* default로 로그인 화면으로, 업을경우 회원가입 버튼을 통해 회원가입  */}
					{userData ? (
						<>
							<a href="/myprofile">{userData.name} Profile</a>
						</>
					) : (
						<>
							<button className="link" onClick={loginWithKakao}>
								카톡 로그인
							</button>
							{/* {isModalOpen && <LoginModal onClose={handleModalClose} />} */}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default Header;
