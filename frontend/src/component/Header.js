//메뉴바

import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";

function Header(props) {
	const { getUserData } = props;

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
			console.log(data);
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

	const currentDomain = window.location.href;
	useEffect(() => {
		console.log("Domain: " + currentDomain);
	});

	// 카카오 로그인
	const loginWithKakao = async () => {
		try {
			// console.log(currentDomain);
			let redirectUri;

			if (currentDomain.includes("localhost")) {
				// 로컬 환경인 경우
				redirectUri = "http://localhost:3000/"; // 적절한 포트 및 경로로 설정
			} else if (currentDomain.includes("hivehobby4u")) {
				// Netlify 도메인인 경우
				redirectUri = "https://hivehobby4u.netlify.app/"; // 실제 도메인으로 설정
			} else {
				console.log("도메인 이상해애애애");
			}
			const app_key = process.env.REACT_APP_KAKAO_APP_KEY;
			const redirect_uri = redirectUri;
			const kakaologin_href =
				(window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${app_key}&redirect_uri=${redirect_uri}`);
			const response = await fetch(kakaologin_href, { method: "HEAD" });

			if (response.ok) {
				// URL이 유효하면 페이지 이동
				window.location.replace(kakaologin_href);
			} else {
				console.error("Authorization URL 확인 실패");
			}
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
		}
	});

	return (
		<div className="header_wrapper">
			<div style={{ display: "flex", flexDirection: "row" }}>
				<div className="logo_wrapper">
					<Link to="/">
						<img className="logo" alt="logo" src={Logo} />
					</Link>
				</div>
				<div className="menu_wrapper">
					<div className="menu_item">
						{/* Mento 및 Metee의 혜택, Mentor가 되는 방법 */}
						<Link to="intro" className="link">
							HH 소개
						</Link>
					</div>
					<div className="menu_item">
						{/* 모든 클래스 보기_ Top 5 멘토, New 클래스, All 및 Best 클래스   */}
						<Link to="gide" className="link">
							이용방법
						</Link>
					</div>
				</div>
			</div>
			<div className="login_wrapper">
				<div className="login_item">
					<button className="link" onClick={loginWithKakao}>
						카톡 로그인
					</button>
				</div>
			</div>
		</div>
	);
}

export default Header;
