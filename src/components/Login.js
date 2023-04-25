import React from "react";
import "../styles/Login.css";
import { useState, useEffect } from "react";
import SignUp from "./SignUp";
import { AiOutlineCloseCircle } from "react-icons/ai";
import HorizonLine from "../common/HorizonLine";
import { KAKAO_AUTH_URL } from "../Auth";

const Login = ({ onClose }) => {
	const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false); // 회원가입 모달 열림 여부 상태

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	// 회원가입 모달 열기 함수
	const handleOpenSignUpModal = () => {
		setIsSignUpModalOpen(true);
	};

	// 회원가입 모달 닫기 함수
	const handleCloseSignUpModal = () => {
		setIsSignUpModalOpen(false);
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				{/* 모달창 내용 */}
				<AiOutlineCloseCircle className="close" onClick={onClose} />
				<h2 className="title">로그인</h2>
				<div className="content">
					<div className="input_wrapper">
						<div className="input_id">
							{/* <div className="label">아이디 :</div> */}
							<input className="input" type="text" placeholder="아이디" />
						</div>
						<div className="input_password">
							{/* <div className="label">비밀번호 :</div> */}
							<input className="input" type="password" placeholder="비밀번호" />
						</div>
					</div>
					<button className="login">로그인</button>
				</div>
				{/* 회원가입 버튼 */}
				<div className="etc">
					<div className="signup_etc">
						계정이 없으신가요?
						<button className="signUp" onClick={handleOpenSignUpModal}>
							회원가입 하기
						</button>
						{/* 회원가입 모달 */}
						{isSignUpModalOpen && (
							<SignUp
								onClose={handleCloseSignUpModal} // isOpen 속성 대신 onClose 속성을 전달
							/>
						)}
					</div>
					<div className="pwfind">
						<button className="pw">비밀번호 초기화 하기</button>
					</div>
				</div>
				<div className="sns">
					<HorizonLine text="소셜 계정으로 로그인 하기" />
					<a href={KAKAO_AUTH_URL}>카카오로 로그인</a>
				</div>
			</div>
		</div>
	);
};

export default Login;
