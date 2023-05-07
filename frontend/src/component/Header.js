//메뉴바
import React from "react";
import "../styles/Header.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useState, useEffect } from "react";
// import LoginModal from "./Login";
// import SignUpModal from "./SignUp";

function Header(props) {
	// const [isModalOpen, setIsModalOpen] = useState(false);
	const [userData, setUserData] = useState(null);
	const navigate = useNavigate();

	// const token = localStorage.getItem("token");

	// useEffect(() => {
	// 	fetch("kakao/login/")
	// 		.then((response) => response.json())
	// 		.then((token) => {
	// 			localStorage.setItem("token", token);
	// 		});
	// });

	const token = localStorage.getItem("token");

	useEffect(() => {
		fetch("get_user_data/", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setUserData(data);
				// navigate("");
			})
			.catch((error) => console.error(error));
	}, [navigate, token, setUserData]);

	// const handleLogout = () => {
	// 	localStorage.removeItem("accessToken");
	// 	setLoggedIn(false);
	// };
	const handleLoginClick = () => {
		fetch("/kakao/login/").then((response) => {
			console.log(response);
		});

		// .then((token) => {
		// 	localStorage.setItem("token", token);
		// });
	};

	// const handleLoginButtonClick = () => {
	// 	setIsModalOpen(true);
	// };
	// const handleModalClose = () => {
	// 	setIsModalOpen(false);
	// };

	// 회원가입 모달 열기 함수
	// const handleOpenSignUpModal = () => {
	// 	setIsSignUpModalOpen(true);
	// };

	// // 회원가입 모달 닫기 함수
	// const handleCloseSignUpModal = () => {
	// 	setIsSignUpModalOpen(false);
	// };

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
							<a className="link" href="http://localhost:8000/kakao/login">
								카톡 로그인
							</a>
							{/* {isModalOpen && <LoginModal onClose={handleModalClose} />} */}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default Header;
