//메뉴바

import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";

function Header(props) {
	// 사용자 닉네임 상태 변수
	const [userNickname, setUserNickname] = useState("");
	const [userImg, setUserImg] = useState("");

	// 카카오 로그인 코드로 백엔드에 JWT 요청
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

			// 로컬스토리지에 JWT 토큰 저장
			localStorage.setItem("token", token);

			// 사용자 정보 가져오는 함수 호출
			await getUserData();
		} catch (error) {
			// 예외처리
			throw new Error(error.message);
		}
	};

	// 카카오 로그인
	const loginWithKakao = async () => {
		try {
			const app_key = process.env.REACT_APP_KAKAO_APP_KEY;
			const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
			window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${app_key}&redirect_uri=${redirect_uri}`;
		} catch (error) {
			throw new Error(error.message);
		}
	};

	// 로그아웃
	const logout = () => {
		try {
			const app_key = process.env.REACT_APP_KAKAO_APP_KEY;
			const logout_redirect_uri = process.env.REACT_APP_LOGOUT_REDIRECT_URI;
			window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${app_key}&logout_redirect_uri=${logout_redirect_uri}`;
			localStorage.removeItem("token");
		} catch (error) {
			throw new Error(error.message);
		}
	};

	// 1. 카카오 로그인 성공 후 , 코드로 GetCode 함수 호출
	// 2. 중복 호출 방지를 위해 GetCode 함수 호출 이후 주소창에서 CODE 삭제
	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get("code");
		if (code) {
			getCode(code);
			window.history.replaceState({}, document.title, window.location.pathname);
		} else {
			// JWT 토큰이 로컬 스토리지에 있는 경우에도 사용자 정보를 가져옴
			getUserData();
		}
	});

	// JWT 검증 후 사용자 정보 가져오기
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
				const userImg = user.profileImg;
				setUserNickname(nickname);
				setUserImg(userImg);
			} else {
				// 예외처리
				throw new Error("Failed to fetch user data");
			}
		} catch (error) {
			// 예외처리
			throw new Error("Token is not available");
		}
	};
	return (
		<div className="header_wrapper">
			<div className="logo_wrapper">
				<Link to="/intro">
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
					<Link to="createclass" className="link">
						클래스 만들기
					</Link>
				</div>
			</div>
			<div className="login_wrapper">
				<div className="login_item">
					{/* default로 로그인 화면으로, 업을경우 회원가입 버튼을 통해 회원가입  */}
					{userNickname ? (
						<>
							<Dropdown>
								<Dropdown.Toggle variant="white" id="dropdown-basic">
									반가워요! {userNickname} 님
								</Dropdown.Toggle>
								{/* 카카오 사용자 프로필 동의 한 경우,  */}
								{userImg ? (
									<img
										style={{ borderRadius: 40 }}
										width="40"
										height="40"
										src={userImg}
										alt="user-male-circle--v1"
									/>
								) : (
									// 카카오 사용자 프로필 동의 하지 않은 경우,
									<img
										width="40"
										height="40"
										src="https://img.icons8.com/ios/50/ffd0ca/user-male-circle--v1.png"
										alt="user-male-circle--v1"
									/>
								)}

								<Dropdown.Menu>
									<Link to={"myclass"} className="dropdown-link ">
										<Dropdown.Item href="#/action-2">MY 클래스</Dropdown.Item>
									</Link>
									<Link to={"exam"} className="dropdown-link ">
										<Dropdown.Item href="#/action-2">
											클래스 심사 현황
										</Dropdown.Item>
									</Link>
									<Link to={"likeclass"} className="dropdown-link ">
										<Dropdown.Item href="#/action-2">
											내가 찜한 클래스
										</Dropdown.Item>
									</Link>
									<Link to={"setting"} className="dropdown-link ">
										<Dropdown.Item href="/intro">설정</Dropdown.Item>
									</Link>
									<Dropdown.Item href="#/logout" onClick={logout}>
										로그아웃
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
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
