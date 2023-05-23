//메뉴바

import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useState, useEffect } from "react";

function Header(props) {
	const [userNickname, setUserNickname] = useState("");

	const getCode = async (code) => {
		try {
			const response = await fetch(
				"http://localhost:8000/api/user/kakao/callback/",
				{
					method: "POST",
					headers: {
						"Content-type": "application/x-www-form-urlencoded;charset=utf-8",
					},
					body: JSON.stringify({ code: code }),
				}
			);
			const data = await response.json();
			const token = data.token;

			localStorage.setItem("token", token);

			await getUserData();
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const loginWithKakao = async () => {
		try {
			const app_key = process.env.REACT_APP_KAKAO_APP_KEY;
			const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
			window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${app_key}&redirect_uri=${redirect_uri}`;
		} catch (error) {
			throw new Error(error.message);
		}
	};
	const logout = () => {
		localStorage.removeItem("token");
		setUserNickname("");
		alert("로그아웃되었습니다.");
	};

	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get("code");
		if (code) {
			getCode(code);
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	});

	const getUserData = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Token is not available");
			}

			const response = await fetch(
				"http://localhost:8000/api/user/get_user_data/",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization header에 포함시킴
					},
				}
			);
			if (response.ok) {
				const user = await response.json();
				const nickname = user.nickname;
				setUserNickname(nickname);
			} else {
				throw new Error("Failed to fetch user data");
			}
		} catch (error) {
			throw new Error("Token is not available");
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
					{userNickname ? (
						<>
							<Link to="/intro">{userNickname} Profile</Link>
							<Link to="/">
								<button onClick={logout}>로그아웃</button>
							</Link>
						</>
					) : (
						<>
							<button className="link" onClick={loginWithKakao}>
								카톡 로그인
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default Header;
